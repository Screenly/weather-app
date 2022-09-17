const gulp = require('gulp')
const babel = require('gulp-babel')
const uglifyJS = require('gulp-uglify')
const uglifyCSS = require('gulp-uglifycss')

function buildJS () {
  return gulp.src('assets/static/js/*.js')
    .pipe(babel())
    .pipe(uglifyJS())
    .pipe(gulp.dest('assets/static/js'))
}

function buildCSS () {
  return gulp.src('assets/static/styles/*.css')
    .pipe(uglifyCSS())
    .pipe(gulp.dest('assets/static/styles'))
}

exports.build = gulp.series(buildJS, buildCSS)
