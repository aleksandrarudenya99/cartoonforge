/** Set NEW YORK — FOREGROUND: steam rising from a manhole, a hydrant at the edge. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("newyork").foreground = {
    build({ g, theme, width: W, height: H }) {
      T.el("ellipse", { cx: 820, cy: H - 200, rx: 110, ry: 26, fill: "#3a3c42", ...X.ink(theme, 0.8) }, g);
      for (let k = -3; k <= 3; k++) T.el("path", { d: `M${820 + k * 26},${H - 220} l0,40`, ...X.ink(theme, 0.4) }, g);
      const puffs = Array.from({ length: 7 }, (_, i) => ({ n: T.el("path", { d: X.blob(0, 0, 70, 50, { seed: i + 3, n: 9, irr: 0.25 }), fill: "#f2f2f4", ...X.ink(theme, 0.5) }, g), ph: i / 7 }));
      T.el("path", { d: `M${W - 70},${H + 40} l0,-170 q0,-40 40,-40 q40,0 40,40 L${W + 10},${H + 40} Z`, fill: "#c8573f", ...X.ink(theme, 0.9) }, g);
      return { update(t) { puffs.forEach((p) => { const k = (t * 0.45 + p.ph) % 1; p.n.setAttribute("transform", `translate(${820 + Math.sin(k * 6 + p.ph * 9) * 30},${H - 230 - k * 700}) scale(${(0.5 + k * 1.6).toFixed(2)})`); p.n.setAttribute("opacity", (0.95 * (1 - k)).toFixed(2)); }); } };
    },
  };
})(window);
