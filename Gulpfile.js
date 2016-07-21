'use strict';

// deps
var gulp = require('gulp');
var rename = require('gulp-rename');
var del = require('del');
var path = require('path');

// config
var tpl = './angular2-webpack-starter';
var dest = './template/';

// delete source in template
gulp.task('del', function () {
  return del([
    `${dest}/**/*`
  ]);
});

// copy source to template
gulp.task('copy', function () {
  return gulp.src([
    `${tpl}/**`,
    `!${tpl}/.github`,
    `!${tpl}/.github/**`,
    `!${tpl}/**/.git`,
    `!${tpl}/**/.git/**`
  ], {
      dot: true
    })
    .pipe(rename(function (file) {
      file.basename = !/^(config|src)/.test(file.dirname) && /(?:\/|^)(\.[^\/]*)$/.test(file.basename) ? file.basename.replace(/./i, '_') : file.basename;
    }))
    .pipe(gulp.dest(dest));
});

// default
gulp.task('default', ['copy']);
