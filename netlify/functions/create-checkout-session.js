// Creates the Stripe Checkout Session for a purchase.
//
// One session, two line items: the one-off £199 tablet + the £24.99/mo
// subscription. Because there is NO trial (the "2 months free" is a
// Nellie bonus, not a Stripe trial), the one-off tablet line item is
// billed TODAY on the first invoice rather than deferred to a trial-end
// invoice - so we ship a paid-for tablet, not an unpaid one.
//
// The setup_id / device_token / gift_code / existing_person_id are
// stamped into the session metadata so the success page AND the webhook
// can finalise the account afterwards.
//
// The Stripe secret key lives only in this function's env, never the browser.
// Require the SDK at module load, but DON'T construct the client here.
// Constructing with no key throws immediately ("Neither apiKey nor
// config.authenticator provided"), which on the gated market build (no
// Stripe key) crashed the function with a 502 before the SITE_MODE guard
// below could run. Construction is deferred into the handler, after the
// guard, so market mode returns a clean 403 and never touches Stripe.
const Stripe = require('stripe');
const { json, parseBody } = require('./_nellie');

exports.handler = async (event) => {
  // Hard gate for the pre-launch "register your interest" site. The public
  // market build sets SITE_MODE=market (see netlify-build.sh), and no order
  // may be placed there. This is the server-side belt-and-braces behind the
  // front-end CTA rewrite: even a stale client, a typed subscribe URL or a
  // direct POST cannot create a Stripe Checkout session while in market mode.
  if (process.env.SITE_MODE === 'market') {
    return json(403, { error: 'Ordering is not open yet. Please register your interest at /register.html and we will be in touch at launch.' });
  }
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'Bad JSON' });

  const {
    device_token,
    setup_id,
    gift_code = '',
    existing_person_id = '',
    email = '',
  } = body;

  if (!device_token || !setup_id) {
    return json(400, { error: 'Missing device_token or setup_id' });
  }
  if (!process.env.PRICE_TABLET || !process.env.PRICE_SUBSCRIPTION) {
    return json(500, { error: 'Stripe price IDs are not configured' });
  }

  // Stripe metadata values must be strings.
  const metadata = {
    setup_id: String(setup_id),
    device_token: String(device_token),
    gift_code: String(gift_code || ''),
    existing_person_id: String(existing_person_id || ''),
  };

  // Construct the Stripe client now (never in market mode, gated above).
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: process.env.PRICE_TABLET, quantity: 1 },        // one-off tablet, charged today
        { price: process.env.PRICE_SUBSCRIPTION, quantity: 1 },  // monthly subscription
      ],
      // NO trial_period_days - the free months are a Nellie bonus (so the
      // tablet is collected now, not at a trial-end invoice).
      customer_email: email || undefined,
      shipping_address_collection: { allowed_countries: ['GB'] }, // Stripe captures the delivery address
      allow_promotion_codes: false,                               // gift codes are Nellie's, not Stripe's
      metadata,
      subscription_data: { metadata },
      success_url: `${process.env.SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/subscribe?cancelled=1`,
    });
    return json(200, { url: session.url });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
