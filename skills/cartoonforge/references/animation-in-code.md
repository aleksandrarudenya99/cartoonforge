# Animation in code: cheatsheet

## Timing

| Thing | Value |
|---|---|
| Film fps | 24 |
| Drawings per second | 12 ("on twos"): `t = Toon.onTwos(tRaw)` |
| Fast action | on ones: use `tRaw` directly for that part |
| Beat at 120 bpm | 0.5 s — step, bounce and sway on the beat |
| Hold a pose | ≥ 0.3 s, or the eye doesn't register it |
| Blink | ~0.15 s total, close fast, open slower |
| Reel length | 10–15 s; hook in the first 1.5 s |

## The principles that matter most, in code

**Squash & stretch.** Volume stays constant: `Toon.squash(a)` returns `{sx, sy}`.
Stretch along the motion when fast (`+0.3` taking off), squash on impact (`-0.35` landing).

**Anticipation.** Before a jump: crouch down (squash −0.25), arms back, 0.4–0.6 s. Then go.

**Follow-through & settle.** After landing, overshoot and settle: key the last segment with
`"outElastic"`. Loose parts (sprout, hair, tail) lag the body: drive them with `sin(t·k)` plus a
kick that peaks after the main action.

**Arcs.** Nothing moves in straight lines: give jumps an up `outQuad` and a down `inQuad`;
swing arms with `sin`.

**Slow in / slow out.** Default ease for keys is `inOutSine`. Use `outBack` for a snappy pose.

**Staging.** One action at a time, in the centre third, silhouette readable. Freeze background
motion to a gentle bounce while the character acts.

**Secondary action.** The world reacts: trees sway, flowers bounce on the beat.

## Keyframes

```js
const x = Toon.track(t, [
  [1.6, -260],              // off-screen left
  [4.4, 470, "outQuad"],    // arrive and slow down
]);
```
The ease on a key shapes the segment that arrives at that key.

## Determinism checklist
- [ ] no `Math.random`, `Date.now`, `performance.now`
- [ ] no CSS `animation`/`transition`
- [ ] every visible attribute is set inside `render(t)` (or once at build)
- [ ] seeded randomness keyed by drawing or frame index
