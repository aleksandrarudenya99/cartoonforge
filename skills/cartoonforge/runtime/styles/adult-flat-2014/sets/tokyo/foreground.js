/** Set TOKYO — FOREGROUND: cherry petals drifting down, overhead wires. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("tokyo").foreground = {
    build({ g, theme, width: W, height: H }) {
      T.el("path", { d: `M-60,140 Q${W / 2},230 ${W + 60},110 M-60,190 Q${W / 2},290 ${W + 60},170`, fill: "none", ...X.ink(theme, 0.7) }, g);
      const r = T.rng(4), petals = Array.from({ length: 26 }, () => ({ n: T.el("ellipse", { rx: 9, ry: 5, fill: "#ffc4dc", ...X.ink(theme, 0.3) }, g), x: r() * W, y: r() * H, sp: 60 + r() * 60, ph: r() * 6 }));
      return { update(t) { petals.forEach((p) => p.n.setAttribute("transform", `translate(${(p.x + Math.sin(t + p.ph) * 40 - t * 20).toFixed(1)},${((p.y + t * p.sp) % H).toFixed(1)}) rotate(${((t * 90 + p.ph * 60) % 360).toFixed(0)})`)); } };
    },
  };
})(window);
