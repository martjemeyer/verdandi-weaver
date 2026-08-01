const EleventyFetch = require("@11ty/eleventy-fetch");
const RssParser = require("rss-parser");
const rssParser = new RssParser();
const podcastShows = require("./src/_data/podcastShows.js");

// Node's default fetch User-Agent is a common trigger for bot-blocking
// on shared CI IP ranges (this showed up as intermittent build-time
// fetch failures specifically from GitHub Actions, never locally) —
// identify honestly instead of spoofing a browser.
const FEED_FETCH_OPTIONS = {
  duration: "1h",
  type: "text",
  fetchOptions: {
    headers: {
      "User-Agent": "VerdandiWeaverSiteBuild/1.0 (+https://verdandiweaver.com/)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
  },
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Confirmed (31 July 2026) via temporary diagnostic logging: Substack's
// edge returns a hard 403 Forbidden to every one of these feeds from
// GitHub Actions' runner IPs — both verdandiweaver.substack.com (the
// publication's own domain) and api.substack.com (the podcast RSS
// host). This is a durable IP-level block on Substack's side, not tied
// to the specific domain that was blocked before — swapping URLs again
// will not fix it. Retrying within a build cannot succeed against a
// 403; this retry only helps with genuinely transient errors (timeouts,
// DNS blips, a real 5xx), which is why it's kept.
//
// The actual fix: fetch through the existing Cloudflare Worker
// (verdandi-cms-auth.martjemeyer.workers.dev, source in
// cloudflare-worker-oauth.js) instead of hitting Substack directly.
// Cloudflare's edge isn't blocked, so it fetches server-side and hands
// the XML back untouched. The Worker only proxies its own closed
// allow-list of feed keys — never an arbitrary URL.
const FEED_PROXY_BASE = "https://verdandi-cms-auth.martjemeyer.workers.dev/substack-feed";

async function fetchFeedWithRetry(feedKey, attempts = 3, delayMs = 3000) {
  const url = `${FEED_PROXY_BASE}?feed=${feedKey}`;
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await EleventyFetch(url, FEED_FETCH_OPTIONS);
    } catch (e) {
      lastError = e;
      if (i < attempts - 1) await sleep(delayMs);
    }
  }
  throw lastError;
}

