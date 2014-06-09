var gulp = require('gulp');
var gulpReact = require('gulp-react');
var jshint = require('gulp-jshint');

module.exports = function(src) {
  return function() {
    var react = gulpReact();

    // handle react transform errors so that gulp won't abort
    // note that ./watchify.js has better error reporting
    // so look at that output
    react.on('error', function(err) {
      console.warn('jshint build error, see browserify error for detail: %s', err.message);
      react.end();
    });

    gulp.src(src)
      .pipe(react)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
  }
}
