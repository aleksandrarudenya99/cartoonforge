/** Set VENICE — DETAILS: colourful canal houses with arched windows, green shutters, flower boxes and funnel chimneys; a canal with a gliding gondola and striped poles; a stone walkway underfoot. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("venice").details = {
    build({ g, theme, defs, width: W, ground: G, height: H }) {
      const house = (x0, x1, top, fill, seed) => {
        T.el("rect", { x: x0, y: top, width: x1 - x0, height: G - 60 - top, fill, ...X.ink(theme, 0.8) }, g);
        T.el("path", { d: `M${x0 + 40},${top} l0,-60 l-14,-20 l48,0 l-14,20 l0,60`, fill: "#b05a44", ...X.ink(theme, 0.6) }, g);
        const r = T.rng(seed);
        for (let y = top + 70; y < G - 380; y += 190) for (let x = x0 + 40; x < x1 - 90; x += 130) {
          T.el("path", { d: `M${x},${y + 120} l0,-90 q35,-40 70,0 l0,90 Z`, fill: "#3d4a5a", ...X.ink(theme, 0.6) }, g);
          for (const sx of [-26, 70]) T.el("rect", { x: x + sx, y: y + 20, width: 26, height: 100, fill: "#3f8a5a", ...X.ink(theme, 0.5) }, g);
          if (r() < 0.6) { T.el("rect", { x: x - 6, y: y + 120, width: 82, height: 20, fill: "#8a5a3a", ...X.ink(theme, 0.5) }, g); for (let k = 0; k < 4; k++) T.el("circle", { cx: x + 6 + k * 20, cy: y + 114, r: 9, fill: ["#ff5f6a", "#ffd23f", "#ff8fd0"][k % 3], ...X.ink(theme, 0.4) }, g); }
        }
        X.shade(g, defs, X.rectD(x0, top, x1 - x0, G - 60 - top), "#5a3a30", [[0, 0], [70, 0], [100, 0.55]]);
      };
      house(-60, 300, 380, "#e3a06a", 1);
      house(780, W + 60, 300, "#e8c27a", 2);
      // canal
      const water = T.el("rect", { x: -60, y: G - 430, width: W + 120, height: 370, fill: "#4e9c98", ...X.ink(theme, 0.6) }, g);
      X.shade(g, defs, X.rectD(-60, G - 430, W + 120, 370), "#2f6a6a", [[0, 0.6], [30, 0], [100, 0]]);
      const ripples = Array.from({ length: 16 }, (_, i) => T.el("path", { d: `M0,0 q20,-8 40,0 t40,0`, fill: "none", stroke: "#bfe6e0", "stroke-width": 4, "stroke-linecap": "round" }, g));
      for (const [x, c] of [[300, "#d23a2f"], [345, "#d23a2f"], [760, "#3a5ad2"]]) { T.el("rect", { x: x - 9, y: G - 560, width: 18, height: 440, fill: "#f4f1ea", ...X.ink(theme, 0.6) }, g); for (let y = G - 540; y < G - 140; y += 60) T.el("path", { d: `M${x - 9},${y} l18,-14 l0,26 l-18,14 Z`, fill: c }, g); T.el("circle", { cx: x, cy: G - 566, r: 12, fill: "#d9b45a", ...X.ink(theme, 0.5) }, g); }
      const gon = T.el("g", {}, g);
      T.el("path", { d: "M-260,-20 Q-200,10 0,10 Q200,10 260,-30 Q290,-80 280,-120 Q260,-60 230,-50 Q0,-30 -240,-50 Q-270,-60 -260,-20 Z", fill: "#1e1e22", ...X.ink(theme, 0.7) }, gon);
      T.el("path", { d: "M270,-110 l20,-6 l-8,20 Z", fill: "#d9d9d9", ...X.ink(theme, 0.4) }, gon);
      T.el("path", { d: "M-120,-46 Q-60,-70 0,-46 Z", fill: "#c9473f", ...X.ink(theme, 0.5) }, gon);
      // stone walkway
      const wk = X.rectD(-60, G - 60, W + 120, H - G + 120);
      T.el("path", { d: wk, fill: "#d7cbb3", ...X.ink(theme, 0.8) }, g);
      T.el("rect", { x: -60, y: G - 60, width: W + 120, height: 26, fill: "#c4b796", ...X.ink(theme, 0.6) }, g);
      for (let row = 0; row < 6; row++) { const y = G - 34 + row * 80; T.el("path", { d: `M-60,${y} L${W + 60},${y}`, ...X.ink(theme, 0.35) }, g); for (let x = (row % 2) * 90; x < W; x += 180) T.el("path", { d: `M${x},${y} l0,80`, ...X.ink(theme, 0.35) }, g); }
      void water;
      return { update(t) { gon.setAttribute("transform", `translate(${W + 300 - ((t * 120) % (W + 700))},${G - 190}) rotate(${(Math.sin(t * 2) * 1.2).toFixed(2)})`); ripples.forEach((n, i) => n.setAttribute("transform", `translate(${((i * 141 + t * 18) % (W + 120)) - 60},${G - 400 + (i % 6) * 54})`)); } };
    },
  };
})(window);
