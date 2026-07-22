# Privacy & Cookie System — Implementation Notes

Companion to `PRIVACY-AND-COOKIE-AUDIT.md`. That document says what the audit found; this one documents the
system built on top of it, how to maintain it, and what still needs the site owner's attention.

## Files changed / added

**New:**
- `PRIVACY-AND-COOKIE-AUDIT.md` — the audit
- `PRIVACY-IMPLEMENTATION-NOTES.md` — this file
- `src/assets/consent.js` — the consent manager (single source of truth for consent state)
- `src/assets/consent.css` — banner, preference panel, and external-media placeholder styles
- `src/_includes/consent.njk` — banner + preference panel markup, included once by `base.njk`
- `src/privacy.njk` → `/privacy.html`
- `src/cookies.njk` → `/cookies.html`

**Edited:**
- `src/_includes/layouts/base.njk` — links `consent.css`, includes `consent.njk`, loads `consent.js` before `app.js`
- `src/assets/app.js` — SPA navigation (`swap()`) now preserves `#vw-consent-root` and `consent.js` itself across page swaps instead of destroying/reloading them (otherwise the banner/panel would vanish or double-initialize after the first client-side navigation); dispatches a `vw:content-swapped` event so consent.js can re-scan newly inserted pages for embeds; gates the theme-toggle's `localStorage.setItem` behind Preferences consent
- `src/assets/rethinking-society.js` — the YouTube click-to-load facade now checks External Media consent before injecting a real iframe, and can collapse back to its original thumbnail state if consent is later revoked
- `src/ecosystem.njk`, `src/rethinking-society/episode.njk` — the two previously-unconditional `<iframe>` embeds are now `[data-vw-embed]` placeholders that `consent.js` fills in with a real iframe or the "External content is paused" placeholder
- `src/_includes/footer.njk` — removed the 8-item site nav list; footer now shows only the brand name, tagline, copyright, and four links: Cookie Settings, Contact, Privacy, Cookies
- `src/contact.njk` — added the required data-use notice above the submit button, linking to `/privacy.html`
- `src/assets/components.css` — added `.legal-page`/`.legal-toc`/`.legal-table` etc. for the two new policy pages, plus a `.foot__link-btn` reset for the new "Cookie Settings" footer button

## Consent categories

Five categories exist in the data model (`categories: { analytics, externalMedia, preferences, marketing }`,
essential is implicit and always true). Only **four** are shown in the preference panel today — **Marketing is
omitted from the UI** because the audit found no marketing/advertising tooling anywhere in the codebase. The
field still exists in storage (always `false`) so that if marketing tooling is added later, the panel can
show a real toggle without needing a new storage schema or re-triggering consent for unrelated reasons.

| Category | Shown in panel? | Off by default? | What it currently gates |
|---|---|---|---|
| Essential | Yes, locked on | N/A | The `vw-consent` record itself |
| Analytics | Yes | Yes | Plausible (`plausible.io/js/script.js`), loaded by `consent.js` only once accepted. Cookieless, no personal data. |
| External media | Yes | Yes | YouTube iframe embeds (all three insertion points) |
| Marketing | **Not shown** | — | Nothing — no marketing tooling exists |
| Preferences | Yes | Yes | The `vw-theme` localStorage key |

## How the consent manager works

- `src/assets/consent.js` is a single IIFE, loaded once per real page load and deliberately **never re-executed**
  during SPA navigation (see the `app.js` changes above) — this is what keeps its listeners and the
  `window.VWConsent` object stable across the whole site.
- Consent is stored as one JSON object under the localStorage key `vw-consent`:
  `{ version, timestamp, categories: { analytics, externalMedia, preferences, marketing }, method }`.
  `method` is one of `"accept-all"`, `"reject-all"`, `"custom"`.
- The banner is shown whenever there is no stored record, or the stored record's `version` doesn't match the
  current `CONSENT_VERSION` constant at the top of `consent.js`.
- `window.VWConsent` exposes: `hasConsent(category)`, `isDecided()`, `openPreferences()`, `acceptAll()`,
  `rejectAll()`, `acceptCategory(name)`. Any other script on the site can call these — this is the intended
  integration point for future services (see below).
- Embeds are marked up as `<div data-vw-embed data-embed-src="…" data-embed-title="…" data-embed-provider="…">`.
  `consent.js` scans for these on load and after every SPA navigation, and swaps each one between a real
  `<iframe>` and the "External content is paused" placeholder depending on current consent.
- The Rethinking Society click-to-load facade (`[data-yt-facade]`) is handled separately in
  `rethinking-society.js` because it has its own lazy-load-on-click behaviour (a performance choice, unrelated
  to consent) that the generic `[data-vw-embed]` scanner would defeat — it would auto-load every facade on the
  page the instant External Media is accepted anywhere on the site. The facade still respects consent, it just
  does so on click rather than immediately.

## How to add a future service

1. Add the script/embed guarded by `window.VWConsent.hasConsent('analytics' | 'externalMedia' | 'marketing')`
   — never load it unconditionally.
