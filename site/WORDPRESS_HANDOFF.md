# Verdandi Weaver → WordPress

A handoff for Claude Code (or any dev) to take the static site in this repo and publish it as a maintainable WordPress site **without losing the editorial tone, design system, or information architecture**.

The site is the body of work of **Sara Leidelmeijer** — writer & systemic thinker. The project is called **Verdandi Weaver**, a "space for soul presence." It is _quiet, grounded, slow_. Every implementation decision below should be filtered through that.

---

## 0 · What this site IS (read this first)

A calm, library-feeling editorial site. Not a marketing funnel. Not a course platform. Not a blog. It is closer to a published author's personal canon — books, frameworks, reflections, gentle self-scans, future spaces (circles, courses) — woven into one ecosystem.

**Voice / tone**
- Low affect. No exclamation marks. No emoji. No CTAs that shout.
- Sentences are pretty (`text-wrap: pretty`), titles are balanced (`text-wrap: balance`).
- The language is somatic: _grounded, slow, nervous-system aware, return, soft, woven_.
- Avoid SaaS/wellness clichés: no "transform your life", no "unlock", no "10x".

**Visual DNA**
- Forest-after-rain palette (cool off-white, deep moss, sage, stone) — see `tokens.css`.
- Display type set in **Cormorant Garamond** (classic), with **Fraunces** (modern) and **EB Garamond + Work Sans** (humanist) as optional palettes.
- Body type **Inter**.
- Hand-drawn-feeling SVG illustrations (the living-system tree, frameworks, orbs) — these are **content**, not decoration. They must survive into WordPress.
- Heavy use of generous whitespace, hairline rules, `--c-bg-sunk` alternating sections.
- Two themes shipped: **light** (forest after rain) and **dark** (forest at night). Plus palette variants `warm` / `stone` / `ink` and font variants `classic` / `modern` / `humanist`. These are user-facing tweaks via the "Tweak" button in the nav — they must keep working in WP.

---

## 1 · File inventory

| File | Role | WP destination |
|---|---|---|
| `index.html` | Home — hero, living-system tree, books/scans/frameworks previews, ecosystem, about teaser | Front page (custom template `front-page.php`) |
| `about.html` | About Sara + the work | Page → template `page-about.php` |
| `books.html` | Library of 10 titles | Archive of `book` CPT → `archive-book.php` |
| `self-scans.html` | 6 reflection tools + an interactive scan player | Archive of `scan` CPT → `archive-scan.php` (player stays as a JS island) |
| `frameworks.html` | Index of visual frameworks | Archive of `framework` CPT |
| `framework-01.html` … `framework-09.html` | Single framework deep-dives | `single-framework.php` |
| `reflection-01.html`, `deep-read-01.html` | Single article / deep-read templates | `single-post.php` + a `deep-read` template option |
| `articles.html` | Articles & essays index | `home.php` (blog index) or `archive-essay.php` if essays become a CPT |
| `videos.html` | Quiet talks | Archive of `video` CPT |
| `guides.html` | Downloadable PDFs / companions | Archive of `guide` CPT (attachment-backed) |
| `ecosystem.html` | The whole map of offerings | Page → custom template |
| `events.html` | Upcoming events | Archive of `event` CPT |
| `circles.html`, `spaces.html`, `one-to-one.html`, `stay-near.html`, `contact.html` | Individual landing pages | Pages, each with its own template if layout is bespoke |
| `design-system.html` | Internal DS reference | **Do not publish.** Keep in repo as `/design-system/` for the team. |
| `tokens.css` | All design tokens (color, type, spacing, motion) | Enqueue as-is in the theme |
| `components.css` | UI primitives | Enqueue as-is in the theme |
| `app.js` | Theme toggle, mobile nav, fade-in, tweaks panel | Enqueue as-is in the theme; ensure it loads on every page |

---

## 2 · Recommended WordPress approach

