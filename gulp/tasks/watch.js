var gulp        = require("gulp");
var gutil       = require("gulp-util");
var clear       = require('clear');
var config      = require("../config.js");
var error       = require("../error.js");


/*
    Watch Task
*/

gulp.task('watch', function () {
    GLOBAL.errors = false;

    gulp.watch(config.path.CSS_SRC + '/**/*.scss', ['init', 'clean-css', 'sass', 'sass-pages', 'sass-vendors', 'sass-vendors-concat'], error.reportSuccess);
    gulp.watch(config.path.JS_SRC + '/**/*.js', ['init', 'clean-js', 'js', 'js-pages', 'js-vendors', 'js-vendors-concat'], error.reportSuccess);
    gulp.watch(config.path.STATICS, ['static']);
});