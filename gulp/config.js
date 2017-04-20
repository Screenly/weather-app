var pngquant = require('imagemin-pngquant');

module.exports = {
	// Image min configuration
	imagemin: {

        optimizationLevel: 	5,
        progressive: 		true,
        interlaced: 		true,
        use: 				[pngquant()],
        svgoPlugins: 		[{removeViewBox: false}]

    },

	// -----------------------------------------------------------

	// Path definitions
	path: {

		ROOT: 				'.',
		SRC:                './src/',
		ASSETS: 			'./assets',
		HTML: 				'./**/*.html',
		JS_SRC: 			'./src/js',
		JS_DEST: 			'./assets/js',
		CSS_SRC: 			'./src/scss',
		CSS_DEST: 			'./assets/css',
		JS_ENTRY_POINT: 	'./src/js/app.js',
		SCSS_ENTRY_POINT: 	'./src/scss/app.scss'

	},

	// -----------------------------------------------------------

	// Join Sass & JS Pages into one minified file?
	joinPages: true,

	// Append .min to the file url
	appendDotMin: false,

};