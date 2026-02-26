const Image = require('@11ty/eleventy-img');
const path = require('path');

module.exports = function (eleventyConfig) {
	eleventyConfig.addAsyncShortcode('image', async function (args) {
		let src = args.src;
		let alt = args.alt || '';
		let className = args.class || '';

		// Fix: Remove leading slash from src if it exists so path.join works correctly
		const relativeSrc = src.startsWith('/') ? src.substring(1) : src;
		let fullSrc = path.join(process.cwd(), 'src', relativeSrc);

		let metadata = await Image(fullSrc, {
			widths: [400, 800, 1200],
			formats: ['avif', 'webp', 'jpeg'],
			outputDir: './_site/img/',
			// Fix: Ensure this matches your local server's path prefix
			urlPath: '/breast-cancer-site-final/img/',
		});

		let imageAttributes = {
			alt,
			class: className,
			sizes: args.sizes || '(min-width: 30em) 50vw, 100vw',
			loading: 'lazy',
			decoding: 'async',
		};

		return Image.generateHTML(metadata, imageAttributes);
	});

	eleventyConfig.addPassthroughCopy('src/assets');
	eleventyConfig.addWatchTarget('./src/css/');

	return {
		htmlTemplateEngine: 'njk',
		pathPrefix: '/breast-cancer-site-final/',
		dir: {
			input: 'src',
			output: '_site',
		},
	};
};
