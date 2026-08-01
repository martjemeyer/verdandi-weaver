/*
 * First-visit language entrance, homepage only. The homepage renders
 * in full regardless of JS — nothing here is hidden by default — so
 * this is pure progressive enhancement: if a visitor already chose a
 * language before (localStorage flag), this script does nothing at
 * all, and if JS never runs, the visitor simply sees the full English
 * homepage directly, which is the correct fallback either way.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "vw-lang-chosen";

  if (localStorage.getItem(STORAGE_KEY)) return;

  var entrance = document.getElementById("vw-entrance");
  if (!entrance) return;

  entrance.hidden = false;
  document.body.classList.add("vw-entrance-open");

  var enBtn = document.getElementById("vw-entrance-en");
  var svBtn = document.getElementById("vw-entrance-sv");
  if (enBtn) enBtn.focus();

  function choose(lang, href) {
    localStorage.setItem(STORAGE_KEY, lang);
    if (lang === "sv") {
      window.location.href = href;
      return;
    }
    entrance.classList.add("vw-entrance--closing");
    document.body.classList.remove("vw-entrance-open");
    window.setTimeout(function () {
      entrance.hidden = true;
    }, 400);
  }

  if (enBtn) enBtn.addEventListener("click", function (e) { e.preventDefault(); choose("en", enBtn.href); });
  if (svBtn) svBtn.addEventListener("click", function (e) { e.preventDefault(); choose("sv", svBtn.href); });
})();
