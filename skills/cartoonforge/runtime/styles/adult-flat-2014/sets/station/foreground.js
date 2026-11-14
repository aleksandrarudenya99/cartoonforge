/** Set STATION — FOREGROUND: a thick pipe arching over the top of the frame, a glowing glass tube on the left edge. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("station").foreground = {
    build({ g, theme, defs, width: W, height: H }) {
      X.pipe(g, theme, `M-60,320 Q${W / 2},-120 ${W + 60},320`, 80, { step: 46 });
      T.el("rect", { x: -60, y: 900, width: 150, height: 700, rx: 30, fill: "#7fe6de", ...X.ink(theme, 0.9) }, g);
      X.shade(g, defs, X.rectD(-60, 900, 150, 700), "#3fb2b0", [[0, 0], [60, 0], [100, 0.8]], { x1: 0, y1: 0, x2: 1, y2: 0 });
      T.el("path", { d: "M40,940 L40,1560", stroke: "#e8fffd", "stroke-width": 14, "stroke-linecap": "round", opacity: 0.8 }, g);
      for (const y of [880, 1580]) T.el("rect", { x: -70, y, width: 175, height: 50, rx: 10, fill: "#b9c2ce", ...X.ink(theme, 0.8) }, g);
      const bubbles = Array.from({ length: 8 }, (_, i) => ({ n: T.el("circle", { r: 4 + (i % 3) * 3, fill: "#e8fffd", opacity: 0.8 }, g), x: -10 + (i * 37) % 80, ph: i * 0.7 }));
      return { update(t) { bubbles.forEach((b) => { b.n.setAttribute("cx", (b.x + Math.sin(t + b.ph) * 6).toFixed(1)); b.n.setAttribute("cy", (1560 - ((t * 70 + b.ph * 120) % 640)).toFixed(1)); }); } };
    },
  };
})(window);
