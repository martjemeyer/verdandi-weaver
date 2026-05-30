module.exports = function (eleventyConfig) {
  // Copy static assets as-is
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Make page.url available in templates for active-nav logic
  eleventyConfig.addFilter("activeIf", function (href, pageUrl) {
    const norm = (u) => u.replace(/\/?$/, ".html").replace("/index.html", "/");
    return norm(pageUrl) === norm(href) ? "active" : "";
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
