module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addWatchTarget("./src/css/");

  return {
    // This tells the "| url" filter to add the subfolder to every link
    pathPrefix: "/breast-cancer-site-final/",
    
    
    dir: {
      input: "src",
      output: "_site"
    }
  };
};