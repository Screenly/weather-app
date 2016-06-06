'use strict';

// Gulpfile
// Version:     1.0
// Author:      Peter Monte
// --------------------------------------------
// @see gulp/config.js for more info



var gulp            = require("gulp");
var requireDir      = require("require-dir");
var error           = require("./gulp/error.js");

gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
gulp.Gulp.prototype._runTask = function(task) {
  this.currentTask = task;
  this.__runTask(task);
}

GLOBAL.errors       = false;
GLOBAL.production   = false;

// Load files in directory tasks
requireDir("./gulp/tasks", { recurse: true } );




/*
    Default Task
*/

gulp.task('default', [
        'init', 
        'clean-css', 'sass-vendors', 'sass-vendors-concat', 'sass', 'sass-pages', 
        'clean-js', 'js-vendors', 'js-vendors-concat', 'js', 'js-pages',
        'watch'], 
    error.reportSuccess);



/*
    Production Task
*/

gulp.task('production', [
        'init', 'init-production', 
        'clean-css', 'sass-vendors', 'sass-vendors-concat', 'sass', 'sass-pages', 
        'clean-js', 'js-vendors', 'js-vendors-concat', 'js', 'js-pages',
        'watch'], 
    error.reportSuccess);



/*
    Static Files Task
*/

gulp.task('static', [
        'init-production', 
        'static-clean', 'static-process']);
