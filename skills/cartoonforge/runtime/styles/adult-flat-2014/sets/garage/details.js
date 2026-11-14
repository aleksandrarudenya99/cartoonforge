/**
 * Set GARAGE — DETAILS: utility sink, washer and dryer with simple dials, a warm work lamp
 * glowing through airbrush, a metal shelving unit with junk, a puddle on the floor.
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("garage").details = {
    build({ g, theme, defs, ground: G, width: W }) {
      const FL = G - 230;
      // warm lamp over the door with an airbrushed glow
      X.shade(g, defs, X.ellD(470, 470, 160, 130), "#f6b54a", [[0, 0.9], [100, 0]], { radial: true });
      const lampG = T.el("path", { d: "M430,500 L445,450 L500,445 L515,500 Z", fill: "#f39a3a", ...X.ink(theme, 0.6) }, g);
      // utility sink
      T.el("rect", { x: -60, y: FL - 190, width: 260, height: 70, fill: "#c9cbc4", ...X.ink(theme, 0.8) }, g);
      T.el("rect", { x: -40, y: FL - 175, width: 200, height: 30, rx: 8, fill: "#6d7068", ...X.ink(theme, 0.5) }, g);
      for (const x of [0, 170]) T.el("rect", { x, y: FL - 120, width: 16, height: 150, fill: "#76796f", ...X.ink(theme, 0.6) }, g);
      T.el("path", { d: `M60,${FL - 190} l0,-50 q0,-20 30,-20 l50,0`, fill: "none", stroke: theme.line.color, "stroke-width": 16, "stroke-linecap": "round" }, g);
      T.el("path", { d: `M60,${FL - 190} l0,-50 q0,-20 30,-20 l50,0`, fill: "none", stroke: "#d8dcd8", "stroke-width": 10, "stroke-linecap": "round" }, g);
      // washer + dryer
      [[200, "#e3dfc3"], [380, "#e9e5c9"]].forEach(([x, c], i) => {
        T.el("rect", { x, y: FL - 280, width: 170, height: 300, rx: 6, fill: c, ...X.ink(theme, 0.8) }, g);
        T.el("rect", { x, y: FL - 280, width: 170, height: 60, rx: 6, fill: "#d6d2b6", ...X.ink(theme, 0.6) }, g);
        T.el("circle", { cx: x + 40, cy: FL - 250, r: 16, fill: c, ...X.ink(theme, 0.6) }, g);
        for (let k = 0; k < 3; k++) T.el("rect", { x: x + 80 + k * 22, y: FL - 260, width: 14, height: 20, rx: 3, fill: "none", ...X.ink(theme, 0.5) }, g);
        T.el("path", { d: `M${x + 20},${FL - 200} l130,0`, ...X.ink(theme, 0.4) }, g);
        T.el("rect", { x: x + 20, y: FL - 30, width: 26, height: 16, rx: 3, fill: "none", ...X.ink(theme, 0.4) }, g);
        X.shade(g, defs, X.rectD(x, FL - 280, 170, 300), "#9d987c", [[0, 0], [50, 0], [100, 0.7]], { x1: 0, y1: 0, x2: 1, y2: 0 });
        if (i === 0) T.el("path", { d: X.blob(x + 40, FL - 290, 36, 14, { seed: 5 }), fill: "#d9d0a8", ...X.ink(theme, 0.5) }, g); // folded rag
      });
      // metal shelving unit with junk on the right
      const sx = 850, sw = 260;
      for (const x of [sx, sx + sw]) {
        T.el("rect", { x: x - 10, y: 120, width: 22, height: FL + 40 - 120, fill: "#6b6a62", ...X.ink(theme, 0.7) }, g);
        for (let y = 160; y < FL; y += 60) T.el("ellipse", { cx: x + 1, cy: y, rx: 4, ry: 7, fill: "#3a3933" }, g);
      }
      const shelves = [330, 640, 950, FL - 40];
      shelves.forEach((y) => { T.el("rect", { x: sx - 14, y, width: sw + 40, height: 22, fill: "#7d7b72", ...X.ink(theme, 0.7) }, g); X.shade(g, defs, X.rectD(sx, y - 300, sw, 300), "#2f2e29", [[0, 0.2], [100, 0.7]]); });
      // junk on shelves
      T.el("rect", { x: sx + 20, y: 250, width: 110, height: 80, fill: "#a68a5e", ...X.ink(theme, 0.6) }, g);
      T.el("path", { d: `M${sx + 20},250 l20,-20 l110,0 l-20,20`, fill: "#bfa071", ...X.ink(theme, 0.5) }, g);
      for (let i = 0; i < 3; i++) T.el("rect", { x: sx + 150 + i * 34, y: 270, width: 28, height: 60, rx: 5, fill: ["#7f9a6a", "#c7c2a8", "#9a6b5a"][i], ...X.ink(theme, 0.5) }, g);
      T.el("path", { d: `M${sx + 40},640 l0,-110 l120,0 l0,110 Z`, fill: "#7fa06a", ...X.ink(theme, 0.6) }, g);
      T.el("path", { d: `M${sx + 60},560 l20,-20 l20,20 l20,-20 l20,20`, fill: "none", ...X.ink(theme, 0.6) }, g);
      T.el("ellipse", { cx: sx + 210, cy: 610, rx: 34, ry: 30, fill: "#f2efe4", ...X.ink(theme, 0.6) }, g); // a jar with a weird thing
      T.el("circle", { cx: sx + 210, cy: 610, r: 12, fill: "#c46aa0", ...X.ink(theme, 0.4) }, g);
      T.el("rect", { x: sx + 30, y: 880, width: 70, height: 70, rx: 30, fill: "#8d9198", ...X.ink(theme, 0.6) }, g);
      T.el("path", { d: `M${sx + 140},950 l30,-120 l12,0 l-20,120 Z`, fill: "#a4744a", ...X.ink(theme, 0.5) }, g);
      // puddle
      T.el("path", { d: X.blob(330, G - 20, 190, 36, { seed: 9, n: 11, irr: 0.3 }), fill: "#d7ddd2", ...X.ink(theme, 0.5) }, g);
      return { update(t) { lampG.setAttribute("opacity", Math.floor(t * 12) % 37 === 0 ? "0.75" : "1"); } };
    },
  };
})(window);
