// Shared helper for the Nellie API proxies.
//
// Why proxies at all: the four Nellie account APIs (gift-code check, auth
// validate, setup-save, setup-complete) only allow CORS for the
// nellieconnect.com origin. Rather than wait on a DNS cut-over or an
// allow-list change, the browser calls our OWN Netlify Functions
// (same origin, no CORS) and the function calls the Nellie API
// server-to-server. As a bonus the API base URL stays an env var, so
// pointing dev -> prod is a config change, not a code edit.
//
// Node 18+ on Netlify has a global fetch, so there is no dependency here.

const API_BASE = process.env.NELLIE_API_BASE || 'https://dev.nellieconnect.com';

// POST a JSON body to a Nellie API path and return a normalised result.
// Never throws on a non-2xx: it returns { ok, status, data } so each
// proxy can decide what to forward to the browser.
async function nelliePost(path, payload) {
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // network / DNS failure reaching the Nellie backend
    return { ok: false, status: 502, data: { error: 'Upstream unreachable' } };
  }
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return { ok: res.ok, status: res.status, data };
}

// Standard JSON response. No CORS headers needed: the browser only ever
// hits these functions same-origin.
function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

// Parse a function's POST body, tolerating an empty/garbled payload.
function parseBody(event) {
  try { return JSON.parse(event.body || '{}'); } catch { return null; }
}

module.exports = { nelliePost, json, parseBody, API_BASE };
