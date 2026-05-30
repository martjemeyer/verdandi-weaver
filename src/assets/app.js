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
  const appScript = document.querySelector("script[src='app.js']");

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
      Array.from(document.body.children).forEach((el) => {
        if (el !== navEl && el !== appScript) el.remove();
      });

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
})();
