## Existing support
The base template includes titles, descriptions, Open Graph title/description and canonical tags. A complete social sharing image/URL setup still needs a final production review.

## Acceptance criteria
- [ ] Agree an approved branded fallback sharing image.
- [ ] Add absolute og:image and og:url values, suitable image alt text and matching sharing-card metadata.
- [ ] Use page-specific imagery only where its approval, dimensions and identity have been verified; otherwise use the fallback.
- [ ] Check homepage, experience, accommodation, dining, trip-planner and contact links.
- [ ] Ensure previews use the production domain and project-path builds resolve assets correctly.
- [ ] Keep private enquiry details and selected-trip state out of sharing metadata.
- [ ] Verify representative actual link previews after deployment and check that cached previews can be refreshed when needed.

Related: the production-domain issue for canonical host selection, and #8 for remaining real-device/accessibility checks.
