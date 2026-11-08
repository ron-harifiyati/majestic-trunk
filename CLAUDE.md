# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What This Repository Is

A **static marketing site** for majestictrunk.com — "Majestic Trunk Expeditions", a
luxury safari/expedition operator in **Victoria Falls, Zimbabwe**.

It is a v2 ground-up rebuild. The site is **plain HTML/CSS/JS** with **no framework and
no runtime JavaScript for layout**. Pages are produced by a tiny, zero-dependency Node
generator (`build.js`) that stamps one set of templates with content from JSON data files
("Option B": one reusable template → many real, SEO-friendly pages).

Bookings are **not** handled here — every "Book Now" hands off to the operator's external
**Activitar** platform (`majestictrunkexpeditions.activitar.com`). No backend, no database,
no payments on this site.

Design direction: **Sun & Savanna** — original sand, terracotta and olive palette,
Fraunces + Inter fonts, rounded cards, pill buttons and pill navigation. The original
theme was restored at the user’s request while retaining the expanded directories. All design
values live as tokens in `src/styles/tokens.css`. Activity, property and dining data include
practical planning notes, official source URLs and review dates. Do not restore
unverified starting prices or unsupported business credentials.

## Build & Serve

```bash
node build.js                                   # generate dist/ from src/
python3 -m http.server 8090 --directory dist    # serve the built site
```

Then open `http://localhost:8090`.

## Directory Structure

```
build.js                 # the generator (zero deps, plain Node)
package.json
src/
  data/                  # CONTENT lives here — edit these, then rebuild
    site.json            #   brand, Activitar URL, year
    experiences.json     #   the ~10 experiences (one object each)
    lodges.json          #   the ~5 lodges
  partials/
    base.html            #   the page shell (<head>, header/footer slots)
    header.html          #   the ONE header (reused on every page)
    footer.html          #   the ONE footer
  templates/             # one reusable template per page type
    home.html  experiences-index.html  experience.html
    lodges-index.html    lodge.html
    about.html  contact.html  gallery.html  privacy.html
  styles/
    tokens.css           #   design tokens (color, type, spacing scale) — start here
    site.css             #   all component styles
  js/
    nav.js               #   mobile nav toggle (the only layout JS)
  assets/img/            #   images (currently PLACEHOLDERS — see docs/image-*.md)
dist/                    # GENERATED output (gitignored) — never hand-edit
docs/                    # planning docs (see below)
design-mockups/          # throwaway design explorations (reference only)
```

## How to Change Things

- **Add/edit an experience or lodge:** edit `src/data/experiences.json` (or `lodges.json`),
  then run `node build.js`. Never edit files in `dist/`.
- **Change the header, footer, or any layout:** edit the relevant file in `src/partials/`
  or `src/templates/` — it applies to every generated page.
- **Change brand colors/spacing/type:** edit `src/styles/tokens.css`.
- **The generator** (`build.js`) uses a tiny `{{token}}` replacer; card grids and list
  HTML are assembled in JS and injected as tokens.

## Important Notes

- **Images are placeholders** pending rights clearance. See `docs/image-audit.md` (what we
  can't use) and `docs/image-replacement-plan.md` (what to source).
- **Booking integration is parked** — see `docs/booking-integration.md`.
- The overall plan and open decisions are in `docs/redesign-plan.md`.
- Git history still contains the original WordPress mirror; a fresh-start reset is planned
  for cutover but has not been done yet.

## Directory expansion

The current build has 46 pages: 16 experiences, 13 stays, 8 dining venues and
supporting pages. Category definitions and filter preferences are in `build.js`;
progressive enhancement lives in `src/js/directory.js`. Run `npm test` after changes
to categories, links, templates or filtering. Photo provenance and responsive sizes
are recorded in `src/data/media.json`; only referenced images are copied to output.
Official venue photographs are preview-only until publication rights are confirmed.
