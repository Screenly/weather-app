var gulp        = require("gulp");
var browserSync = require('browser-sync');
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

    // Static server
    //gulp.task('browser-sync', function() {
        browserSync.init(config.browsersync);
    //});


    // Pretty error reporting
    var report = '';
    // var chalk = gutil.colors.yellow.bgBlack;

    // Format report
    // report += '\n';
    // report += chalk(' _   _                         _   _      \n');  
    // report += chalk('| | | |                       | | (_)     \n');
    // report += chalk('| |_| |_   _ _ __  _ __   ___ | |_ _  ___ \n');
    // report += chalk('|  _  | | | | \'_ \\| \'_ \\ / _ \\| __| |/ __|\n');
    // report += chalk('| | | | |_| | |_) | | | | (_) | |_| | (__ \n');
    // report += chalk('\\_| |_/\\__, | .__/|_| |_|\\___/ \\__|_|\\___|\n');
    // report += chalk('        __/ | |                           \n');
    // report += chalk('       |___/|_|                           \n');
    // report += chalk('\n\n');
    // report += chalk('[WATCHING YOU]\n');
    // report += '\n';

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