There are three reasonable paths. Pick **A** unless the client has a reason not to.

### A. Custom classic theme (recommended)
Build a thin classic theme that **enqueues `tokens.css` + `components.css` verbatim** and reuses the existing markup as PHP templates. This preserves the design with zero translation loss, keeps the theme small (under ~30 PHP files), and gives the editor full WP comfort (menus, the Customizer, plugin ecosystem).

Pros: 1:1 visual fidelity, fast, easy to maintain, no block-editor learning curve for the client.
Cons: The editor uses the classic editor + ACF flexible content rather than Gutenberg blocks.

### B. Block theme (FSE) — only if client wants to edit layouts visually
Convert the design system to `theme.json` and rebuild each section as a block pattern. **Significantly more work** (every SVG, every section, every spacing rule must be re-expressed as patterns + block.json files). Use only if Sara wants to compose new landing pages herself without dev help.

### C. Headless (WP REST → Astro/Next)
Overkill for an editorial site at this scale. Skip unless there's a specific reason.

**This document assumes Path A.**

---

## 3 · Theme structure (Path A)

```
verdandi-weaver/                       (the theme folder, in wp-content/themes/)
├── style.css                          (WP theme header + @import nothing — see below)
├── functions.php                      (enqueues, CPT/taxonomy registration, ACF includes)
├── header.php                         (the <header class="nav"> + <head> + opening <body>)
├── footer.php                         (the <footer class="foot"> + tweaks panel + scripts)
├── front-page.php                     (= index.html body)
├── index.php                          (fallback)
├── home.php                           (blog/articles index)
├── single.php                         (default article template)
├── single-book.php
├── single-framework.php
├── single-scan.php
├── single-video.php
├── single-guide.php
├── single-event.php
├── archive-book.php
├── archive-framework.php
├── archive-scan.php
├── archive-video.php
├── archive-guide.php
├── archive-event.php
├── page.php
├── page-about.php
├── page-ecosystem.php
├── page-circles.php
├── page-spaces.php
├── page-one-to-one.php
├── page-stay-near.php
├── page-contact.php
├── 404.php
├── searchform.php
├── inc/
│   ├── cpts.php                       (register_post_type calls)
│   ├── taxonomies.php
│   ├── acf-fields.php                 (or use ACF JSON sync — see §6)
│   ├── enqueue.php
│   ├── nav-menus.php
│   ├── shortcodes.php                 (for the SVG frameworks, the orb, the tree)
│   └── theme-support.php
├── parts/                             (get_template_part targets — the page sections)
│   ├── nav.php
│   ├── footer.php
│   ├── tweaks-panel.php
│   ├── hero.php
│   ├── section-living-system.php      (the tree SVG)
│   ├── section-books-preview.php
│   ├── section-pull-quote.php
│   ├── section-self-scans-preview.php
│   ├── section-frameworks-preview.php
│   ├── section-articles-videos.php
│   ├── section-ecosystem.php
│   ├── section-about-teaser.php
│   ├── card-book.php
│   ├── card-scan.php
│   ├── card-framework.php
│   ├── card-video.php
│   └── card-guide.php
├── assets/
│   ├── css/
│   │   ├── tokens.css                 (copied from this repo, unchanged)
│   │   └── components.css             (copied, unchanged)
│   ├── js/
│   │   ├── app.js                     (copied, unchanged)
│   │   └── scan.js                    (extracted from self-scans.html — see §7)
│   ├── svg/
│   │   ├── living-system-tree.svg
│   │   ├── orb.svg
│   │   └── framework-*.svg
│   └── fonts/                         (optional: self-hosted versions of Cormorant, Inter, etc.)
└── README.md
```

