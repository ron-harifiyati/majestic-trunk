Priority: P1 — complete before the final business launch

## Current position
The Privacy Policy at `src/templates/privacy.html` is still explicitly marked as a placeholder. This issue now contains the working policy template and the business-information checklist needed to finish it.

The site has changed since this issue was first opened:
- The published GitHub Pages build uses `ENQUIRY_MODE=email`. It prepares a complete enquiry for the visitor to send through their own email service; filling in the form does not itself deliver an email.
- The trip shortlist stores catalogue IDs in browser local storage (`majestic-trip-v1`). The application does not persist contact-form values in local/session storage.
- A Cloudflare Pages Function and Resend integration exist in source, but direct website email sending is not connected on GitHub Pages. Do not describe Resend as a live processor unless it is actually deployed.
- Google Fonts is loaded externally. Hosting and the eventual mailbox provider also need to be accounted for.
- Activitar is no longer the public booking journey. Its old handoff language must not appear in the final policy.

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
- [ ] Confirm whether information is used for marketing, and the actual subscription/opt-out process if so.

### Providers, storage and retention
- [ ] Confirm production hosting, mailbox provider, enquiry delivery provider, CRM/backups and any analytics or embedded services.
- [ ] Establish what hosting/access logs are retained, by whom and for how long.
- [ ] Confirm where those providers process/store information, including any processing outside Zimbabwe and the arrangements to review.
- [ ] Decide whether to retain externally served Google Fonts or host the fonts locally.
- [ ] Agree justified retention periods for unsuccessful enquiries, completed-trip records, financial records and backups; confirm applicable legal obligations.
- [ ] Confirm deletion, access/correction request and privacy complaint handling.
- [ ] Confirm practical security/access controls without publishing sensitive implementation details.
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
[STATE THE ACTUAL MARKETING PRACTICE AND OPT-OUT PROCESS, OR OMIT MARKETING IF IT IS NOT USED.]

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
- [ ] Publish a readable light-background page with a brief introduction, last-updated date and numbered sections.
- [ ] Preserve the footer link on every page and the enquiry-form privacy link.
- [ ] Match the form's required/optional labels, storage behaviour and email flow to the final wording.
- [ ] Recheck after domain, hosting, email or analytics changes.

## References and related work
- [Owner-supplied Wild Horizons Agent Portal reference](privacy-policy-reference-wild-horizons.md), including the supplied text and adaptation notes.
- POTRAZ-published Data Protection Act, particularly sections 14–15: https://www.potraz.gov.zw/wp-content/uploads/2022/02/Data-Protection-Act-5-of-2021.pdf
- Business identity/contact verification: #3.
- Current enquiry implementation and deployment instructions: `docs/enquiry-setup.md`.


- Production domain/mailbox: #13. Enquiry delivery: #2. Separate booking terms: #14. Launch tracker: #16.
