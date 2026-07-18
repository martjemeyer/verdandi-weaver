module.exports = function (eleventyConfig) {
  // Copy static assets as-is
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/contact-handler.php");
  eleventyConfig.addPassthroughCopy("src/newsletter-handler.php");
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

  // CMS-entered external URLs (e.g. resource purchase links) sometimes
  // get pasted without a protocol — "buymeacoffee.com/..." instead of
  // "https://buymeacoffee.com/...". Without this, the browser treats
  // it as a path relative to the current page and 404s on our own
  // domain instead of leaving it. Absolute paths ("/foo") and
  // mailto:/tel: links are left untouched.
  eleventyConfig.addFilter("absUrl", function (url) {
    if (!url) return "";
    if (/^(https?:|mailto:|tel:|\/)/i.test(url)) return url;
    return "https://" + url;
  });

  // Turns free-typed tag text into a URL-safe slug for /tags/{slug}/.
  // Keeps å/ä/ö (not just a-z) since Swedish tags are first-class here.
  function slugify(input) {
    return String(input || "")
      .toLowerCase()
      .replace(/[^a-z0-9åäö]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  eleventyConfig.addFilter("slugify", slugify);

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

  // Site-wide tag index: one entry per unique tag, gathering everything
  // — Rethinking Society episodes (both languages), Explore/ecosystem
  // entries, and Articles & Reflections posts — that shares it, so a
  // single tag page can list all of it regardless of content type.
  // Books are not included yet: their "Tags / Meta" field is a single
  // free-text string, not a real list, so there is nothing structured
  // to index there.
  eleventyConfig.addCollection("tagIndex", (api) => {
    const bySlug = new Map();
    function add(rawLabel, item) {
      const label = String(rawLabel || "").trim();
      if (!label) return;
      const slug = slugify(label);
      if (!slug) return;
      if (!bySlug.has(slug)) bySlug.set(slug, { slug, label, items: [] });
      bySlug.get(slug).items.push(item);
    }

    rsEpisodes(api, "English").forEach((ep) => {
      (ep.data.topics || []).forEach((t) =>
        add(t, {
          title: ep.data.title,
          href: `/rethinking-society/episodes/${ep.data.slug}/`,
          typeLabel: "Rethinking Society",
          external: false,
        })
      );
    });
    rsEpisodes(api, "Swedish").forEach((ep) => {
      (ep.data.topics || []).forEach((t) =>
        add(t, {
          title: ep.data.title,
          href: `/sv/rethinking-society/#avsnitt-${ep.data.number}`,
          typeLabel: "Rethinking Society",
          external: false,
        })
      );
    });

    api.getFilteredByTag("ecosystem").forEach((entry) => {
      const href = entry.data.href || entry.data.youtube_url || null;
      if (!href) return;
      (entry.data.topics || []).forEach((t) =>
        add(t, {
          title: entry.data.title,
          href,
          typeLabel: entry.data.type_label || "Explore",
          external: /^https?:\/\//.test(href),
        })
      );
    });

    api.getFilteredByTag("articles").forEach((article) => {
      (article.data.topics || []).forEach((t) =>
        add(t, {
          title: article.data.title,
          href: article.url,
          typeLabel: "Article",
          external: false,
        })
      );
    });

    return Array.from(bySlug.values()).sort((a, b) => a.label.localeCompare(b.label));
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
