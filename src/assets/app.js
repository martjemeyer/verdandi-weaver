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
    localStorage.setItem("vw-theme", mode);
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    const isDark = root.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
  });

  // ----------------------------------------------------------------
  // Active nav link — updated on every navigation
  // ----------------------------------------------------------------
  function updateActiveLinks(href) {
    const file = (href.split("/").pop() || "index.html").replace(/%20/g, " ");
    document.querySelectorAll(".nav__links a").forEach((a) => {
      const linkFile = (a.getAttribute("href").split("/").pop() || "index.html");
      const match = linkFile === file;
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
  const appScript = document.querySelector("script[src='/assets/app.js']");

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

      // Remove every body child except the nav and this script tag
      // Also remove any page-specific external scripts loaded by the previous page
      Array.from(document.body.children).forEach((el) => {
        if (el !== navEl && el !== appScript) el.remove();
      });
      document.querySelectorAll("script[data-page-script]").forEach((s) => s.remove());

      // Collect incoming content (skip the new page's nav and any scripts)
      const frag = document.createDocumentFragment();
      Array.from(newDoc.body.children).forEach((el) => {
        if (!el.matches(".nav, script")) frag.appendChild(el);
      });

      // Insert before the script tag so it stays last in <body>
      document.body.insertBefore(frag, appScript || null);

      if (pushState) history.pushState({}, "", href);
      window.scrollTo(0, 0);
      openNav(false);
      updateActiveLinks(href);

      // Re-execute inline scripts from the incoming page (e.g. ecosystem filter)
      newDoc.body.querySelectorAll("script:not([src])").forEach((orig) => {
        const s = document.createElement("script");
        s.textContent = orig.textContent;
        document.body.appendChild(s);
      });

      // Re-load external page-specific scripts (e.g. scan.js on self-scans)
      newDoc.body.querySelectorAll("script[src]").forEach((orig) => {
        const src = orig.getAttribute("src");
        if (!src || src.includes("app.js")) return;
        const s = document.createElement("script");
        s.src = src;
        s.setAttribute("data-page-script", "");
        document.body.appendChild(s);
      });
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
    // Ignore: external URLs, anchor-only, special protocols, non-html files
    if (!href ||
        /^(https?:|\/\/|#|mailto:|tel:)/.test(href) ||
        !href.endsWith(".html")) return;

    // Already on this page — swallow the click silently
    const currentFile = location.pathname.split("/").pop() || "index.html";
    const hrefFile = href.split("/").pop();
    if (hrefFile === currentFile) { e.preventDefault(); return; }

    e.preventDefault();
    openNav(false); // close mobile nav immediately, before the fetch
    navigate(href);
  });

  // Restore content on browser back / forward
  window.addEventListener("popstate", () => {
    const href = location.pathname.split("/").pop() || "index.html";
    navigate(href, { pushState: false });
  });

  // ----------------------------------------------------------------
  // Amazon geo-redirect — swap data-asin links to the visitor's store
  // ----------------------------------------------------------------
  (function () {
    const domains = {
      GB: 'amazon.co.uk', AU: 'amazon.com.au', CA: 'amazon.ca',
      DE: 'amazon.de',    AT: 'amazon.de',     CH: 'amazon.de',
      FR: 'amazon.fr',    BE: 'amazon.fr',
      ES: 'amazon.es',    IT: 'amazon.it',
      JP: 'amazon.co.jp', BR: 'amazon.com.br', IN: 'amazon.in',
      MX: 'amazon.com.mx',NL: 'amazon.nl',     PL: 'amazon.pl',
      SE: 'amazon.se',    SG: 'amazon.sg',     AE: 'amazon.ae',
      TR: 'amazon.com.tr',SA: 'amazon.sa',     EG: 'amazon.eg'
    };
    const tzMap = {
      'Europe/Stockholm': 'SE', 'Europe/London': 'GB', 'Europe/Berlin': 'DE',
      'Europe/Paris': 'FR', 'Europe/Amsterdam': 'NL', 'Europe/Madrid': 'ES',
      'Europe/Rome': 'IT', 'Asia/Tokyo': 'JP', 'America/Toronto': 'CA',
      'Australia/Sydney': 'AU', 'Asia/Kolkata': 'IN', 'America/Sao_Paulo': 'BR'
    };
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const countryFromTz = tzMap[tz];
      const countryFromLang = (navigator.language || '').split('-')[1] || '';
      const country = countryFromTz || countryFromLang.toUpperCase();
      const domain = domains[country] || 'amazon.com';
      document.querySelectorAll('a[data-asin]').forEach(a => {
        a.href = 'https://www.' + domain + '/dp/' + a.dataset.asin;
      });
    } catch (e) {}
  })();
})();
