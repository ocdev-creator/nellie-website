#!/usr/bin/env bash
# Netlify build: stage ONLY the public site into _site/ so the
# reference files kept in the repo (original.html, the viewer*.html
# comparison pages, nellie-original.css, and the design SVGs) never
# reach the public CDN. Mirrors the oc-vibe-studio netlify-build.sh
# pattern: source and working files live in git, only the real site
# deploys.
set -euo pipefail

rm -rf _site
mkdir -p _site

# the three pages
cp index.html how-it-works.html pricing.html _site/
cp index-v2.html how-it-works-v2.html pricing-v2.html _site/

# shared styles + script, and all imagery / icons
cp -r assets nellie _site/

echo "Staged public site into _site/:"
find _site -type f | sort
