# Nellie homepage rework

A rebuilt version of https://nellie-homepage-version1.netlify.app/ as a single static page: fully responsive, with 3D and motion elements layered over the original content and brand.

## What's here

- `index.html`, the whole site. No build step, no framework, vanilla CSS and JS in one file.
- `nellie/images/` and `nellie/icons/`, the original assets downloaded from the live site (same paths the original used).
- `original.html` + `nellie-original.css`, a local mirror of the original page kept for side-by-side reference. Not needed in production.

## Motion and 3D inventory

- Hero: slow Ken Burns drift on the photo, scroll parallax, word-by-word headline rise, and floating notification chips at three depths that follow the mouse (damped, pointer-fine devices only).
- Feature and step cards: 3D tilt following the pointer with a glare highlight, icons raised on translateZ.
- Key features: a 3D coverflow carousel (drag/swipe, arrows, dots, arrow keys, gentle auto-advance that stops on first interaction).
- Scroll-triggered reveals everywhere via IntersectionObserver, with staggered delays.
- Count-up on the "8 million" stat, animated aurora gradient on the CTA band, header that hides on scroll down and returns on scroll up, full-screen mobile menu with staggered links.
- All of it is disabled under `prefers-reduced-motion`, and the page renders fully with JS off.

## Deploy

It's a plain static folder. Drag it into Netlify (or `netlify deploy`), or serve it from any static host. Test locally with `python3 -m http.server` from this directory.
