#!/usr/bin/env bash
# Netlify build: stage ONLY the public site into _site/ so the
# reference files kept in the repo (original.html, the viewer*.html
# comparison pages, nellie-original.css, and the design SVGs) never
# reach the public CDN. Mirrors the oc-vibe-studio netlify-build.sh
# pattern: source and working files live in git, only the real site
# deploys.
#
# SITE_MODE picks which variant this site builds (set it in the Netlify
# site's environment variables, it defaults to the full site):
#
#   full   (default) - the real product site with ordering + Stripe
#                      checkout ON. This is what the password-protected
#                      dev.nellieconnect.co.uk site builds.
#
#   market           - the public, pre-launch "register your interest"
#                      site. Every buy/checkout CTA is rewritten to point
#                      at register.html, the checkout pages (subscribe /
#                      success) become redirects to it, and the Stripe
#                      checkout function refuses to run (it also checks
#                      SITE_MODE, see netlify/functions/create-checkout-session.js).
#                      So NO order can physically be placed. One codebase,
#                      two deploys: design changes flow to both automatically.
set -euo pipefail

SITE_MODE="${SITE_MODE:-full}"

rm -rf _site
mkdir -p _site

# the public pages (the v2 redesign is now the live site) plus the purchase
# flow (subscribe form + post-payment success page), the register-interest
# page (the market build's gated replacement for checkout), the contact page
# and the coming-soon placeholder (legal links point at it)
cp index.html how-it-works.html pricing.html subscribe.html success.html \
   register.html contact.html coming-soon.html terms.html privacy.html \
   cookies.html _site/

# shared styles + script, and all imagery / icons
cp -r assets nellie _site/

if [ "$SITE_MODE" = "market" ]; then
  echo "SITE_MODE=market -> building the gated register-interest variant"

  # 1. Tag every page so CSS/JS can react to market mode. This is what
  #    reveals the pre-launch note that ships hidden in the source.
  for f in _site/*.html; do
    perl -0777 -i -pe 's/<html lang="en">/<html lang="en" data-mode="market">/' "$f"
  done

  # 2. Rewrite the ordering CTAs on the pricing page: every buy/get button
  #    becomes "register your interest" and points at register.html instead
  #    of the Stripe checkout. Each replace is anchored on the button's own
  #    icon so it can only ever hit a real button, never body copy. The two
  #    purchase-flavoured headings soften too.
  perl -0777 -i -pe '
    s{(<img src="nellie/icons/present\.svg" alt="">)buy tablet}{${1}register your interest}g;
    s{(<img src="nellie/icons/link\.svg" alt="">)get <span class="nowrap">nellieconnect</span>}{${1}register your interest}g;
    s{(<img src="nellie/icons/get-started\.svg" alt="">)buy nellie}{${1}register your interest}g;
    s{>buy the nellie tablet<}{>the nellie tablet<}g;
    s{how to purchase}{what you get}g;
    s{href="subscribe\.html"}{href="register.html"}g;
  ' _site/pricing.html

  # 3. Neutralise the checkout pages themselves, so a stale link, a search
  #    result or a typed URL cannot reach a payment screen: both redirect to
  #    the register-interest page.
  for page in subscribe success; do
    cat > "_site/${page}.html" <<'EOF'
<!DOCTYPE html>
<html lang="en" data-mode="market">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#3d076b">
<meta name="robots" content="noindex">
<title>Register your interest | Nellie</title>
<meta http-equiv="refresh" content="0; url=register.html">
<link rel="canonical" href="register.html">
</head>
<body>
<p>nellie is launching soon. <a href="register.html">Register your interest</a>.</p>
<script>location.replace('register.html');</script>
</body>
</html>
EOF
  done
fi

echo "Staged public site into _site/ (SITE_MODE=$SITE_MODE):"
find _site -type f | sort
