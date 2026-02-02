module.exports = function(eleventyConfig) {
  // Copy assets from src to _site
  eleventyConfig.addPassthroughCopy("src/assets");

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("./src/css/");

  return {
   
    // If on GitHub, use the repo name. If on your PC, use "/"
    pathPrefix: process.env.GITHUB_ACTIONS ? "/breast-cancer-site-final/" : "/",
    
    dir: {
      input: "src",
      output: "_site"
    }
  };
};