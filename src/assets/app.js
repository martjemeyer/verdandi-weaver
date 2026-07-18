/* Verdandi Weaver — app.js
   Theme toggle · Mobile nav · Client-side navigation */
(function () {
  const root = document.documentElement;

  // ----------------------------------------------------------------
  // Theme
  // The theme attribute is also set by an inline <script> in <head>
  // before first paint. This run additionally handles palette & font.
  // ----------------------------------------------------------------
  const storedTheme = localStorage.getItem("vw-theme");
  if (storedTheme) root.setAttribute("data-theme", storedTheme);
  else if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    root.setAttribute("data-theme", "dark");

  function setTheme(mode) {
    document.body.style.transition = "background-color 0.4s ease, color 0.4s ease";
    if (mode === "light") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", "dark");
    // Remembering the choice across visits is a "Preferences" cookie
    // category — only persist it once that category has been accepted.
    // The toggle still works for the current page view either way.
    if (window.VWConsent && window.VWConsent.hasConsent("preferences")) {
      localStorage.setItem("vw-theme", mode);
    }
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    const isDark = root.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
  });

  // ----------------------------------------------------------------
  // Newsletter ("Stay near") forms — delegated so every instance
  // (Explore, Circles, Spaces) works identically without rebinding
  // after an SPA navigation. Submits are real: they email the site
  // owner via newsletter-handler.php, clearly labelled as a newsletter
  // signup so it's never mistaken for a contact-form message.
  // ----------------------------------------------------------------
  document.addEventListener("submit", (e) => {
    const form = e.target.closest(".stay__form");
    if (!form) return;
    e.preventDefault();

    const button = form.querySelector("button");
    const original = button.textContent;
    const status = form.parentElement.querySelector("[data-stay-status]");
    button.disabled = true;
    button.textContent = "Sending…";

    const data = new FormData(form);
    data.set("page", document.title);

    fetch(form.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
      .then(({ ok, json }) => {
        if (!ok || !json.ok) throw new Error(json.message || "Request failed");
        form.reset();
        button.textContent = "kept near";
        if (status) {
          status.textContent = json.message || "Thank you — you're on the list.";
          status.setAttribute("data-state", "ok");
        }
      })
      .catch((err) => {
        button.textContent = original;
        if (status) {
          status.textContent = err.message || "Something went wrong. Please try again.";
          status.setAttribute("data-state", "error");
        }
      })
      .finally(() => {
        button.disabled = false;
      });
  });

  // ----------------------------------------------------------------
  // Path normalization — mirrors the "activeIf" Nunjucks filter so
  // client-side nav state agrees with the server-rendered state.
  // Trailing-slash directory URLs (e.g. /rethinking-society/) must
  // NOT collapse to the same value as "/" (the homepage) the way a
  // naive split("/").pop() would.
  // ----------------------------------------------------------------
  function normPath(u) {
    const path = u.split("?")[0].split("#")[0].replace(/%20/g, " ");
    if (path === "/" || path === "" || path === "/index.html") return "/";
    let v = path.endsWith("/") ? path.slice(0, -1) : path;
    if (!v.endsWith(".html")) v += ".html";
    return v.replace(/\/index\.html$/, "/");
  }

  // ----------------------------------------------------------------
  // Active nav link — updated on every navigation
  // A link matches by exact normalized path OR — for links carrying
  // data-section — whenever the current page's own data-nav-section
  // (set on <body>, mirroring the "navSection" front matter used
  // server-side) equals that value. Both checks apply independently
  // (a union, not either/or) exactly like the server-side Nunjucks:
  // the landing page itself (e.g. /frameworks.html) matches by exact
  // path, while its sub-pages (e.g. /framework-01.html) match only via
  // the section, and /rethinking-society/ pages match via the section
  // since none of their nested paths equal the section link's own href.
  // ----------------------------------------------------------------
  function updateActiveLinks(href) {
    const current = normPath(href);
    const section = document.body.dataset.navSection || "";
    document.querySelectorAll(".nav__links a").forEach((a) => {
      const sectionMatch = a.dataset.section && a.dataset.section === section;
      const pathMatch = normPath(a.getAttribute("href")) === current;
      const match = sectionMatch || pathMatch;
      a.classList.toggle("active", match);
      a.ariaCurrent = match ? "page" : null;
    });
  }

  updateActiveLinks(window.location.pathname);

  // ----------------------------------------------------------------
  // Mobile nav — aria-expanded, close on outside click or Escape
  // ----------------------------------------------------------------
  const navEl     = document.querySelector(".nav");
  const navToggle = navEl?.querySelector("[data-nav-toggle]");

  function openNav(open) {
    navEl.classList.toggle("is-open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
  }

  navToggle?.addEventListener("click", () => {
    openNav(!navEl.classList.contains("is-open"));
  });

  document.addEventListener("click", (e) => {
    if (navEl?.classList.contains("is-open") && !e.target.closest(".nav"))
      openNav(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navEl?.classList.contains("is-open")) {
      openNav(false);
      navToggle?.focus();
    }
  });

  // ----------------------------------------------------------------
  // Client-side navigation
  // Clicks on internal .html links are intercepted. The target page
  // is fetched, and only the body content is swapped — the nav
  // element is never touched so it never flickers or re-renders.
  // ----------------------------------------------------------------
  const appScript = document.querySelector("script[src^='/assets/app.js']");

  async function navigate(href, { pushState = true } = {}) {
    let html;
    try {
      const res = await fetch(href);
      if (!res.ok) throw new Error(res.status);
      html = await res.text();
    } catch {
      // Network error or non-2xx — fall back to full navigation
      location.href = href;
      return;
    }

    const newDoc = new DOMParser().parseFromString(html, "text/html");

    function swap() {
      document.title = newDoc.title;
      document.body.dataset.navSection = newDoc.body.dataset.navSection || "";

      // Remove every body child except the nav, this script tag, and the
      // persistent cookie-consent banner/panel (#vw-consent-root — its
      // markup is identical on every page, but it must stay the SAME
      // live DOM node so consent.js's open/close state isn't reset)
      Array.from(document.body.children).forEach((el) => {
        if (el !== navEl && el !== appScript && el.id !== "vw-consent-root") el.remove();
      });
      document.querySelectorAll("script[data-page-script]").forEach((s) => s.remove());

      // Collect incoming content (skip the new page's nav, scripts, and
      // its own copy of the consent root — the live one above is kept)
      const frag = document.createDocumentFragment();
      Array.from(newDoc.body.children).forEach((el) => {
        if (!el.matches(".nav, script, #vw-consent-root")) frag.appendChild(el);
      });

      // Insert before the script tag so it stays last in <body>
      document.body.insertBefore(frag, appScript || null);

      if (pushState) history.pushState({}, "", href);
      const hash = href.split("#")[1];
      const target = hash && document.getElementById(hash);
      if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
      openNav(false);
      updateActiveLinks(href);
      applyAmazonLinks();

      // Re-execute inline scripts from the incoming page (e.g. ecosystem filter)
      newDoc.body.querySelectorAll("script:not([src])").forEach((orig) => {
        const s = document.createElement("script");
        s.textContent = orig.textContent;
        document.body.appendChild(s);
      });

      // Re-load external page-specific scripts (e.g. scan.js on self-scans)
      newDoc.body.querySelectorAll("script[src]").forEach((orig) => {
        const src = orig.getAttribute("src");
        if (!src || src.includes("app.js") || src.includes("consent.js")) return;
        const s = document.createElement("script");
        s.src = src;
        s.setAttribute("data-page-script", "");
        document.body.appendChild(s);
      });

      // Let consent.js re-scan the freshly inserted content for
      // [data-vw-embed] placeholders (it is never itself re-executed,
      // so it can't discover new embeds on its own)
      document.dispatchEvent(new CustomEvent("vw:content-swapped"));
    }

    // Use View Transition if available for a smooth content fade
    if (document.startViewTransition) {
      await document.startViewTransition(swap).finished;
    } else {
      swap();
    }
  }

  // Intercept all clicks on internal .html links
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    // Ignore: external URLs, anchor-only, special protocols, and anything
    // not a same-site page reference (internal pages are either "*.html"
    // or a clean "/section/sub-path/" directory URL, each optionally
    // followed by a "#fragment")
    const hrefPath = href ? href.split("#")[0] : "";
    if (!href ||
        /^(https?:|\/\/|#|mailto:|tel:)/.test(href) ||
        !(hrefPath.endsWith(".html") || hrefPath.endsWith("/"))) return;

    // Already on this page — scroll to the fragment if there is one,
    // otherwise swallow the click silently (nothing to navigate to)
    if (normPath(href) === normPath(location.pathname)) {
      e.preventDefault();
      const hash = href.split("#")[1];
      const target = hash && document.getElementById(hash);
      if (target) target.scrollIntoView({ behavior: "smooth" });
      return;
    }

    e.preventDefault();
    openNav(false); // close mobile nav immediately, before the fetch
    navigate(href);
  });

  // Restore content on browser back / forward
  window.addEventListener("popstate", () => {
    navigate(location.pathname + location.hash, { pushState: false });
  });

  // ----------------------------------------------------------------
  // Amazon geo-redirect — swap data-asin links to the visitor's store
  // Runs on initial load and after every SPA navigation
  // ----------------------------------------------------------------
  const amazonDomains = {
    GB: 'amazon.co.uk', AU: 'amazon.com.au', CA: 'amazon.ca',
    DE: 'amazon.de',    AT: 'amazon.de',     CH: 'amazon.de',
    FR: 'amazon.fr',    BE: 'amazon.fr',
    ES: 'amazon.es',    IT: 'amazon.it',
    JP: 'amazon.co.jp', BR: 'amazon.com.br', IN: 'amazon.in',
    MX: 'amazon.com.mx',NL: 'amazon.nl',     PL: 'amazon.pl',
    SE: 'amazon.se',    SG: 'amazon.sg',     AE: 'amazon.ae',
    TR: 'amazon.com.tr',SA: 'amazon.sa',     EG: 'amazon.eg'
  };
  // Language code (without country) → country
  const langMap = {
    nl: 'NL', de: 'DE', fr: 'FR', es: 'ES', it: 'IT', pl: 'PL',
    sv: 'SE', ja: 'JP', pt: 'BR', tr: 'TR', ar: 'AE'
  };
  const tzMap = {
    'Europe/Amsterdam': 'NL', 'Europe/Stockholm': 'SE', 'Europe/London': 'GB',
    'Europe/Berlin': 'DE', 'Europe/Paris': 'FR', 'Europe/Madrid': 'ES',
    'Europe/Rome': 'IT', 'Asia/Tokyo': 'JP', 'America/Toronto': 'CA',
    'Australia/Sydney': 'AU', 'Asia/Kolkata': 'IN', 'America/Sao_Paulo': 'BR'
  };

  let amazonDomain = 'amazon.com';
  try {
    const tz   = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lang = (navigator.language || '').toLowerCase();
    const countryCode = lang.split('-')[1] || '';
    const langCode    = lang.split('-')[0] || '';
    const country = tzMap[tz] || countryCode.toUpperCase() || langMap[langCode] || '';
    amazonDomain = amazonDomains[country] || 'amazon.com';
  } catch (e) {}

  function applyAmazonLinks() {
    document.querySelectorAll('a[data-asin]').forEach(a => {
      a.href = 'https://www.' + amazonDomain + '/dp/' + a.dataset.asin;
    });
  }
  applyAmazonLinks();
})();
