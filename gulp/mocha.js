var gulp = require('gulp');
var path = require('path');
var glob = require('glob');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var config = require('../config/config');
var configureBundler = require('./watchify').configureBundler;

// NODE_ENV=test node gulp/mocha.js --bug > dist/test.js

var bundlerError = function(err) {
  console.warn(err.message);
  console.warn(err.stack);
};

var bundleTests = function(options) {
  var bundler;
  options = options || {};
  bundler = options.watch ? watchify() : browserify();

  // add the init script
  bundler.add(path.resolve(config.root, 'test', 'init-browser.js'));

  // add all the specs
  ['test', 'lib'].forEach(function(dir) {
    glob.sync('**/*spec.js', {
      cwd: path.resolve(config.root, dir)
    }).forEach(function(spec) {
      bundler.add(path.resolve(config.root, dir, spec));
    });  
  });

  // configure transforms etc
  configureBundler(bundler);

  return bundler;
};

var writeToStdout = function() {
  var bundler = bundleTests();
  bundler.bundle().pipe(process.stdout);
}

var watchBundle = function(dest, options) {
  return function() {
    var bundler = bundleTests(dest, options);

    bundler.on('update', rebundle);
    bundler.on('error', bundlerError);

    function rebundle () {
      return bundler.bundle()
        .pipe(source('test.js'))
        .pipe(gulp.dest(dest))
    }

    return rebundle();
  }
}

module.exports = {
  bundleTests: bundleTests,
  watchBundle: watchBundle
};