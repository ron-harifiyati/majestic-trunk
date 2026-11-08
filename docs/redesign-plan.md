> **Current implementation, 29 October 2026:** this is a historical proposal. The site uses the zero-dependency HTML generator described in README.md, not Astro. The original Sun & Savanna theme has been restored (sand/terracotta/olive, Fraunces + Inter), with 47 pages and source-linked activity, accommodation and dining guides. Remaining launch tasks are tracked in GitHub issues. The older decisions below are retained as background, not implementation instructions.

# Majestic Trunk — Redesign Plan (v2)

Status: **proposal / in discussion**. Decisions still open are marked ❓. Things I'll
default unless told otherwise are marked ✅.

---

## 0. Decisions already made

- **Full redesign** (new IA, layout, identity) — not a reskin.
- **Visual direction: "Sun & Savanna"** — sand `#EFE6D6`, terracotta `#B5541B`,
  olive `#6B7350`, ink `#3A3026`; Fraunces (display) + Inter (body); rounded cards,
  pill nav, warm/boutique mood. (See `design-mockups/savanna.html`.)
- **Bookings stay external** — every "Book Now" hands off to Activitar
  (`majestictrunkexpeditions.activitar.com`). No booking engine, no backend.
- **Content strategy** — keep the ~18 real Victoria Falls pieces, drop the ~20
  WordPress demo-filler posts, merge duplicates, fix the lying slugs.

---

## 1. Tech stack ✅

| Layer | Choice | Why |
|---|---|---|
| Generator | **Astro** | Ships ~zero JS, content-first, great DX |
| Content | **Markdown + content collections** | Author articles as plain text, type-checked frontmatter |
| Images | **`astro:assets` `<Image>`/`<Picture>`** | Auto webp/avif, responsive `srcset`, lazy-load — fixes the 59 MB problem |
| Styling | ❓ **Plain CSS + design tokens** (recommended) *or* Tailwind | Tokens keep it approachable & dependency-light |
| JS | Tiny vanilla (mobile nav, gallery lightbox) | No framework runtime |
| Pkg mgr | npm (Node 25 / npm 11 already installed) | — |
| Host | ❓ **Cloudflare Pages** (recommended) *or* Netlify | Free, git-connected, global CDN, free SSL, auto-build |

Final output is still **plain static HTML/CSS** — exactly as fast/reliable as
hand-written HTML, but maintainable.

---

## 2. Content model (collections)

- **`experiences/`** — ~10 activities. Frontmatter: `title, slug, category
  (adrenaline|scenic|culture|wildlife|dining), summary, heroImage, gallery[],
  duration, priceFrom, difficulty, activitarUrl, order`.
- **`lodges/`** — ~5 stays. Frontmatter: `title, slug, summary, heroImage,
  gallery[], location, priceFrom, amenities[], activitarUrl`.
- **`stories/`** *(optional)* — keep a few editorial posts ("Smoke That Thunders",
  cultural pieces) as a light blog, or drop entirely. ❓

Mapping of current files → new collection lives in §7.

---

## 3. Pages & layouts

| URL | Layout | Notes |
|---|---|---|
| `/` | Home | Savanna homepage (hero, featured experiences, stay block, why-us, CTA) |
| `/experiences` | Index grid | All activities, filterable by category |
| `/experiences/[slug]` | Detail | Hero, key facts, body, gallery, **Book → Activitar**, related |
| `/stay` | Index grid | All lodges |
| `/stay/[slug]` | Detail | Same shape as experience detail |
| `/about` | Page | Who we are |
| `/gallery` | Gallery | Curated photo grid + lightbox |
| `/contact` | Page | ❓ Form vs WhatsApp/email/phone links (recommend links — no backend) |
| `/privacy` | Page | Keep, cleaned up |

**Dropped from the WordPress version:** category/tag/author archives, RSS/oEmbed
endpoints, "all-posts" — all demo-CMS cruft.

---

## 4. Repo structure ✅

