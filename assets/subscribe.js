/* Nellie purchase flow.
 *
 * Three steps (your details -> your loved one -> confirm & pay), then:
 *   1. save the whole form to Nellie BEFORE payment (Step A) -> setup_id
 *   2a. forever_free gift code  -> finalise directly (Step B), skip Stripe
 *   2b. everyone else           -> create a Stripe Checkout Session, redirect
 * The success page finalises the paid accounts (with the webhook as a
 * server-side safety net). All API calls go through our own Netlify
 * Functions (same origin, no CORS).
 *
 * No framework, no build step, matching the rest of the site.
 */
(function () {
  'use strict';

  var FN = '/.netlify/functions/';
  var POSTCODE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ---- one stable id ties "payment succeeded" -> "create THIS account" ----
  function getDeviceToken() {
    var t = localStorage.getItem('nellie_device_token');
    if (!t) { t = 'web_' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '_' + Math.random().toString(16).slice(2)); localStorage.setItem('nellie_device_token', t); }
    return t;
  }
  var deviceToken = getDeviceToken();

  var state = {
    step: 1,
    existingPersonId: null,   // Journey B: set when they sign in via the gate
    giftCode: '',
    codeType: '',             // promotional | device_bonus | forever_free
    bonusMonths: 0,
  };

  var $ = function (id) { return document.getElementById(id); };
  var val = function (id) { var e = $(id); return e ? e.value.trim() : ''; };

  // ---------- step navigation ----------
  function showStep(n) {
    state.step = n;
    document.querySelectorAll('.wiz-step').forEach(function (s) {
      s.classList.toggle('active', Number(s.dataset.step) === n);
    });
    document.querySelectorAll('.co-step').forEach(function (s) {
      var sn = Number(s.dataset.step);
      s.classList.toggle('on', sn === n);
      s.classList.toggle('done', sn < n);
    });
    $('co-back').style.visibility = n === 1 ? 'hidden' : 'visible';
    $('co-next').style.display = n < 3 ? '' : 'none';
    $('co-pay').style.display = n === 3 ? '' : 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- validation ----------
  function markField(fieldEl, ok) {
    fieldEl.classList.toggle('show-err', !ok);
    fieldEl.querySelectorAll('input,select').forEach(function (i) { i.classList.toggle('bad', !ok); });
    return ok;
  }
  function validDob(d, m, y, minYear, maxYear) {
    d = +d; m = +m; y = +y;
    if (!d || !m || !y) return false;
    if (m < 1 || m > 12 || d < 1 || d > 31) return false;
    if (y < minYear || y > maxYear) return false;
    var dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
  }
  // validate every required field within a step section
  function validateStep(n) {
    var section = document.querySelector('.wiz-step[data-step="' + n + '"]');
    var ok = true;
    section.querySelectorAll('.field[data-req]').forEach(function (f) {
      if (f.hasAttribute('hidden')) return;          // e.g. care-home name when not applicable
      var input = f.querySelector('input,select');
      var fieldOk;
      if (f.hasAttribute('data-dob')) {
        var ids = f.querySelectorAll('input');
        var subscriber = section.dataset.step === '1';
        // subscriber must be an adult; resident just a plausible past date
        fieldOk = validDob(ids[0].value, ids[1].value, ids[2].value, 1900, subscriber ? 2007 : 2024);
      } else if (input.type === 'email') {
        fieldOk = EMAIL.test(input.value.trim());
      } else if (input.id === 'postcode' || input.id === 'resident_postcode') {
        fieldOk = POSTCODE.test(input.value.trim());
      } else {
        fieldOk = input.value.trim() !== '';
      }
      if (!markField(f, fieldOk)) ok = false;
    });
    return ok;
  }

  // ---------- gather payload ----------
  function buildAllData() {
    return {
      source: 'netlify',
      existing_person_id: state.existingPersonId || null,
      step_1: {
        first_name: val('first_name'),
        email: val('email'),
        postcode: val('postcode').toUpperCase(),
        dob_day: +val('dob_day'), dob_month: +val('dob_month'), dob_year: +val('dob_year'),
      },
      step_2: {
        resident_name: val('resident_name'),
        relationship: +val('relationship'),
        known_to_you_as: val('known_to_you_as'),
        living_in: val('living_in'),
        resident_postcode: val('resident_postcode').toUpperCase(),
        care_home_name: ($('care-home-field').hasAttribute('hidden') ? '' : val('care_home_name')),
        dob_day: +val('r_dob_day'), dob_month: +val('r_dob_month'), dob_year: +val('r_dob_year'),
      },
      step_4: {
        gift_code: state.giftCode || '',
        bonus_months: state.bonusMonths || 0,
        // forever_free is created directly (platform 'gift'); everyone else
        // pays via Stripe. payment_confirmed stays false on this pre-payment
        // save - Step B / the webhook is the real payment gate.
        payment_confirmed: state.codeType === 'forever_free',
        platform: state.codeType === 'forever_free' ? 'gift' : 'stripe',
      },
    };
  }

  // ---------- persistence (survives the Stripe redirect) ----------
  function persistForCheckout(setupId) {
    localStorage.setItem('nellie_checkout', JSON.stringify({
      setup_id: setupId,
      existing_person_id: state.existingPersonId || null,
      known_as: val('known_to_you_as') || val('resident_name'),
      email: val('email'),
      resident_name: val('resident_name'),
      gift_code: state.giftCode || '',
      code_type: state.codeType || '',
    }));
  }

  // ---------- API helpers ----------
  function postFn(name, body) {
    return fetch(FN + name, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    }).then(function (r) { return r.json().catch(function () { return {}; }); });
  }

  // ---------- gift code (live, debounced) ----------
  var giftTimer = null;
  function onGiftInput() {
    var raw = val('gift_code').toUpperCase();
    $('gift_code').value = raw;
    clearTimeout(giftTimer);
    var statusEl = $('gift-status');
    // reset to default paid state whenever the code changes
    state.giftCode = ''; state.codeType = ''; state.bonusMonths = 0;
    applySummary();
    if (!raw) { statusEl.textContent = ''; statusEl.className = 'gift-status'; return; }
    statusEl.textContent = 'Checking…'; statusEl.className = 'gift-status checking';
    giftTimer = setTimeout(function () {
      postFn('gift-check', { code: raw }).then(function (d) {
        if (val('gift_code').toUpperCase() !== raw) return;     // changed while we waited
        if (d && d.valid) {
          state.giftCode = raw;
          state.codeType = d.code_type || 'promotional';
          state.bonusMonths = d.free_months || 0;
          if (state.codeType === 'forever_free') {
            statusEl.textContent = 'Forever-free code applied, you won’t be charged.';
          } else if (state.bonusMonths) {
            statusEl.textContent = state.bonusMonths + ' free month' + (state.bonusMonths > 1 ? 's' : '') + ' will be added.';
          } else {
            statusEl.textContent = 'Code applied.';
          }
          statusEl.className = 'gift-status good';
        } else {
          state.giftCode = ''; state.codeType = ''; state.bonusMonths = 0;
          statusEl.textContent = (d && d.error) ? d.error : 'Code not recognised.';
          statusEl.className = 'gift-status bad';
        }
        applySummary();
      });
    }, 450);
  }

  // ---------- order summary + pay button reflect the code ----------
  function applySummary() {
    var free = state.codeType === 'forever_free';
    $('sum-tablet').innerHTML = free ? 'Free' : '&pound;199.00';
    $('sum-sub').innerHTML = free ? 'Free' : '&pound;24.99<span style="font-weight:600">/mo</span>';
    $('sum-total').innerHTML = free ? 'Free' : '&pound;223.99';
    document.querySelectorAll('#summary .li').forEach(function (li) { li.classList.toggle('free', free); });
    var bonusEl = $('sum-bonus');
    if (!free && state.bonusMonths) {
      bonusEl.style.display = ''; bonusEl.textContent = '+ ' + state.bonusMonths + ' free month' + (state.bonusMonths > 1 ? 's' : '') + ' of nellie connect';
    } else { bonusEl.style.display = 'none'; }
    var payLabel = $('co-pay').querySelector('span');
    payLabel.textContent = free ? 'create my account' : 'continue to payment';
  }

  // ---------- the "already have nellie?" gate ----------
  function setupGate() {
    var gate = $('gate');
    $('gate-toggle').addEventListener('click', function () { gate.classList.toggle('open'); });
    $('gate-signin').addEventListener('click', function () {
      var email = val('g-email'), pass = val('g-pass');
      var err = $('g-err');
      err.style.display = 'none';
      if (!EMAIL.test(email) || !pass) { err.textContent = 'Enter your email and password.'; err.style.display = 'block'; return; }
      var btn = $('gate-signin'); btn.disabled = true; var old = btn.innerHTML; btn.innerHTML = '<span class="spin"></span>signing in…';
      postFn('auth-validate', { email: email, password: pass }).then(function (d) {
        btn.disabled = false; btn.innerHTML = old;
        if (d && d.valid) {
          state.existingPersonId = d.person_id;
          gate.classList.add('signed');
          $('gate-ok').textContent = 'Welcome back, ' + (d.name || 'friend') + '. Just add your new loved one below.';
          // pre-fill + lock the subscriber identity
          if (d.name) { $('first_name').value = (d.name || '').split(' ')[0]; }
          $('email').value = email;
          $('first_name').readOnly = true; $('email').readOnly = true;
        } else {
          err.textContent = 'Those details didn’t match. Check and try again.'; err.style.display = 'block';
        }
      });
    });
  }

  // ---------- final submit ----------
  function submit() {
    if (!validateStep(3)) return;
    var pay = $('co-pay'); pay.disabled = true;
    var label = pay.querySelector('span'); var old = label.textContent;
    label.innerHTML = '<span class="spin"></span>saving your details…';

    var allData = buildAllData();
    postFn('setup-save', { device_token: deviceToken, all_data: allData }).then(function (a) {
      if (!a || !a.success || !a.setup_id) {
        throw new Error((a && a.error) || 'We couldn’t save your details, please try again.');
      }
      persistForCheckout(a.setup_id);

      if (state.codeType === 'forever_free') {
        // free path: finalise straight away, no Stripe
        label.textContent = 'creating your account…';
        return postFn('setup-complete', { device_token: deviceToken, setup_id: a.setup_id }).then(function (b) {
          if (b && b.success) { localStorage.setItem('nellie_result', JSON.stringify(b)); }
          window.location = 'success.html';
        });
      }
      // paid path: hand off to Stripe
      label.textContent = 'redirecting to secure payment…';
      return postFn('create-checkout-session', {
        device_token: deviceToken, setup_id: a.setup_id,
        gift_code: state.giftCode || '', existing_person_id: state.existingPersonId || '',
        email: val('email'),
      }).then(function (s) {
        if (s && s.url) { window.location = s.url; }
        else { throw new Error((s && s.error) || 'We couldn’t start the payment, please try again.'); }
      });
    }).catch(function (e) {
      pay.disabled = false; label.textContent = old;
      alert(e.message || 'Something went wrong, please try again.');
    });
  }

  // ---------- wire up ----------
  document.addEventListener('DOMContentLoaded', function () {
    setupGate();

    // care-home name shows only for care_home / hospice
    $('living_in').addEventListener('change', function () {
      var need = this.value === 'care_home' || this.value === 'hospice';
      $('care-home-field').toggleAttribute('hidden', !need);
    });

    $('gift_code').addEventListener('input', onGiftInput);

    $('co-next').addEventListener('click', function () {
      if (validateStep(state.step)) showStep(state.step + 1);
    });
    $('co-back').addEventListener('click', function () { showStep(state.step - 1); });
    $('co-pay').addEventListener('click', submit);

    // returning from a cancelled Stripe checkout
    if (/[?&]cancelled=1/.test(location.search)) { $('co-cancelled').hidden = false; showStep(3); }

    applySummary();
  });
})();
