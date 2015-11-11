/* @file gulpfile.js
 * @brief Builds a JS file ready to deploy.
 *
 * @author Vicki Long (vicki@scottylabs.org)
 * @author Victor Xu (victor@scottylabs.org)
 * @author Jackie Gaston (jackie@scottylabs.org)
 */

var browserify = require('browserify');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('test', function () {
  'use strict';
  browserify('build/index-src.jsx', {debug: true})
    .transform('babelify', {presets: ['es2015', 'react']})
    .bundle()
    .pipe(source('index.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['test']);
