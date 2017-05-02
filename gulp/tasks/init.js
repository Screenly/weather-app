var gulp        = require("gulp");
var gutil       = require("gulp-util");
var clear       = require('clear');
var config      = require("../config");
var error       = require("../error");

/*
    Init task
*/

gulp.task('init', function () {
    clear();
    GLOBAL.errors = false;
    var report = '';
    var blue = gutil.colors.blue;
    report += blue('--------------------------------------------------------------------------------------------------');

    // Output success
    console.log(report);
    return;
});

/*
    Init task (Production)
*/

gulp.task('init-production', function () {
    GLOBAL.errors = false;
    GLOBAL.production = true;
    return;
});
