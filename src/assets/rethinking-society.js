/* Rethinking Society — episode section interactions.
   Loaded only on Rethinking Society pages. */
(function () {
  // YouTube click-to-load facade — avoids loading N embeds up front.
  document.querySelectorAll('[data-yt-facade]').forEach(function (el) {
    function load() {
      var src = el.dataset.embedSrc;
      if (!src) return;
      var sep = src.indexOf('?') === -1 ? '?' : '&';
      var iframe = document.createElement('iframe');
      iframe.src = src + sep + 'autoplay=1';
      iframe.title = el.getAttribute('aria-label') || 'Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      el.innerHTML = '';
      el.appendChild(iframe);
      el.removeAttribute('role');
      el.removeAttribute('tabindex');
    }
    el.addEventListener('click', load);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); }
    });
  });

  // Copy-link buttons — copies the current page URL, optionally with a
  // per-section anchor hash (data-copy-href="#episode-1").
  document.querySelectorAll('[data-copy-link]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var hrefPart = btn.dataset.copyHref || '';
      var url = window.location.origin + window.location.pathname + hrefPart;
      navigator.clipboard.writeText(url).then(function () {
        var original = btn.textContent;
        btn.textContent = btn.dataset.copiedLabel || 'Link copied';
        setTimeout(function () { btn.textContent = original; }, 2000);
      });
    });
  });
})();
