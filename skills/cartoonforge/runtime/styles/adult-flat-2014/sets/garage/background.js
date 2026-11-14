/**
 * Set GARAGE — BACKGROUND: a cluttered home garage. Warm grey panel walls with blotchy airbrush
 * stains, panel seams, a bare concrete floor; an open door shows a bright checker-floor kitchen.
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("garage").background = {
    build({ g, theme, defs, look, width: W, ground: G, height: H }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.3 });
      const FL = G - 230;
      T.el("rect", { x: -60, y: -60, width: W + 120, height: FL + 60, fill: "#8f877b" }, g);
      // stains: blotchy airbrush patches lighter and darker
      const r = T.rng(3);
      for (let i = 0; i < 9; i++) X.shade(g, defs, X.ellD(r() * W, 100 + r() * (FL - 200), 140 + r() * 160, 110 + r() * 140), i % 2 ? "#a49c8f" : "#6f685e", [[0, 0.8], [100, 0]], { radial: true });
      X.shade(g, defs, X.rectD(-60, -60, W + 120, 260), "#5f584f", [[0, 0.9], [100, 0]]);
      for (const x of [40, 330, 980]) T.el("path", { d: `M${x},0 L${x + 2},${FL}`, ...X.ink(theme, 0.5) }, g); // panel seams

      // open doorway into the kitchen
      const dx = 560, dw = 250, dt = 520;
      T.el("rect", { x: dx, y: dt, width: dw, height: FL - dt, fill: "#f1ead2" }, g);
      T.el("rect", { x: dx + 20, y: dt + 20, width: 60, height: 120, fill: "#c8ccd2", ...X.ink(theme, 0.5) }, g); // cabinet
      T.el("rect", { x: dx + 120, y: dt + 140, width: 110, height: FL - dt - 230, rx: 8, fill: "#eef2f5", ...X.ink(theme, 0.6) }, g); // fridge
      T.el("path", { d: `M${dx + 130},${dt + 180} l0,60 M${dx + 130},${dt + 300} l0,60`, ...X.ink(theme, 0.9) }, g);
      const ky = FL - 90;
      for (let row = 0; row < 3; row++) for (let c = 0; c < 9; c++) if ((row + c) % 2) T.el("path", { d: `M${dx + c * 28 + row * 8},${ky + row * 30} l28,0 l8,30 l-28,0 Z`, fill: "#2f3540" }, g);
      T.el("rect", { x: dx, y: ky, width: dw, height: 90, fill: "none", ...X.ink(theme, 0.5) }, g);
      X.shade(g, defs, X.rectD(dx, dt, dw, FL - dt), "#c9b98a", [[0, 0.7], [40, 0], [100, 0]], { x1: 0, y1: 0, x2: 1, y2: 0 });
      // the door leaf swung open + frame
      T.el("path", { d: `M${dx},${dt} L${dx - 150},${dt - 50} L${dx - 150},${FL + 20} L${dx},${FL} Z`, fill: "#8b8072", ...X.ink(theme, 0.8) }, g);
      T.el("path", { d: `M${dx - 20},${dt + 210} l0,40`, ...X.ink(theme, 1.4) }, g);
      for (const x of [dx - 14, dx + dw]) T.el("rect", { x, y: dt - 14, width: 14, height: FL - dt + 14, fill: "#6e5a44", ...X.ink(theme, 0.6) }, g);
      T.el("rect", { x: dx - 14, y: dt - 28, width: dw + 28, height: 16, fill: "#6e5a44", ...X.ink(theme, 0.6) }, g);

      // concrete floor
      T.el("rect", { x: -60, y: FL, width: W + 120, height: H - FL + 60, fill: "#c4c7bb", ...X.ink(theme, 0.6) }, g);
      X.shade(g, defs, X.rectD(-60, FL, W + 120, 200), "#8d9085", [[0, 0.7], [100, 0]]);
      X.contours(g, theme, { y0: FL + 80, y1: H - 60, n: 8, seed: 4 });
      return null;
    },
  };
})(window);