### `style.css` header
```css
/*
Theme Name: Verdandi Weaver
Theme URI: https://verdandiweaver.com
Author: Sara Leidelmeijer
Description: A grounded, slow editorial theme for the Verdandi Weaver body of work.
Version: 1.0.0
Requires at least: 6.4
Tested up to: 6.6
Requires PHP: 8.0
License: All rights reserved
Text Domain: verdandi
*/
/* Real styles live in assets/css/tokens.css + components.css */
```

---

## 4 · Enqueueing the design system

`inc/enqueue.php`:

```php
add_action('wp_enqueue_scripts', function () {
    $theme = wp_get_theme();
    $ver   = $theme->get('Version');

    // Google Fonts — same families the static site uses.
    wp_enqueue_style(
        'verdandi-fonts',
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=EB+Garamond:ital@0;1&family=Fraunces:wght@400;500;600&family=Inter:wght@400;500;600&family=Work+Sans:wght@400;500;600&display=swap',
        [], null
    );

    wp_enqueue_style('verdandi-tokens',     get_theme_file_uri('/assets/css/tokens.css'),     [],                       $ver);
    wp_enqueue_style('verdandi-components', get_theme_file_uri('/assets/css/components.css'), ['verdandi-tokens'],      $ver);

    wp_enqueue_script('verdandi-app',  get_theme_file_uri('/assets/js/app.js'),  [], $ver, true);
    if (is_post_type_archive('scan') || is_singular('scan')) {
        wp_enqueue_script('verdandi-scan', get_theme_file_uri('/assets/js/scan.js'), ['verdandi-app'], $ver, true);
    }
}, 20);

// Preconnect.
add_action('wp_head', function () {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">';
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
}, 1);
```

**Do not** try to port `tokens.css` to `theme.json` for a classic theme. Just enqueue it.

---

## 5 · Custom post types & taxonomies

Register these in `inc/cpts.php`. All are public, have archives, and use the block editor (or classic — see ACF section). Slugs match the static URLs so redirects are minimal.

| CPT slug | Singular | Plural | Slug (rewrite) | Has archive | Supports |
|---|---|---|---|---|---|
| `book` | Book | Books | `books` | yes | title, editor, thumbnail, excerpt |
| `framework` | Framework | Frameworks | `frameworks` | yes | title, editor, thumbnail, excerpt |
| `scan` | Self-Scan | Self-Scans | `self-scans` | yes | title, editor, thumbnail, excerpt |
| `video` | Video | Videos | `videos` | yes | title, editor, thumbnail, excerpt |
| `guide` | Guide | Guides | `guides` | yes | title, editor, thumbnail |
| `event` | Event | Events | `events` | yes | title, editor, thumbnail |

Built-in `post` is used for **Articles & reflections** (the slow essays). Set the blog page to `/articles/`.

**Taxonomies** (shared where it makes sense):
- `theme` (hierarchical) — _Belonging, Nervous system, Awakening, Relational, Body, Ecology, Soul, Identity, Mind, Spaces_. Applied to: `post`, `book`, `framework`, `scan`, `video`, `guide`.
- `format` (non-hierarchical) — _Deep read, Short reflection, Letter, Talk, Audio, Companion, PDF_. Applied to: `post`, `video`, `guide`.

Both taxonomies should be public and have rewrite slugs `theme` and `format`.

---

## 6 · ACF (Advanced Custom Fields) field groups

Use **ACF Pro** (or the free version + Custom Post Type UI for registration if no Pro). Store all field group definitions in `acf-json/` for version control.

### `book` fields
- `subtitle` (text)
- `cover_variant` (select: `1`–`10` — drives the `.book__cover--N` class)
- `meta_tags` (text — e.g. _"Belonging · Boundaries · Departure"_)
- `description` (textarea, short — appears under the cover)
- `long_description` (wysiwyg — full single page)
- `buy_links` (repeater: `label`, `url`)
- `pdf_sample` (file)
- `language` (select: English, Swedish, Both)

