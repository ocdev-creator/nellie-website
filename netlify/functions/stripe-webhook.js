// Stripe webhook - the account-creation SAFETY NET.
//
// On checkout.session.completed we finalise the account (Step B) using
// the setup_id/device_token from the session metadata, even if the
// customer never returned to /success (closed the tab, lost signal, paid
// on another device). Step B is idempotent, so if the success page
// already finalised, this duplicate call is a harmless no-op.
//
// Order/fulfilment recording is NOT done here: per the integration brief
// that is a separate Nellie backend webhook (con_stripe_webhook.php),
// which can be registered against the same checkout.session.completed
// event independently. This function is purely the account safety net.
//
// Stripe signature verification needs the EXACT raw request body, so we
// must not let it be JSON-parsed first; Netlify may also base64-encode
// it, which we decode here.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { nelliePost } = require('./_nellie');

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : (event.body || '');

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return { statusCode: 400, body: `Webhook signature verification failed: ${e.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const md = session.metadata || {};
    if (md.setup_id && md.device_token) {
      await nelliePost('/connect/api/con_setup_complete.php', {
        device_token: md.device_token,
        setup_id: Number(md.setup_id),
      });
      // We don't fail the webhook on a Nellie error: Stripe would retry
      // and the success page is the other finaliser. Returning 200 keeps
      // Stripe from hammering the endpoint on a transient blip.
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
