# Booking Integration (Activitar) — PARKED for later

Status: **decision deferred** (2026-06-23). Building the rest of the site first; booking
buttons currently point to the single Activitar URL as a placeholder.

## What Activitar supports (researched)
- **Per-product URLs** — the live instance has real paths (`/products`, `/products/groups`,
  `/vouchers`, `/about`, `/contact`). So we can **deep-link each experience** to its exact
  Activitar page instead of the homepage (current behaviour: all 32 links → homepage).
- **Embeddable booking widget** — their sites run one (date + adults/children + "Book
  Specific Service"). Can sit on our branded page; Activitar handles data + payment.
- **"Offers API" + private-label / in-house** for *distributors* — exists, but **no public
  docs/SDK/widget snippet** (their GitHub is just forked infra). Needs a partner agreement +
  credentials via support@activitar.com.
- **Payments stay on Activitar** (Visa/Mastercard, Stripe). Sign-up-free checkout.

## Options (in order of preference)
1. **Deep-link per experience** → that activity's Activitar page. Trivial. Do regardless.
2. **Embed the Activitar widget** on experience pages → "enter on our side, sent over",
   no payment exposure. Low effort once we have the snippet.
3. ~~Custom form → Activitar API~~ → high complexity (partner API + still hands off to
   Activitar for payment). **Dropped** per owner's call ("if too complex, skip it").

## Open question for the owner
"Forward the data/info" = which?
- **(a)** real booking the customer completes (pays) → **embed widget / deep-link**, or
- **(b)** just an inquiry/lead we follow up on → **simple form that emails us** (no API, no DB).

## Action item (owner)
From the Activitar dashboard (or support@activitar.com), grab the **widget/embed snippet**
and the **individual product URLs** — that's what the booking buttons will use.
*(Note: Activitar's GitHub has a `claude-superpowers` repo and this repo has `docs/superpowers/`
— if there's already an Activitar relationship, obtaining the embed code should be quick.)*
