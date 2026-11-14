/**
 * Set DUSK — BACKGROUND: hot orange alien sky, a huge streaky planet cut by the frame,
 * a ringed planet trailing a diagonal stream of spores, long flat darker cloud streaks,
 * pink far mesas with contour strokes.
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("dusk").background = {
    build({ g, theme, defs, look, width: W, ground: G }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.3 });
      X.sky(g, defs, { w: W + 120, h: G - 340, stops: [[0, "#e4913f"], [45, "#ecaa4c"], [78, "#f2c25e"], [100, "#f5d27a"]] });
      const big = X.planet(g, defs, theme, { cx: 230, cy: 110, r: 520, fill: "#dc8e4c", blot: "#c3703a", seed: 3, outline: 0.35, streaky: true });
      X.shade(g, defs, X.ellD(230, 110, 640, 640), "#f7d27a", [[70, 0], [82, 0.5], [100, 0]], { radial: true }); // airbrushed haze around it
      X.ringed(g, theme, { x: 830, y: 360, r: 92, rot: -22, body: "#c98a58", band: "#9c5f3a", ring: "#a7e0a0", ringHi: "#eef59a" });
      const spores = X.trail(g, { x0: 1180, y0: -60, x1: 640, y1: 560, n: 240, seed: 5, colors: ["#9ed6a8", "#cdeaa2", "#f6f0cf", "#7cc4ae", "#e9b26a"], spread: 110 });
      const clouds = X.cloudBands(g, { y0: 480, y1: 1000, n: 10, color: "#d98745", seed: 6, wMin: 380, wMax: 900, hMin: 18, hMax: 44 });
      const mesa = X.hillD(-80, W + 80, G - 470, 60, { seed: 7, bumps: 4 });
      T.el("path", { d: mesa, fill: "#e4a283", ...X.ink(theme, 0.55) }, g);
      X.shade(g, defs, mesa, "#c97a6a", [[0, 0], [8, 0.5], [20, 0]]);
      X.contours(g, theme, { y0: G - 440, y1: G - 360, n: 10, seed: 8 });
      return { update(t) { clouds.update(t); spores.update(t); big.setAttribute("transform", `translate(${230 + t * 0.8},110)`); } };
    },
  };
})(window);
