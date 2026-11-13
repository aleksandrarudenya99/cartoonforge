---
name: toon-film
description: Make a short vertical cartoon film in this repo (cartoonforge) in one of its style packs. Use when asked for a reel, cartoon, short or animation "in style X about Y".
---

# Making a cartoonforge film

## 1. Pick the style
List `styles/*/README.md` and read the chosen one fully: it defines palette, timing and texture.
If the user names a style that doesn't exist yet, say so and offer the closest one or to create the pack first.

## 2. Write a beat sheet before code
10–15 s for a Reel. 4–7 beats, each with a time range and one clear action. Always:
- open with a hook in the first 1.5 s (title card, a gag, or motion)
- hold a pose before every big action (anticipation), let it settle after (follow-through)
- end with a card or a loopable pose

## 3. Build the film
- Copy `films/hello-pip/` to `films/<slug>/` and edit.
- Keep the script order: gsap → `core/toon.js` → `styles/<style>/style.js` → `characters/<name>/rig.js`.
- Everything visible is a pure function of time inside `render(t)`. Call `look.update(tRaw)` first,
  then use `Toon.onTwos(tRaw)` for character motion.
- Use `Toon.track()` for keyframes, `Toon.squash()` for squash & stretch, `Toon.hose()` for limbs,
  `Toon.rng(seed)` / `Toon.noise()` for randomness. Never `Math.random()` or `Date.now()`.
- Canvas is 1080×1920. Keep important action between y≈500 and y≈1500 (Reels UI safe zone).

## 4. Check and render
- `npm run render:draft -- <slug>`; if Chrome is missing set `HYPERFRAMES_BROWSER_PATH`.
- Extract 8–10 frames with ffmpeg into a contact sheet and LOOK at it before calling it done:
  is the character on screen, readable, on model, and is every beat visible?
- Final: `npm run render -- <slug>`.

## 5. Rules
- Original characters only. No studio characters, logos or famous catchphrases.
- New reusable motion goes into `core/toon.js`; new look rules go into the style pack, not the film.
