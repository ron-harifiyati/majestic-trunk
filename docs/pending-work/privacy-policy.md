Priority: P1 — complete before the final business launch

## Current position
The Privacy Policy at `src/templates/privacy.html` is populated as a clearly labelled review draft. It describes confirmed website behaviour and identifies the business details still to be finalised. This document retains the working template and remaining business-information checklist.

The site has changed since this issue was first opened:
- The published GitHub Pages build uses `ENQUIRY_MODE=email`. It prepares a complete enquiry for the visitor to send through their own email service; filling in the form does not itself deliver an email.
- The trip shortlist stores catalogue IDs in browser local storage (`majestic-trip-v1`). The application does not persist contact-form values in local/session storage.
- A Cloudflare Pages Function and Resend integration exist in source, but direct website email sending is not connected on GitHub Pages. Do not describe Resend as a live processor unless it is actually deployed.
- Google Fonts is loaded externally. Hosting and the eventual mailbox provider also need to be accounted for.
- Activitar is no longer the public booking journey. Its old handoff language must not appear in the final policy.

## Business answers received — 11 November 2026
- Business name supplied by the owner: **Majestic Trunk Expeditions**. Registration status, any separate legal entity and the public business address have not been confirmed.
- Planned public enquiry/privacy address: **similo@majestictrunk.com**. The owner confirms it is not operational yet and intends to activate it for launch. Do not describe it as currently monitored.
- Mailbox provider: not chosen or confirmed. This is the company operating the inbox, separate from the domain registrar, website host and any future form-sending service.
- Initial enquiry access: the owner confirms they will be the only person reading and replying to enquiries at launch.
- Marketing: the owner confirms customer details are used only to reply about the requested trip/services; no promotional messages or newsletters.
- Internal access and security: this is a one-person business, with only the owner accessing enquiry accounts/devices. The owner confirms two-factor authentication. Because the planned mailbox is not active yet, the public draft describes mailbox 2FA as a launch arrangement.
- Provider sharing and retention: not yet decided. These remain decisions to agree, not established practices to assert in a published policy.
- Still needed: the approved public business address, mailbox provider, and decisions on provider sharing and retention.

## Verified website behaviour — 11 November 2026

These are implementation facts, separate from the business practices that still need confirmation below.

| Area | Verified behaviour | Policy wording to use |
| --- | --- | --- |
| Enquiry delivery | The production Pages workflow builds with `ENQUIRY_MODE=email`. The visitor explicitly opens their own email application or copies the prepared enquiry. GitHub Pages does not run the included email API function. | Completing or preparing the form does not send it to Majestic Trunk. The visitor sends the message using their chosen email service. |
| Form fields | Name, email and adult/child counts are required. Phone, dates and message are optional. Selections can be empty. | Describe these fields and purposes; do not claim the site requests passports or payment details. |
| Saved shortlist | `majestic-trip-v1` in local storage contains catalogue IDs, survives visits until removed/cleared, and synchronises across tabs. | Explain how visitors remove selections or clear site storage. The application does not save contact-form values in local/session storage. |
| Hosting | The production workflow deploys to GitHub Pages. GitHub documents IP-address logging for security. | Identify GitHub Pages and link its privacy statement; do not promise that browsing is anonymous or that no technical data is collected. |
| Fonts | `src/partials/base.html` connects to Google Fonts and Google font-file servers. Google's official Fonts explanation confirms its servers receive IP addresses when delivering fonts. | Identify the external font service while it remains in use. Self-hosting is a separate implementation choice, not an assumed change. |
| Analytics and advertising | No analytics, advertising trackers or application cookie-setting code were found in `src/`. This is a source-code review, not a browser/network audit of every third-party service. | Keep any claim limited to the site's own implementation. Avoid an absolute statement that no cookies or data processing can occur. |
| Images | Generated pages serve the site's image files locally. | Do not list image-source websites as services contacted automatically when a visitor views a locally served photo. |
| Payments and accounts | No website checkout, customer login or payment form is implemented. | Do not describe payment processing, account management or guaranteed reservations as website features. |
| Future direct sending | Cloudflare/Resend code exists but is not deployed by GitHub Pages. | Do not name these as current enquiry processors. Revise the notice if direct sending is enabled. |

