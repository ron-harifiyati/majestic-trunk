## Confirmed problem
The Travel Guide currently links to `https://www.evisa.gov.bw/`.
A strict HTTPS request failed because the certificate does not match that hostname.
`https://evisa.gov.bw/` returned HTTP 200 with certificate validation enabled, and Botswana's government lists the non-www address.

Government reference: https://gov.bw/taxonomy/term/114

## Other links requiring review
These are not proven permanently broken; distinguish connectivity, timeout and bot-protection results:
- Zulu Bistro: `https://zulubistrobar.com/` timed out twice, including an IPv4 retry. This is a visitor-facing venue website action.
- Old Drift source: `https://www.olddriftlodge.com/old-drift-lodge-accommodation/` could not connect, including an IPv4 retry.
- Tami Walker contact: `https://tamiwalkerphotography.com/contact/` timed out.
- Anantara Stanley & Livingstone: `https://www.anantara.com/en/stanley-and-livingstone-victoria-falls` returned HTTP 403 to the audit client; verify in a normal browser before changing it.

## Acceptance criteria
- [ ] Replace the invalid Botswana hostname with the verified government-listed destination and check all occurrences.
- [ ] Manually test flagged provider URLs in a normal browser.
- [ ] Replace confirmed dead destinations with verified official alternatives; avoid third-party substitutes without checking them.
- [ ] Recheck each final CTA and its source record.
- [ ] Keep a repeatable external-link review process that distinguishes 403/timeouts from confirmed missing pages.
- [ ] Do not count the root preconnect URL `https://fonts.gstatic.com` as a broken visitor link; it is a resource-connection hint.

Audit date: 10 November 2026. Check results are time-specific.
