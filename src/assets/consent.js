/* Verdandi Weaver — consent.js
   Central, first-party cookie/storage consent manager. No third-party
   consent platform. Loaded once and preserved across SPA navigations
   by app.js (see the #vw-consent-root / "consent.js" exclusions in its
   swap() function) — this file's top-level code runs exactly once per
   real page load, so state and listeners never duplicate.

   Bump CONSENT_VERSION to re-trigger the banner for every visitor
   (e.g. after adding a new category or a new third-party service). */
(function () {
  "use strict";

  var CONSENT_VERSION = 1;
  var STORAGE_KEY = "vw-consent";

  var root = document.getElementById("vw-consent-root");
  if (!root) return; // consent.js re-executed on a page without the include — never expected, defensive only

  var banner = document.getElementById("vw-consent-banner");
  var overlay = document.getElementById("vw-consent-overlay");
  var panel = document.getElementById("vw-consent-panel");
  var toggles = Array.prototype.slice.call(panel.querySelectorAll("[data-consent-toggle]"));

  var focusedBeforePanel = null;

  // ---------------------------------------------------------------
  // Storage
  // ---------------------------------------------------------------
  function readRecord() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.categories) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeRecord(categories, method) {
    var record = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      categories: {
        analytics: !!categories.analytics,
        externalMedia: !!categories.externalMedia,
        preferences: !!categories.preferences,
        marketing: false, // reserved: no marketing tooling exists on this site today
      },
      method: method,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return record;
  }

  var current = readRecord();

  function hasConsent(category) {
    if (category === "essential") return true;
    return !!(current && current.version === CONSENT_VERSION && current.categories[category]);
  }

  function isDecided() {
    return !!(current && current.version === CONSENT_VERSION);
  }

  // ---------------------------------------------------------------
  // Revocation side-effects — remove what a category is no longer
  // allowed to keep. Third-party cookies already set by an embed the
  // visitor loaded before revoking cannot be deleted by this site; the
  // Cookie Policy explains that those need manual browser-level removal.
  // ---------------------------------------------------------------
  function applyRevocations(previous, next) {
    if (previous && previous.categories.preferences && !next.categories.preferences) {
      localStorage.removeItem("vw-theme");
    }
    if (previous && previous.categories.externalMedia && !next.categories.externalMedia) {
      collapseLoadedEmbeds();
    }
  }

  function collapseLoadedEmbeds() {
    document.querySelectorAll("[data-vw-embed]").forEach(function (el) {
      var iframe = el.querySelector("iframe");
      if (iframe) renderPlaceholder(el);
    });
    document.querySelectorAll("[data-yt-facade][data-vw-loaded]").forEach(function (el) {
      el.removeAttribute("data-vw-loaded");
      var iframe = el.querySelector("iframe");
      if (iframe) iframe.remove();
      var thumb = el.querySelector("img, .rs-yt-facade__play");
      // rethinking-society.js owns the facade's own thumbnail markup;
      // dispatch so it can restore its own facade UI instead of guessing.
      el.dispatchEvent(new CustomEvent("vw:facade-collapse", { bubbles: true }));
    });
  }

  // ---------------------------------------------------------------
  // Apply current consent to the page: swap every [data-vw-embed]
  // between its placeholder and a real iframe.
  // ---------------------------------------------------------------
  function buildIframe(embedSrc, title) {
    var iframe = document.createElement("iframe");
    iframe.src = embedSrc;
    iframe.title = title || "";
    iframe.loading = "lazy";
    iframe.allowFullscreen = true;
    iframe.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;";
    return iframe;
  }

  function renderIframe(el) {
    el.innerHTML = "";
    el.appendChild(buildIframe(el.dataset.embedSrc, el.dataset.embedTitle));
  }

  function renderPlaceholder(el) {
    el.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className = "vw-embed-placeholder";

    var title = document.createElement("p");
    title.className = "vw-embed-placeholder__title";
    title.textContent = "External content is paused";

    var body = document.createElement("p");
    body.className = "vw-embed-placeholder__body";
    body.textContent =
      "This content is provided by " + (el.dataset.embedProvider || "an external provider") +
      ". Loading it may allow the provider to receive information about your visit and use cookies or similar technologies.";

    var loadBtn = document.createElement("button");
    loadBtn.type = "button";
    loadBtn.className = "btn btn--ghost";
    loadBtn.textContent = "Load this content";

    var checkLabel = document.createElement("label");
    checkLabel.className = "vw-embed-placeholder__check";
    var check = document.createElement("input");
    check.type = "checkbox";
    check.id = "vw-always-allow-" + Math.random().toString(36).slice(2, 8);
    check.setAttribute("aria-label", "Always allow external media on this website");
    checkLabel.appendChild(check);
    var checkText = document.createElement("span");
    checkText.textContent = "Always allow external media on this website";
    checkLabel.appendChild(checkText);

    loadBtn.addEventListener("click", function () {
      if (check.checked) {
        grantCategory("externalMedia");
      } else {
        renderIframe(el); // one-time load only, no stored consent change
      }
    });

    wrap.appendChild(title);
    wrap.appendChild(body);
    wrap.appendChild(loadBtn);
    wrap.appendChild(checkLabel);
    el.appendChild(wrap);
  }

  function scanEmbeds() {
    document.querySelectorAll("[data-vw-embed]").forEach(function (el) {
      var wantsIframe = hasConsent("externalMedia");
      var hasIframe = !!el.querySelector("iframe");
      var hasPlaceholder = !!el.querySelector(".vw-embed-placeholder");
      // Server-rendered markup may include a <noscript> fallback link
      // inside the container, so "has any child at all" is not a
      // reliable signal that a placeholder/iframe has already been
      // rendered — check for the specific elements instead.
      if (wantsIframe && !hasIframe) renderIframe(el);
      else if (!wantsIframe && !hasPlaceholder) renderPlaceholder(el);
    });
  }

  function grantCategory(category) {
    var next = {
      analytics: current ? current.categories.analytics : false,
      externalMedia: current ? current.categories.externalMedia : false,
      preferences: current ? current.categories.preferences : false,
    };
    next[category] = true;
    saveConsent(next, "custom");
  }

  // ---------------------------------------------------------------
  // Banner / panel visibility
  // ---------------------------------------------------------------
  function showBanner() {
    banner.hidden = false;
  }
  function hideBanner() {
    banner.hidden = true;
  }

  function openPanel(opener) {
    focusedBeforePanel = opener || document.activeElement;
    // Panel always opens reflecting the last SAVED state, not a stale draft
    toggles.forEach(function (t) {
      t.checked = hasConsent(t.dataset.consentToggle);
    });
    overlay.hidden = false;
    panel.hidden = false;
    var firstFocusable = panel.querySelector("input, button, a");
    if (firstFocusable) firstFocusable.focus();
    document.addEventListener("keydown", onPanelKeydown, true);
  }

  function closePanel() {
    overlay.hidden = true;
    panel.hidden = true;
    document.removeEventListener("keydown", onPanelKeydown, true);
    if (focusedBeforePanel && document.contains(focusedBeforePanel)) focusedBeforePanel.focus();
    focusedBeforePanel = null;
  }

  function onPanelKeydown(e) {
    if (panel.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel(); // Escape closes only — never implies consent
      return;
    }
    if (e.key === "Tab") {
      var focusables = Array.prototype.slice.call(
        panel.querySelectorAll('button, [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter(function (el) { return el.offsetParent !== null; });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // ---------------------------------------------------------------
  // Save paths
  // ---------------------------------------------------------------
  function saveConsent(categories, method) {
    var previous = current;
    current = writeRecord(categories, method);
    applyRevocations(previous, current);
    scanEmbeds();
    window.dispatchEvent(new CustomEvent("vw:consent-changed", { detail: current }));
  }

  function acceptAll() {
    saveConsent({ analytics: true, externalMedia: true, preferences: true }, "accept-all");
    hideBanner();
    closePanel();
  }
  function rejectAll() {
    saveConsent({ analytics: false, externalMedia: false, preferences: false }, "reject-all");
    hideBanner();
    closePanel();
  }
  function saveCustom() {
    var categories = {};
    toggles.forEach(function (t) {
      categories[t.dataset.consentToggle] = t.checked;
    });
    saveConsent(categories, "custom");
    hideBanner();
    closePanel();
  }

  // ---------------------------------------------------------------
  // Wiring — delegated so it survives content swaps without rebinding
  // ---------------------------------------------------------------
  document.addEventListener("click", function (e) {
    var actionEl = e.target.closest("[data-consent-action]");
    if (!actionEl) return;
    var action = actionEl.dataset.consentAction;
    if (action === "accept-optional") acceptAll();
    else if (action === "reject-optional") rejectAll();
    else if (action === "open-preferences") openPanel(actionEl);
    else if (action === "accept-all") acceptAll();
    else if (action === "reject-all") rejectAll();
    else if (action === "save") saveCustom();
    else if (action === "close") closePanel();
  });

  overlay.addEventListener("click", closePanel);

  document.addEventListener("vw:content-swapped", scanEmbeds);

  // ---------------------------------------------------------------
  // Analytics (Plausible) — cookieless, so there is nothing to clear
  // on revoke; the only thing consent controls is whether the script
  // ever loads in the first place. Once loaded it can't be un-run for
  // the current page view, but it won't load again on a future visit
  // once the category is off.
  // ---------------------------------------------------------------
  var analyticsLoaded = false;
  function loadAnalyticsIfConsented() {
    if (analyticsLoaded || !hasConsent("analytics")) return;
    var s = document.createElement("script");
    s.defer = true;
    s.dataset.domain = "verdandiweaver.com";
    s.src = "https://plausible.io/js/script.js";
    document.head.appendChild(s);
    analyticsLoaded = true;
  }
  window.addEventListener("vw:consent-changed", loadAnalyticsIfConsented);

  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------
  if (!isDecided()) showBanner();
  scanEmbeds();
  loadAnalyticsIfConsented();

  window.VWConsent = {
    CONSENT_VERSION: CONSENT_VERSION,
    hasConsent: hasConsent,
    isDecided: isDecided,
    openPreferences: openPanel,
    acceptAll: acceptAll,
    rejectAll: rejectAll,
    acceptCategory: grantCategory,
  };
})();