### Verified service references
- [GitHub Pages: data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection).
- [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
- [Google Fonts: privacy explanation](https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html).
- [POTRAZ-published Cyber and Data Protection Act [Chapter 12:07]](https://www.potraz.gov.zw/wp-content/uploads/2025/02/Cyber-and-Data-Protection-Act-Chapter-1207.pdf), including sections 7, 14–15 and 28–29. The draft still needs the actual controller identity, business practices and applicable-law review; these cannot be established from code.

### Business answers requested
1. Public business address and confirmation of whether the supplied business name is also the registered legal entity.
2. Mailbox provider and activation of the planned `similo@majestictrunk.com` inbox. The owner confirms it is not operational yet.
3. When information is shared with travel providers and record-retention practices. Sole-owner access, two-factor authentication and reply-only use are confirmed.

The public page template is populated for local review while these facts remain outstanding. It explicitly labels its draft status and inactive planned mailbox. No final policy or compliance sign-off is asserted.

## Information to obtain from the business
Record approved public business facts in this issue; keep customer information, account credentials and internal security details outside public issues.

### Identity and contact
- [ ] Confirm the legal entity name and its relationship to the trading name “Majestic Trunk Expeditions”.
- [ ] Obtain the approved business/contact address and country of establishment.
- [ ] Confirm the person or business role responsible for privacy enquiries.
- [ ] Choose and test a monitored public privacy/contact email. The current address is `similo@majestictrunk.com`; the intended future domain may be `majestic-trunk.com`. Do not assume they are interchangeable.
- [ ] Confirm the final public website address and effective date.

### Real information-handling practices
- [ ] Confirm the services actually offered and whether Majestic Trunk acts as operator, booking agent, trip planner, or a combination.
- [ ] Confirm every channel receiving enquiries: website/email, phone, WhatsApp, social media, in-person and any booking platform.
- [ ] List information required versus optional at enquiry and booking stages; identify any later passport, payment, access, dietary or health information separately.
- [ ] Confirm whether children's ages/details are collected, who provides them, and the approach to requests from minors.
- [ ] Identify the purposes and appropriate legal grounds for each use, with legal review rather than assumed blanket consent.
- [ ] Identify staff/contractor roles with access and relevant accommodation/activity/dining/transfer recipients.
- [ ] Confirm when customer information is shared with providers, what is shared, and how the customer is informed.
- [x] Marketing confirmed: reply only about the requested trip/services; no newsletters or promotional messages.

### Providers, storage and retention
- [ ] Confirm production hosting, mailbox provider, enquiry delivery provider, CRM/backups and any analytics or embedded services.
- [ ] Establish what hosting/access logs are retained, by whom and for how long.
- [ ] Confirm where those providers process/store information, including any processing outside Zimbabwe and the arrangements to review.
- [ ] Decide whether to retain externally served Google Fonts or host the fonts locally.
- [ ] Agree justified retention periods for unsuccessful enquiries, completed-trip records, financial records and backups; confirm applicable legal obligations.
- [ ] Confirm deletion, access/correction request and privacy complaint handling.
- [x] Initial access/security confirmed: sole-owner access and two-factor authentication. Verify the new mailbox is configured accordingly before launch.
- [ ] Review applicable Zimbabwe data-protection duties and any registration/notification requirements with an appropriate adviser. A policy page alone does not establish compliance.

## Working Privacy Policy template
**Draft only — replace every bracketed item and remove drafting instructions before publication. Keep statements aligned with the deployed service.**

### Privacy Policy
**Last updated:** [DATE]  
**Business:** [LEGAL ENTITY], trading as Majestic Trunk Expeditions  
**Contact:** [MONITORED EMAIL]  
**Address:** [APPROVED BUSINESS ADDRESS]

### 1. Who we are
[LEGAL ENTITY / TRADING-NAME RELATIONSHIP] provides [CONFIRMED SERVICES] in and around Victoria Falls. This policy explains how we handle information when you browse [FINAL WEBSITE], build a trip shortlist or contact us about a visit.

For privacy questions or requests, contact [PRIVACY CONTACT ROLE] at [EMAIL / ADDRESS].

### 2. Information we collect
When you enquire, you may provide your name, email address, optional phone or WhatsApp number, proposed dates, the number of adults and children, your selected experiences/stays/dining interests and your message.

A name and valid email are required by the enquiry form so we can respond. Dates, phone number and message are optional. Adult/child counts help us understand your group. You can enquire without selecting any catalogue items.

[DESCRIBE ANY ADDITIONAL INFORMATION ACTUALLY REQUESTED LATER, INCLUDING WHY, WHETHER OPTIONAL, AND HOW CHILDREN'S OR SENSITIVE INFORMATION IS HANDLED.]

[DESCRIBE VERIFIED TECHNICAL INFORMATION PROCESSED BY THE HOST OR OTHER LIVE SERVICES, SUCH AS ACCESS LOGS. DO NOT INVENT ANALYTICS OR CLAIM ANONYMITY WITHOUT CHECKING.]

### 3. How we use information
We use enquiry information to understand your interests, reply to questions, prepare suggested arrangements and quotations, and [OTHER CONFIRMED PURPOSES].

[STATE THE APPROPRIATE GROUNDS FOR THESE USES, REVIEWED FOR THE APPLICABLE LAW.]  
Enquiry contact details are used to reply about the requested trip or services, not for newsletters or unrelated promotional messages.

### 4. Sending your enquiry
**Current GitHub Pages version:** The form prepares an email containing your details and selected items. You send it using your chosen email service, or copy it into an email. Preparing or completing the form alone does not send us your enquiry. Your email provider handles the message when you send it.

**Replace this paragraph if direct sending is deployed:** [IDENTIFY THE LIVE FORM DELIVERY SERVICE, HOW THE INFORMATION IS TRANSMITTED, AND THE RELEVANT PROVIDER INFORMATION.]

An enquiry does not confirm availability, reserve a table or create a confirmed booking.

### 5. Your saved trip and browser storage
The site uses browser local storage to remember the catalogue items you add to “Your trip”. The stored shortlist contains item identifiers. The application does not save your contact-form details in this storage.

You can remove individual selections using the shortlist controls, or clear the site's stored data through your browser settings. Selections normally remain available between visits until removed or cleared; browser settings may prevent or clear storage.

[ADD ONLY VERIFIED COOKIES / ANALYTICS / CONSENT DETAILS. DO NOT DESCRIBE LOCAL STORAGE AS AN ADVERTISING COOKIE OR ADD SPECULATIVE TRACKING CLAIMS.]

### 6. Who receives information
[IDENTIFY THE ACTUAL HOSTING, MAILBOX, DELIVERY AND OTHER SERVICE PROVIDERS OR CLEAR RECIPIENT CATEGORIES.]

[EXPLAIN WHEN RELEVANT HOTELS, LODGES, ACTIVITY OPERATORS, DINING VENUES OR TRANSFER PROVIDERS RECEIVE INFORMATION TO ARRANGE REQUESTED SERVICES, AND WHAT INFORMATION IS SHARED.]

The site currently loads fonts from Google Fonts. [CONFIRM THIS IS RETAINED AND ADD ACCURATE SERVICE INFORMATION, OR UPDATE AFTER SELF-HOSTING.]

Other websites linked from our guides operate under their own policies. [IDENTIFY RELEVANT SEPARATE BOOKING SERVICES ONLY IF THEY ARE ACTUALLY USED.]

### 7. Processing outside Zimbabwe
[DESCRIBE VERIFIED INTERNATIONAL PROCESSING AND THE RELEVANT ARRANGEMENTS AFTER REVIEW. DO NOT CLAIM ALL INFORMATION STAYS IN ZIMBABWE UNLESS CONFIRMED.]

### 8. How long information is kept
We retain [RECORD CATEGORY] for [JUSTIFIED PERIOD / CRITERIA] for [PURPOSE].  
[EXPLAIN ANY DIFFERENT PERIODS FOR BOOKING/FINANCIAL RECORDS, LEGAL REQUIREMENTS AND BACKUPS, AND HOW RECORDS ARE REMOVED.]

### 9. Your requests and concerns
Contact [MONITORED PRIVACY EMAIL] to ask about your information, request access or correction, object to relevant processing, or raise a privacy concern. [DESCRIBE OTHER APPLICABLE REQUESTS, LIMITATIONS AND THE ACTUAL HANDLING PROCESS AFTER LEGAL REVIEW.]

[ADD THE VERIFIED ROUTE FOR COMPLAINTS TO THE RELEVANT AUTHORITY, INCLUDING POTRAZ WHERE APPLICABLE. DO NOT INVENT RESPONSE DEADLINES.]

### 10. Protecting information
[DESCRIBE CONFIRMED, APPROPRIATE MEASURES IN PLAIN LANGUAGE. DO NOT PROMISE ABSOLUTE SECURITY OR DISCLOSE INTERNAL CREDENTIALS / CONFIGURATION.]

### 11. Changes to this policy
We will update this policy when our services or information-handling practices change and revise the date above. [CONFIRM HOW MATERIAL CHANGES WILL BE COMMUNICATED WHERE REQUIRED.]

## Implementation and sign-off
- [ ] Resolve all placeholders using confirmed business practices.
- [ ] Review the draft with a Zimbabwe-qualified legal/data-protection adviser; do not present the template as approved legal advice or a compliance certification.
- [ ] Separate booking/cancellation terms from privacy.
- [x] Prepare a readable light-background review page with a brief introduction, draft-updated date and numbered sections. Final publication remains pending.
- [ ] Preserve the footer link on every page and the enquiry-form privacy link.
- [ ] Match the form's required/optional labels, storage behaviour and email flow to the final wording.
- [ ] Recheck after domain, hosting, email or analytics changes.

## References and related work
- [Owner-supplied Wild Horizons Agent Portal reference](privacy-policy-reference-wild-horizons.md), including the supplied text and adaptation notes.
- POTRAZ-published Cyber and Data Protection Act [Chapter 12:07], particularly sections 14–15: https://www.potraz.gov.zw/wp-content/uploads/2025/02/Cyber-and-Data-Protection-Act-Chapter-1207.pdf
- Business identity/contact verification: #3.
- Current enquiry implementation and deployment instructions: `docs/enquiry-setup.md`.


- Production domain/mailbox: #13. Enquiry delivery: #2. Separate booking terms: #14. Launch tracker: #16.
