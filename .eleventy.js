const Image = require('@11ty/eleventy-img');
const path = require('path');

module.exports = function (eleventyConfig) {
	// 1. Server & CSP Config
	eleventyConfig.setServerOptions({
		showVersion: true,
		https: {
			key: './localhost-key.pem',
			cert: './localhost.pem',
		},
		port: 8888,
		headers: {
			'Content-Security-Policy': [
				"default-src 'self'",
				"script-src 'self' https://www.paypal.com https://www.sandbox.paypal.com https://api.modempay.com https://js.stripe.com https://*.stripe.com https://*.stripe.network 'sha256-ZuuqwvzC9dQE5oskZTSF2C0RVtVoo1Ppdbr75fYkeSo=' 'sha256-Ki20kTCVjupv1D5qllQ1FQZR2kc9s0NlsLSq6fsOxUA=' 'sha256-QRuasIvtZdORGYBDeZnjr0Xs5FV7vauzUaaU1n0miVo='",
				"style-src 'self' https://api.modempay.com https://fonts.googleapis.com https://*.stripe.com https://*.stripe.network 'sha256-0hAheEzaMe6uXIKV4EehS9pu1am1lj/KnnzrOYqckXk='",
				"frame-src 'self' https://www.sandbox.paypal.com https://www.paypal.com https://js.stripe.com https://*.stripe.network",
				"img-src 'self' data: https://www.paypalobjects.com https://*.stripe.com",
				"connect-src 'self' wss://localhost:8888 https://api.modempay.com https://www.sandbox.paypal.com https://www.paypal.com https://*.stripe.com https://q.stripe.com https://r.stripe.com https://m.stripe.com",
			].join('; '),
		},
	});

	// 2. Image Shortcode
	eleventyConfig.addAsyncShortcode('image', async function (args) {
		let src = args.src;
		const relativeSrc = src.startsWith('/') ? src.substring(1) : src;
		let fullSrc = path.join(process.cwd(), 'src', relativeSrc);

		let metadata = await Image(fullSrc, {
			widths: [400, 800, 1200],
			formats: ['avif', 'webp', 'jpeg'],
			outputDir: './_site/img/',
			// Match this to your pathPrefix below
			urlPath: '/breast-cancer-site-final/img/',
		});

		return Image.generateHTML(metadata, {
			alt: args.alt || '',
			class: args.class || '',
			sizes: args.sizes || '(min-width: 30em) 50vw, 100vw',
			loading: 'lazy',
			decoding: 'async',
		});
	});

	// 3. Passthrough & Watch (FIXED PATHS)
	eleventyConfig.addPassthroughCopy('src/assets');
	eleventyConfig.addPassthroughCopy('./src/js/');
	eleventyConfig.addPassthroughCopy('src/js'); // Removed leading slash

	eleventyConfig.addWatchTarget('src/css/');
	eleventyConfig.addWatchTarget('src/js/');

	return {
		htmlTemplateEngine: 'njk',
		pathPrefix: '/breast-cancer-site-final/',
		dir: {
			input: 'src',
			output: '_site',
		},
	};
};
