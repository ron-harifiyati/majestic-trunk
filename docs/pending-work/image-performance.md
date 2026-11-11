Priority: P2 — performance and image quality

## Current status (10 November 2026 audit)
Responsive local images, srcset/sizes, intrinsic dimensions, lazy loading and prioritised hero markup already exist. All 83 manifest records matched their actual image dimensions in the audit, and the 81 deployed photo records have local files.

The older claim that the site has no responsive images is superseded.

## Remaining findings
- Largest full-size image: `online/experiences-banner.jpg`, 1,046,978 bytes. Actual phone transfer depends on which srcset candidate the browser selects; do not assume every phone downloads this full-size file.
- Some detail hero sources are only 419–750px wide (for example Stanley's Terrace is 419px, Old Drift/Waterfalls and some safari properties are 600px). Review large-screen quality and obtain approved higher-resolution sources where necessary.
- Several full-size dining/property assets exceed 400–500KB.
- The owner-supplied home hero has one 1352px WebP candidate rather than a separate small candidate; measure whether another size meaningfully improves mobile performance.
- There are no recorded real-browser LCP/CLS/transfer measurements for the final layout.

## Acceptance criteria
- [ ] Measure representative home, catalogue, planner and detail pages on mobile and desktop using the actual deployed host.
- [ ] Record LCP, layout shift and image transfer sizes; establish a justified performance budget.
- [ ] Verify srcset choices match actual card/hero widths, including the new compact home rows and carousel.
- [ ] Optimise the largest approved assets, adding suitable modern formats/sizes where useful.
- [ ] Replace undersized wide-hero sources with approved higher-resolution photography where quality requires it.
- [ ] Preserve intrinsic dimensions, appropriate crop/alt text, hero priority and below-the-fold lazy loading.
- [ ] Recheck performance when new approved photography replaces preview images.
