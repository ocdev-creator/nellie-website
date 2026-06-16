// Proxy: the "already have Nellie?" gate.
// Browser -> here -> con_auth_validate.php
// Body: { email, password }
// Returns: { valid:true, person_id:314, name:"Norman" } | { valid:false }
// The Nellie API rate-limits this (5 fails / 15 min locks the account);
// we pass the result straight through. The password only ever transits
// server-to-server over HTTPS and is never logged here.
const { nelliePost, json, parseBody } = require('./_nellie');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'Bad JSON' });

  const email = String(body.email || '').trim();
  const password = String(body.password || '');
  if (!email || !password) return json(400, { valid: false, error: 'Email and password required' });

  const r = await nelliePost('/connect/api/con_auth_validate.php', { email, password });
  return json(r.ok ? 200 : r.status, r.data);
};