module.exports = function (eleventyConfig) {
  // Copy static assets as-is
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/contact-handler.php");
  eleventyConfig.addPassthroughCopy("src/newsletter-handler.php");
  eleventyConfig.addPassthroughCopy("src/vendor");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

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

  // Look up one podcast show's plain data object (src/_data/podcastShows.js)
  // by its key, for use on that show's own hub page.
  eleventyConfig.addFilter("byShowKey", function (arr, key) {
    return Array.isArray(arr) ? arr.find((show) => show.key === key) : undefined;
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

  // Nunjucks (unlike Jinja2) has no selectattr/rejectattr — this is
  // the plain equivalent, used to split the Explore page's tag chips
  // by language.
  eleventyConfig.addFilter("whereLang", (tags, lang) =>
    (Array.isArray(tags) ? tags : []).filter((t) => t.lang === lang)
  );

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

  // Latest posts + podcast episodes from Substack's public RSS feed,
  // fetched at build time (cached for an hour so repeated builds don't
  // hammer Substack). If the fetch ever fails — Substack down, no
  // network in the build environment, etc. — this degrades to an empty
  // list rather than failing the whole site build.
  eleventyConfig.addCollection("substackFeed", async () => {
    try {
      const xml = await fetchFeedWithRetry("main");
      const feed = await rssParser.parseString(xml);
      // The feed carries no per-episode image or duration (Substack
      // doesn't populate itunes:image/itunes:duration per item here,
      // and the enclosure's length is always "0") — so those are never
      // invented; templates fall back to a local branded image and
      // simply omit duration.
      return (feed.items || []).slice(0, 3).map((item, i) => ({
        title: item.title,
        url: item.link,
        date: item.isoDate || item.pubDate,
        description: item.contentSnippet || "",
        isNewest: i === 0,
      }));
    } catch (e) {
      console.warn("Substack feed fetch failed — showing no items:", e.message);
      return [];
    }
  });

  // Maps one Substack podcast RSS item into the shape templates use.
  // itunes:episode is only present on some items (confirmed by
  // inspecting the live feed) — omitted rather than invented when
  // absent, same principle as the missing duration/image used to be
  // handled under the old section feeds.
  function mapPodcastItem(item) {
    return {
      title: item.title,
      url: item.link,
      date: item.isoDate || item.pubDate,
      description: item.contentSnippet || "",
      image: (item.itunes && item.itunes.image) || null,
      duration: (item.itunes && item.itunes.duration) || null,
      episodeNumber: (item.itunes && item.itunes.episode) || null,
      audioUrl: (item.enclosure && item.enclosure.url) || null,
    };
  }

  // Newest episode per podcast show (src/_data/podcastShows.js), for
  // the homepage's "new episode" strips. Each show is fetched
  // independently so one feed failing doesn't hide the other's strip.
  eleventyConfig.addCollection("podcastLatest", async () => {
    const results = [];
    for (const show of podcastShows) {
      try {
        // A small gap between each show's request, rather than firing
        // both back-to-back, to go a little easier on Substack's rate
        // limiting from a shared CI IP.
        if (results.length > 0) await sleep(1500);
        const xml = await fetchFeedWithRetry(show.key);
        const feed = await rssParser.parseString(xml);
        const item = (feed.items || [])[0];
        if (item) {
          results.push({
            key: show.key,
            name: show.name,
            sectionUrl: show.sectionUrl,
            ...mapPodcastItem(item),
          });
        }
      } catch (e) {
        console.warn(`Podcast feed fetch failed for ${show.name}:`, e.message);
      }
    }
    return results;
  });

  // Full episode list per show (newest first, as Substack already
  // orders them), for each show's own hub page. Kept as one collection
  // keyed by show so a single hub template can pull its own show's
  // list without either hub depending on the other's fetch succeeding.
  eleventyConfig.addCollection("podcastEpisodes", async () => {
    const byKey = {};
    for (const show of podcastShows) {
      try {
        if (Object.keys(byKey).length > 0) await sleep(1500);
        const xml = await fetchFeedWithRetry(show.key);
        const feed = await rssParser.parseString(xml);
        byKey[show.key] = (feed.items || []).map(mapPodcastItem);
      } catch (e) {
        console.warn(`Podcast episode list fetch failed for ${show.name}:`, e.message);
        byKey[show.key] = [];
      }
    }
    return byKey;
  });

  // Site-wide tag index: one entry per unique tag, gathering everything
  // — Rethinking Society episodes (both languages), Explore/ecosystem
  // entries, and Articles & Reflections posts — that shares it, so a
  // single tag page can list all of it regardless of content type.
  // Books are not included yet: their "Tags / Meta" field is a single
  // free-text string, not a real list, so there is nothing structured
  // to index there.
  eleventyConfig.addCollection("tagIndex", (api) => {
    const bySlug = new Map();
    function add(rawLabel, item, lang) {
      const label = String(rawLabel || "").trim();
      if (!label) return;
      const slug = slugify(label);
      if (!slug) return;
      if (!bySlug.has(slug)) bySlug.set(slug, { slug, label, items: [], langs: new Set() });
      const tag = bySlug.get(slug);
      tag.items.push(item);
      tag.langs.add(lang || "en");
    }

    rsEpisodes(api, "English").forEach((ep) => {
      (ep.data.topics || []).forEach((t) =>
        add(t, {
          title: ep.data.title,
          href: `/rethinking-society/episodes/${ep.data.slug}/`,
          typeLabel: "Rethinking Society",
          external: false,
        }, "en")
      );
    });
    rsEpisodes(api, "Swedish").forEach((ep) => {
      (ep.data.topics || []).forEach((t) =>
        add(t, {
          title: ep.data.title,
          href: `/sv/rethinking-society/#avsnitt-${ep.data.number}`,
          typeLabel: "Rethinking Society",
          external: false,
        }, "sv")
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
        }, "en")
      );
    });

    api.getFilteredByTag("articles").forEach((article) => {
      (article.data.topics || []).forEach((t) =>
        add(t, {
          title: article.data.title,
          href: article.url,
          typeLabel: "Article",
          external: false,
        }, "en")
      );
    });

    // A tag is grouped as Swedish only if EVERY item that contributed
    // it is Swedish — a tag shared across languages stays with English
    // rather than being hidden away in the Swedish-only group.
    return Array.from(bySlug.values())
      .map((tag) => ({ ...tag, lang: tag.langs.size === 1 && tag.langs.has("sv") ? "sv" : "en" }))
      .sort((a, b) => a.label.localeCompare(b.label));
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
