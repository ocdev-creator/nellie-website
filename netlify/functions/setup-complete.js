// Proxy: Step B - finalise the account and return the access code.
// Browser (/success) -> here -> con_setup_complete.php
// Also called by the Stripe webhook as a safety net.
//
// Body: { device_token, setup_id }
// Returns (new customer):
//   { success:true, access_code:"482916", known_as:"Mum", needs_password:true, ... }
// On a setup that is already finalised the Nellie API returns
//   { success:false, error:"Setup not found or already completed" }
// which is what makes the success-page / webhook race safe (idempotent
// write). NOTE for go-live: confirm Step B also returns the access_code
// on a repeat call, otherwise whichever caller loses the race can't show
// the code (see the integration brief, open item / success page).
const { nelliePost, json, parseBody } = require('./_nellie');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'Bad JSON' });

  const { device_token, setup_id } = body;
  if (!device_token || !setup_id) return json(400, { error: 'Missing device_token or setup_id' });

  const r = await nelliePost('/connect/api/con_setup_complete.php', {
    device_token,
    setup_id: Number(setup_id),
  });
  return json(r.ok ? 200 : r.status, r.data);
};
