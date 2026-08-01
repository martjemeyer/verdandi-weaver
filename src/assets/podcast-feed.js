/*
 * Fetches podcast/Substack episode data in the visitor's own browser
 * instead of at build time. GitHub Actions' shared runner IPs get a
 * hard 403 from Substack's edge (confirmed 31 July 2026); a visitor's
 * own browser was never blocked or rate-limited. Goes through the
 * existing Cloudflare Worker (cloudflare-worker-oauth.js), which has
 * CORS enabled and only proxies its own closed allow-list of feed
 * keys — never an arbitrary URL.
 *
 * Every page renders a real static fallback by default (no JS
 * required to see something reasonable); this script progressively
 * enhances that fallback once a fetch succeeds. A failed or slow
 * fetch simply leaves the fallback in place.
 */
(function () {
  "use strict";

  var WORKER_BASE = "https://verdandi-cms-auth.martjemeyer.workers.dev/substack-feed";
  var lang = document.documentElement.lang === "sv" ? "sv" : "en";

  // Substack's <description> is block-level HTML (<p>, <br>); reading
  // .textContent directly runs paragraphs together with no space
  // between them ("...heavy…even after..."). Insert a space at block
  // boundaries first, then strip the remaining tags.
  function stripHtml(html) {
    var withBreaks = (html || "").replace(/<\/(p|div|li)>/gi, " ").replace(/<br\s*\/?>/gi, " ");
    var div = document.createElement("div");
    div.innerHTML = withBreaks;
    return (div.textContent || "").replace(/\s+/g, " ").trim();
  }

  function truncate(text, max) {
    if (!text || text.length <= max) return text;
    var cut = text.slice(0, max);
    var lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
  }

  function firstText(el, tag) {
    var node = el.getElementsByTagName(tag)[0];
    return node ? node.textContent.trim() : "";
  }

  // Parses one <item> into the shape templates use — mirrors the
  // mapping the old build-time code used to do in .eleventy.js.
  // itunes:duration/itunes:image/enclosure are only present on some
  // feeds or some items; omitted rather than invented when absent.
  function parseItem(item) {
    var pubDate = firstText(item, "pubDate");
    var durationNode = item.getElementsByTagName("itunes:duration")[0];
    var imageNode = item.getElementsByTagName("itunes:image")[0];
    var enclosureNode = item.getElementsByTagName("enclosure")[0];
    return {
      title: firstText(item, "title"),
      url: firstText(item, "link"),
      date: pubDate ? new Date(pubDate).toISOString() : null,
      description: truncate(stripHtml(firstText(item, "description")), 220),
      image: imageNode ? imageNode.getAttribute("href") : null,
      duration: durationNode ? durationNode.textContent.trim() : null,
      audioUrl: enclosureNode ? enclosureNode.getAttribute("url") : null,
    };
  }

  function formatDate(iso) {
    if (!iso) return "";
    try {
      return new Intl.DateTimeFormat(lang === "sv" ? "sv-SE" : "en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(iso));
    } catch (e) {
      return "";
    }
  }

  function formatMinutes(durationSeconds) {
    if (!durationSeconds) return "";
    var n = parseInt(durationSeconds, 10);
    if (isNaN(n)) return "";
    return Math.round(n / 60) + " min";
  }

  // Fetches and parses one feed. Returns a Promise of an array of
  // items (newest first, as Substack already orders them), or an
  // empty array if the fetch/parse fails for any reason.
  function fetchFeed(key) {
    return fetch(WORKER_BASE + "?feed=" + encodeURIComponent(key))
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (xmlText) {
        var doc = new DOMParser().parseFromString(xmlText, "application/xml");
        if (doc.querySelector("parsererror")) throw new Error("XML parse error");
        return Array.prototype.slice.call(doc.getElementsByTagName("item")).map(parseItem);
      })
      .catch(function (e) {
        console.warn("Podcast feed fetch failed for " + key + ":", e.message);
        return [];
      });
  }

  // --- Homepage: two "new episode" strips, one per podcast show ---
  function hydrateStrips() {
    var strips = document.querySelectorAll("[data-podcast-strip]");
    strips.forEach(function (strip) {
      var key = strip.getAttribute("data-podcast-strip");
      fetchFeed(key).then(function (items) {
        var item = items[0];
        if (!item) return;
        strip.href = item.url;
        var titleEl = strip.querySelector("[data-field='title']");
        if (titleEl) titleEl.textContent = item.title;
        strip.hidden = false;
        strip.closest("section").hidden = false;
      });
    });
  }

  // --- Homepage: "Latest listening" panel (general feed, 3 items) ---
  function hydrateLatestListening() {
    var container = document.getElementById("latest-listening");
    if (!container) return;
    var key = container.getAttribute("data-podcast-feed");
    fetchFeed(key).then(function (items) {
      if (!items.length) return;
      var strings = lang === "sv"
        ? { newest: "Senaste avsnittet", listen: "Lyssna på avsnittet →", readOn: "Läs och lyssna på Substack →" }
        : { newest: "Newest episode", listen: "Listen to the episode →", readOn: "Read and listen on Substack →" };
      var newest = items[0];
      var html = '<div class="grid grid-2" style="align-items:center; gap: var(--sp-7); margin-top: var(--sp-7);">' +
        '<div class="clearing"><div class="figure" style="aspect-ratio: 4/5; max-width: 380px; margin-inline: auto;">' +
        '<img src="' + (newest.image || "/assets/uploads/returning-to-grounded-wholeness.png") + '" alt="" loading="lazy" /></div></div>' +
        '<div><span class="new-episode-strip__badge" style="display:inline-block;">' + strings.newest + '</span>' +
        '<h3 class="t-h3" style="margin-top: var(--sp-3);">' + escapeHtml(newest.title) + '</h3>' +
        (newest.description ? '<p class="t-body t-pretty" style="margin-top: var(--sp-2);">' + escapeHtml(newest.description) + '</p>' : '') +
        (newest.date ? '<p class="t-meta" style="margin-top: var(--sp-3);"><time datetime="' + newest.date + '">' + formatDate(newest.date) + '</time></p>' : '') +
        '<a class="btn btn--ghost" href="' + newest.url + '" target="_blank" rel="noopener noreferrer" style="margin-top: var(--sp-5);">' + strings.listen + '</a></div></div>';

      if (items.length > 1) {
        html += '<div class="listening-row" style="margin-top: var(--sp-8);">';
        items.slice(1).forEach(function (item) {
          html += '<a class="listening-row__item" href="' + item.url + '" target="_blank" rel="noopener noreferrer">' +
            (item.date ? '<p class="t-meta"><time datetime="' + item.date + '">' + formatDate(item.date) + '</time></p>' : '') +
            '<h4 class="t-h4 listening-row__title" style="margin-top: var(--sp-2);">' + escapeHtml(item.title) + '</h4>' +
            (item.description ? '<p class="t-meta" style="margin-top: var(--sp-1);">' + escapeHtml(item.description) + '</p>' : '') +
            '</a>';
        });
        html += '</div>';
      }

      var linkRow = container.querySelector("[data-substack-link-row]");
      container.innerHTML = html + (linkRow ? linkRow.outerHTML : "");
    });
  }

  // --- Podcast hub pages: latest episode (audio player) + full list ---
  function hydrateHub() {
    var config = window.VW_PODCAST_HUB;
    if (!config) return;
    fetchFeed(config.key).then(function (items) {
      if (!items.length) return;

      var latestContainer = document.getElementById("podcast-hub-latest");
      if (latestContainer) {
        var newest = items[0];
        var s = config.strings;
        var html = '<header class="section-header">' +
          '<p class="t-eyebrow">' + s.latestEpisode + '</p>' +
          '<h2 class="t-h2 t-balance">' + escapeHtml(newest.title) + '</h2>';
        if (newest.date || newest.duration) {
          html += '<p class="t-meta">' +
            (newest.date ? '<time datetime="' + newest.date + '">' + formatDate(newest.date) + '</time>' : '') +
            (newest.date && newest.duration ? ' · ' : '') +
            (newest.duration ? formatMinutes(newest.duration) : '') + '</p>';
        }
        html += '</header>';
        if (newest.description) html += '<p class="t-body t-pretty">' + escapeHtml(newest.description) + '</p>';
        if (newest.audioUrl) {
          html += '<audio controls preload="none" style="width:100%; margin-top: var(--sp-4);" aria-label="' + s.listenTo + ' ' + escapeHtml(newest.title) + '">' +
            '<source src="' + newest.audioUrl + '" type="audio/mpeg" />' + s.noAudioSupport + '</audio>';
        }
        html += '<p class="t-meta" style="margin-top: var(--sp-3);"><a class="link-chev" href="' + newest.url + '" target="_blank" rel="noopener noreferrer">' + s.readOnSubstack + '</a></p>';
        latestContainer.innerHTML = html;
      }

      var listContainer = document.getElementById("podcast-hub-episodes");
      if (listContainer && items.length > 1) {
        var s2 = config.strings;
        var cardsHtml = items.map(function (ep) {
          var meta = (ep.date ? '<time datetime="' + ep.date + '">' + formatDate(ep.date) + '</time>' : '') +
            (ep.date && ep.duration ? ' · ' : '') + (ep.duration ? formatMinutes(ep.duration) : '');
          return '<article class="card"><div class="card__body">' +
            '<h3 class="t-h3">' + escapeHtml(ep.title) + '</h3>' +
            (meta ? '<p class="t-meta">' + meta + '</p>' : '') +
            (ep.description ? '<p class="t-body t-pretty">' + escapeHtml(ep.description) + '</p>' : '') +
            '<a class="link-chev" href="' + ep.url + '" target="_blank" rel="noopener noreferrer">' + s2.listenOnSubstack + '</a>' +
            '</div></article>';
        }).join("");
        listContainer.innerHTML = '<header class="section-header"><h2 class="t-h2 t-balance">' + s2.allEpisodes + '</h2></header><div class="grid grid-3">' + cardsHtml + '</div>';
        listContainer.hidden = false;
      }
    });
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  document.addEventListener("DOMContentLoaded", function () {
    hydrateStrips();
    hydrateLatestListening();
    hydrateHub();
  });
})();