```
/
├─ public/                  # passthrough: favicon, robots.txt, og-image, /CNAME
├─ src/
│  ├─ assets/images/        # SOURCE images, optimized at build by astro:assets
│  ├─ components/           # Header, Footer, Nav, ExperienceCard, Hero, CTA, Gallery, Lightbox
│  ├─ layouts/              # BaseLayout.astro, DetailLayout.astro
│  ├─ content/
│  │   ├─ experiences/*.md
│  │   ├─ lodges/*.md
│  │   └─ config.ts         # collection schemas (the type-checking)
│  ├─ pages/                # index.astro, experiences/[...].astro, stay/[...].astro, ...
│  └─ styles/               # tokens.css (colors/space/type scale), global.css
├─ astro.config.mjs
├─ package.json
└─ docs/ , scripts/         # kept; old restructure scripts archived
```

---

## 5. Git strategy ❓

Recommended:
1. Branch `redesign-astro` off `main`.
2. Move the current static site into `_legacy/` (history preserved) so it stays
   servable during the rebuild; build Astro alongside.
3. When v2 is ready and verified, delete `_legacy/`, merge to `main`, tag `v1-archive`
   first so the old site is recoverable.

Alternative: fresh repo. (I recommend same repo — keeps history + issue trail.)

---

## 6. Images

- Today: **467 files / 59 MB**, mostly WordPress-generated size variants and dupes.
- Plan: curate down to the **source images we actually use** (~30–60), drop into
  `src/assets/`, let Astro generate every responsive size at build. Expected
  result: **59 MB → a few MB** of sources, pages from ~130 KB → ~10–20 KB.
- ❓ **Rights/licensing** — some current images look like stock or watermarked
  (e.g. the golden-hour elephant has a photographer watermark; one filename is
  `istockphoto-...`). Need to confirm which we own/are licensed and replace the rest.
- Remove the **leaked MapTiler API key** from old files (the interactive map is
  being dropped; rotate the key regardless).

---

## 7. Content migration map (real pieces to keep)

**Experiences:** Sunset Cruise (`a-sunset-cruise...`) · Game Drives
(`an-outsiders-guide-to-colombia`) · Bungee/Bridge (`at-the-end-of-the-world`) ·
Chobe Day Trip (`chobe-day-trip-botswana`, merge `sri-lanka-and-the-maldives-tour`) ·
Elephant Encounter (`elephant-encounter-wildlife-walk`) · Helicopter Flight
(`helicopter-flight...`) · Village Tour / Ko Mpisi (`exploring-the-midwest`) ·
Guided Falls Tour (`ireland-is-waiting-for-you`) · White-Water Rafting
(merge `white-water-rafting...` + `what-to-expect-from-vibrant-alpes`) ·
The Boma dining (`meeting-wonderful-people-is-great`)

**Lodges:** Old Drift (`old-drift-lodge...`, merge `beautiful-day-at-desoto-falls`) ·
Inkosi (`inkosi-lodge...`) · Palm River (`palm-river-hotel...`) · Pioneers
(`pioneers-lodge...`) · Victoria Falls Safari Lodge (merge the two duplicates)

**Drop (demo filler):** bora-bora ×2, brazil beaches, singapore, italian-sea-view,
ireland tours, colombia(text only), mexico, portugal surfing, midwest(text only),
us-south, and the generic "all-you-need / perfect-vacation / etc." posts.

---

## 8. Deploy & domain ❓

- Recommend **Cloudflare Pages** (or Netlify): connect the git repo, auto-build on
  push, free CDN + SSL.
- Need: who controls **majestictrunk.com** DNS/registrar, to point it at the new host.

---

## 9. Open questions for you

1. **Image rights** — which photos do we own/are licensed? Which are placeholders to replace?
2. **Activitar links** — does each experience/lodge have its own Activitar booking URL, or just the one homepage URL?
3. **Hosting** — Cloudflare Pages OK? And who controls the domain's DNS?
4. **Styling** — plain CSS + tokens (recommended) or Tailwind?
5. **Git** — same-repo with `_legacy/` archive (recommended) or fresh repo?
6. **Contact** — simple WhatsApp/email/phone links (recommended) or a real form (needs a form service)?
7. **Stories/blog** — keep a small editorial section, or experiences + lodges only?
