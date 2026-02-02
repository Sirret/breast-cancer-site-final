module.exports = function(eleventyConfig) {
  // Copy the assets folder so images show up
  eleventyConfig.addPassthroughCopy("src/assets");

  // Watch the CSS folder for changes to trigger a reload
  eleventyConfig.addWatchTarget("./src/css/");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};