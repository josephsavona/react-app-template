var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['debug'],
  default: {
    debug: false
  }
});
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var browserify = require('gulp-browserify');
var proxy = require('api-proxy');
var connectLivereload = require('connect-livereload');
var lr = require('tiny-lr');
var lrServer = null;
var lrPort = 35729;
 
var config = {
  mainScript: 'index.js',
  scripts: ['index.js', 'config/**/*.js', 'src/**/*.js'],
  mainStyle: 'index.less',
  styles: ['index.less', 'src/**/*.less'],
  assets: ['assets/**/*.{html,css,js,png,gif,jpg,mp3,eot,svg,ttf,woff,otf}'],
  views: ['*.html'],
  dist: 'dist/'
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
    hostname: 'localhost',
    port: 9000,
    proxy: {
      hostname: argv.proxyhost || 'localhost',
      port: argv.proxyport || 3000
    },
    middleware: function(connect) {
      var middleware = [];
      middleware.push(connectLivereload({
        port: lrPort
      }));
      middleware.push(connect.static(path.resolve(__dirname, config.dist)));
      middleware.push(function(req, res, next) {
        if (/^\/api/.test(req.url)) {
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
        path.join(__dirname, 'assets', 'styles'),
        path.join(__dirname, 'node_modules')
      ],
      sourceMap: argv.debug
    }))
    .pipe(gulp.dest(config.dist))
});
 
gulp.task('browserify', function() {
  gulp.src(config.mainScript)
    .pipe(browserify({
      debug: argv.debug
    }))
    .pipe(gulp.dest(config.dist))
});
 
gulp.task('watch', function() {
  gulp.watch(config.scripts, ['browserify']);
  gulp.watch(config.styles, ['less']);
  gulp.watch(config.views, ['views']);
});
 
gulp.task('build', ['views', 'assets', 'less', 'browserify']);
 
gulp.task('server', ['build', 'proxy', 'watch-lr', 'watch']);
 
gulp.task('default', ['server']);
