var path = require('path');
var gulp = require('gulp');
var config = require('../config/config');
var server = require('./server');

module.exports = function(src) {
  return function() {
    gulp.watch(src, function(evt) {
      // convert the path to be relative to server root
      evt.path = path.relative(config.root, evt.path);
      evt.path = evt.path.replace(/^[^\/]+\//, '');
      console.log('change: %s', evt.path);
      server.changed({
        body: {
          files: [evt.path]
        }
      });
    });
  }
}