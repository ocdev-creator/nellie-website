# Nellie website rework

A rebuild of the Nellie site to the V4 design comps (the Illustrator artboards in `Nellie-Website-V4_Folder` on Google Drive): fully responsive, with 3D and motion elements layered over the brand. Three pages, no build step, no framework.

## What's here

- `index.html`, the homepage (hero, features bar, why nellie, who is nellie for, 6-slide key-features slider, how nellie helps, 3 steps, CTA).
- `how-it-works.html`, the nellie connect page (app hero, 6 app-screen feature cards, family connection collage, gentle insights quote bubbles, intentionally simple, CTA).
- `pricing.html`, pricing + FAQs (two-tone hero, how-to-purchase columns with products and perks, 3 steps, FAQ accordion, photo CTA band).
- `assets/site.css` + `assets/site.js`, shared styles and the motion layer (reveals, parallax, floating chips, slider, tilt cards, scrollspy, accordion). Page-specific tweaks live in a small `<style>` block per page.
- `nellie/images/` + `nellie/icons/`, all imagery: the original live-site assets plus everything extracted from the V4 design SVGs (hero compositions, app screens, product cutouts, the who-is-nellie-for photo, FAQ illustration).
- `design.svg`, `design-about.svg`, `design-pricing.svg` + `viewer*.html` + `original.html`/`nellie-original.css`, reference copies of the comps and the original site. NOT for production, delete or exclude before deploying.

## Motion inventory

Scroll-triggered staggered reveals, hero Ken Burns + scroll parallax + word-by-word headline, floating notification chips with damped mouse parallax (pointer-fine only), crossfading full-bleed slider with per-slide caption sides and overlaid nav (drag/swipe/keys/dots, auto-advance until first interaction), 3D tilt on step cards, count-up stat, scrollspy nav highlight, one-open FAQ accordion. Everything disables under `prefers-reduced-motion` and the pages render fully with JS off.

## Things to review before launch

- FAQ answers on the pricing page were drafted by us, the design file only carries the questions.
- The Google Play / App Store badges on how-it-works are styled text placeholders, swap in the official badge SVGs.
- The design shows both "Lifetime warranty" (tablet feature list) and "12 month warranty" (perk chip); both are reproduced as-is.
- The icon set ships white, repainted purple via CSS filter for the outline-circle styles; purple SVG exports would be cleaner.

## Purchase flow (Stripe + Nellie account APIs)

The pricing CTAs go to `subscribe.html`, a three-step form (your details -> your
loved one -> confirm & pay). The flow:

1. The form is saved to Nellie **before** payment (Step A, `con_setup_save`) which
   returns a `setup_id`. Saving first means the account can be finalised from just
   `device_token` + `setup_id`, so the Stripe webhook can finalise as a safety net
   even if the customer never returns to `/success`.
2. **forever_free** gift codes skip Stripe entirely: the account is finalised
   directly (Step B) and we land on `success.html`.
3. Everyone else goes to a **Stripe Checkout Session** (one-off £199 tablet +
   £24.99/mo subscription, **no Stripe trial** so the tablet is charged today;
   the "2 months free" is a Nellie bonus). Stripe collects the card + delivery
   address, then redirects to `success.html`, which finalises (Step B) and shows
   the 6-digit access code.

All four Nellie APIs are called through **our own Netlify Functions** (same origin,
so no CORS, and the API base + secret keys stay server-side):

- `netlify/functions/gift-check.js` / `auth-validate.js` / `setup-save.js` /
  `setup-complete.js`, thin proxies to the Nellie backend.
- `create-checkout-session.js`, builds the Stripe session (secret key only here).
- `stripe-webhook.js`, verifies the Stripe signature and finalises the account as
  a safety net. (Order/fulfilment recording is a **separate Nellie backend
  webhook**, `con_stripe_webhook.php`, registered against the same event.)

### Netlify environment variables (Site settings -> Environment variables)

```
STRIPE_SECRET_KEY      = sk_test_… then sk_live_…
STRIPE_WEBHOOK_SECRET  = whsec_…            (from the Stripe webhook endpoint)
PRICE_TABLET           = price_…            (one-off tablet price ID)
PRICE_SUBSCRIPTION     = price_…            (monthly subscription price ID)
NELLIE_API_BASE        = https://dev.nellieconnect.com   (prod URL TBC)
NELLIE_DEV_TOKEN       = <token from dev_gate .htaccess>  (dev only; sent as the
                          X-Dev-Access header so the functions bypass the dev login
                          gate; never exposed to the browser)
SITE_URL               = https://nellieconnect.netlify.app  (then https://nellieconnect.com)
```

Stripe dashboard: create the two Prices, **disable promotion codes** (gift codes
are Nellie's, not Stripe coupons), and add a `checkout.session.completed` webhook
pointing at `/.netlify/functions/stripe-webhook`. Start in **test mode**
(card `4242 4242 4242 4242`).

### Backend behaviour the build is matched to (verified against backend code)

- **Dev gate bypass:** `dev.nellieconnect.com` is gated; the proxies send
  `X-Dev-Access: $NELLIE_DEV_TOKEN` to get through (server-side only).
- **`step_4` must carry** `platform` (`stripe`/`gift`, or it defaults to `apple`),
  `voucher_code` + `voucher_type` as well as `gift_code` (the forever_free status is
  set from the voucher_* pair), and `payment_confirmed: true` (Step B reads it from
  the saved data and only ever runs after payment). `step_2` sends both `known_as`
  and `known_to_you_as`.
- **Step B is not idempotent:** a repeat call returns "already completed" with no
  code, so `/success` falls back to `con_setup_result.php` to fetch the code (the
  webhook + success page both finalise). `con_setup_result.php` is written but
  **awaiting deploy** by the backend.
- **Journey B ("already have Nellie?") is hidden:** the backend doesn't link a new
  resident to an existing person yet, so the gate is commented out (new-customers
  only) until Step B supports `existing_person_id`.
- **`forever_free` = subscription-only, no tablet:** it correctly skips Stripe, so
  no address/order is needed. `device_bonus` ships a reduced-price tablet via Stripe
  (a separate Price ID), so address + order are handled the normal way (only needed
  once those codes are issued).

### Still needed before go-live

- The **`NELLIE_DEV_TOKEN`** value set in Netlify (from the dev_gate `.htaccess`).
- `con_setup_result.php` **deployed**.
- Swap Stripe **test → live** keys, set `SITE_URL` to the live domain, point DNS.

## Deploy

Netlify (Pro): `git push` builds via `netlify-build.sh` (stages the public pages
into `_site/`) and deploys the functions from `netlify/functions`. Test the static
pages locally with `python3 -m http.server` from this directory; the functions and
Stripe leg need `netlify dev` (or a deploy) with the env vars above. The design
reference files (`design*.svg`, `viewer*.html`, `original.html`) are kept in the
repo but never staged into `_site/`, so they don't reach the CDN.
