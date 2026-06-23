# Image Audit — what we can and can't use

Status: **first pass, 2026-06-23.** Rights still need owner confirmation where noted.

**Legend:** ✅ probably OK (confirm we own/are licensed) · ⚠️ third-party (need
permission) · ❌ cannot use (replace)

There are **508 image files but only 69 unique sources** — the rest are WordPress
auto-generated size variants. Of the 69: **44 are 2019 demo-era filler** (all dropped),
~24 are the 2025 real-content era (audited below).

## 2025-era content images

| File | What it is | Verdict | Reason |
|---|---|---|---|
| `elephanty.jpg` | Golden-hour elephant | ❌ | **Visible watermark** "© Chris Falkner / eyeofpredator.com" — licensed stock |
| `istockphoto-157666116-612x612-1.jpg` | Aerial Zambezi | ❌ | iStock **comp/preview** (612px free size + filename) — unlicensed |
| `elephant_santuaryplettenbergbay-84008.jpg` | Elephants + tourists | ❌ | **Wrong location** (Plettenberg Bay, South Africa ~1,500 km away); likely stock |
| `The_Elephant_Sanctuary.jpg` | Same sanctuary | ❌ | Wrong location; likely stock |
| `southern-africa.jpg` | Gray regional map | ❌ | Generic stock map — replace with custom map graphic |
| `Unknown-10-e1739952626323.jpeg` | "SERIOUS FUN OUTDOORS" logo | ❌ | **A different company's logo** — not ours |
| `WILD-HORIZONS-VILLAGE-TOUR-scaled.jpg` | Village tour | ⚠️ | Belongs to **Wild Horizons** (operator) — usable only with permission |
| `Victoria-Falls-Helicopter-Flight.jpg.webp` | Heli over falls | ⚠️ | Helicopter operator's marketing image — need permission |
| `306295807.jpg` | Lodge veranda/restaurant | ⚠️ | Numeric filename = scraped from Booking.com/TripAdvisor — lodge owns it |
| `328891054.jpg` | Lodge pool at dusk | ⚠️ | Same — booking-site image |
| `the-entrance-to-the-lodge-2.jpg` | Lodge entrance | ⚠️ | Same — booking-site caption filename |
| `banner-opening-special-palm-river-hotel-…jpg` | Palm River exterior/pool | ⚠️ | Hotel's own marketing image — request from lodge |
| `Victoria-Falls-Safari-Lodge-…-768x1023-1.jpg` | Safari Lodge + waterhole | ⚠️ | Lodge's own marketing image — request from lodge |
| `eleinteraction.jpg` | Woman hugging elephant | ⚠️ | No visible watermark, but source unknown — confirm before use |
| `IMG_5082-2.jpg` | White-water rafting | ⚠️ | Camera-default filename (could be an original photo) — confirm who shot it |
| `Bridge-Swing-Victoria-Falls.jpg` | Bridge swing + rainbow (current hero) | ⚠️ | Strong image, no watermark — confirm rights (likely swing operator's) |
| `image_processing20190806-…jpg` | (processing artifact) | ⚠️ | Unclear subject/source — likely drop |
| `WhatsApp-Image-*.jpeg` / `cropped-WhatsApp-*` | Logo + favicon crops + some photos | ⚠️/✅ | The only clearly-yours images, but low quality; logo/favicon must be redesigned anyway |

## 2019-era images
All **44** are WordPress demo-theme filler (rafting marketing banners, generic travel
stock for the Bora-Bora / Brazil / Ireland demo posts). **Drop all** — none belong to
this business and the posts they served are being deleted.

## Bottom line
- **1** image has a literal watermark (`elephanty.jpg`).
- The bigger problem: **almost every "real" content photo is third-party** (operators,
  lodge listings, stock). Only the WhatsApp images are plausibly owned, and they're weak.
- **Net usable, rights-clean, on-location, good-quality images today: very few.**
  Sourcing legitimate photography is the #1 content task. See
  `image-replacement-plan.md`.
