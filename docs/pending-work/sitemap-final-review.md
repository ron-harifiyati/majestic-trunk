## Timing
Complete the final sitemap review once the site is finished and its production URL is agreed. Do not treat today's generated output as the final launch inventory.

## Already implemented
`build.js` generates `dist/sitemap.xml` from canonical page routes, with deployment-specific origin/base-path rewriting. Legacy HTML redirect pages and filter comparison pages are excluded. The current inventory is 88 canonical pages; tests should derive the expected inventory rather than freeze that number.

## Remaining work
- [ ] Confirm the final list of public, indexable pages and the canonical production host.
- [ ] Generate the sitemap from that final inventory using absolute HTTPS URLs.
- [ ] Exclude legacy redirects, previews, 404 pages, noindex pages and transient filter/enquiry/cart query URLs.
- [ ] Confirm every listed URL returns a real canonical content page, not a redirect or error.
- [ ] Confirm sitemap URLs match canonical tags and the selected trailing-slash convention.
- [ ] Validate XML encoding/escaping and ensure the deployed sitemap returns HTTP 200.
- [ ] Check the robots.txt Sitemap reference matches the deployed location.
- [ ] Verify the business-owned Search Console property and submit the final sitemap after launch.
- [ ] Confirm submission is accepted and review crawl/indexing reports; submission is not a promise of indexing.
- [ ] Document regeneration and resubmission/review when published content or URLs change.
- [ ] If lastmod is added, derive it from meaningful content changes rather than inventing a new date at every build.

Reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

Depends on the final-domain decision and completed content.
