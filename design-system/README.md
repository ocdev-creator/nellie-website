# Nellie design system → Claude Design

This package re-expresses the Nellie Connect marketing site's UI as real React
components, then syncs them to **claude.ai/design** so the design agent builds
every Nellie design from the brand's own parts (and the brand's own photos),
not generic ones. Source of truth for styling is the live site one level up
(`../assets/site-v2.css`).

## What's in it

14 components, all rendering against `src/nellie.css` (brand tokens + classes):

| | |
|---|---|
| **Button** | pill, 5 variants (primary / deep / bright / grape / ghost), 3 sizes |
| **Kicker** | uppercase label with accent underline |
| **Heading** + **Highlight** | display heading with a pink accent phrase |
| **Pill** | chips: lilac / pink / solid / accent / tag / perk |
| **Icon** | 15-icon line set, currentColor |
| **IconCircle** | filled badge, 5 tones, 3 sizes |
| **Card** | rounded surface, white / soft |
| **TickList** | pink tick badges |
| **FeatureBar** | the signature hero lozenge |
| **PhotoCircle** | circular portrait + accent ring (master photo) |
| **StepCard** | numbered step card (master photo) |
| **PlanCard** | pricing plan card (master photo) |
| **LogoLockup** | the nellie / nellieconnect wordmark |

`media` carries a curated set of the site's **master photographs**, inlined as
data-URIs, so anything built with the system uses real Nellie imagery.

## Build

```bash
npm install
npm run build      # gen-media (sips resize + inline) → tsc (.d.ts) → esbuild bundle
```

Outputs `dist/index.es.js` (+ `dist/nellie.css`). `src/media.ts` is generated
and gitignored; the build regenerates it from `../nellie/images/`.

## Sync to Claude Design

The sync is driven by the bundled **`/design-sync`** skill and needs a
claude.ai login, which only works in the **standalone `claude` Terminal CLI**
(not the desktop/app session). The library, config, previews and a verified
`ds-bundle/` are already built on disk, so from this folder it's quick:

```bash
cd design-system
claude            # the standalone CLI, in this folder
/login            # choose the claude.ai login (grants design scopes)
/design-sync      # reuses design-sync.config.json + the committed previews
```

`/design-sync` will: rebuild deterministically, render-check the previews
(installing chromium if needed), reuse the authored previews in
`.design-sync/previews/`, create a new design-system project (or let you pick
one), and upload. Approve the upload prompt when it appears. The project URL is
printed at the end.

Everything verified locally already: all 14 components render cleanly and every
preview cell is graded good. To eyeball the cards yourself first:

```bash
node .ds-sync/storybook/http-serve.mjs ./ds-bundle   # then open the .review.html URL it prints
```

## Notes

Repo-specific gotchas for re-syncs live in `.design-sync/NOTES.md`.
