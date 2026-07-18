# Privacy & Cookie Audit — verdandiweaver.com

Date of audit: 18 July 2026
Method: full-text search of the `src/` tree (every `.njk`, `.html`, `.js`, `.yml`, `.php` file) for
`document.cookie`, `localStorage`/`sessionStorage`, `<iframe>`, `<form>`, known analytics/marketing
signatures (gtag, Google Analytics, Tag Manager, Facebook Pixel, Matomo, Plausible, Hotjar, Clarity,
Mixpanel, Segment, Amplitude, Piwik), and every external `src=`/`href=` reference. This document lists
**only what was actually found in the code**. Nothing below is guessed or assumed — anything the audit
could not fully confirm is called out explicitly in "Requires owner confirmation" at the end.

## 1. Cookies set by first-party code

**None.** There is no `document.cookie` usage anywhere in the codebase (checked across `src/assets/*.js`,
every `.njk` template, and `src/contact-handler.php`). The site's own code has never written a cookie.

## 2. localStorage / sessionStorage

| Key | Set in | Purpose | Proposed category |
|---|---|---|---|
| `vw-theme` | `src/_includes/layouts/base.njk` (inline pre-paint script, read-only), `src/assets/app.js` (read + write in the theme toggle) | Remembers the visitor's manually chosen light/dark theme so it persists across page loads. Absent this key, the site falls back to `prefers-color-scheme`. | **Preferences** — this is an optional display preference, not required for the site to function (it has a working system-preference fallback), so it is not "demonstrably essential" and must not be written before consent. |

No other `localStorage`/`sessionStorage` key exists anywhere in the project.

## 3. Analytics tools

**None found.** Searched for `gtag`, `google-analytics`, `googletagmanager`, generic `analytics`, `fbq`,
`matomo`, `plausible`, `hotjar`, `clarity.ms`, `mixpanel`, `segment.`, `amplitude`, `piwik` across every
template, script, and config file. Zero matches. The site currently ships no analytics of any kind.

## 4. Marketing / advertising pixels

**None found.** Same search as above covers standard ad-tech signatures (Facebook Pixel, etc.) — no
matches. There is no marketing/advertising script anywhere in the codebase today.

## 5. Embedded third-party media (YouTube / Vimeo / Spotify / social / maps)

Only YouTube embeds exist. No Vimeo, Spotify, Google Maps, Instagram, Facebook, Twitter/X, or TikTok
embeds were found anywhere in the codebase.

| Location | What it is | Loads automatically? |
|---|---|---|
| `src/ecosystem.njk:57-63` | `<iframe src="https://www.youtube-nocookie.com/embed/...">` for archive entries of kind `video` | Yes — renders directly in the page markup, no click-to-load gate |
| `src/rethinking-society/episode.njk:34` | `<iframe src="https://www.youtube-nocookie.com/embed/...">` on each episode's own page | Yes — same, direct in markup |
| `src/_includes/rethinking-society/macros.njk:105` (`episodeSection` macro, used on `/rethinking-society/`) | `data-embed-src="https://www.youtube-nocookie.com/embed/..."` on a facade `<div data-yt-facade>` — the real `<iframe>` is only injected into the DOM by `src/assets/rethinking-society.js` when the facade is clicked/activated | No — this one is already click-to-load (a thumbnail + play button stand in until the visitor clicks), it just doesn't yet check consent before injecting |
| `src/_includes/rethinking-society/macros.njk:27` (`episodeThumbImg` macro) | `<img src="https://img.youtube.com/vi/{id}/maxresdefault.jpg">` — static thumbnail image, used everywhere episode cards/sections appear | Yes — plain image request, no cookie, no script |

All three iframe/facade locations use the privacy-enhanced `-nocookie` domain already. None of them currently
check any consent state — the two direct `<iframe>` cases render unconditionally, and the facade only gates on
a click, not on consent.

## 6. Forms, newsletter tools, CMS integrations, booking/payment/donation, external APIs

| Location | What it is | Wired to a real backend? |
|---|---|---|
| `src/contact.njk` | Contact form (Name optional, Email required, Message required) | **Yes.** Submits via `fetch` to `/contact-handler.php`, which uses vendored PHPMailer over SMTP (Titan Mail) to email `verdandi@verdandiweaver.com`. SMTP credentials come from a gitignored `src/smtp-config.php` generated at deploy time from GitHub Actions secrets. Includes a honeypot field (`_gotcha`) for spam. No analytics/marketing tool ever sees form data. |
| `src/circles.njk`, `src/ecosystem.njk`, `src/spaces.njk` (`.stay__form`, "Stay near") | Email-collection form for a newsletter signup | **Yes, as of 18 July 2026.** Submits via `fetch` to `/newsletter-handler.php`, which uses the same vendored PHPMailer/SMTP setup as the contact form to email `verdandi@verdandiweaver.com`, subject-lined `[Newsletter signup]` so it's never confused with a contact message. Includes a honeypot field (`_gotcha`). There is still no automated mailing-list/newsletter-sending service — this only notifies the site owner that someone wants to receive updates; no third party receives the address, and no recurring emails are sent automatically. |
| `src/admin/` (Decap CMS) | Content-management backend at `/admin`, GitHub backend | Not visitor-facing — ordinary site visitors never load this path, so it is out of scope for visitor cookie consent. Loads `unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js` only on that admin path. |
| Booking / payment / donation | — | **None found.** No booking widget, payment processor, or donation service integration exists anywhere in the codebase. |

