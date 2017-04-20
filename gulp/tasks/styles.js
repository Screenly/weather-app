var gulp        = require("gulp");
var gulpif      = require('gulp-if');
var sourcemaps  = require("gulp-sourcemaps");
var concat      = require("gulp-concat");
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var plumber     = require('gulp-plumber');
var rename      = require('gulp-rename');
var del         = require('del');
var flatten     = require('gulp-flatten');
var cleanCSS    = require('gulp-clean-css');
var notify      = require("gulp-notify");
var browserSync = require('browser-sync');
var debug       = require('gulp-debug');

var config      = require("../config.js");
var error       = require("../error.js");

/*
    Clean CSS directory
*/

gulp.task('clean-css', function () {
    return del.sync([config.path.CSS_DEST + '/**/*'], {read: false});
});



/*
    Process SASS App
*/

var processSassFiles = function(src, dest, filename, concatenate, map, min) {

    return gulp.src(src)
        .pipe(plumber({ errorHandler: error.reportError }))
        .pipe(gulpif(map, sourcemaps.init()))
        .pipe(sass({
                sourcemap: true,
                outputStyle: 'compressed',
                errLogToConsole: true
            }).on('error', error.reportError ))
        .pipe(prefix("last 1 version", "> 1%"))
        .pipe(gulpif(concatenate, concat(filename)))
        .pipe(gulpif(config.appendDotMin && min, rename({ suffix: '.min' })))
        .pipe(gulpif(map, sourcemaps.write(".")))
        .pipe(flatten())
        .pipe(gulp.dest(dest));
};

// Sass Entry Point
gulp.task('sass', function () {
    return processSassFiles (
        [config.path.CSS_SRC + '/app.scss'],
        config.path.CSS_DEST,
        'style.css',
        true,
        true,
        true
    );
});

// SASS Pages
gulp.task('sass-pages', function () {
    return true;
});

// SASS Vendors
gulp.task('sass-vendors', function () {
    return true;
});

// SASS Vendors Concat
gulp.task('sass-vendors-concat', function () {
    return true;
});