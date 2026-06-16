// Proxy: validate a gift code (read-only, does NOT consume it).
// Browser -> here -> con_check_gift_code.php
// Body: { code }
// Returns the Nellie response verbatim, e.g.
//   { valid:true, free_months:1, code_type:"promotional" }   (promotional | device_bonus | forever_free)
//   { valid:false, error:"Code not found" }
const { nelliePost, json, parseBody } = require('./_nellie');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'Bad JSON' });

  const code = String(body.code || '').trim().toUpperCase();
  if (!code) return json(400, { valid: false, error: 'No code supplied' });

  const r = await nelliePost('/connect/api/con_check_gift_code.php', { code });
  // Forward the upstream status so a 5xx surfaces as a 5xx.
  return json(r.ok ? 200 : r.status, r.data);
};
