// A fresh value on every build — appended as a cache-busting query
// string to CSS/JS asset URLs (e.g. /assets/app.js?v=173...), so a
// browser that already cached the previous version's file under a
// long Cache-Control lifetime is forced to fetch the new one instead
// of silently running stale JS/CSS after a deploy.
module.exports = () => Date.now();
