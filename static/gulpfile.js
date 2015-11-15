/* @file gulpfile.js
 * @brief Builds a JS file ready to deploy.
 *
 * @author Vicki Long (vicki@scottylabs.org)
 * @author Victor Xu (victor@scottylabs.org)
 * @author Jackie Gaston (jackie@scottylabs.org)
 */

'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('watch', function () {
  watch('src/**/*.js', batch(function (events, done) {
    gulp.start('js', done);
  }));
});

gulp.task('js', function () {
  return browserify(['src/a.js','src/b.js'], {debug: true})
  .transform('babelify', {presets: ['es2015', 'react']})
  .bundle()
  .pipe(source('index.min.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dest/js'));
});

gulp.task('default', ['js']);
