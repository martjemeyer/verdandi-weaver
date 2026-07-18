/* Rethinking Society — episode section interactions.
   Loaded only on Rethinking Society pages. */
(function () {
  // YouTube click-to-load facade — avoids loading N embeds up front.
  // Consent-aware: a click only ever injects the real iframe once
  // External Media has been accepted; otherwise it swaps in the same
  // "External content is paused" placeholder used elsewhere on the
  // site, so a visitor who hasn't consented never gets a live embed
  // just by clicking the thumbnail.
  document.querySelectorAll('[data-yt-facade]').forEach(function (el) {
    var originalHTML = el.innerHTML; // thumbnail + play button, restored on consent revoke

    function loadIframe() {
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
      el.setAttribute('data-vw-loaded', '');
    }

    function showPlaceholder() {
      el.innerHTML = '';
      el.removeAttribute('role');
      el.removeAttribute('tabindex');

      var wrap = document.createElement('div');
      wrap.className = 'vw-embed-placeholder';

      var title = document.createElement('p');
      title.className = 'vw-embed-placeholder__title';
      title.textContent = 'External content is paused';

      var body = document.createElement('p');
      body.className = 'vw-embed-placeholder__body';
      body.textContent = 'This content is provided by YouTube. Loading it may allow the provider to receive information about your visit and use cookies or similar technologies.';

      var loadBtn = document.createElement('button');
      loadBtn.type = 'button';
      loadBtn.className = 'btn btn--ghost';
      loadBtn.textContent = 'Load this content';

      var checkLabel = document.createElement('label');
      checkLabel.className = 'vw-embed-placeholder__check';
      var check = document.createElement('input');
      check.type = 'checkbox';
      check.setAttribute('aria-label', 'Always allow external media on this website');
      checkLabel.appendChild(check);
      var checkText = document.createElement('span');
      checkText.textContent = 'Always allow external media on this website';
      checkLabel.appendChild(checkText);

      loadBtn.addEventListener('click', function () {
        if (check.checked && window.VWConsent) window.VWConsent.acceptCategory('externalMedia');
        else loadIframe(); // one-time load only, no stored consent change
      });

      wrap.appendChild(title);
      wrap.appendChild(body);
      wrap.appendChild(loadBtn);
      wrap.appendChild(checkLabel);
      el.appendChild(wrap);
    }

    function activate() {
      if (window.VWConsent && window.VWConsent.hasConsent('externalMedia')) loadIframe();
      else showPlaceholder();
    }

    el.addEventListener('click', activate);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });

    // Fired by consent.js when External Media is revoked after this
    // facade already loaded a live iframe — restore the original
    // thumbnail/play-button state so it requires a fresh click.
    el.addEventListener('vw:facade-collapse', function () {
      el.innerHTML = originalHTML;
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
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
