// Proxy: read-only fetch of a finalised setup's result.
// Browser (/success) -> here -> con_setup_result.php
//
// Why this exists: Step B (con_setup_complete) is NOT idempotent - it
// loads the setup WHERE completed_at IS NULL, so a repeat call returns
// 400 "already completed" with NO access code. Both /success and the
// Stripe webhook call Step B, so whoever's second needs another way to
// get the code. This endpoint returns the stored result for an already-
// finalised setup (or { completed:false } if it isn't done yet).
//
// Body: { device_token, setup_id }
// Returns: { success, completed, resident_slug, access_code, known_as, needs_password }
const { nelliePost, json, parseBody } = require('./_nellie');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'Bad JSON' });

  const { device_token, setup_id } = body;
  if (!device_token || !setup_id) return json(400, { error: 'Missing device_token or setup_id' });

  const r = await nelliePost('/connect/api/con_setup_result.php', {
    device_token,
    setup_id: Number(setup_id),
  });
  return json(r.ok ? 200 : r.status, r.data);
};
