/**
 * Set DESERT — DETAILS: rolling lavender ground with open contour strokes, puffy candy trees,
 * pink pools with concentric rings and an airbrushed rim, grass tufts, pebbles.
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("desert").details = {
    build({ g, theme, defs, width: W, ground: G, height: H }) {
      const hillA = X.hillD(-80, 560, G - 330, 60, { seed: 8, bumps: 1, bottom: H + 40 });
      T.el("path", { d: hillA, fill: "#bcc2ec", ...X.ink(theme, 0.7) }, g);
      X.shade(g, defs, hillA, "#8f95d4", [[0, 0], [8, 0.6], [22, 0]]);
      const hillB = X.hillD(420, W + 80, G - 300, 70, { seed: 9, bumps: 1, bottom: H + 40 });
      T.el("path", { d: hillB, fill: "#b7bdea", ...X.ink(theme, 0.7) }, g);
      X.shade(g, defs, hillB, "#8f95d4", [[0, 0], [8, 0.6], [22, 0]]);
      const plain = X.hillD(-80, W + 80, G - 170, 30, { seed: 10, bumps: 2, bottom: H + 40 });
      T.el("path", { d: plain, fill: "#b4bae8", ...X.ink(theme, 0.7) }, g);
      X.shade(g, defs, plain, "#9298d6", [[0, 0.5], [12, 0], [70, 0], [100, 0.5]]);
      X.contours(g, theme, { y0: G - 280, y1: H - 40, n: 34, seed: 11 });

      // candy trees: one cut by the left frame edge, a pair on the right
      X.puffTree(g, defs, theme, { x: 90, y: G - 300, s: 1.05, crown: "#f6c46a", shadeC: "#e08a4a", hi: "#fff2b8", trunk: "#a8e3dc", seed: 21 });
      X.puffTree(g, defs, theme, { x: 1010, y: G - 270, s: 0.95, crown: "#f5a87a", shadeC: "#e0707a", hi: "#ffe2c8", trunk: "#a8e3dc", seed: 22, flip: true });
      X.puffTree(g, defs, theme, { x: 880, y: G - 255, s: 0.78, crown: "#f6c46a", shadeC: "#e08a4a", hi: "#fff2b8", trunk: "#a8e3dc", seed: 23 });

      const pools = [
        X.pool(g, defs, theme, { cx: 200, cy: G - 70, rx: 170, ry: 30, fill: "#ef8ea0", ring: "#ffc2cc", rim: "#b46ad8", seed: 31 }),
        X.pool(g, defs, theme, { cx: 960, cy: G + 150, rx: 230, ry: 44, fill: "#ef8ea0", ring: "#ffc2cc", rim: "#b46ad8", seed: 32 }),
      ];
      X.tufts(g, theme, { y0: G - 260, y1: G + 300, n: 26, color: "#c8efae", seed: 12, sMin: 0.45, sMax: 1.1 });
      X.pebbles(g, theme, { y0: G - 250, y1: H - 60, n: 40, colors: ["#8a3a52", "#6e4a9a", "#a7495c"], seed: 13 });
      X.rock(g, theme, { x: 420, y: G - 150, rx: 34, ry: 14, fill: "#c0475a", facet: "#e06a7a", seed: 14 });
      return { update(t) { pools.forEach((p) => p.update(t)); } };
    },
  };
})(window);
