## Status
Implemented locally on 11 November 2026: storage updates now refresh an existing prepared enquiry, with regression coverage. Two-tab browser verification remains pending.

## Original bug
Previously, a browser storage event reloaded the selected IDs and redrew the shortlist, but did not refresh the prepared email preview or mailto link.

## Reproduction
1. Open the contact page and another site tab.
2. Select the sunset cruise and prepare an email enquiry.
3. Change the shortlist in the other tab to the gorge swing.
4. The contact page now shows the gorge swing in its shortlist, while the existing email preview/link still contains the sunset cruise.
5. Choosing “Open email app” can therefore send different items from those visibly selected.

Reproduced in a Node/VM harness using the actual trip script and storage event callback on 10 November 2026.

## Acceptance criteria
- [x] Refresh any visible prepared enquiry after a cross-tab storage update or clear.
- [ ] Build the final email draft from the latest selections when the visitor opens the email action.
- [x] Preserve entered contact details and message.
- [x] Keep the copy action, preview and email link consistent.
- [ ] Add a regression test for cross-tab additions, removals and clearing.
- [ ] Verify in two real browser tabs.

Related: #2. This does not require adding contact details to persistent browser storage.
