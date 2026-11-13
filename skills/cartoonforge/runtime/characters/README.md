# Characters

**Characters come from the user.** cartoonforge has no house mascot: the user brings their own
characters (a description, a sketch or a photo of a toy / pet / themselves) and the idea, then picks a
style. The style decides *how* any character is drawn; the character decides *who* is on screen.

## Character spec (what to collect from the user)

Write it to `cartoons/<film>/characters/<name>.json` before animating:

```jsonc
{
  "name": "Mila",
  "kind": "human",              // human | animal | creature | object
  "build": "small, round",      // silhouette in a few words
  "head": "big round head, short bob haircut",
  "features": ["freckles", "round glasses"],
  "colors": { "main": "#3b6fd1", "skin": "#f2c7a5", "hair": "#2a1d14", "accent": "#e8564b" },
  "outfit": "yellow raincoat, red boots",
  "personality": "curious, jumpy",           // drives how they move
  "reference": "mila.jpg"                     // optional image the user sent
}
```

Rules:
- Only the user's own / original characters. If the user asks for a famous character, offer an original
  one with a similar *role* instead.
- Keep the user's colours; the style supplies outline, shading mode and texture (`style.skin`).

## How a style skins a character — `style.skin`

| Field | Meaning |
|---|---|
| `outline`, `lineWidth` | outline colour / weight (`null` = no outline: 3D-look, cut-out, silhouette) |
| `shading` | `none` · `cel` · `hatch` · `halftone` · `black` · `paper` · `soft3d` · `gloss` · `pixel` |
| `shadow`, `key`, `rim`, `specular` | colours used by that shading mode |
| `body`, `head`, `face`, `eye`, … | default fills — **replaced by the user's character colours** |

## Rig kit (status)

- `pip/rig.js` — the reference rig used for tests (round body, hose limbs, `pose()` API). It is a test
  dummy, not a product character.
- Next (roadmap phase 4): a rig kit that builds a character from the spec above out of shared body parts
  (heads, bodies, limbs, hair, ears, tails, accessories) and applies the style's `shading` mode. Until then,
  the agent draws the user's character as a new rig in `cartoons/<film>/characters/<name>.js` following
  the same `build(parent, skin) → { pose(p) }` contract as `pip/rig.js`.
