# Trip planner and email enquiries

The public booking destination is now `/plan-your-trip/`. The planner contains all
experiences, accommodation and dining records. Shortlist IDs are saved in browser
local storage under `majestic-trip-v1`; contact details are not saved there.
Add to trip controls are available in the trip planner and on detail pages. Catalogue cards link directly to their detail pages. Existing
`/contact/?interest=...` links add the matching entry to the shortlist.

## Preview

Run `npm run serve` and open `/plan-your-trip/` or `/contact/`.
The Python static server does not execute email functions. The form retains the
entered details and offers an email-app link and copyable complete enquiry when
sending is unavailable. It never shows a successful send for a failed request.
Selections are included as grouped text and links, not file attachments. Dining
interests and alternative stays do not reserve anything.

## Connect email

1. Buy the intended domain and create a mailbox (for example
   `similo@majestic-trunk.com`) with your chosen mailbox provider. The mailbox
   receives enquiries and lets the team reply; the sending API is separate.
2. Verify the sending domain in Resend using the DNS records it supplies. Keep
   the mailbox provider’s MX records. Follow the providers’ guidance for combining
   SPF records if both services request one.
3. Deploy with Cloudflare Pages **Git integration** (build `node build.js`, output
   `dist`, project root at this repository). The repository-root `functions/`
   directory must be included by the deployment pipeline. Uploading only the static
   `dist` folder will not deploy the email function.
4. Configure these private hosting values:
   - `RESEND_API_KEY`: a sending key from Resend.
   - `ENQUIRY_FROM`: a sender on the verified domain, e.g.
     `Majestic Trunk Expeditions <enquiries@majestic-trunk.com>`.
   - `ENQUIRY_TO`: your receiving mailbox, e.g. `similo@majestic-trunk.com`.
5. Change `enquiryEmail` in `src/data/site.json` to the same public mailbox and rebuild.
   It controls the visible contact address, email-app fallback and copy instructions.
6. Send a real test enquiry after deployment. Confirm inbox delivery, selected-item
   links, and that Reply addresses the visitor (`reply_to`), not the sending account.

No API keys belong in `src/`, the generated browser scripts, or Git. `.env.example`
lists the variable names; local Wrangler previews use a gitignored `.dev.vars`.
No live email is sent by automated tests.

The function validates dates, visitor counts, addresses and catalogue IDs, rejects
cross-origin browser requests, and includes a honeypot. It uses an idempotency key
so retrying an identical enquiry does not duplicate the provider send during its
idempotency window. An optional `ENQUIRY_RATE_LIMITER` binding can apply a Cloudflare
rate limit before calling the provider. Configure an appropriate deployment rate
limit before a public launch.

Success means the email service accepted the message; it does not guarantee inbox
delivery. Provider failures and unconfigured environments keep the enquiry on screen
with a manual email option. No browser-stored shortlist is cleared on submission.

The enquiry message currently uses the existing `https://majestictrunk.com` site
address for catalogue links. If the public site moves to `majestic-trunk.com`, update
the canonical site URLs in the generator and `lib/enquiry.cjs` at the same time.

References: [Resend send API](https://resend.com/docs/api-reference/emails/send-email),
[Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/).
