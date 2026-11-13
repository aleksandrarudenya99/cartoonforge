/**
 * Style pack: Pixel 16-bit · early 1990s games
 * Everything is snapped to a coarse pixel grid with a limited palette, banded (dithered)
 * sky, parallax layers, tiled ground, sprite-like motion, CRT scanlines.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    sky1: "#3a2e6e", sky2: "#5a4fa3", sky3: "#8a7fd1", sky4: "#c3b6f0", hillFar: "#4b6fa8", hillNear: "#3c8f6a",
    grass: "#5cc25a", dirt: "#a0623a", dirtDark: "#6e3e22", ink: "#1d1b2e", white: "#f4f4f4", gold: "#ffd34e", pink: "#ff5c8a",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 140, lineWidth: 8, pixel: 8 };

  const MONO = "'Press Start 2P', 'Courier New', 'DejaVu Sans Mono', monospace";
  const caption = { y: 360, size: 58, font: MONO, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 12, maxWidth: 940 };

  const cards = { bg: palette.ink, fg: palette.white, accent: palette.pink, font: MONO, frame: "bar", transition: "iris", transitionColor: palette.ink, upper: true, kickerSpacing: 6 };

  /** Characters: limited palette, dark outline, then pixelated with the scene. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "pixel", outline: palette.ink,
    body: palette.pink, head: palette.pink, face: palette.white, eye: palette.ink, glint: palette.white,
    limb: palette.ink, limbWidth: 0.9, glove: palette.white, gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: palette.gold, mouth: palette.ink, nose: palette.ink,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.sky1 }, (fx, L) => [
      fx.pixelate(L, { size: motion.pixel }),
      fx.scanlines(L, { gap: 6, opacity: 0.16 }),
      fx.vignette(L, { color: "#000", strength: 0.35, inner: 60 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // banded sky (no gradients in 16-bit: hard colour bands)
    [P.sky1, P.sky2, P.sky3, P.sky4].forEach((c, i) => T.el("rect", { x: -60, y: i * 260 + 200, width: W + 120, height: i === 3 ? 900 : 260, fill: c }, g));
    const stars = Array.from({ length: 22 }, (_, i) => { const r = T.rng(i + 3); return T.el("rect", { x: Math.floor(r() * W / 8) * 8, y: Math.floor((120 + r() * 380) / 8) * 8, width: 8, height: 8, fill: P.white }, g); });
    const far = T.el("path", { d: S().ridge(-60, W * 2, G - 420, 260, { seed: 7, peaks: 8, bottom: G, sharp: true }), fill: P.hillFar }, g);
    const near = T.el("path", { d: S().ridge(-60, W * 2, G - 220, 160, { seed: 11, peaks: 10, bottom: G }), fill: P.hillNear }, g);
    const clouds = [0, 1, 2].map(() => T.el("path", { d: S().cloud(-100, 100, 0, 46, 3), fill: P.white }, g));
    // tiled ground: grass strip + dirt blocks
    const ground = T.el("g", {}, g);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.dirt }, ground);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 40, fill: P.grass }, ground);
    for (let x = -64; x < W + 64; x += 64) for (let y = G + 72; y < G + 600; y += 64) T.el("rect", { x: x + ((y / 64) % 2) * 32, y, width: 24, height: 16, fill: P.dirtDark }, ground);
    // floating coins
    const coins = [260, 540, 820].map((x) => T.el("rect", { x: x - 16, width: 32, height: 40, fill: P.gold, stroke: P.ink, "stroke-width": 6 }, g));
    return {
      update(t) {
        far.setAttribute("transform", `translate(${(-(t * 20) % W).toFixed(0)},0)`);
        near.setAttribute("transform", `translate(${(-(t * 45) % W).toFixed(0)},0)`);
        clouds.forEach((c, i) => c.setAttribute("transform", `translate(${(W + 200 - ((t * (30 + i * 15) + i * 400) % (W + 400))).toFixed(0)},${300 + i * 160})`));
        stars.forEach((s, i) => s.setAttribute("opacity", Math.floor(t * 4 + i) % 3 ? "1" : "0.3"));
        coins.forEach((c, i) => {
          const f = Math.floor(t * 8 + i) % 4; // 4-frame spin
          c.setAttribute("y", String(G - 420 + Math.round(Math.sin(t * 3 + i) * 16 / 8) * 8));
          c.setAttribute("width", String([32, 20, 8, 20][f]));
          c.setAttribute("x", String([260, 540, 820][i] - [16, 10, 4, 10][f]));
        });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["pixel-1992"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
