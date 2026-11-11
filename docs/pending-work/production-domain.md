## Problem
The live preview is https://ron-harifiyati.github.io/majestic-trunk/.
The generator defaults to `https://majestictrunk.com`, while the proposed purchased domain is `majestic-trunk.com`. The public enquiry email currently uses `similo@majestictrunk.com`. These are separate domains and must not be silently substituted.

## Business decisions
- [ ] Confirm the exact domain to buy/use, the preferred www/non-www form, account owner and production host.
- [ ] Confirm which mailbox will receive and answer enquiries, and who monitors it.
- [ ] Decide whether the GitHub Pages address remains a preview or becomes the production host with a custom domain.

## Acceptance criteria
- [ ] Configure the chosen domain and HTTPS using the selected host's supported process.
- [ ] Verify redirects/host preference and avoid duplicate indexable copies according to the agreed preview policy.
- [ ] Make canonical URLs, sitemap, robots reference, sharing metadata and links in enquiry emails use the same production domain.
- [ ] Remove hardcoded production-host assumptions, including `lib/enquiry.cjs`, so email item links cannot point to the wrong site.
- [ ] Update `src/data/site.json` with a verified receiving mailbox.
- [ ] Configure the chosen mailbox provider and perform real receive/reply tests.
- [ ] If direct form delivery is enabled, verify its sender domain and required DNS records separately from mailbox setup.
- [ ] Ensure root-host and GitHub project-path builds continue to work.
- [ ] Record launch, renewal and deployment ownership without putting credentials in the repository.

Related: #3 for verified business contact details; #2 for enquiry delivery; #7 for redirects/404. Final robots and sitemap reviews follow this work.
