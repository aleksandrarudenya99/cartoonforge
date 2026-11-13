# cartoonforge

**Cartoons drawn entirely in code — in the styles that made animation history.**

No video model, no stock footage, no After Effects. Every frame is SVG/Canvas drawn by
code, captured by headless Chrome and encoded by FFmpeg. Built to be driven by coding
agents (Claude Code and friends) and tuned for vertical 9:16 Reels / Shorts / TikTok.

| | |
|---|---|
| Engine | [HyperFrames](https://github.com/heygen-com/hyperframes) (Apache-2.0): HTML → MP4 |
| Clock | [GSAP](https://gsap.com) timeline, used only as a seekable clock |
| Drawing | plain SVG + `core/toon.js` (no dependencies) |
| License | MIT |

## Idea

A cartoon style is not a filter. It is five layers, and each one is code:

1. **Shape & line** — rubber-hose limbs, flat UPA shapes, cut-out pins…
2. **Palette** — 3–6 colours per style.
3. **Timing** — animate *on twos* (12 drawings/s), hold poses, bounce to the beat.
4. **Animation principles** — squash & stretch, anticipation, follow-through, arcs.
5. **Film texture** — line boil, grain, dirt, flicker, gate weave, halftone…

So the project is split the same way:

```
core/toon.js                 pure helpers: onTwos, track, squash, hose, seeded noise, film()
styles/<style>/style.js      a style pack: palette + motion rules + film texture
characters/<name>/rig.js     a character rig: build once, pose(p) every frame
films/<film>/index.html      a film: render(t) is a pure function of time
.claude/skills/              skills so an agent can make a film from one sentence
```

The same character rig can be skinned by any style pack — that's the point.

## Quick start

Requirements: Node ≥ 22, FFmpeg, Google Chrome.

```bash
npm install
npm run dev                         # open http://localhost:3000/viewer.html?film=hello-pip
npm run render:draft -- hello-pip   # fast preview  → renders/hello-pip.draft.mp4
npm run render -- hello-pip         # Reels quality → renders/hello-pip.mp4
```

If HyperFrames can't download its own Chrome: `export HYPERFRAMES_BROWSER_PATH=$(which google-chrome)`.

## The one rule: determinism

The renderer may ask for frame 212 before frame 3, or the same frame twice. A film must
draw the same picture for the same `t`. So: no `Math.random()` (use `Toon.rng(seed)`),
no `Date.now()`, no CSS animations that run on their own.

## Styles

| Style | Status |
|---|---|
| Rubber Hose · 1930 | ✅ `styles/rubber-hose-1930` |
| UPA / mid-century modern · 1950 | planned |
| Paper cut-out | planned |
| 80s cel anime | planned |
| Comic halftone | planned |
| Claymation | planned |

## Contributing a style

1. Copy `styles/rubber-hose-1930` to `styles/<your-style>`.
2. Write its `README.md` (what defines the look, with references) and `style.js` (`palette`, `motion`, `install()`).
3. Re-skin Pip in it and add a 10-second film in `films/`.

Please only draw original characters. Styles are free to use; specific studio characters are not.

## License

MIT — see [LICENSE](LICENSE). GSAP and HyperFrames keep their own licenses.
