# Launch-readiness audit — 10 November 2026

## Assessment
Keep the current deployment as a preview until the business/policy and production-enquiry decisions are resolved. Routing and the automated functional foundation are working. No payment or account system is required for the agreed enquiry-based scope.

This was an audit, not an application-fix or deployment task. The footer redesign remains unrelated uncommitted work. No application code was changed during this audit.

## Scope and limitations
- Checked all 88 generated and deployed canonical pages across home, three catalogues, all 78 detail records, planner, contact, About, Travel Guide, gallery and Privacy.
- Reviewed the templates and scripts for navigation, filtering, shortlist storage, enquiry preparation/delivery and the homepage carousel.
- Ran all 58 existing tests: passed.
- Checked 3,805 local link/asset references in an isolated GitHub Pages project-path build; the root-host build is also covered by existing tests.
- Checked static accessibility structure on all 88 pages: no duplicate IDs, missing ARIA targets, unlabelled identified inputs or nested links/buttons.
- Checked all 83 media-manifest records against actual image dimensions; no mismatches.
- Checked 91 external URL targets, including one resource preconnect hint. This corresponds to 90 visitor-facing external links.
- No real enquiry emails or bookings were sent.
- Browser control was unavailable and native browser access timed out. Rendered mobile layouts, gestures, screen readers, Core Web Vitals and mailbox delivery have not been signed off.
- Source/data/HTTP checks do not independently verify every operator fact or accreditation.

## What passed
- All 88 live canonical pages returned HTTP 200.
- Every live page had one title, one H1 and a canonical matching its deployed URL.
- robots.txt and sitemap.xml returned HTTP 200. The sitemap contains 88 canonical routes.
- An intentionally nonexistent URL returned HTTP 404; the missing piece is a branded 404 page and remaining historic redirect mapping.
- Existing tests cover catalogue filters, clean URLs and legacy HTML redirects, shortlist persistence, date validation, enquiry payloads, sending/error states, hamburger keyboard/focus behaviour and carousel loop logic.
- Basic palette contrast samples passed 4.5:1 (white/terracotta: 4.94, muted text/sand: 4.80, footer text/dark background: 8.19). This is not a complete rendered contrast or WCAG audit.
- No simple credential-pattern match was found in the scanned tracked text. This does not resolve the historical MapTiler revocation task.

## Launch blockers and owner decisions

### 1. Complete the Privacy Policy and confirm business identity
The public policy still contains “Placeholder — to be replaced with the final policy.” The legal/trading name relationship, public business address, monitored mailbox, recipients and retention practices need owner confirmation.

