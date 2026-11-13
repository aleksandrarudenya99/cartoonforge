# Building a style pack

A cartoon style is five layers. Write each one down before coding.

| Layer | Question to answer | Lives in |
|---|---|---|
| Shape & line | What do bodies, limbs, eyes look like? Line weight? | README + skin passed to the rig |
| Palette | 3–6 colours, hex | `palette` |
| Timing | Ones or twos? Holds? Beat? | `motion` |
| Principles | How much squash, how snappy? | README (rules for films) |
| Texture | Grain, halftone, paper, boil, print offset? | `install()` → `update(t)` |

## Steps
1. Research the style: era, studios, 3–5 defining traits. Describe them in your own words; never
   copy a studio's characters.
2. `cp -r runtime/styles/rubber-hose-1930 runtime/styles/<slug>`
3. Write `README.md`: the table above + do/don't + Reels notes.
4. Write `style.js`. Contract:
   ```js
   Toon.styles["<slug>"] = {
     palette: { ink, white, … },          // at least ink + white (the rig needs them)
     motion:  { drawingsPerSecond, filmFps, bpm, lineWidth },
     caption: { y, size, font, weight, style, fill, stroke, strokeWidth, maxWidth },  // era lettering
     install(svg, { width, height }) {    // build defs + layers once
       return { scene, overlay, update };  // update(t) is pure
     },
   };
   ```
   `scene` is where films draw; `overlay` is above it (title cards, irises), not affected by
   scene-level filters.
5. Write `style.json` (read by audio.mjs and the gallery):
   ```json
   { "slug": "<slug>", "name": "…", "era": "1950s", "group": "Vintage|World|TV|Anime|Feature|Modern",
     "tagline": "one line for the gallery",
     "tags": [], "music": { "genre": "ragtime|lofi", "bpm": 120, "lofi": "gramophone|none" },
     "voice": { "speed": 1.0, "fx": "gramophone|radio|cartoon|chipmunk|none" },
     "subtitle": "shown on the title card" }
   ```
   New music genre? Add it to `scripts/lib/synth.mjs` (`compose`), keep it original.
6. Scaffold a film with `--style <slug>`, re-skin Pip, render a draft, review the contact sheet.
7. In the repo: `npm run showcase -- <slug>` → example film, GIF, gallery tile, Pages.

## Use the shared pieces — don't re-implement
- Textures / layers: `Toon.fx.stack(svg, …, (fx, L) => [fx.grain(L), fx.boil(L), …])` — see `core/fx.js`.
- Scenery shapes: `Toon.shapes.ridge / cloud / spiral / star / brush / wave / poly` — see `core/shapes.js`.
- Title / end cards and transitions come from `style.cards` via `core/scenes.js`.
- Music: pick a genre from `scripts/lib/audio/genres.mjs`; a new one is a data recipe in `RECIPES`.
- Voice / music treatment: a preset name from `scripts/lib/audio/fx.mjs`.
- `skin.shading`: one of none · cel · hatch · halftone · black · paper · soft3d · gloss · pixel.

## Texture recipes (SVG)
- **Line boil**: `feTurbulence` (baseFrequency ≈ 0.02) → `feDisplacementMap` (scale 3–6), change `seed` per drawing.
- **Grain**: `feTurbulence` (≈ 0.8) → `feColorMatrix` to alpha, overlay with `mix-blend-mode: multiply`, seed per frame.
- **Halftone**: a `<pattern>` of dots used as a fill or mask.
- **Paper**: low-frequency turbulence lighting (`feDiffuseLighting`) on the background.
- **Misregistration (print)**: draw the fill layer offset 3–6 px from the ink layer.
