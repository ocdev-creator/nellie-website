/* ================================================================
   Analytics + cookie consent (PostHog, EU cloud).

   GDPR / PECR first: PostHog is cookie based, so it loads ONLY after
   the visitor clicks Accept. Before that, nothing is sent and no
   analytics cookies or storage are touched. The consent choice itself
   is kept in localStorage (a strictly-necessary preference, allowed
   without consent), so the banner doesn't nag on every page.

   One self-contained file, added to every page (it is deliberately
   NOT part of site.js, the motion layer, which the subscribe and
   success pages don't load). No build step.

   To switch analytics on, paste your PUBLIC project key below. It is
   the write-only ingestion key (phc_...), designed to live in client
   HTML, so it is safe here, just like the TMDB key elsewhere. Find it
   in PostHog: Project Settings, API keys.
   ================================================================ */
(function(){
  'use strict';

  /* ---------- config ---------- */
  var POSTHOG_KEY  = 'phc_unQoQeGEjiuukRR6qAFLhB3HtEfqJ8owD2gKdfaTPvuz'; // public project token (write-only, safe client-side)
  var POSTHOG_HOST = 'https://eu.i.posthog.com';          // EU cloud
  var STORE_KEY    = 'nellie_cookie_consent';             // 'granted' | 'denied'

  function getConsent(){ try { return localStorage.getItem(STORE_KEY); } catch(e){ return null; } }
  function setConsent(v){ try { localStorage.setItem(STORE_KEY, v); } catch(e){} }
  function keyIsSet(){ return POSTHOG_KEY.indexOf('phc_') === 0 && POSTHOG_KEY.indexOf('REPLACE') === -1; }

  var loaded = false;

  /* Load posthog-js and initialise it. Called only with consent. The
     official loader fetches array.js from the matching EU assets host. */
  function loadPostHog(){
    if(loaded) { if(window.posthog && window.posthog.opt_in_capturing) window.posthog.opt_in_capturing(); return; }
    if(!keyIsSet()){
      console.info('[nellie] Analytics off: add your phc_ project key in assets/analytics.js.');
      return;
    }
    loaded = true;
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    window.posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only', // anonymous traffic doesn't create person profiles (cheaper, leaner)
      capture_pageview: true,
      capture_pageleave: true
    });
  }

  /* Withdraw consent within the session: stop capturing and clear state. */
  function stopPostHog(){
    if(loaded && window.posthog && window.posthog.opt_out_capturing){
      try { window.posthog.opt_out_capturing(); window.posthog.reset(); } catch(e){}
    }
  }

  /* ---------- consent banner ---------- */
  function buildBanner(){
    if(document.querySelector('.cookie-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie consent');
    bar.innerHTML =
      '<div class="cookie-bar-inner">' +
        '<p class="cookie-bar-text">We use a few cookies to see how people use nellie, so we can keep making it gentler and easier. ' +
          'You can change your mind any time. <a href="cookies.html">Read our cookie policy</a>.</p>' +
        '<div class="cookie-bar-actions">' +
          '<button type="button" class="cookie-decline">Decline</button>' +
          '<button type="button" class="btn btn-primary cookie-accept">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bar);
    requestAnimationFrame(function(){ bar.classList.add('show'); });

    bar.querySelector('.cookie-accept').addEventListener('click', function(){
      setConsent('granted'); loadPostHog(); dismiss(bar);
    });
    bar.querySelector('.cookie-decline').addEventListener('click', function(){
      setConsent('denied'); stopPostHog(); dismiss(bar);
    });
  }

  function dismiss(bar){
    bar.classList.remove('show');
    setTimeout(function(){ if(bar.parentNode) bar.parentNode.removeChild(bar); }, 450);
  }

  /* ---------- boot ---------- */
  function init(){
    var c = getConsent();
    if(c === 'granted') loadPostHog();
    else if(c !== 'denied') buildBanner();
    // (denied: respect the choice, load nothing)

    // Any element with data-cookie-settings (e.g. a "Manage cookies" link)
    // reopens the banner so consent can be reviewed or withdrawn.
    document.addEventListener('click', function(ev){
      var t = ev.target.closest ? ev.target.closest('[data-cookie-settings]') : null;
      if(t){ ev.preventDefault(); buildBanner(); }
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