The full draft and information checklist are in [privacy-policy.md](privacy-policy.md).
Issues: [#4](https://github.com/ron-harifiyati/majestic-trunk/issues/4), [#3](https://github.com/ron-harifiyati/majestic-trunk/issues/3).

### 2. Confirm production enquiries actually reach the business
GitHub Pages deliberately builds the form in email-preparation mode; it does not execute the included Cloudflare/Resend function. The preview is honest about that limitation, but the intended direct-sending production flow and mailbox receive/reply behaviour remain unverified.

The final mailbox/domain is unresolved: the code uses majestictrunk.com while the proposed purchased domain is majestic-trunk.com. The server-side email formatter also hardcodes the former website URL.

Issues: [#2](https://github.com/ron-harifiyati/majestic-trunk/issues/2), [#13](https://github.com/ron-harifiyati/majestic-trunk/issues/13). See [enquiry-delivery.md](enquiry-delivery.md).

### 3. Define actual booking responsibilities and terms
There is no published booking/cancellation terms page. Clarify operator/agent responsibilities and what happens between an enquiry, quotation, payment and confirmed arrangement before accepting bookings. Do not add invented prices, refund periods, badges or guarantees.

Issue: [#14](https://github.com/ron-harifiyati/majestic-trunk/issues/14).

### 4. Verify listing facts and essential guidance
The “Before you book” sections were intentionally removed. Some age/weight/health/swimming/fitness guidance now remains only in experience JSON planning fields. Decide which essential notes belong beside the facts/enquiry action or in the quotation without restoring the rejected sections wholesale.

Approve the final facts for all 26 experiences, 34 stays and 18 dining venues, including seasonal/cross-border programmes and what Majestic Trunk can actually arrange.

New issue: [#19](https://github.com/ron-harifiyati/majestic-trunk/issues/19).

## Confirmed functional defects and outbound-link findings

### Prepared email becomes stale after a change in another tab
The storage event handler in `src/js/trip.js:46` redraws the shortlist but does not regenerate an already prepared email preview/link. The displayed trip can therefore differ from what “Open email app” sends.

Reproduced using the actual script and its storage callback: prepare a sunset-cruise enquiry, change the stored trip to gorge swing, then observe the new visible selection and old prepared message.

New issue: [#17](https://github.com/ron-harifiyati/majestic-trunk/issues/17).

### Botswana visa link uses an invalid certificate hostname
The current Travel Guide links to https://www.evisa.gov.bw/. Strict certificate validation failed because that hostname does not match the certificate.
https://evisa.gov.bw/ returned HTTP 200 with validation enabled and is the address linked by the [Botswana government](https://gov.bw/taxonomy/term/114).

Other outbound results:
- 85 visitor-facing URLs returned HTTP 200 in the initial scan.
- Zulu Bistro timed out twice.
- Old Drift's older accommodation source could not connect, including an IPv4 retry.
- Tami Walker's contact page timed out.
- Anantara returned HTTP 403 to the audit client and needs normal-browser verification.
- The fonts.gstatic.com root returned 404, but it is a preconnect hint, not a broken visitor link.

Do not label every timeout or 403 as a permanently dead website.

New issue: [#18](https://github.com/ron-harifiyati/majestic-trunk/issues/18).

## Improvements to finish before final sign-off

### Browser, mobile and accessibility checks
The passing tests use mocked DOM/geometry and generated-file assertions. Check native iPhone/iPad/Android scrolling, carousel gestures and screen-reader navigation, popup focus/layering, filters, form controls and the email-app flow.

Specific source-level review points:
- Shortlist remove controls are 32px wide.
- Some planner labels are approximately 9–11px and form text approximately 14px.
- The mobile contact summary comes before the form and has its own scrolling region.
- There is no application-level contact-form draft preservation or leaving-page warning; verify the experience of entering details and then browsing another listing.
- Verify shortlist state after browser Back/Forward restores, not only reloads.
- Larger email-app links need device testing: all 78 selections produced a roughly 9,560-character encoded mailto URL with a short message. The copy alternative exists, but mail-app compatibility is not established.

Updated issue: [#8](https://github.com/ron-harifiyati/majestic-trunk/issues/8).

### Images and performance
Responsive images and dimensions already exist. Measure actual browser-selected candidates before asserting phone download costs.

Remaining examples:
- The full Experiences banner is 1,046,978 bytes.
- Some wide detail heroes originate from 419–750px images.
- Several full-size dining/property images exceed 400–500KB.
- Real-browser LCP, layout shift and final page transfer measurements are outstanding.

Updated issue: [#6](https://github.com/ron-harifiyati/majestic-trunk/issues/6).

### 404, metadata and final search setup
- Add a branded 404 page and complete remaining WordPress redirect mappings: [#7](https://github.com/ron-harifiyati/majestic-trunk/issues/7).
- No page currently has og:image or og:url, and no business structured data is rendered. Titles, descriptions and canonical URLs already exist. Complete approved sharing previews: [#15](https://github.com/ron-harifiyati/majestic-trunk/issues/15). Verified business structured data is an enhancement after business details are confirmed.
- robots.txt and sitemap.xml are already generated. Finalize production/preview indexing and sitemap submission after content/domain/hosting settle: [#11](https://github.com/ron-harifiyati/majestic-trunk/issues/11), [#12](https://github.com/ron-harifiyati/majestic-trunk/issues/12).
- A project-path robots.txt is not the host-root robots file; account for this in the final host/domain decision.

### Operating the launched site
Set monitoring, incident/enquiry ownership, renewal ownership, backups and rollback instructions.

New issue: [#20](https://github.com/ron-harifiyati/majestic-trunk/issues/20).

## Maintenance and release notes
- Enquiry tests use a fixed 12 August 2027 arrival. Freeze the test clock or derive controlled future dates so date-validation tests do not fail when that day ceases to be in the future.
- Review #10 against the validation already implemented before treating its original missing-validator description as current.
- Documentation still contains historic architecture, counts and integration decisions; reconcile it under #9.
- The live homepage includes the carousel, but the new footer is not yet deployed. Its changes and the pending-work Markdown are local/uncommitted.
- The historical credential-revocation action in #5 still needs owner confirmation; the audit did not test or expose any key.

## Recommended order
1. Fix the stale enquiry draft and invalid visa link.
2. Confirm business details, domain/mailbox/delivery, photo approvals and policy/terms.
3. Approve final listing facts and participation guidance.
4. Complete real-device/accessibility/performance testing and remaining 404/sharing work.
5. Finalize robots/sitemap/Search Console, establish monitoring, commit the approved release and verify the deployed result.

Master tracker: [#16](https://github.com/ron-harifiyati/majestic-trunk/issues/16).

