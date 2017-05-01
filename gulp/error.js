var gulp   = require("gulp");
var notify = require("gulp-notify");
var gutil  = require("gulp-util");
var clear  = require('clear');

var config = require("./config");



module.exports = {

    /*
        Notify Errors and write errors to console
    */

    reportError: function (error)
    {
        clear();

        // Notify
        notify({
            title: '[' + (error.plugin ? error.plugin.toUpperCase() : '') + '] - Error',
            message: 'There was an error with ' + error.plugin + ' plugin.\n Please check the console.',
            icon: __dirname + "/images/alert.png",
            sound: 'Basso',
            wait: true,
        }).write(error);

        // Pretty error reporting
        var report = '';

        // Set colors
        var chalk = gutil.colors.white.bgRed;
        var black = gutil.colors.yellow.bgBlue;
        var red = gutil.colors.red;
        var blue = gutil.colors.blue;

        var fileColor = gutil.colors.white.bgRed;
        var lineColor = gutil.colors.white.bgRed;
        var stackColor = gutil.colors.blue;

        // Format report
        report += '\n\n';

        report += blue('#################################################################################################\n');
        report += black('Task:') + black(' [' + error.plugin + ']') + '\n';
        report += blue( '#################################################################################################\n');

        if (error.plugin == "gulp-sass"){
            var filenameParts = error.file ? error.file.split("/") : null;
            var filename = filenameParts ? filenameParts[filenameParts.length - 1] : null;
            report += chalk('Error:\n') + '    ' + red(error.messageFormatted) + '\n';
            if (error.file)   { report += red('File:' + '      ' + fileColor("[" + filename + "]") + " (" + red(error.file) + ")") + '\n'; }
            if (error.line) { report += red('Line:' + '      ' + lineColor("[Line " + error.line + "]") + ']\n'); }
            if (error.column) { report += red('Column:' + '    [' + red(error.column) + ']\n'); }
        } else {
            var filenameParts = error.fileName ? error.fileName.split("/") : null;
            var filename = filenameParts ? filenameParts[filenameParts.length - 1] : null;
            report += chalk('Error:\n') + '    ' + red(' ' + error.message + ' ') + '\n';
            if (error.fileName)   { report += red('File:' + '      ' + fileColor("[" + filename + "]") + " (" + red(error.fileName) + ")" + '\n'); }
            if (error.lineNumber) { report += red('Line:' + '      ' + lineColor('[Line ' + error.lineNumber + "]") + ']\n'); }
        }

        report += blue('--------------------------------------------------------------------------------------------------\n');
        report += '\n';


        // Output errors to console
        console.error(report);

        // Set error so we don't show any finished notification
        GLOBAL.errors = true;

        this.emit('end');
    },



    /*
        Notify Success
    */

    reportSuccess: function ()
    {
        // We should not show the notification if we have errors
        if (GLOBAL.errors) return;

        // Notify
        notify({
            title: 'Gulp Task Finished',
            message: 'Task finished successufully',
            icon: __dirname + "/images/hypnotic.png",
        }).write("");

        // Pretty error reporting
        var report = '';
        var chalk = gutil.colors.green.bgBlue;
        var blue = gutil.colors.blue;

        report += blue('--------------------------------------------------------------------------------------------------\n');

        // Output success to console
        console.error(report);

        // Reset errors
        GLOBAL.errors = false;
    }
};
