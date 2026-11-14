/** Set LONDON — DETAILS: a red double-decker bus rolling past, a red phone box, a black lamp post, wet pavement with puddles. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("london").details = {
    build({ g, theme, defs, width: W, ground: G, height: H }) {
      const bus = T.el("g", {}, g);
      T.el("rect", { x: 0, y: -430, width: 820, height: 400, rx: 34, fill: "#d23a2f", ...X.ink(theme, 0.9) }, bus);
      for (const y of [-400, -230]) for (let k = 0; k < 6; k++) T.el("rect", { x: 40 + k * 128, y, width: 110, height: 100, rx: 10, fill: "#cfe0ea", ...X.ink(theme, 0.6) }, bus);
      T.el("rect", { x: 0, y: -260, width: 820, height: 18, fill: "#efe6d2", ...X.ink(theme, 0.5) }, bus);
      for (const x of [140, 660]) { T.el("circle", { cx: x, cy: -30, r: 54, fill: "#2d2f33", ...X.ink(theme, 0.7) }, bus); T.el("circle", { cx: x, cy: -30, r: 22, fill: "#b9bec4", ...X.ink(theme, 0.5) }, bus); }
      X.shade(bus, defs, X.rectD(0, -430, 820, 400), "#8f1f18", [[0, 0], [60, 0], [100, 0.7]]);
      // pavement + puddles
      const pv = X.rectD(-60, G - 90, W + 120, H - G + 150);
      T.el("path", { d: pv, fill: "#8a9097", ...X.ink(theme, 0.7) }, g);
      for (let row = 0; row < 7; row++) { const y = G - 90 + row * 70; T.el("path", { d: `M-60,${y} L${W + 60},${y}`, ...X.ink(theme, 0.3) }, g); for (let x = (row % 2) * 80; x < W; x += 160) T.el("path", { d: `M${x},${y} l0,70`, ...X.ink(theme, 0.3) }, g); }
      const pud = [[230, G + 120, 120, 22], [820, G + 260, 160, 28], [470, H - 140, 140, 24]].map(([x, y, rx, ry]) => { T.el("ellipse", { cx: x, cy: y, rx, ry, fill: "#aab6c0", ...X.ink(theme, 0.5) }, g); return T.el("ellipse", { cx: x, cy: y, rx: 1, ry: 1, fill: "none", stroke: "#e8eef2", "stroke-width": 3 }, g); });
      // phone box
      const pb = T.el("g", { transform: `translate(30,${G - 100})` }, g);
      T.el("rect", { x: 0, y: -440, width: 180, height: 440, fill: "#d63a2f", ...X.ink(theme, 0.9) }, pb);
      T.el("path", { d: "M-8,-440 Q90,-500 188,-440 Z", fill: "#d63a2f", ...X.ink(theme, 0.8) }, pb);
      T.el("rect", { x: 30, y: -420, width: 120, height: 26, fill: "#f4efe0", ...X.ink(theme, 0.5) }, pb);
      for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) T.el("rect", { x: 26 + c * 44, y: -380 + r * 48, width: 38, height: 40, fill: "#cfe0ea", ...X.ink(theme, 0.4) }, pb);
      X.shade(pb, defs, X.rectD(0, -440, 180, 440), "#8f1f18", [[0, 0], [55, 0], [100, 0.7]], { x1: 0, y1: 0, x2: 1, y2: 0 });
      T.el("path", { d: `M300,${G - 90} L300,${G - 660}`, stroke: theme.line.color, "stroke-width": 16 }, g);
      T.el("path", { d: `M276,${G - 660} l48,0 l-8,-50 l-32,0 Z`, fill: "#f4e7b0", ...X.ink(theme, 0.7) }, g);
      return { update(t) { bus.setAttribute("transform", `translate(${W + 100 - ((t * 260) % (W + 1100))},${G - 150})`); pud.forEach((n, i) => { const k = (t * 1.3 + i * 0.37) % 1; n.setAttribute("rx", (8 + k * 50).toFixed(1)); n.setAttribute("ry", (2 + k * 9).toFixed(1)); n.setAttribute("opacity", (1 - k).toFixed(2)); }); } };
    },
  };
})(window);
