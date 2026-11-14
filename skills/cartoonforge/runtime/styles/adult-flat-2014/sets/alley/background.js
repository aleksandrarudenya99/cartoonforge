/**
 * Set ALLEY — BACKGROUND: the view out of a narrow back alley onto an ordinary street:
 * pale sky, a brick building with sparse brick marks and blue-glass windows, a rounded tree,
 * a parked boxy car, a hydrant, the far sidewalk. Framed by the alley walls (details).
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("alley").background = {
    build({ g, theme, defs, look, width: W, ground: G, height: H }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.26 });
      X.sky(g, defs, { w: W + 120, h: G, stops: [[0, "#b9d3e2"], [100, "#dbe8ee"]] });
      const ST = G - 300; // far street level
      // left building (light, cut by wall) and right brick building
      T.el("rect", { x: 200, y: 540, width: 260, height: ST - 540, fill: "#d8d3b8", ...X.ink(theme, 0.7) }, g);
      T.el("rect", { x: 200, y: 540, width: 260, height: 30, fill: "#c4bea2", ...X.ink(theme, 0.5) }, g);
      for (const y of [620, 860]) { T.el("rect", { x: 250, y, width: 110, height: 160, fill: "#c9dde8", ...X.ink(theme, 0.6) }, g); T.el("path", { d: `M270,${y + 140} l50,-110`, stroke: "#fff", "stroke-width": 8, opacity: 0.6 }, g); }
      T.el("rect", { x: 520, y: 470, width: 420, height: ST - 470, fill: "#cdbfa8", ...X.ink(theme, 0.7) }, g);
      T.el("rect", { x: 510, y: 470, width: 440, height: 26, fill: "#b9aa92", ...X.ink(theme, 0.6) }, g);
      for (const [x, y, w, h] of [[600, 400, 26, 70], [650, 420, 18, 50]]) T.el("rect", { x, y, width: w, height: h, fill: "#a8a9a6", ...X.ink(theme, 0.5) }, g); // roof vents
      T.el("rect", { x: 760, y: 380, width: 120, height: 90, fill: "#c9cbc8", ...X.ink(theme, 0.6) }, g);
      for (let i = 0; i < 5; i++) T.el("path", { d: `M770,${395 + i * 15} l100,0`, ...X.ink(theme, 0.35) }, g);
      X.brickMarks(g, theme, { x0: 530, x1: 930, y0: 520, y1: ST - 40, n: 16, seed: 3 });
      for (const [x, y] of [[620, 600], [800, 600], [620, 860], [800, 860]]) { T.el("rect", { x, y, width: 110, height: 170, fill: "#c9dde8", ...X.ink(theme, 0.6) }, g); T.el("rect", { x: x - 10, y: y - 10, width: 130, height: 190, fill: "none", ...X.ink(theme, 0.5) }, g); T.el("path", { d: `M${x + 20},${y + 150} l50,-120`, stroke: "#fff", "stroke-width": 8, opacity: 0.6 }, g); }
      // tree between the buildings
      T.el("path", { d: `M470,${ST} l6,-160 l-30,-60 M476,${ST - 150} l26,-70`, fill: "none", stroke: theme.line.color, "stroke-width": 20, "stroke-linecap": "round" }, g);
      T.el("path", { d: `M470,${ST} l6,-160 l-30,-60 M476,${ST - 150} l26,-70`, fill: "none", stroke: "#8a6a4a", "stroke-width": 13, "stroke-linecap": "round" }, g);
      const crown = X.blob(480, ST - 330, 150, 170, { seed: 5, n: 14, irr: 0.12 });
      T.el("path", { d: crown, fill: "#7fae6a", ...X.ink(theme, 0.7) }, g);
      for (let i = 0; i < 6; i++) { const r = T.rng(50 + i), x = 400 + r() * 160, y = ST - 440 + r() * 220; T.el("path", { d: `M${x},${y} q14,-16 28,0`, fill: "none", ...X.ink(theme, 0.45) }, g); }
      X.shade(g, defs, crown, "#4f7f45", [[0, 0], [55, 0], [100, 0.8]]);
      // far sidewalk + street
      T.el("rect", { x: -60, y: ST, width: W + 120, height: 40, fill: "#c7c8c2", ...X.ink(theme, 0.6) }, g);
      T.el("rect", { x: -60, y: ST + 40, width: W + 120, height: 70, fill: "#8f9196", ...X.ink(theme, 0.6) }, g);
      // parked boxy car (generic sedan)
      const car = T.el("g", { transform: `translate(330,${ST + 30})` }, g);
      T.el("path", { d: "M-120,0 L-120,-60 L-60,-62 L-20,-120 L120,-120 L160,-62 L230,-58 L230,0 Z", fill: "#9fb2c9", ...X.ink(theme, 0.7) }, car);
      T.el("path", { d: "M-8,-66 L22,-110 L112,-110 L140,-66 Z", fill: "#d9e6ef", ...X.ink(theme, 0.5) }, car);
      T.el("path", { d: "M62,-110 L62,-66", ...X.ink(theme, 0.5) }, car);
      for (const x of [-60, 160]) { T.el("circle", { cx: x, cy: 0, r: 34, fill: "#3a3b40", ...X.ink(theme, 0.6) }, car); T.el("circle", { cx: x, cy: 0, r: 14, fill: "#c9ccd0", ...X.ink(theme, 0.4) }, car); }
      T.el("rect", { x: 210, y: -50, width: 18, height: 22, fill: "#d9534a", ...X.ink(theme, 0.4) }, car);
      // hydrant
      T.el("path", { d: `M690,${ST + 4} l0,-50 q0,-18 18,-18 q18,0 18,18 l0,50 Z`, fill: "#c8573f", ...X.ink(theme, 0.6) }, g);
      T.el("rect", { x: 680, y: ST - 40, width: 56, height: 12, rx: 5, fill: "#c8573f", ...X.ink(theme, 0.5) }, g);
      return null;
    },
  };
})(window);
