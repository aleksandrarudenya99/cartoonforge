# Rubber Hose · 1930

American cartoons of roughly 1923–1937. Named after the limbs: arms and legs are one
smooth curve with no elbow or knee, bending like a garden hose.

## What defines the look

| Layer | Rule | In code |
|---|---|---|
| Shape | round bodies, circle heads, hose limbs, white gloves, big shoes | `Toon.hose()` for every limb |
| Eyes | tall black ovals with a "pie-cut" wedge highlight | wedge path in the rig |
| Palette | black ink on warm paper, one mid grey, no colour | `palette` |
| Timing | on twos (12 drawings/s), everything bounces to the music (~120 bpm) | `motion.drawingsPerSecond`, `motion.bpm` |
| Principles | huge squash & stretch, anticipation before every jump | `Toon.squash()`, `track()` |
| Texture | line boil, film grain, dust, scratches, flicker, gate weave, vignette | `install()` → `update(t)` |
| Editing | title card, iris in / iris out, "The End" card | film overlay |

## Do / don't

- Do make the *world* dance: trees, flowers and clouds squash on the beat.
- Do hold poses (blink, look at camera) between big actions.
- Don't use colour or gradients inside characters.
- Don't copy period characters (mice with round ears, a famous cat, a famous flapper). Invent your own.

## Reels notes

Keep the character between y ≈ 500 and y ≈ 1500 of the 1080×1920 frame: the top and bottom
are covered by Instagram's UI.
