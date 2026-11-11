## Timing
Perform the final review after the site's content, production domain and hosting are settled. This is a launch-finalization task, not a request to build a missing file now.

## Already implemented
`build.js` generates `dist/robots.txt` with a sitemap reference and rewrites its host/base path for deployment. The current file allows crawling.

## Remaining work
- [ ] Confirm which deployment is production and whether the GitHub Pages copy remains a public preview.
- [ ] Verify the production domain serves the intended file at `https://[PRODUCTION-DOMAIN]/robots.txt`.
- [ ] Account for the project Pages path: a file under `/majestic-trunk/robots.txt` does not establish robots rules at the host's root.
- [ ] Check the Sitemap directive points to the final canonical sitemap and returns HTTP 200.
- [ ] Allow access to public content and the CSS/JS/images needed to render it.
- [ ] Implement the agreed preview-indexing policy. Use page-level noindex where appropriate; do not rely on robots.txt as a privacy or de-indexing mechanism, or block a page whose noindex directive must be read.
- [ ] Confirm production pages are not accidentally marked noindex or disallowed.
- [ ] Add deployment-aware checks for root-host and project-path builds, then inspect the deployed result.
- [ ] Recheck after URL/content/hosting changes.

Reference: https://developers.google.com/search/docs/crawling-indexing/robots/intro

Coordinate with the final-domain and sitemap issues. No changes to crawl rules should be published until the production/preview decision is made.
