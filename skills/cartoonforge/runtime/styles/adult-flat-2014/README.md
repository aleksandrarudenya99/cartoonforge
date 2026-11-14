# Adult Flat Comedy · 2010s (layered pilot)

Genre look of adult animated sitcoms: flat colour, a thin even black line, deadpan acting,
mundane suburbia colliding with acid sci-fi. Genre traits only — no specific show's characters,
devices or locations.

| File | Part |
|---|---|
| `style.js` | theme, captions, cards, fx; loads everything and dispatches to the chosen **set** |
| `props.js` | the drawing vocabulary of the backgrounds (airbrush shade, cloud bands, contours, tufts, candy trees, pools, spires, crystals, pictures, curtains, lamps, pipes, hazard doors, glyphs, cracks, bricks…) |
| `character.js` | HOW characters are drawn (proportions, eyes, mouth, hands, line, contact shadow) |
| `motion.js` | timing, talking, blinking, walk, transitions |
| `sets/<name>/background.js` | sky / far scenery / architecture |
| `sets/<name>/details.js` | mid-ground props behind the characters |
| `sets/<name>/foreground.js` | things in front of the characters, usually cut by the frame |

## Sets (pick one with `CF.scene`)

| Set | Place |
|---|---|
| `street` | suburban street at night under an alien sky, dimensional tear (default) |
| `alley` | grimy back alley framing a view onto a city street, cracks, trash, the tear |
| `home` | family room: cream walls, plank floor, arched doorway, curtained window, pictures |
| `garage` | cluttered garage: washer/dryer, utility sink, shelving with junk, open kitchen door |
| `desert` | yellow-green sky, lavender hills, candy trees, pink ring pools |
| `dusk` | orange sky, streaky giant planet, ringed planet with spore trail, spires, crystals |
| `station` | pale sci-fi corridor: pipe ribs, hazard doors, alien-glyph ad, glass tube |

## Background rules (from the reference study)
- Same thin black line as the characters; many lines left **open** (ground contours, folds).
- Flat fills; depth comes from **airbrush shading** that breaks into speckle as it fades
  (ceilings, corners, hill bases, pool rims, stains on walls).
- Skies: smooth gradient + long flat cloud bands in a darker tone of the sky.
- Lots of small everyday clutter that carries jokes; big props cut by the frame edges.
- Characters cast a soft flat contact shadow.