### `framework` fields
- `eyebrow` (text)
- `subtitle` (text)
- `diagram_svg` (textarea — paste raw SVG; rendered with `wp_kses_post` allowlisted for `svg`/`path`/`circle`/etc., see §10)
- `summary` (textarea)
- `sections` (repeater: `heading`, `body_wysiwyg`)

### `scan` fields
- `eyebrow` (text — e.g. _"Reflection tool"_)
- `intro` (wysiwyg)
- `questions` (repeater: `question` text, `hint` text, `options` sub-repeater of `label`)
- `closing` (wysiwyg)

### `video` fields
- `duration` (text)
- `provider` (select: YouTube, Vimeo, self-hosted)
- `video_url` (url)
- `thumbnail_override` (image)

### `guide` fields
- `pdf` (file)
- `length` (text — e.g. _"24 pages"_)
- `companion_to` (post object — link to a book or framework)

### `event` fields
- `starts_at` (date_time_picker)
- `location` (text — e.g. _"Online"_, _"Stockholm"_)
- `format` (select: Circle, Workshop, Retreat, Talk)
- `registration_url` (url)
- `capacity` (number)

### Front page (options page or page-specific group)
A field group attached to `page` where template = `front-page.php`, OR an ACF Options Page (`Home`). Fields mirror the section blocks of `index.html`:
- `hero_eyebrow`, `hero_title`, `hero_lead`
- `living_system_heading`, `living_system_lead`, `living_system_body_1`, `living_system_body_2`
- `pull_quote` (textarea)
- `books_section_eyebrow`, `books_section_title`, `books_section_lead`, `featured_books` (relationship → 3 `book` posts)
- `scans_section_*`, `featured_scans` (relationship → 3 `scan` posts)
- `frameworks_section_*`, `featured_frameworks` (relationship → 3 `framework` posts)
- `ecosystem_nodes` (repeater: `title`, `body`)
- `about_teaser` (wysiwyg)

This way Sara can re-edit copy on the home page without touching templates.

---

## 7 · Special cases: the interactive self-scan player

`self-scans.html` contains an inline JS scan player (`startScan()`, `scanNext()`, `scanReset()`, progress bar). Pull that JS out into `assets/js/scan.js` and have it read questions from a `data-` attribute or a `wp_localize_script` call:

```php
// In single-scan.php (or wherever the player mounts):
$questions = get_field('questions');
wp_localize_script('verdandi-scan', 'verdandiScan', [
    'questions' => $questions,
    'closing'   => get_field('closing'),
]);
```

Mount point markup is identical to the static version (`<div class="scan" id="scan">…</div>`).

Persistence: the static version says "your progress is held" — back this with `localStorage` keyed by `vw-scan-{post_id}`. Do **not** store scan answers server-side; they are private reflections. Make this explicit on the page.

---

## 8 · Header / footer / nav

The nav is one component used everywhere. Two ways to source links:

1. **WP menu** (recommended) — register a `primary` menu location, use `wp_nav_menu` with a custom walker that outputs `<li><a class="active">…</a></li>` matching `components.css` exactly.
2. **Hard-coded** — fine for a 6-link nav that rarely changes. Less work.

Use option 1 so Sara can edit footer links from `Appearance → Menus`.

**Menu locations to register**: `primary` (top nav), `footer` (10-link footer column).

**Theme & Tweaks toggle**: keep `app.js` exactly as is. It reads/writes `localStorage` keys (`vw-theme`, `vw-palette`, `vw-font`) and toggles attributes on `<html>`. This works identically under WP — just make sure `<html>` is the standard `<html <?php language_attributes(); ?>>` and that `app.js` loads on every page (`wp_enqueue_scripts` already covers this).

---

## 9 · Routing / URL plan

