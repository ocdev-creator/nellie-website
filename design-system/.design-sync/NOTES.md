# Nellie design system, sync notes

Repo-specific gotchas for `/design-sync`. Append as you learn things.

- **This package is purpose-built for Claude Design**, not consumed by the
  marketing site itself. The site is plain HTML + `assets/site-v2.css`; this
  `design-system/` package re-expresses those same components as real React so
  the design agent can build with them. Source of truth for styling is the live
  `assets/site-v2.css` one level up.
- **Build**: `npm run build` runs `gen-media.mjs` (resizes + inlines the master
  photos via macOS `sips`), then `tsc` (declarations only), then `build.mjs`
  (esbuild ESM bundle, React external; copies `nellie.css` to `dist/`).
  `src/media.ts` is GENERATED and gitignored, so a fresh clone MUST run the
  build before the converter (it needs `dist/index.es.js`). `sips` is macOS-only;
  on a Linux runner the media step would need a swap-in (sharp/imagemagick).
- **Entry**: `dist/index.es.js`. `--node-modules ./node_modules` (the package's
  own, where react resolves). Pass `--entry ./dist/index.es.js`.
- **CSS**: `cssEntry = dist/nellie.css` defines the `:root` brand tokens AND all
  `.nc-*` component classes, so there is no separate tokens package.
- **Fonts**: `nellie.css` `@import`s Nunito + Nunito Sans from Google Fonts, so
  validate will print `[FONT_REMOTE]` (informational, loads at runtime). No fonts
  are shipped in the bundle by design, do NOT chase `[FONT_MISSING]` into a swap.
- **Imagery**: the master photos live inlined as data-URIs in the bundle (via
  `media`), so the bundle is ~3 MB. That's deliberate, real Nellie photography
  travels with the system so designs never reach for stock. Components that show
  a photo default to a `media.*` master.

## Re-sync risks
- `src/media.ts` is regenerated each build from `nellie/images/`; if a master
  photo is renamed/removed, update `gen-media.mjs`'s `SET` list or the build
  drops that key.
- The bundle hash changes whenever any master photo changes (new base64), which
  will mark every component as "upload" on the next diff even if no render
  changed. Expected, not a regression.
