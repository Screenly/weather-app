# Screenly Email Templates

# Description
Screenly repository for email template development.


# Requirements

```Node.js 4.0+, Node Package Manager 3.6.0+, Gulp CLI 3.9.0+, Gulp 3.9.1+```

# Instalation

Open terminal on project root ```package.json```
Run command ```npm install```

# Usage

### Development

To build templates you need to create an HTML file for markup under folder ```src/markup```. Build your main styles under folder ```src/css``` and place any image assets in ```src/img``` just like:

- ./src
 - / markup ```(html markup)```
 - / css ```(css styles)```
 - / img ```(images)```

Point your style tag to ```<link rel="stylesheet" href="../css/your-file-name.css">```. These styles will be placed inline. Use Javascript Template double curly brackets inside a style tag like: ```<style type="text/css">{{YOUR_VAR_NAME_TO_REPLACE}}</style>``` to later replace with any styles you wish to maintain inside head tag after build.

### Gulp Build

For build create a task in file ```gulpfile.js```like ```gulp.task ( 'terminal-task-name', [ 'init', 'your-task-name' ], error.reportSuccess );```. Then go to ```gulp/tasks/tasks.js``` and edit your task to run on terminal - example:

```javascript

/*
  TASK : CSS INLINE
*/

gulp.task('your-task-name', function()
{
  return gulp.src(config.path.CSS + 'style.css')
    .pipe(plumber(
    {
      errorHandler: error.reportError
    }))
    .pipe(prefix("last 1 version", "> 1%"))
    .pipe(cleanCSS())
    .pipe(flatten())
    .pipe(inlineCss(
    {
      removeLinkTags: false,
      preserveMediaQueries: true,
    }))
    .pipe(gulp.dest(config.path.BUILD))
    .on('error', error.reportError)
    .on('end', error.reportSuccess);
});
```

On terminal run your command like `gulp terminal-task-name`