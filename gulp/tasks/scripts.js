var gulp        = require("gulp");
var gulpif      = require('gulp-if');
var del         = require('del');
var sourcemaps  = require("gulp-sourcemaps");
var concat      = require("gulp-concat");
var uglify      = require('gulp-uglify');
var plumber     = require('gulp-plumber');
var rename      = require('gulp-rename');
var flatten     = require('gulp-flatten');
var jshint      = require("gulp-jshint");
var stylish     = require('jshint-stylish');
var debug       = require('gulp-debug');

var config      = require("../config.js");
var error       = require("../error.js");

/*
    Clean JS output folder
*/
gulp.task('clean-js', function () {
    return del.sync([config.path.JS_DEST + '/**/*'], {read: false});
});




/*
    Process JS files
*/
function processJsFiles(src, dest, filename, concatenate, map, min)
{
    return gulp.src(src)
        .pipe(plumber({ errorHandler: error.reportError }))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(gulpif(map, sourcemaps.init()))
        .pipe(gulpif(GLOBAL.production, uglify()))
        .pipe(gulpif(concatenate, concat(filename)))
        .pipe(gulpif(config.appendDotMin && min, rename({ suffix: '.min' })))
        .pipe(gulpif(map, sourcemaps.write(".")))
        .pipe(flatten())
        .pipe(gulp.dest(dest));
}


/*
    TASKS
*/
gulp.task("js", function () {
    return processJsFiles (
        [
            config.path.JS_SRC + "/utils.js",
            config.path.JS_ENTRY_POINT
        ],
        config.path.JS_DEST,
        'app.js',
        config.joinPages,
        true,
        true,
        true
    );
});

// Pages
gulp.task("js-pages", function () {
    return true;
});

// Vendors
gulp.task("js-vendors", function () {
    return true;
});

// Vendors Concat
gulp.task ("js-vendors-concat", function () {
    return gulp.src([
            config.path.JS_SRC + "/vendors/moment-with-locales.min.js",
            config.path.JS_SRC + "/vendors/moment-timezone-with-data.js"
        ])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(config.path.JS_DEST + "/vendors/"));
});