| Static file | WordPress URL |
|---|---|
| `/index.html` | `/` |
| `/about.html` | `/about/` |
| `/books.html` | `/books/` |
| `/self-scans.html` | `/self-scans/` |
| `/frameworks.html` | `/frameworks/` |
| `/framework-0N.html` | `/frameworks/{slug}/` |
| `/articles.html` | `/articles/` |
| `/reflection-01.html` | `/articles/{slug}/` |
| `/deep-read-01.html` | `/articles/{slug}/` (with `format: deep-read` taxonomy) |
| `/videos.html` | `/videos/` |
| `/guides.html` | `/guides/` |
| `/ecosystem.html` | `/ecosystem/` |
| `/events.html` | `/events/` |
| `/circles.html` | `/circles/` |
| `/spaces.html` | `/spaces/` |
| `/one-to-one.html` | `/one-to-one/` |
| `/stay-near.html` | `/stay-near/` |
| `/contact.html` | `/contact/` |

Set `Settings → Permalinks → Post name`. Add 301 redirects for any old `.html` URLs (via plugin **Redirection** or `.htaccess`).

---

## 10 · SVG handling

The site has substantial inline SVG (the living-system tree on the home page is ~200 lines; each framework has its own diagram). Two options:

1. **Inline via `get_template_part`** — paste each SVG into its own PHP partial, no escaping needed.
2. **Store in ACF `textarea` field**, then `echo` with a custom safe-SVG allowlist.

