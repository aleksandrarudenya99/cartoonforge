/** Set GARAGE — FOREGROUND: shelf post and a mop bucket cut by the frame, a toolbox, dust. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("garage").foreground = {
    build({ g, theme, defs, height: H, width: W }) {
      T.el("path", { d: `M-40,${H - 260} L230,${H - 260} L210,${H + 40} L-20,${H + 40} Z`, fill: "#6c6f74", ...X.ink(theme, 0.9) }, g);
      T.el("ellipse", { cx: 95, cy: H - 260, rx: 135, ry: 26, fill: "#4a4d52", ...X.ink(theme, 0.8) }, g);
      T.el("path", { d: `M130,${H - 270} L230,${H - 620}`, stroke: theme.line.color, "stroke-width": 22, "stroke-linecap": "round" }, g);
      T.el("path", { d: `M130,${H - 270} L230,${H - 620}`, stroke: "#b08a5c", "stroke-width": 15, "stroke-linecap": "round" }, g);
      T.el("rect", { x: W - 260, y: H - 200, width: 300, height: 240, rx: 12, fill: "#5f7a6a", ...X.ink(theme, 0.9) }, g);
      T.el("path", { d: `M${W - 200},${H - 200} l0,-40 l120,0 l0,40`, fill: "none", stroke: theme.line.color, "stroke-width": 14 }, g);
      X.shade(g, defs, X.rectD(W - 260, H - 200, 300, 240), "#2f3f36", [[0, 0], [100, 0.7]]);
      const r = T.rng(11), dust = Array.from({ length: 16 }, (_, i) => ({ n: T.el("circle", { r: 2 + r() * 3, fill: "#f3e7c4", opacity: 0.5 }, g), x: r() * W, y: 300 + r() * 1200, ph: r() * 6 }));
      return { update(t) { dust.forEach((d) => { d.n.setAttribute("cx", (d.x + Math.sin(t * 0.4 + d.ph) * 20).toFixed(1)); d.n.setAttribute("cy", (d.y - t * 6 + Math.cos(t * 0.5 + d.ph) * 10).toFixed(1)); }); } };
    },
  };
})(window);
