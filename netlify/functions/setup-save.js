// Proxy: Step A - persist the collected form data BEFORE payment.
// Browser -> here -> con_setup_save.php
//
// Saving before Stripe (rather than on the success page) is the key
// robustness move: once the form is server-side and we have a setup_id,
// the account can be finalised from just { device_token, setup_id } - so
// the Stripe webhook can finalise as a safety net even if the customer
// never lands back on /success.
//
// Body: { device_token, all_data }  (all_data per the brief, step_4 carries
//        payment_confirmed:false at this pre-payment stage)
// Returns: { success:true, setup_id:142, current_step:1 }
const { nelliePost, json, parseBody } = require('./_nellie');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'Bad JSON' });

  const { device_token, all_data } = body;
  if (!device_token || !all_data) return json(400, { error: 'Missing device_token or all_data' });

  const r = await nelliePost('/connect/api/con_setup_save.php', {
    device_token,
    step: 1,
    all_data,
  });
  return json(r.ok ? 200 : r.status, r.data);
};
