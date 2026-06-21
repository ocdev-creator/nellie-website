# Nellie — brand kit for claude.ai/design

Paste the relevant parts of this into a claude.ai/design prompt (or any design
agent) so it designs on-brand. Values are from the official Nellie Brand Toolkit,
cross-checked against the live site's `assets/site-v2.css`.

UK English throughout. No em-dashes or en-dashes, use commas. Warm, gentle,
reassuring tone. Brand line: **"a gentle way to stay close."**

---

## Colour palette

| Role | Hex | Token | Use |
|---|---|---|---|
| Primary | `#3e0a6e` | `--nc-primary` | Headings + body text on light backgrounds; the dark brand purple |
| Primary Light | `#5c1a8c` | `--nc-primary-light` | Secondary purple, badges, secondary text |
| Primary Soft | `#e4b8f5` | `--nc-primary-soft` | Soft lilac fills, light gradient start |
| UI Pink | `#f1d2fc` | — | Very light pink surfaces, chips |
| Card | `#fef0fe` | `--nc-card` | Lightest pink, section + card backgrounds |
| Accent 1 | `#7e37ca` | `--nc-accent-1` | Deep violet accent |
| Accent 2 | `#c866e9` | `--nc-accent-2` | The bright pink, primary accent + word highlights, tick badges, primary buttons |
| Accent 3 | `#e67cf2` | `--nc-accent-3` | Bright orchid accent |

- **Text** is Primary `#3e0a6e` on light backgrounds, white `#ffffff` on dark/accent.
- **Highlight specific words** in headings with Accent 2 `#c866e9`.
- The dark header/footer use a purple gradient; cards are white or `#fef0fe`.

## Gradients

Linear (left -> right):
- **Dark** `#3e0a6e -> #7e37ca`
- **Medium** `#5c1a8c -> #e67cf2`
- **Soft** `#7e37ca -> #e67cf2`
- **Light** `#e4b8f5 -> #fef0fe`

The same four exist as radial. The header/hero use a Dark/Medium feel; section
backgrounds use Light (`#e4b8f5 -> #fef0fe`).

## Typography

- **Headings:** Nunito, weight 600 (semibold) default, 700/800 for emphasis. Rounded, friendly.
- **Body:** Nunito Sans, weight 500-700.
- Large headings sit slightly looser; copy avoids orphans (keep last word company).
- Both are Google Fonts: `Nunito` and `Nunito Sans`.

## Logo

- The mark is a rounded **"N" monogram** drawn in the brand gradient (violet to pink).
- Wordmark **"nellie"** in Nunito, lowercase. On dark backgrounds the wordmark is white; the mark keeps its gradient.
- Sub-brand lockup: **nellie** in Primary + the suffix (e.g. **connect**) in Accent 2, set tight with no space, e.g. `nellieconnect`.

## Imagery

- Warm, natural **lifestyle photography**: older people and multi-generational families at home, using the purple-cased nellie tablet, soft daylight, cosy interiors.
- **Diverse headshots** of older adults and family members, friendly and real (not stocky).
- Pale lilac/pink backdrops; the purple tablet is the recurring hero object.
- Avoid cold, clinical or "tech" imagery. The feeling is calm, familiar, comforting.

## Shape, depth, motion

- **Radii:** generous and rounded. Pills/buttons are fully rounded (`border-radius: 999px`); cards ~20-32px; the feature bar is a perfect lozenge.
- **Shadows:** soft and purple-tinted, e.g. `0 24px 60px rgba(67,16,111,.16)`.
- **Tick badges:** a filled circle in Accent 2 `#c866e9` with a white checkmark (not a flat dot).
- Motion is gentle (soft reveals, easing); never flashy.

## Component recipes (from the live site)

- **Primary button:** gradient violet pill, white text + small icon, fully rounded. Bright variant = solid `#c866e9`; deep variant = solid `#7e37ca`.
- **Pill / chip:** soft lilac (`#e4b8f5` or `#f1d2fc`) rounded pill, Primary text, often with a small kicker label.
- **Feature lozenge:** a full-width white perfect-lozenge holding a row of items, each an icon-circle + 2-3 lines of copy, with a small accent pill perched on its top-left.
- **Tick list:** Accent 2 circle + white check, Primary text, semibold.
- **Kicker:** small uppercase label in Accent 2 with a short underline rule, above a heading.

---

## Paste-ready CSS tokens

```css
:root {
  /* palette */
  --nc-primary: #3e0a6e;
  --nc-primary-light: #5c1a8c;
  --nc-primary-soft: #e4b8f5;
  --nc-ui-pink: #f1d2fc;
  --nc-card: #fef0fe;
  --nc-accent-1: #7e37ca;
  --nc-accent-2: #c866e9;
  --nc-accent-3: #e67cf2;
  --nc-text: #3e0a6e;
  --nc-text-inverse: #ffffff;

  /* gradients */
  --nc-grad-dark: linear-gradient(120deg, #3e0a6e, #7e37ca);
  --nc-grad-medium: linear-gradient(120deg, #5c1a8c, #e67cf2);
  --nc-grad-soft: linear-gradient(120deg, #7e37ca, #e67cf2);
  --nc-grad-light: linear-gradient(180deg, #e4b8f5, #fef0fe);

  /* type */
  --nc-font-display: "Nunito", system-ui, sans-serif;
  --nc-font-body: "Nunito Sans", system-ui, sans-serif;

  /* shape + depth */
  --nc-radius-pill: 999px;
  --nc-radius-card: 28px;
  --nc-shadow-card: 0 24px 60px rgba(67, 16, 111, .16);
}
```

## One-paragraph brief (for a prompt)

> Design for **Nellie**, a gentle tablet that keeps older loved ones connected to
> family. Tone: warm, calm, reassuring, UK English, no em-dashes. Use the Nellie
> palette (primary purple `#3e0a6e`, bright pink accent `#c866e9`, soft lilac
> `#e4b8f5`, pale pink surfaces `#fef0fe`) with soft purple gradients. Headings in
> Nunito, body in Nunito Sans. Fully rounded pill buttons, generously rounded
> cards, soft purple-tinted shadows, tick badges as a pink circle with a white
> check. Imagery: warm lifestyle photos of older people and families using the
> purple tablet at home. The brand line is "a gentle way to stay close."
