# Nellie website rework

A rebuild of the Nellie site to the V4 design comps (the Illustrator artboards in `Nellie-Website-V4_Folder` on Google Drive): fully responsive, with 3D and motion elements layered over the brand. Three pages, no build step, no framework.

## What's here

- `index.html`, the homepage (hero, features bar, why nellie, who is nellie for, 6-slide key-features slider, how nellie helps, 3 steps, CTA).
- `how-it-works.html`, the nellie connect page (app hero, 6 app-screen feature cards, family connection collage, gentle insights quote bubbles, intentionally simple, CTA).
- `pricing.html`, pricing + FAQs (two-tone hero, how-to-purchase columns with products and perks, 3 steps, FAQ accordion, photo CTA band).
- `assets/site.css` + `assets/site.js`, shared styles and the motion layer (reveals, parallax, floating chips, slider, tilt cards, scrollspy, accordion). Page-specific tweaks live in a small `<style>` block per page.
- `nellie/images/` + `nellie/icons/`, all imagery: the original live-site assets plus everything extracted from the V4 design SVGs (hero compositions, app screens, product cutouts, the who-is-nellie-for photo, FAQ illustration).
- `design.svg`, `design-about.svg`, `design-pricing.svg` + `viewer*.html` + `original.html`/`nellie-original.css`, reference copies of the comps and the original site. NOT for production, delete or exclude before deploying.

## Motion inventory

Scroll-triggered staggered reveals, hero Ken Burns + scroll parallax + word-by-word headline, floating notification chips with damped mouse parallax (pointer-fine only), crossfading full-bleed slider with per-slide caption sides and overlaid nav (drag/swipe/keys/dots, auto-advance until first interaction), 3D tilt on step cards, count-up stat, scrollspy nav highlight, one-open FAQ accordion. Everything disables under `prefers-reduced-motion` and the pages render fully with JS off.

## Things to review before launch

- FAQ answers on the pricing page were drafted by us, the design file only carries the questions.
- The Google Play / App Store badges on how-it-works are styled text placeholders, swap in the official badge SVGs.
- The design shows both "Lifetime warranty" (tablet feature list) and "12 month warranty" (perk chip); both are reproduced as-is.
- The icon set ships white, repainted purple via CSS filter for the outline-circle styles; purple SVG exports would be cleaner.

## Deploy

Static folder, any host. Test locally with `python3 -m http.server` from this directory. If deploying by dragging to Netlify, remove the design reference files first (they're ~75 MB of SVG).
