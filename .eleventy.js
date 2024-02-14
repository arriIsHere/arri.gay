const Moment = require('moment');
const SyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const PluginRss = require('@11ty/eleventy-plugin-rss');

module.exports = function(eleventyConfig) {

	// Install plugin for syntax highlighting
	eleventyConfig.addPlugin(SyntaxHighlight);
	eleventyConfig.addPlugin(PluginRss);

	eleventyConfig.addFilter('date', function(value, format) {
		return Moment(value).format(format);
	});

	eleventyConfig.addPassthroughCopy({"node_modules/@codium-css/css/": "lib/css/codium"});

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
			"svg",
			"njk",
			"ttf",
			"otf",
			"woff",
			"woff2"
		],
		passthroughFileCopy: true
	}
};