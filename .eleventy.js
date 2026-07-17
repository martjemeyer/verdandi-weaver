module.exports = function (eleventyConfig) {
  // Copy static assets as-is
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/contact-handler.php");
  eleventyConfig.addPassthroughCopy("src/vendor");

  eleventyConfig.addFilter("activeIf", function (href, pageUrl) {
    function norm(u) {
      if (u === "/" || u === "" || u === "/index.html") return "/";
      let v = u.endsWith("/") ? u.slice(0, -1) : u;
      if (!v.endsWith(".html")) v += ".html";
      return v.replace(/\/index\.html$/, "/");
    }
    return norm(pageUrl) === norm(href) ? "active" : "";
  });

  eleventyConfig.addFilter("limit", function (arr, n) {
    return Array.isArray(arr) ? arr.slice(0, n) : arr;
  });

  eleventyConfig.addFilter("byNumber", function (arr, n) {
    return Array.isArray(arr) ? arr.find((item) => item.data.number === n) : undefined;
  });

  eleventyConfig.addFilter("youtubeId", function (url) {
    if (!url) return "";
    const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : url;
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
