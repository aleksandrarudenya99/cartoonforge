/**
 * Style pack: Primetime TV Cartoon · 1990s
 * Genre look of 90s prime-time TV animation: bright flat colours, even thick dark outlines,
 * simple rounded shapes, suburban street, a slight broadcast feel (scanlines, soft
 * chroma). Character colours come from the user's character, never a "house" skin tone.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    sky: "#6cc3f0", cloud: "#ffffff", grass: "#79c043", road: "#9b9b9b", walk: "#d9d4c7",
    houseA: "#f4a6a0", houseB: "#a7d58f", houseC: "#f6d27a", roof: "#8a4b3b", ink: "#2b2118", white: "#ffffff", door: "#b5643a",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 128, lineWidth: 7 };

  const ROUND = "'Arial Rounded MT Bold', 'Helvetica Rounded', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 72, font: ROUND, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 14, maxWidth: 900 };

  const cards = { bg: "#e8564b", fg: palette.white, accent: palette.white, font: ROUND, frame: "bar", transition: "fade", transitionColor: palette.ink, upper: false, titleStyle: "normal" };

  /** Characters: even thick dark-brown outline, flat bright fills, no shading. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "none", outline: palette.ink,
    body: "#5a8fd8", head: "#f2c7a5", face: "#f2c7a5", eye: palette.white, glint: palette.ink,
    limb: palette.ink, limbWidth: 0.7, glove: "#f2c7a5", gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: "#e8564b", mouth: palette.ink, nose: "#e3ae8a",
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.sky }, (fx, L) => [
      fx.misregister(L, { dx: 2, dy: 0, color: "#ff3b6b", opacity: 0.18 }), // soft chroma bleed
      fx.scanlines(L, { gap: 4, opacity: 0.07 }),
      fx.vignette(L, { color: "#000", strength: 0.18, inner: 65 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const line = { stroke: P.ink, "stroke-width": motion.lineWidth, "stroke-linejoin": "round" };
    const clouds = [[200, 300, 1], [760, 220, 0.8], [520, 470, 0.6]].map(([x, y, s]) => ({ n: T.el("path", { ...line, d: S().cloud(-120, 120, 0, 70, 4), fill: P.cloud }, g), x, y, s }));
    // a row of simple houses
    const houses = [[-40, P.houseA], [330, P.houseB], [700, P.houseC]].map(([x, c], i) => {
      const n = T.el("g", { transform: `translate(${x},${G - 60})` }, g);
      T.el("rect", { ...line, x: 0, y: -330, width: 330, height: 330, fill: c }, n);
      T.el("path", { ...line, d: "M-30,-330 L165,-470 L360,-330 Z", fill: P.roof }, n);
      T.el("rect", { ...line, x: 130, y: -170, width: 80, height: 170, fill: P.door }, n);
      for (const wx of [30, 230]) T.el("rect", { ...line, x: wx, y: -270, width: 70, height: 70, fill: "#cfeefe" }, n);
      return n;
    });
    // lawn, sidewalk, fence
    T.el("rect", { ...line, x: -60, y: G - 60, width: W + 120, height: 70, fill: P.grass }, g);
    for (let x = 0; x < W; x += 60) T.el("path", { ...line, "stroke-width": 5, d: `M${x + 10},${G - 60} L${x + 10},${G - 130} L${x + 25},${G - 150} L${x + 40},${G - 130} L${x + 40},${G - 60}`, fill: P.white }, g);
    T.el("rect", { ...line, x: -60, y: G, width: W + 120, height: 120, fill: P.walk }, g);
    T.el("rect", { ...line, x: -60, y: G + 120, width: W + 120, height: 600, fill: P.road }, g);
    for (let x = 40; x < W; x += 220) T.el("rect", { x, y: G + 260, width: 120, height: 18, fill: P.white }, g);
    return {
      update(t) {
        clouds.forEach(({ n, x, y, s }, i) => n.setAttribute("transform", `translate(${(x + t * (10 + i * 6)) % (W + 300) - 50},${y}) scale(${s})`));
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["tv-cartoon-1990"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