Use option 1 for the home-page tree and orb (they don't change). Use option 2 for `framework` CPT diagrams (Sara may iterate). Add a `kses` allowlist:

```php
function verdandi_kses_svg($html) {
    $allowed = wp_kses_allowed_html('post');
    $allowed['svg']            = ['xmlns'=>1,'viewbox'=>1,'role'=>1,'aria-label'=>1,'width'=>1,'height'=>1,'fill'=>1,'stroke'=>1,'class'=>1];
    $allowed['defs']           = [];
    $allowed['lineargradient'] = ['id'=>1,'x1'=>1,'y1'=>1,'x2'=>1,'y2'=>1];
    $allowed['radialgradient'] = ['id'=>1,'cx'=>1,'cy'=>1,'r'=>1];
    $allowed['stop']           = ['offset'=>1,'stop-color'=>1,'stop-opacity'=>1];
    $allowed['filter']         = ['id'=>1,'x'=>1,'y'=>1,'width'=>1,'height'=>1];
    $allowed['fegaussianblur'] = ['stddeviation'=>1];
    $allowed['g']              = ['fill'=>1,'stroke'=>1,'stroke-width'=>1,'stroke-linecap'=>1,'opacity'=>1,'filter'=>1,'class'=>1];
    $allowed['path']           = ['d'=>1,'fill'=>1,'stroke'=>1,'stroke-width'=>1,'stroke-linecap'=>1,'opacity'=>1,'class'=>1];
    $allowed['circle']         = ['cx'=>1,'cy'=>1,'r'=>1,'fill'=>1,'stroke'=>1,'opacity'=>1,'class'=>1,'style'=>1];
    $allowed['ellipse']        = ['cx'=>1,'cy'=>1,'rx'=>1,'ry'=>1,'fill'=>1,'opacity'=>1];
    $allowed['rect']           = ['x'=>1,'y'=>1,'width'=>1,'height'=>1,'fill'=>1,'opacity'=>1];
    $allowed['line']           = ['x1'=>1,'y1'=>1,'x2'=>1,'y2'=>1,'stroke'=>1,'stroke-width'=>1,'opacity'=>1];
    $allowed['text']           = ['x'=>1,'y'=>1,'text-anchor'=>1,'class'=>1,'opacity'=>1];
    return wp_kses($html, $allowed);
}
```

**Do not** install the "Safe SVG" plugin and treat SVGs as media uploads — these illustrations are content, not assets. Inline them.

---

## 11 · Content migration

There is **no real content yet** in the static site — copy is editorial placeholder written in Sara's voice. The migration is therefore largely _structural_, not data-extraction. Plan:

1. Spin up WordPress (local with **LocalWP** or **wp-env** first, production on the chosen host).
2. Install required plugins (see §13).
3. Build the theme as above.
4. Register CPTs and taxonomies. Verify archives render with seed data.
5. Seed 1 post per CPT manually so Sara has examples to follow.
6. Hand over the editorial backlog (the 10 books, 6 scans, 9 frameworks, etc.) for Sara to fill in.
7. **Optional**: a one-shot WP-CLI seed script that creates a draft post per static file from the inline copy, so Sara isn't typing from scratch. See `bin/seed.php` (Claude Code: write this if asked — parse each `framework-0N.html` for its `<h1>`, lead `<p>`, and SVG, and `wp_insert_post()` it as a `framework` draft).

---

## 12 · Hosting

Recommend in this order:
1. **Kinsta** or **WP Engine** (managed, fast, easy SSL/CDN/staging).
2. **Cloudways** (cheaper, still managed).
3. **Self-hosted on a small VPS** (Hetzner / DO + RunCloud) — only if budget is tight.

Hard requirements: PHP 8.1+, MySQL 8 / MariaDB 10.6+, HTTPS, daily backups, staging environment.

---

## 13 · Plugins (the small list — resist adding more)

| Plugin | Why |
|---|---|
| **ACF Pro** | Custom fields for every CPT |
| **Yoast SEO** or **Rank Math** | XML sitemap, schema, social meta. Pick one. |
| **Redirection** | Manage 301s for the old `.html` URLs |
| **Wordfence** or host-level WAF | Security |
| **WP Mail SMTP** | Reliable contact-form delivery |
| **Fluent Forms** or **WPForms Lite** | Contact form on `/contact/` |
| **WP Super Cache** or host-level cache | Performance (skip if the host has its own — Kinsta does) |

**Do not** install: page builders (Elementor, Divi, Beaver), block libraries, theme frameworks, "all-in-one" suites. They will fight the design system.

---

## 14 · Performance & accessibility checklist

- Self-host fonts if Lighthouse complains (use `wp-fontloader` or just drop WOFF2s in `/assets/fonts/` and write the `@font-face` rules into `tokens.css`).
- Keep `app.js` deferred (it already is via `in_footer = true`).
- Images: lazy-load by default (WP 5.5+ does this), use `wp_get_attachment_image` with `loading="lazy"` and explicit `width`/`height`.
- `prefers-reduced-motion` is already honored in `tokens.css`. Don't break it.
- The hero orb and tree have `aria-hidden="true"` / `role="img"` + `aria-label` — preserve when porting.
- Color contrast: light theme is AA-clean; dark theme should be spot-checked after porting.
- Heading order: each page has one `<h1>` (the hero). Keep it that way — section titles are `<h2>`.

---

## 15 · The Tweaks panel — keep it

The "Tweak" button in the nav opens a panel that toggles theme/palette/font. It's part of Sara's voice (giving the reader agency over the reading environment). It must keep working under WordPress.

- The panel markup lives in `parts/tweaks-panel.php` and is included in `footer.php`.
- The logic is `app.js` — no changes needed.
- The persisted `localStorage` keys (`vw-theme`, `vw-palette`, `vw-font`) survive across pages because they are read on `DOMContentLoaded`.

---

## 16 · What to ask Sara before starting

1. **Domain & host**: which one? Has DNS been bought?
2. **Languages**: site copy mixes English & Swedish. Should we install **Polylang** or **WPML** now, or keep it English-only at launch?
3. **Commerce**: are books/guides sold here (WooCommerce) or only linked out to publishers/Stripe payment links?
4. **Newsletter / "Stay near"**: which provider? (`stay-near.html` implies a quiet newsletter signup — Buttondown? Substack embed? MailerLite? Native WP via Newsletter Glue?)
5. **Contact form**: who receives it, any GDPR consent text required?
6. **Self-scan privacy**: confirm that scan answers are client-side only (recommended).
7. **Events**: are bookings handled on-site or via an external link (Eventbrite, Tito)?
8. **Comments**: on or off? (Recommend: off everywhere except `post`.)
9. **Analytics**: Plausible / Fathom (privacy-friendly) or GA4? Cookie banner if GA4.
10. **Cookie / GDPR**: footer mentions "Integritetspolicy · Cookies" — need real policy pages.

---

## 17 · Step-by-step plan for Claude Code

Treat each step as a small, reviewable commit.

1. **Bootstrap** — `wp-env` or LocalWP, install WP, set permalinks to `/%postname%/`.
2. **Theme scaffold** — create `wp-content/themes/verdandi-weaver/` with `style.css`, `functions.php`, `header.php`, `footer.php`, `index.php`. Copy `tokens.css`, `components.css`, `app.js` into `assets/`. Activate the theme. Visit `/` — should render an empty body with the fonts loaded.
3. **Nav + footer** — port `<header class="nav">` and `<footer class="foot">` from `index.html` into `header.php`/`footer.php`. Use `wp_nav_menu` with a custom walker.
4. **Front page** — copy the `<body>` of `index.html` into `front-page.php`. Replace the previews (books, scans, frameworks) with `WP_Query` loops. Wire ACF for the hero/about-teaser copy.
5. **CPTs + taxonomies** — register all 6 CPTs and 2 taxonomies. Verify `/books/`, `/frameworks/`, etc. route to `archive-*.php`.
6. **Single templates** — port `framework-01.html`, `books.html` cards, etc., to `single-*.php` and `archive-*.php`.
7. **Self-scan player** — extract JS to `scan.js`, port `single-scan.php`, wire ACF questions through `wp_localize_script`.
8. **Other pages** — port `about`, `ecosystem`, `circles`, `spaces`, `one-to-one`, `stay-near`, `contact` as `page-*.php` templates.
9. **ACF JSON sync** — turn on local JSON in `acf-json/`, export all field groups.
10. **Seed content** — write `bin/seed.php` WP-CLI command to insert one draft per static page.
11. **Redirects** — install Redirection, add `.html → /` rules for every old path.
12. **SEO + sitemap** — install Yoast/Rank Math, set titles & descriptions.
13. **Forms + newsletter** — install chosen form & newsletter plugin, wire to `contact.html` and `stay-near.html`.
14. **QA** — Lighthouse pass on `/`, `/books/`, `/frameworks/`, a single framework, and `/self-scans/`. Target ≥95 on all four metrics.
15. **Staging review** with Sara.
16. **Go live**.

---

## 18 · Things to NOT do

- Don't replace Cormorant / Inter / Fraunces with system fonts to "save weight". The typography is the design.
- Don't add gradient backgrounds, drop shadows, glows, or emoji. The site is deliberately quiet.
- Don't convert the living-system tree SVG into an image. It's responsive, theme-aware, and uses CSS variables.
- Don't add a hero carousel, popup, exit-intent, or any modal that isn't the Tweaks panel.
- Don't introduce a page builder. The CSS in this repo is the design system; a builder will fight it and lose.
- Don't refactor `tokens.css` into `theme.json` unless switching to Path B (block theme).
- Don't move the `data-screen-label` attributes — they are used for design-review tooling and are harmless in production.

---

## 19 · Open questions / future

- A "Library" search across books + articles + frameworks (one search box with faceted filters by `theme` taxonomy). Worth doing in v1.1 with **FacetWP** or **SearchWP** if Sara wants it.
- "Stay near" as a quiet email sequence — could be three letters auto-sent via FluentCRM.
- Circles / 1:1 booking — if these become bookable, integrate **Amelia** or **FluentBooking**, but theme the calendar with `tokens.css` overrides so it doesn't break the visual quiet.

---

_End of handoff. The static site is the source of truth for design. This document is the source of truth for how to bring it into WordPress._