2. If it's a new kind of thing (not a script and not an embed iframe), listen for `window.addEventListener('vw:consent-changed', …)` to react live when a visitor changes their choice, instead of only checking once on load.
3. If it needs a **Marketing** category to exist in the UI, add the toggle back into
   `src/_includes/consent.njk` (a `<li class="vw-consent-category">` matching the existing ones) and update
   `PRIVACY-AND-COOKIE-AUDIT.md` and `/cookies.html`'s table with the new provider, cookies, and category —
   do this *before* the tool goes live, not after.
4. Bump `CONSENT_VERSION` in `consent.js` (see below) so existing visitors are asked again.

## How to update the consent version

Change the `CONSENT_VERSION` constant near the top of `src/assets/consent.js`. Any stored record with a
different version is treated as "not decided," so the banner reappears for every returning visitor. Bump this
whenever a category's meaning changes, a new category is added, or a new third-party service starts running.

## How to update the cookie table

Edit the `<table class="legal-table">` in `src/cookies.njk`. Only add a row once you've confirmed, in the
code, that the cookie/storage key actually exists and what sets it — don't guess a name or duration. Use the
literal string "Provider-controlled or not confirmed" for any duration you can't verify, exactly as the
existing YouTube row does.

## Known limitations (please read before treating this as "done")

Implementing this system does not, by itself, make the site legally compliant — that determination needs the
site owner (and, if desired, a lawyer) to review the following, all of which are also flagged in
`PRIVACY-AND-COOKIE-AUDIT.md`:

1. **Google Fonts** load from Google's CDN on every page view, before any consent choice is possible, and
   expose the visitor's IP address to Google. This was *disclosed*, not fixed — self-hosting the two font
   files would remove it entirely but is a build/asset change outside this task's scope.
2. **The "Stay near" email fields** (`circles.njk`, `ecosystem.njk`, `spaces.njk`) now email the site owner
   directly via `newsletter-handler.php` (added 18 July 2026) — but this is only a notification, not a real
   mailing list: there is no automated recurring send and no unsubscribe mechanism behind it yet, even though
   the on-page copy promises "A letter every few weeks... Unsubscribe with one tap." If a real newsletter
   provider is wired up later, the audit, this file, the Privacy Policy, and `/cookies.html` all need to be
   updated *before* it goes live, and it must never auto-subscribe someone via another form.
3. **Amazon and episode-resource links** are outbound-only and require no consent, but the exact nature of the
   Amazon relationship (affiliate program or not) and the exact provider behind resource purchase links were
   not confirmed by this audit — see the audit document.
4. **Plausible needs a real account.** The code only loads `plausible.io/js/script.js` once a visitor
   consents — it does not create the Plausible account or register the site. Until the site owner signs up
   (paid) and adds `verdandiweaver.com` there, consenting visitors' data has nowhere to land.
5. **The Privacy Policy and Cookie Policy body text** were drafted from the controller identity block supplied
   and from this audit's findings — not from a pre-written policy document, since only the identity block was
   provided. Please review both pages before relying on them.
5. **Exact banner/panel copy**: the banner intro paragraph and the four category descriptions in
   `src/_includes/consent.njk` were written to satisfy the structural requirements (three equal choices,
   Essential/Analytics/External media/Preferences, no dark patterns) but are not a verbatim reproduction of any
   pre-existing legal copy — if the site owner has separately approved exact wording for these, it should
   replace the text in that file directly (it's the only place this copy lives).
6. **No automated test suite exists in this project** (no test runner in `package.json`). Verification was done
   by building the site and manually inspecting cookies/localStorage/network requests/DOM state for the
   states listed below, not by an automated test file.

## Manual verification performed

New visitor (no consent record) → banner shown, zero optional requests/storage beforehand · Reject all →
banner closes, `vw-consent.categories` all false, no iframe loads, theme toggle works but doesn't persist ·
Accept all → all four shown categories true, YouTube iframes load, theme choice persists on reload · Accept
Analytics only / External media only → verified independently via the Manage preferences panel · Save custom
selection → only the checked boxes persist · Close panel (✕ or overlay click or Escape) without pressing Save
→ no change to stored record · Reopen from footer "Cookie Settings" → panel reflects last saved state, not a
stale draft · Revoke a previously granted category → `vw-theme` removed on Preferences revoke; loaded YouTube
iframes collapse back to the placeholder/facade on External Media revoke · Bump `CONSENT_VERSION` → banner
reappears for a visitor with an old-version record · SPA navigation between pages → banner/panel DOM node and
`consent.js` are not duplicated or lost, embeds on the newly loaded page are scanned and gated correctly ·
Full page refresh → consent persists correctly from `localStorage` · Keyboard-only interaction → banner and
panel buttons are reachable and operable via Tab/Enter/Space, focus is trapped inside the open panel, Escape
closes without saving and returns focus to the control that opened it · Mobile viewport → banner becomes a
stacked bottom sheet, all three choices remain visible without scrolling the buttons off-screen · No sitemap
file exists in this project, so there was nothing to add the new pages to.
