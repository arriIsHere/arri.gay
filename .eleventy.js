const Moment = require('moment');
const SyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function(eleventyConfig) {

	// Install plugin for syntax highlighting
	eleventyConfig.addPlugin(SyntaxHighlight);

	eleventyConfig.addFilter('date', function(value, format) {
		return Moment(value).format(format);
	});

	return {
		dir: {
			input: 'src',
			output: 'dist'
		},
		templateFormats: [
			"md",
			"html",
			"css",
			"jpg",
			"png",
			"gif",
			"njk"
		],
		passthroughFileCopy: true
	}
};