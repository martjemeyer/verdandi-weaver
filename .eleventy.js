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

  eleventyConfig.addFilter("byTranslationKey", function (arr, key) {
    return Array.isArray(arr) && key ? arr.find((item) => item.data.translationKey === key) : undefined;
  });

  // Minimal date formatter (no date library in this project). Front-matter
  // "YYYY-MM-DD" values are parsed as UTC midnight by the YAML/front-matter
  // parser, so read the UTC components back out — otherwise the displayed
  // day could shift by one depending on the machine's local timezone.
  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  eleventyConfig.addFilter("date", function (input, format) {
    if (!input) return "";
    const d = new Date(input);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    const tokens = {
      YYYY: d.getUTCFullYear(),
      MMMM: MONTH_NAMES[d.getUTCMonth()],
      MM: pad(d.getUTCMonth() + 1),
      DD: pad(d.getUTCDate()),
    };
    return (format || "YYYY-MM-DD").replace(/YYYY|MMMM|MM|DD/g, (m) => tokens[m]);
  });

  eleventyConfig.addFilter("youtubeId", function (url) {
    if (!url) return "";
    const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : url;
  });

  // Rethinking Society episodes, scoped by language so each language
  // page only ever sees its own published entries — never a mix.
  function rsEpisodes(api, language) {
    return api
      .getFilteredByTag("rethinkingEpisode")
      .filter((item) => item.data.status === "published")
      .filter((item) => (item.data.language || "English") === language)
      .sort((a, b) => (a.data.displayOrder || a.data.number) - (b.data.displayOrder || b.data.number));
  }
  eleventyConfig.addCollection("rethinkingEpisodeEN", (api) => rsEpisodes(api, "English"));
  eleventyConfig.addCollection("rethinkingEpisodeSV", (api) => rsEpisodes(api, "Swedish"));

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
