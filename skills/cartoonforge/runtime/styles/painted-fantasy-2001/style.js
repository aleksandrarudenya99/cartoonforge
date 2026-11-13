/**
 * Style pack: Painted Fantasy Feature · 2000s
 * Genre look of hand-drawn Japanese fantasy features: lush watercolour/gouache backgrounds,
 * towering summer clouds, deep greens, warm lantern light at dusk, wind moving grass and
 * leaves, quiet observant pacing. Thin character line, soft flat colour. A genre, not any
 * specific film or studio.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    skyTop: "#4f8fc0", skyLow: "#bfe1ea", cloud: "#fbfaf2", cloudShade: "#c9d6e0", hill: "#6f9e57", hillDeep: "#3f6e3c",
    grass: "#8cbf5a", water: "#7fb7c7", lantern: "#ffb347", roof: "#8c3b2e", wood: "#6b4a34", ink: "#3a2f28", white: "#fffdf5",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 80, lineWidth: 4 };

  const SERIF = "'Noto Serif', Georgia, 'DejaVu Serif', serif";
  const caption = { y: 360, size: 66, font: SERIF, weight: "normal", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 10, maxWidth: 880 };

  const cards = { bg: palette.skyLow, fg: palette.ink, endFg: palette.ink, accent: palette.roof, font: SERIF, frame: "none", transition: "fade", transitionColor: palette.white, upper: false, titleWeight: "normal" };

  /** Characters: thin warm line, soft flat colour, gentle cel-shadow, no heavy outlines. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "cel", outline: palette.ink, shadow: "rgba(63,110,60,0.22)",
    body: "#d8c7a3", head: "#f2d7bd", face: "#f2d7bd", eye: palette.ink, glint: palette.white,
    limb: palette.ink, limbWidth: 0.5, glove: "#f2d7bd", gloveLine: palette.ink, shoe: palette.wood, shoeShine: null,
    bow: palette.roof, mouth: palette.ink, nose: "#d9ae95",
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.skyLow }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.skyTop], [70, palette.skyLow], [100, "#eef6f2"]] }),
      fx.paper(L, { color: "#fffdf0", opacity: 0.35, freq: 0.035 }), // watercolour paper
      fx.grain(L, { opacity: 0.08 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // towering summer cumulus
    const clouds = [[300, 820, 1.6], [860, 700, 1.1]].map(([x, y, s]) => {
      const n = T.el("g", {}, g);
      for (let k = 0; k < 3; k++) T.el("path", { d: S().cloud(-180 + k * 30, 180 - k * 30, -k * 110, 150, 4), fill: P.cloud }, n);
      T.el("path", { d: S().cloud(-170, 170, 10, 40, 4), fill: P.cloudShade }, n);
      return { n, x, y, s };
    });
    T.el("path", { d: S().ridge(-60, W + 60, G - 380, 180, { seed: 21, peaks: 4, bottom: G }), fill: P.hillDeep }, g);
    T.el("path", { d: S().ridge(-60, W + 60, G - 230, 120, { seed: 27, peaks: 5, bottom: G }), fill: P.hill }, g);
    // a small wooden house with a red roof and a warm lantern
    const house = T.el("g", { transform: `translate(${W - 300},${G - 120})` }, g);
    T.el("rect", { x: 0, y: -170, width: 220, height: 170, fill: P.wood }, house);
    T.el("path", { d: "M-30,-170 L110,-260 L250,-170 Z", fill: P.roof }, house);
    T.el("rect", { x: 40, y: -120, width: 50, height: 50, fill: "#ffe2a8" }, house);
    const lantern = T.el("circle", { cx: 160, cy: -60, r: 16, fill: P.lantern }, house);
    T.el("rect", { x: -60, y: G - 120, width: W + 120, height: 800, fill: P.grass }, g);
    // wind through tall grass: many blades that bend together
    const blades = Array.from({ length: 70 }, (_, i) => ({ n: T.el("path", { fill: i % 3 ? P.hill : P.hillDeep }, g), x: (i * 37) % (W + 40) - 20, h: 60 + ((i * 53) % 90), y: G - 100 + ((i * 29) % 140) }));
    const leaves = Array.from({ length: 10 }, () => T.el("ellipse", { rx: 10, ry: 5, fill: P.hillDeep }, g));
    return {
      update(t) {
        clouds.forEach(({ n, x, y, s }, i) => n.setAttribute("transform", `translate(${x + t * (4 + i * 3)},${y}) scale(${s})`));
        lantern.setAttribute("opacity", (0.75 + 0.25 * Math.abs(T.noise(3, t * 2))).toFixed(2));
        const gust = Math.sin(t * 0.9) * 0.6 + Math.sin(t * 2.3) * 0.2;
        blades.forEach(({ n, x, h, y }, i) => { const bend = (gust + Math.sin(t * 3 + x * 0.02) * 0.15) * h * 0.6; n.setAttribute("d", S().brush(x, y, x + bend, y - h, 6)); });
        leaves.forEach((l, i) => { const r = T.rng(i * 9 + 1), k = (t * 0.2 + r()) % 1; l.setAttribute("transform", `translate(${(k * (W + 200) - 100).toFixed(0)},${(600 + r() * 600 + Math.sin(t * 2 + i) * 60).toFixed(0)}) rotate(${(t * 200 + i * 50) % 360})`); });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["painted-fantasy-2001"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
