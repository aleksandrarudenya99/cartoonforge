/**
 * Set DUSK — DETAILS: sandy pink ground, purple canal lines, clusters of yellow spires with
 * eyes and holes, pale crystal shards, contour strokes and pebbles.
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("dusk").details = {
    build({ g, theme, defs, width: W, ground: G, height: H }) {
      // horizon spires (small)
      for (let i = 0; i < 9; i++) { const r = T.rng(60 + i); X.spire(g, theme, { x: 40 + i * 125 + r() * 40, base: G - 360, h: 60 + r() * 110, w: 28 + r() * 18, fill: "#e9b04a", shadeC: "#c98a2f", eye: i % 3 === 0 ? "#d7ec7a" : null, seed: 60 + i }); }
      const ground = X.hillD(-80, W + 80, G - 360, 40, { seed: 61, bumps: 2, bottom: H + 40 });
      T.el("path", { d: ground, fill: "#ebba90", ...X.ink(theme, 0.7) }, g);
      X.shade(g, defs, ground, "#d58f7a", [[0, 0.6], [10, 0], [60, 0], [100, 0.45]]);
      // purple canals winding to the horizon
      for (const [d, w] of [[`M-40,${G - 250} C200,${G - 280} 300,${G - 220} 520,${G - 300} S800,${G - 340} 1120,${G - 320}`, 9], [`M680,${G - 345} C640,${G - 260} 820,${G - 200} 760,${G - 120} S900,${G} 1120,${G - 40}`, 7]]) {
        T.el("path", { d, fill: "none", stroke: theme.line.color, "stroke-width": w + 5, "stroke-linecap": "round" }, g);
        T.el("path", { d, fill: "none", stroke: "#9a78d8", "stroke-width": w, "stroke-linecap": "round" }, g);
      }
      X.contours(g, theme, { y0: G - 330, y1: H - 40, n: 30, seed: 62 });
      // mid spire clusters on both sides
      const sp = [[70, 330, 64, "#d7ec7a"], [170, 250, 52, null], [250, 190, 44, null], [860, 280, 58, null], [960, 380, 70, "#d7ec7a"], [1050, 240, 50, null]];
      sp.forEach(([x, h, w, eye], i) => X.spire(g, theme, { x, base: G - 210 + (i % 2) * 20, h, w, fill: "#eab34a", shadeC: "#c98a2f", eye, seed: 70 + i }));
      X.crystals(g, theme, { x: 120, y: G - 170, n: 4, s: 90, seed: 80 });
      X.crystals(g, theme, { x: 930, y: G - 150, n: 3, s: 110, seed: 81 });
      X.crystals(g, theme, { x: 560, y: G - 300, n: 3, s: 40, seed: 82 });
      X.pebbles(g, theme, { y0: G - 300, y1: H - 60, n: 36, colors: ["#b5655a", "#8a5aa8", "#d08a5a"], seed: 83 });
      X.tufts(g, theme, { y0: G - 280, y1: G + 300, n: 14, color: "#f2d7a0", seed: 84, sMin: 0.5, sMax: 1 });
      return null;
    },
  };
})(window);
