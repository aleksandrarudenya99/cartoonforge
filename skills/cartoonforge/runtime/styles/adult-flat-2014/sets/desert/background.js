/**
 * Set DESERT — BACKGROUND: pale yellow-green alien sky with long flat cloud bands,
 * soft lavender far hills with tiny candy trees. Painted look: airbrush speckle on the layer.
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("desert").background = {
    build({ g, theme, defs, look, width: W, ground: G }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.26 });
      X.sky(g, defs, { w: W + 120, h: G - 380, stops: [[0, "#e6e68c"], [55, "#efed9e"], [100, "#f6f1b4"]] });
      const clouds = X.cloudBands(g, { y0: 40, y1: 860, n: 14, color: "#c6d488", seed: 4 });
      // far hills, back to front
      T.el("path", { d: X.hillD(-80, W + 80, G - 520, 70, { seed: 2, bumps: 3 }), fill: "#ccd0f0", ...X.ink(theme, 0.5) }, g);
      for (const [x, s, c] of [[140, 0.22, "#f6c46a"], [300, 0.16, "#f4a978"], [930, 0.2, "#f6c46a"]]) X.puffTree(g, defs, theme, { x, y: G - 520, s, crown: c, shadeC: "#d98a4a", hi: "#fff2b8", trunk: "#a8e3dc", seed: x });
      const far = X.hillD(-80, W + 80, G - 450, 90, { seed: 5, bumps: 2 });
      T.el("path", { d: far, fill: "#bfc4ec", ...X.ink(theme, 0.6) }, g);
      X.shade(g, defs, far, "#8d93d2", [[0, 0], [10, 0.55], [26, 0]]);
      X.contours(g, theme, { y0: G - 430, y1: G - 330, n: 9, seed: 6 });
      return { update(t) { clouds.update(t); } };
    },
  };
})(window);
