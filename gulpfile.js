var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');

var config = {
  mainScript: 'index.js',
  devScript: 'dev.js',
  scripts: ['index.js', 'config/**/*.js', 'app/**/*.js', 'lib/**/*.js'],
  mainStyle: 'index.less',
  styles: ['index.less', 'app/**/*.less', 'lib/components/**/*.less'],
  assets: [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/mocha/mocha.js',
    'node_modules/mocha/mocha.css',
    'assets/**/*.{html,css,js,png,gif,jpg,mp3,eot,svg,ttf,woff,otf}'
  ],
  html: ['*.html', 'test/*.html'],
  dist: path.resolve(__dirname, 'dist'),
  distAssets: 'dist/*.{html,js,css}',
  tests: ['test/**/*spec.js', 'lib/**/*spec.js']
};


// ****************** GENERATORS ******************

/*
 *  template: scaffold-like generator for a UI component
 *
 *  options:
 *    --name="component-name": a component name. required.
 */
gulp.task('template', require('./gulp/template'));


// ****************** DEV SERVER ******************

/*
 *  watch-lr: watches for changes in dist/ files
 *  and triggers a browser reload
 */
gulp.task('watch-lr', require('./gulp/reload')(config.distAssets));

/*
 *  proxy: runs the dev server, including:
 *  - proxy server to the real API server
 *  - dummy web socket server for simulating devices
 *  - live reload server
 */
gulp.task('proxy', require('./gulp/server').listen(config.dist));


// ****************** BUILD TASKS *****************

/*
 *  clean: cleans the dist/ folder
 */
gulp.task('clean', function() {
  gulp.src(config.dist, {read: false})
    .pipe(clean());
});

/*
 *  assets: copies static assets to dist/
 */
gulp.task('assets', function() {
  gulp.src(config.assets)
    .pipe(gulp.dest(config.dist));
});

/*
 *  html: copies .html to dist/, also adding livereload snippet in development
 */
gulp.task('html', require('./gulp/html')(config.html, config.dist));

/*
 *  less: compile index.less to dist/index.css
 *  default is no source maps
 *
 *  options:
 *    --debug: enable source maps
 */
gulp.task('less', require('./gulp/less')(config.mainStyle, config.dist));

/*
 *  browserify: compile index.js to dist/index.js
 *  default is no source maps & minified output
 *
 *  options:
 *    --debug: enable source maps & prevent minification
 */
gulp.task('browserify', require('./gulp/watchify').bundle(config.mainScript, config.dist));

/*
 *  browserify:watch: compile index.js to dist/index.js, rebuilding on change
 *  for details see `browserify` task
 */
gulp.task('browserify:watch', require('./gulp/watchify').bundle(config.mainScript, config.dist, config.scripts));

/*
 *  browserify:dev: compile dev.js to dist/dev.js
 *  for details see `browserify` task
 */
gulp.task('browserify:dev', require('./gulp/watchify').bundle(config.devScript, config.dist, config.scripts));

/*
 *  jshint: output linting results for the app. note that this includes
 *  linting on compiled .jsx files
 */
gulp.task('jshint', require('./gulp/jshint')(config.scripts));

/**
 * test: compile tests open them in a browser, refreshing on file changes
 */
gulp.task('mocha', require('./gulp/mocha').watchBundle(config.dist, {watch:true}));

/*
 *  watch: watches and rebuilds on change
 */
gulp.task('watch', function() {
  gulp.watch(config.scripts, ['jshint']);
  gulp.watch(config.styles, ['less']);
  gulp.watch(config.assets, ['assets']);
  gulp.watch(config.html, ['html']);
  gulp.watch(config.devScript, ['browserify:dev']);
});


// ****************** MAIN TASKS *****************

/*
 *  build: build the application
 *    production: NODE_ENV=production gulp build
 *    dev: NODE_ENV=development gulp build --debug
 *    test: NODE_ENV=test gulp build --debug
 */
gulp.task('build', ['assets', 'html', 'less', 'browserify', 'jshint']);

/*
 *  server: run a development server and build/reload on changes
 *
 *  examples:
 *    dev: NODE_ENV=development gulp start --debug --open
 *    test: NODE_ENV=test gulp start
 */
gulp.task('start', ['build', 'proxy', 'watch-lr', 'watch', 'browserify:watch', 'browserify:dev']);

/**
 * test: compile mocha tests and open them in a browser
 */
gulp.task('test', ['mocha', 'proxy', 'watch-lr'], function() {
  require('open')('http://localhost:9001/test.html');
});

/*
 *  default => server
 */
gulp.task('default', ['server']);