### Outbound-only links (not embeds, not forms)

These are plain `<a href>` links to external sites, opened only when a visitor clicks them. They do not
load third-party content into the page and set no cookie on verdandiweaver.com itself:

- `src/books.njk` — Amazon product links. When a book has an `asin`, the link points to `amazon.com/dp/{asin}` and `src/assets/app.js` (the `applyAmazonLinks()` block) rewrites the domain client-side (e.g. `amazon.co.uk`, `amazon.se`) based on `Intl.DateTimeFormat().resolvedOptions().timeZone` / `navigator.language`. This is pure client-side link-rewriting — no network request, no cookie, no external contact happens until the visitor actually clicks the link.
- `src/rethinking-society/gathering-library.njk:95` — resource links whose `sr-only` text says "(opens Buy Me a Coffee in a new tab)", pointing at whatever `url` is set in that episode's CMS data.

Both are disclosed in the Cookie Policy as "you may be taken to a third-party site that has its own cookies,
outside our control" but do not themselves require a cookie-consent gate, since nothing loads until the
visitor chooses to click.

## 7. Third-party scripts, fonts, CDNs, tracking scripts, external requests

| Reference | Where | Notes |
|---|---|---|
| `https://fonts.googleapis.com`, `https://fonts.gstatic.com` (`<link rel="preconnect">` + stylesheet) | `src/_includes/layouts/base.njk:23-25`, also `src/admin/start.html:8` (admin only) | Loads two Google Fonts (Sorts Mill Goudy, Source Sans 3) on **every** page, before any consent choice can be made. Google's font-serving infrastructure does not set cookies, but the request does send the visitor's IP address to Google's servers on every page load. See "Requires owner confirmation" below. |
| `https://www.youtube-nocookie.com/embed/...`, `https://img.youtube.com/vi/...` | See section 5 | Covered by the External Media consent category (iframe) / disclosed as a minor asset request (thumbnail image). |
| `https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js` | `src/admin/index.html` | Admin-only (CMS editor), never loaded for ordinary visitors. Out of scope for the visitor-facing consent system. |

No other external domain is contacted anywhere in the templates, scripts, or stylesheets.

## 8. Is data processed directly by the site, or only by linked third parties?

- **Directly by the site (first-party):** the contact form (name/email/message → emailed via SMTP to the
  site owner), and the `vw-theme` display preference (stored only in the visitor's own browser, never
  transmitted anywhere).
- **By linked third parties, only if the visitor clicks through:** Amazon (book links), and whichever
  provider actually sits behind each episode resource's "Buy Me a Coffee"-style link.
- **By a third party on every page load, regardless of consent:** Google Fonts (IP address only, no cookie;
  see below).
- **By YouTube, only where an embed is actually loaded:** the two direct `<iframe>` placements load
  immediately today (to be gated by this project); the facade already gates on click (to be additionally
  gated on consent).

---

## Requires owner confirmation

The audit intentionally stops at what the code demonstrates. The following items cannot be resolved without
input from Sara Leidelmeijer / Verdandi Weaver, and are flagged here rather than guessed:

1. **Google Fonts loaded from Google's CDN.** This happens on every page view, before a consent choice is
   possible, and sends the visitor's IP address to Google. The clean fix is to self-host the two font files
   (removes the third-party request entirely, no consent question needed at all). That is a build/asset
   change outside the scope of "implement the cookie consent system" and has **not** been made as part of
   this work — it is called out here and in `PRIVACY-IMPLEMENTATION-NOTES.md` as a recommended follow-up.
   Until it's resolved, the Cookie Policy discloses this fact plainly rather than omitting it.
2. **The "Stay near" email field** (`circles.njk`, `ecosystem.njk`, `spaces.njk`) now emails the address
   straight to the site owner (as of 18 July 2026) so she knows someone wants updates — but there is still no
   real mailing-list/newsletter-sending provider, so the "A letter every few weeks... Unsubscribe with one
   tap" copy on these forms describes a service that doesn't exist yet as an automated system. If/when a
   real newsletter provider is added, that provider's name, retention period, and unsubscribe mechanism must
   be added to the audit and Privacy Policy, and this copy should be revisited so it matches reality.
3. **Amazon links (`data-asin`) and the episode resource "Buy Me a Coffee" links** — please confirm whether
   the Amazon links are part of the Amazon Associates affiliate program (this changes what should be said in
   the Privacy Policy about affiliate tracking) and confirm the exact provider name behind the resource
   purchase links so the Cookie Policy can name it precisely rather than saying "Buy Me a Coffee" only from
   an `sr-only` hint string.
4. **The full body text of the Privacy Policy and Cookie Policy.** Only the controller identity block
   (name, country, email, website, last-updated date) was supplied. The policy pages have been drafted from
   the facts established by this audit — no cookie, provider, or retention period was invented — but Sara
   should review both pages before treating them as final, especially the Google Fonts and "Stay near"
   sections above.

Nothing in this document claims legal compliance on its own — see `PRIVACY-IMPLEMENTATION-NOTES.md` for the
system built on top of these findings and its known limitations.
