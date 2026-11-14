/**
 * Set STATION — BACKGROUND: a pale sci-fi corridor in one-point perspective. Curved walls and
 * ceiling are airbrushed bluish toward the edges; segmented pipe ribs arch over the ceiling.
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("station").background = {
    build({ g, theme, defs, look, width: W, height: H }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.24 });
      const B = { x0: 300, x1: 820, y0: 760, y1: 1260 }; // back wall
      const ceil = `M-60,-60 L${W + 60},-60 L${B.x1},${B.y0} L${B.x0},${B.y0} Z`;
      const left = `M-60,-60 L${B.x0},${B.y0} L${B.x0},${B.y1} L-60,1760 Z`;
      const right = `M${W + 60},-60 L${B.x1},${B.y0} L${B.x1},${B.y1} L${W + 60},1760 Z`;
      const floor = `M${B.x0},${B.y1} L${B.x1},${B.y1} L${W + 60},1760 L${W + 60},${H + 60} L-60,${H + 60} L-60,1760 Z`;
      T.el("path", { d: ceil, fill: "#eef2f8", ...X.ink(theme, 0.6) }, g);
      X.shade(g, defs, ceil, "#b3c2d6", [[0, 0.95], [60, 0.15], [100, 0]]);
      for (const [d, c, dir] of [[left, "#d5dfec", { x1: 0, y1: 0, x2: 1, y2: 0 }], [right, "#dae3ee", { x1: 1, y1: 0, x2: 0, y2: 0 }]]) {
        T.el("path", { d, fill: c, ...X.ink(theme, 0.6) }, g);
        X.shade(g, defs, d, "#a9b9cf", [[0, 0.85], [55, 0], [100, 0]], dir);
      }
      T.el("rect", { x: B.x0, y: B.y0, width: B.x1 - B.x0, height: B.y1 - B.y0, fill: "#e6ecf4", ...X.ink(theme, 0.6) }, g);
      T.el("path", { d: floor, fill: "#e8edf3", ...X.ink(theme, 0.6) }, g);
      X.shade(g, defs, floor, "#b9c6d6", [[0, 0.6], [25, 0], [100, 0]]);
      // wall panel seams converging to the vanishing point
      for (const k of [0.35, 0.65]) {
        const lx = -60 + (B.x0 + 60) * k, rx = W + 60 - (W + 60 - B.x1) * k;
        T.el("path", { d: `M${lx},${-60 + (B.y0 + 60) * k} L${lx},${1760 - (1760 - B.y1) * k}`, ...X.ink(theme, 0.45) }, g);
        T.el("path", { d: `M${rx},${-60 + (B.y0 + 60) * k} L${rx},${1760 - (1760 - B.y1) * k}`, ...X.ink(theme, 0.45) }, g);
      }
      // pipe ribs arching across the ceiling
      for (const t of [0.22, 0.5, 0.78]) {
        const lx = -60 + (B.x0 + 60) * t, ly = -60 + (B.y0 + 60) * t, rx = W + 60 - (W + 60 - B.x1) * t;
        X.pipe(g, theme, `M${lx.toFixed(0)},${(ly + 120 * (1 - t)).toFixed(0)} Q${(W / 2).toFixed(0)},${(ly - 260 * (1 - t)).toFixed(0)} ${rx.toFixed(0)},${(ly + 120 * (1 - t)).toFixed(0)}`, 46 * (1 - t * 0.6), { step: 30 * (1 - t * 0.5) });
      }
      return null;
    },
  };
})(window);
