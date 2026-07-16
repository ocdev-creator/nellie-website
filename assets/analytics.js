/* ================================================================
   Analytics: Plausible (privacy-first, cookieless).

   Plausible sets NO cookies, stores nothing on the device and collects
   no personal data, so under GDPR / PECR it needs no consent banner:
   it loads for every visitor. That is why there is no cookie-bar here
   any more (we moved off PostHog, which was cookie based and had to be
   gated behind Accept).

   Loaded on the PUBLIC site only, so the password-protected preview at
   *.netlify.app and local dev don't pollute the numbers. For data to
   appear, add the site under "nellieconnect.co.uk" in the Plausible
   dashboard (Plausible ignores traffic from unregistered domains).

   One self-contained file, included on every page. No build step.
   ================================================================ */
(function () {
  'use strict';

  // Only count the real public domain (+ its www), never the internal
  // preview host or localhost.
  var PUBLIC_HOSTS = ['nellieconnect.co.uk', 'www.nellieconnect.co.uk'];
  if (PUBLIC_HOSTS.indexOf(location.hostname) === -1) return;

  var s = document.createElement('script');
  s.defer = true;
  s.setAttribute('data-domain', 'nellieconnect.co.uk');
  s.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(s);
})();
