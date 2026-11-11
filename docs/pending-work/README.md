# Pending work and launch checklist

Master tracker: [GitHub issue #16](https://github.com/ron-harifiyati/majestic-trunk/issues/16).

Use the linked GitHub issues as the ongoing task tracker. Files in this folder are editable starting drafts/backups; keep them aligned with their issues when decisions change. This checklist does not mark the website or business as legally approved for launch.

## Business facts and privacy
- [ ] [Confirm approved business identity and contact channels](https://github.com/ron-harifiyati/majestic-trunk/issues/3).
- [ ] [Complete the Privacy Policy and business-information checklist](https://github.com/ron-harifiyati/majestic-trunk/issues/4) — full [working template](privacy-policy.md).
- Supporting reference: [Wild Horizons Agent Portal policy excerpt](privacy-policy-reference-wild-horizons.md), supplied by the owner, with adaptation notes.
- [ ] [Resolve the documented legacy credential action](https://github.com/ron-harifiyati/majestic-trunk/issues/5) without posting any keys.

## Production setup
- [ ] [Choose and configure the final domain, HTTPS and mailbox](https://github.com/ron-harifiyati/majestic-trunk/issues/13) — [draft](production-domain.md).
- [ ] [Connect and verify enquiry email delivery](https://github.com/ron-harifiyati/majestic-trunk/issues/2) — [draft](enquiry-delivery.md).
- [ ] [Agree booking/enquiry terms](https://github.com/ron-harifiyati/majestic-trunk/issues/14) — [draft](booking-terms.md).

## After content, URLs and hosting are settled
Both robots.txt and sitemap.xml already exist in the generator. These are final-review/update tasks for the completed site.
- [ ] [Finalize robots.txt and preview indexing rules](https://github.com/ron-harifiyati/majestic-trunk/issues/11) — [draft](robots-final-review.md).
- [ ] [Validate and submit the final sitemap](https://github.com/ron-harifiyati/majestic-trunk/issues/12) — [draft](sitemap-final-review.md).
- [ ] [Complete social sharing previews](https://github.com/ron-harifiyati/majestic-trunk/issues/15) — [draft](social-sharing.md).
- [ ] [Finish production 404 handling and legacy redirects](https://github.com/ron-harifiyati/majestic-trunk/issues/7). Clean directory URLs and legacy HTML aliases already exist; verify the remaining historical routes and real host responses.

## Validation and handover
- [ ] Review remaining [real-device, accessibility and browser checks](https://github.com/ron-harifiyati/majestic-trunk/issues/8). Automated build/link/filter/enquiry/menu/carousel tests and CI already exist; inspect and update the older issue before treating every original checkbox as unfinished.
- [ ] Review [responsive image/performance work](https://github.com/ron-harifiyati/majestic-trunk/issues/6). Responsive variants and image dimensions already exist; remaining measurement/approved-media work needs verification.
- [ ] [Reconcile launch documentation](https://github.com/ron-harifiyati/majestic-trunk/issues/9).
- [ ] Review [build validation](https://github.com/ron-harifiyati/majestic-trunk/issues/10) against current checks before closing or redefining the remaining gaps.

Recommended order: confirm business facts → choose domain/hosting/mailbox → connect delivery and approve policies/terms → finish content → finalize crawl/indexing and sharing → validate deployed site and hand over.



## Site-wide audit — 10 November 2026

Read the [full launch-readiness audit](launch-audit.md) for scope, evidence and limitations.
- [ ] [Verify cross-tab prepared-email synchronization](https://github.com/ron-harifiyati/majestic-trunk/issues/17) — implemented locally with regression coverage; real-browser verification remains. [Details](enquiry-draft-sync.md).
- [ ] [Fix the visa link and review flagged provider URLs](https://github.com/ron-harifiyati/majestic-trunk/issues/18) — [audit details](outbound-links.md).
- [ ] [Approve listing facts and essential activity guidance](https://github.com/ron-harifiyati/majestic-trunk/issues/19) — [content sign-off](listing-content-signoff.md).
- [ ] [Set up operating ownership, monitoring and recovery](https://github.com/ron-harifiyati/majestic-trunk/issues/20) — [handover tasks](monitoring-recovery.md).

Updated remaining-work definitions: [browser/device QA](browser-release-checks.md) and [image performance](image-performance.md).
