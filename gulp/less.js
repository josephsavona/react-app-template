var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');

var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['debug'],
  default: {
    debug: false
  }
});

module.exports = function(src, dest) {
  return function() {
    gulp.src(src)
      .pipe(less({
        paths: [
          path.join(__dirname, '..', 'node_modules')
        ],
        sourceMap: argv.debug
      }))
      .pipe(gulp.dest(dest))
  }
}