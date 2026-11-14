/** Set HOME — DETAILS: hanging cone lamp (swings a little), low cabinet with a plant and books, oval rug. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("home").details = {
    build({ g, theme, defs, ground: G }) {
      const lamp = X.hangLamp(g, theme, { x: 540, y0: 160, len: 170, w: 260, color: "#eee2b8" });
      // cabinet
      const cx = 600, cy = G - 330;
      T.el("rect", { x: cx, y: cy, width: 400, height: 170, fill: "#b98a5c", ...X.ink(theme, 0.8) }, g);
      for (const [x, w] of [[cx + 14, 180], [cx + 206, 180]]) { T.el("rect", { x, y: cy + 20, width: w, height: 130, fill: "#c69a6a", ...X.ink(theme, 0.5) }, g); T.el("circle", { cx: x + w / 2, cy: cy + 85, r: 6, fill: "#e6c27a", ...X.ink(theme, 0.4) }, g); }
      X.shade(g, defs, X.rectD(cx, cy, 400, 170), "#6d4b2e", [[0, 0], [60, 0], [100, 0.7]]);
      T.el("path", { d: `M${cx + 40},${cy} l12,-70 l56,0 l12,70 Z`, fill: "#c8674a", ...X.ink(theme, 0.6) }, g); // plant pot
      for (let i = 0; i < 5; i++) T.el("path", { d: X.blob(cx + 80 + (i - 2) * 22, cy - 110 - (i % 2) * 20, 22, 44, { seed: 40 + i, n: 7, irr: 0.15 }), fill: "#6fa65a", ...X.ink(theme, 0.5) }, g);
      ["#6f7fb5", "#a95f6e", "#d3a457", "#7aa58a"].forEach((c, i) => T.el("rect", { x: cx + 250 + i * 26, y: cy - 90 + (i % 2) * 10, width: 24, height: 90 - (i % 2) * 10, fill: c, ...X.ink(theme, 0.5) }, g));
      // rug
      T.el("ellipse", { cx: 540, cy: G + 40, rx: 400, ry: 80, fill: "#9fb5c7", ...X.ink(theme, 0.7) }, g);
      T.el("ellipse", { cx: 540, cy: G + 40, rx: 350, ry: 62, fill: "none", stroke: "#d6e2ea", "stroke-width": 8, "stroke-dasharray": "22 14" }, g);
      return { update(t) { lamp.setAttribute("transform", `translate(540,160) rotate(${(Math.sin(t * 1.1) * 1.2).toFixed(2)})`); } };
    },
  };
})(window);
