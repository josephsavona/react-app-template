var gulp = require('gulp');
var path = require('path');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('gulp-browserify');

var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['debug'],
  default: {
    debug: false
  }
});

var configureBundler = function(bundler) {
  // convert `process.env.ENV_VAR` => literal value of `ENV_VAR`
  bundler.transform({
    global: true
  }, 'envify');

  // convert `<Component />` => `Component()`
  bundler.transform({
    global: true
  }, 'reactify');

  // minify if not debug
  if (!argv.debug) {
    bundler.transform({
      global: true
    }, 'uglifyify');
  }

  // make some packages available via developer console `require()`
  if (argv.debug) {
    bundler.require('analytics');
    bundler.require('cookies');
    bundler.require('logstash');
    bundler.require('mediator');
    bundler.require('rift');
    bundler.require('socket');
    bundler.require('session');
    bundler.require('timeout');
  }

  return bundler;
};

var bundlerError = function(err) {
  console.warn(err.message);
  console.warn(err.stack);
};

var bundle = function(src, dest, watch) {
  // without `watch`, run a single pass build and return
  if (!watch) {
    return function() {
      gulp.src(src)
        .pipe(browserify({
          debug: argv.debug
        }))
        .on('prebundle', configureBundler)
        .on('error', bundlerError)
        .pipe(gulp.dest(dest))
    }
  }

  // if `watch` given, run watchify to rebuild on change
  //    based on gulpjs documentation for browserify:
  //    https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
  return function() {
    var bundler = watchify(src ? path.resolve(__dirname, '..', src) : null);

    configureBundler(bundler);

    bundler.on('update', rebundle)
    bundler.on('error', bundlerError)

    function rebundle () {
      return bundler.bundle()
        .pipe(source(src))
        .pipe(gulp.dest(dest))
    }

    return rebundle();
  }
};

module.exports = {
  configureBundler: configureBundler,
  bundlerError: bundlerError,
  bundle: bundle
};
