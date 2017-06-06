var gulp = require("gulp");
var del = require('del');
var config = require("../config.js");
var error = require("../error.js");

// Clean CSS directory
gulp.task('static-clean', function() {
    return del.sync([config.path.ASSETS + '/img/**/*', config.path.ASSETS + '/fonts/**/*', config.path.ASSETS + '/svg/**/*'], { read: false });
});

// SASS Vendors Concat
gulp.task('static-do', function() {
    var img = gulp.src(config.path.SRC + '/img/**/*').pipe(gulp.dest(config.path.ASSETS + '/img/'));
    var svg = gulp.src(config.path.SRC + '/svg/**/*').pipe(gulp.dest(config.path.ASSETS + '/svg/'));
    var fonts = gulp.src(config.path.SRC + '/fonts/**/*').pipe(gulp.dest(config.path.ASSETS + '/fonts'));

    return img && svg && fonts;
});
