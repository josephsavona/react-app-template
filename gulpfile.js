var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2), {
  string: ['loglevel', 'name'],
  boolean: ['debug', 'open'],
  default: {
    debug: false,
    open: false,
    loglevel: 'info',
    name: null
  }
});

var fs = require('fs');
var path = require('path');
var open = require('open');
var gulp = require('gulp');
var less = require('gulp-less');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var browserify = require('gulp-browserify');
var gulpReact = require('gulp-react');
var jshint = require('gulp-jshint');
var proxy = require('api-proxy');
var connectLivereload = require('connect-livereload');
var lr = require('tiny-lr');
var ejs = require('ejs');
var lrServer = null;
var lrPort = 35729;
 
var config = {
  mainScript: 'index.js',
  scripts: ['index.js', 'config/**/*.js', 'src/**/*.js', 'lib/**/*.js'],
  mainStyle: 'index.less',
  styles: ['index.less', 'src/**/*.less'],
  assets: ['assets/**/*.{html,css,js,png,gif,jpg,mp3,eot,svg,ttf,woff,otf}'],
  views: ['*.html'],
  dist: 'dist/',
  tests: ['src/**/*spec.js', 'lib/**/*spec.js']
};
 
gulp.task('watch-lr', function() {
  gulp.watch([
    'dist/*.{html,js,css}'
  ], function(evt) {
    // convert the path to be relative to server root
    evt.path = path.relative(process.cwd(), evt.path);
    evt.path = evt.path.replace(/^[^\/]+\//, '');
    console.log('change: %s', evt.path);
    lrServer.changed({
      body: {
        files: [evt.path]
      }
    });
  });
});
 
gulp.task('proxy', function() {
  var server = proxy.get({
    debug: argv.debug,
    ssl: argv.ssl,
    hostname: '127.0.0.1',
    port: 9000,
    proxy: {
      hostname: argv.proxyhost || '127.0.0.1',
      port: argv.proxyport || 3000
    },
    middleware: function(connect) {
      var middleware = [];
      middleware.push(connectLivereload({
        port: lrPort
      }));
      middleware.push(connect.static(path.resolve(__dirname, config.dist)));
      middleware.push(function(req, res, next) {
        if (req.headers && req.headers['x-requested-with'] === 'XMLHttpRequest') {
          return next();
        }
        res.statusCode = 200;
        res.write(fs.readFileSync(path.resolve(__dirname, config.dist, 'index.html'), 'utf8'));
        res.end();
      });
      return middleware;
    }
  });
  server.listen(function(address) {
    console.log('proxy listening at %s', address);
    if (argv.open) {
      open(address);
    }
  });
 
  lrServer = lr();
  lrServer.listen(lrPort, function(err) {
    if (err) {
      console.error('livereload error on port %s', lrPort);
      console.error(err);
      process.exit(1);
    }
    console.log('livereload listening at %s', lrPort);
  });
});
 
gulp.task('clean', function() {
  gulp.src(config.dist, {read: false})
    .pipe(clean());
});
 
gulp.task('assets', function() {
  gulp.src(config.assets)
    .pipe(gulp.dest(config.dist));
});
 
gulp.task('views', function() {
  gulp.src(config.views)
    .pipe(gulp.dest(config.dist))
});
 
gulp.task('less', function() {
  gulp.src(config.mainStyle)
    .pipe(less({
      paths: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'node_modules')
      ],
      sourceMap: argv.debug
    }))
    .pipe(gulp.dest(config.dist))
});
 
gulp.task('browserify', function() {
  var transforms = [];
  transforms.push('reactify');
  transforms.push('envify');
  gulp.src(config.mainScript)
    .pipe(browserify({
      debug: argv.debug
    }))
    .on('prebundle', function(bundler) {
      if (!argv.debug) {
        bundler.transform({
          global: true
        }, 'uglifyify');
      }
      bundler.transform({
        global: true
      }, 'reactify');
      bundler.transform({
        global: true
      }, 'envify');
      // make some packages available via developer console `require()`
      bundler.require('rift');
      bundler.require('cookies');
      bundler.require('socket');
      bundler.require('analytics');
      bundler.require('session');
    })
    .pipe(gulp.dest(config.dist))
});

gulp.task('jshint', function() {
  gulp.src(config.scripts)
    .pipe(gulpReact())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('template', function() {
  if (!argv.name) {
    console.error('missing "name": gulp template --name="ComponentName"');
    process.exit(1);
  }
  var componentName = argv.name
    .replace(/[^a-zA-Z]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/(^|_)(\w)/g, function(match, prefix, c) {
      return c.toUpperCase();
    })
  var className = argv.name
    .replace(/[^a-zA-Z]+/g, '-')
    .replace(/[-]+/g, '-')
    .toLowerCase();

  var folderPath = path.join(__dirname, 'lib', 'components', className);
  if (fs.existsSync(folderPath)) {
    console.error('folder exists: ' + folderPath);
    process.exit(1);
  }
  fs.mkdirSync(folderPath);

  var js = fs.readFileSync(path.join(__dirname, 'lib', 'components', '_template', 'template.js.ejs'), 'utf8');
  fs.writeFileSync(path.join(__dirname, 'lib', 'components', className, className + '.js'), ejs.render(js, {
    componentName: componentName,
    componentClassName: className
  }));

  var less = fs.readFileSync(path.join(__dirname, 'lib', 'components', '_template', 'template.less.ejs'), 'utf8');
  fs.writeFileSync(path.join(__dirname, 'lib', 'components', className, className + '.less'), ejs.render(less, {
    componentName: componentName,
    componentClassName: className
  }));

  var spec = fs.readFileSync(path.join(__dirname, 'lib', 'components', '_template', 'template-spec.js.ejs'), 'utf8');
  fs.writeFileSync(path.join(__dirname, 'lib', 'components', className, className + '-spec.js'), ejs.render(spec, {
    componentName: componentName,
    componentClassName: className
  }));

  console.log('Created %s component with className %s', componentName, className);
  console.log('Next Steps:');
  console.log('- import %s.less in index.less', className);
  console.log('- export %s from lib/components/components.js', componentName);
})
 
gulp.task('watch', function() {
  gulp.watch(config.scripts, ['browserify', 'jshint']);
  gulp.watch(config.styles, ['less']);
  gulp.watch(config.views, ['views']);
  gulp.watch(config.assets, ['assets']);
});
 
gulp.task('build', ['views', 'assets', 'less', 'browserify', 'jshint']);
 
gulp.task('server', ['build', 'proxy', 'watch-lr', 'watch']);
 
gulp.task('default', ['server']);
