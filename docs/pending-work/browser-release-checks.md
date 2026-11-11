Priority: P2 — finish release verification

## Current status (launch audit, 10 November 2026)
Automated build/link/filter/enquiry/menu/carousel checks and the Pages CI workflow already exist. All 58 current tests pass. Static checks over 88 generated pages found no duplicate IDs, missing ARIA reference targets, unlabelled identified form controls, or nested links/buttons.

These tests use generated-file assertions and mocked DOM/geometry. They do not replace testing rendered browser layouts, native scrolling, focus behaviour, screen readers or real touch input.

Browser-control access was unavailable during this audit (browser host unavailable; native browser access timed out). No real-device visual sign-off is claimed.

## Remaining acceptance criteria
- [ ] Run rendered browser checks for home, all three catalogues and their detail templates, planner, contact, About, Travel Guide and Privacy.
- [ ] Cover narrow phone, normal phone, tablet portrait/landscape and desktop widths, including coarse-pointer tablet behaviour.
- [ ] Verify hamburger popup layering, close button, outside click, Escape, focus loop, scroll locking and restoration after resizing.
- [ ] Verify the carousel's actual centring, side-card taps, native swipe/momentum, loop recentering, orientation change, keyboard arrows and reduced motion.
- [ ] Check carousel usability with VoiceOver/TalkBack now that visible arrows/counter/hint have intentionally been removed. Preserve the approved visual design while providing any necessary accessible navigation.
- [ ] Verify sticky filters against the measured header, collapsed filtering, focus restoration and URL/back navigation.
- [ ] Check selected-trip state when returning via browser Back/Forward, reloading and using more than one tab.
- [ ] Verify form validation, date picker boundaries, required/optional labels, preparing/copying/opening email and recovery when no mail application is configured.
- [ ] Review leaving the enquiry form to explore another listing after entering details; preserve the work appropriately or provide a clear warning without silently persisting personal details contrary to the policy.
- [ ] Inspect horizontal overflow, small text, image crops and touch targets. The shortlist remove control currently has only 32px width; planner captions can be approximately 9–11px.
- [ ] Check the phone contact layout: summary precedes the form and scrolls internally; ensure a large shortlist does not make the form hard to reach.
- [ ] Run automated accessibility checks plus manual keyboard/screen-reader checks; a static structure check is not a WCAG certification.
- [ ] Add suitable browser smoke coverage to CI and document the supported browsers/local command.

Do not submit real enquiries or bookings in automated tests. Related: #17 for the confirmed cross-tab email-draft mismatch.
