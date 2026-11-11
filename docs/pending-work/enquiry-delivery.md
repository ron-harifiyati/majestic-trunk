Priority: P1 — production enquiries

## Current position
This issue originally tracked per-product Activitar links. That booking direction has been replaced by the approved “Your trip” shortlist and contact enquiry flow.

Already implemented:
- Catalogue/detail Add to trip controls and a saved shortlist.
- Contact fields and grouped selected-item details.
- Browser/email-app and copyable-message fallback.
- Server-side enquiry validation and a Cloudflare Pages Function prepared for Resend.
- Date validation preventing today/past arrival dates.
- Automated model, route and sending/error-state checks.

The published GitHub Pages build uses `ENQUIRY_MODE=email`; it prepares an email rather than sending directly. GitHub Pages does not run the included function.

## Remaining decisions and work
- [ ] Confirm the real receiving mailbox and the person/team responsible for replies (#3, #13).
- [ ] Choose the production delivery architecture: function-capable hosting or an appropriately configured external endpoint, with secrets kept server-side.
- [ ] Connect and verify the chosen sending service and sender domain.
- [ ] Configure the real sender and recipient, replacing placeholder addresses only after verification.
- [ ] Check mailbox receive/reply delivery, provider acceptance, visitor Reply-To and spam-folder behaviour using an owner-approved test.
- [ ] Check an enquiry containing experiences, alternative stays, dining interests and free text; verify links use the production domain.
- [ ] Preserve entered details and manual email recovery when the service is unavailable or delivery cannot be confirmed.
- [ ] Configure appropriate abuse protection/rate limits for the deployed public sending endpoint.
- [ ] Verify the flow on iPhone/iPad, Android and desktop, including browsers without a configured email app.
- [ ] Update #4 with the actual host/mailbox/sending service, recipient handling and retention practices.
- [ ] Record which system delivers the enquiry and who maintains it in `docs/enquiry-setup.md`.

## Done when
A visitor can send a complete enquiry using the approved production flow, staff can receive and reply to it, and the UI never claims a failed send succeeded. No activity, room or dining table is presented as reserved by adding it to a shortlist.

Related: #3, #4, #13 and #14. Activitar product mapping is not part of the current scope.
