/** Set NEW YORK — DETAILS: brick canyon walls with a rooftop water tower, a fire escape, a glowing billboard, traffic light, a yellow cab, crosswalk. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("newyork").details = {
    build({ g, theme, defs, width: W, ground: G, height: H }) {
      const block = (x0, x1, top, fill, seed) => {
        T.el("rect", { x: x0, y: top, width: x1 - x0, height: G - 140 - top, fill, ...X.ink(theme, 0.8) }, g);
        X.brickMarks(g, theme, { x0, x1, y0: top + 30, y1: G - 200, n: 14, seed });
        const r = T.rng(seed);
        for (let y = top + 60; y < G - 230; y += 150) for (let x = x0 + 30; x < x1 - 80; x += 120) {
          T.el("rect", { x, y, width: 70, height: 100, fill: r() < 0.4 ? "#ffd98a" : "#3d4466", ...X.ink(theme, 0.6) }, g);
          T.el("rect", { x: x - 6, y: y + 100, width: 82, height: 10, fill: "#c9b6a6", ...X.ink(theme, 0.4) }, g);
        }
        X.shade(g, defs, X.rectD(x0, top, x1 - x0, G - 140 - top), "#3a2c34", [[0, 0.3], [40, 0], [100, 0.6]]);
      };
      block(-60, 300, 420, "#8a6f62", 3);
      block(800, W + 60, 260, "#a3897a", 4);
      // water tower on the left roof
      const wt = T.el("g", { transform: "translate(130,420)" }, g);
      for (const x of [-50, 50]) T.el("path", { d: `M${x},0 L${x * 0.8},-70`, ...X.ink(theme, 1) }, wt);
      T.el("path", { d: "M-60,-70 L60,-70 L54,-190 L-54,-190 Z", fill: "#9a6a44", ...X.ink(theme, 0.8) }, wt);
      for (let k = 1; k < 6; k++) T.el("path", { d: `M${-54 + k * 18},-190 l0,120`, ...X.ink(theme, 0.35) }, wt);
      T.el("path", { d: "M-62,-190 L0,-250 L62,-190 Z", fill: "#7a5236", ...X.ink(theme, 0.8) }, wt);
      // fire escape on the right
      for (let k = 0; k < 4; k++) {
        const y = 420 + k * 220;
        T.el("path", { d: `M800,${y} L1000,${y} M800,${y - 40} L1000,${y - 40}`, ...X.ink(theme, 1) }, g);
        let d = ""; for (let x = 806; x < 1000; x += 14) d += `M${x},${y - 40} l0,40 `;
        T.el("path", { d, ...X.ink(theme, 0.35) }, g);
        if (k < 3) T.el("path", { d: `M${k % 2 ? 820 : 980},${y} L${k % 2 ? 980 : 820},${y + 180}`, ...X.ink(theme, 0.9) }, g);
      }
      // billboard (abstract, no brand)
      const bb = T.el("rect", { x: 820, y: 1060, width: 230, height: 150, rx: 6, fill: "#2a2d4a", stroke: "#ff5fb0", "stroke-width": 8 }, g);
      T.el("circle", { cx: 880, cy: 1135, r: 36, fill: "#5ff0e8" }, g);
      X.glyphs(g, theme, { x: 930, y: 1125, n: 4, size: 22, color: "#ffd25a", seed: 11 });
      X.glyphs(g, theme, { x: 930, y: 1170, n: 3, size: 18, color: "#ff8fd0", seed: 12 });
      // traffic light
      T.el("path", { d: `M330,${G - 120} L330,${G - 560}`, stroke: theme.line.color, "stroke-width": 14 }, g);
      T.el("rect", { x: 300, y: G - 760, width: 60, height: 200, rx: 12, fill: "#2f3a2f", ...X.ink(theme, 0.7) }, g);
      const lights = ["#ff4a3a", "#ffc23a", "#4adf6a"].map((c, i) => T.el("circle", { cx: 330, cy: G - 725 + i * 62, r: 20, fill: c, ...X.ink(theme, 0.5) }, g));
      // street, sidewalk, crosswalk
      T.el("rect", { x: -60, y: G - 140, width: W + 120, height: 60, fill: "#9a9ca3", ...X.ink(theme, 0.6) }, g);
      const road = X.rectD(-60, G - 80, W + 120, H - G + 140);
      T.el("path", { d: road, fill: "#4a4d55", ...X.ink(theme, 0.6) }, g);
      for (let k = 0; k < 7; k++) { const y = G + 60 + k * 60; T.el("path", { d: `M${80 - k * 30},${y} L${W - 80 + k * 30},${y}`, stroke: "#e8e6dc", "stroke-width": 26 + k * 3 }, g); }
      // cab
      const cab = T.el("g", {}, g);
      T.el("path", { d: "M-220,0 L-220,-90 L-140,-96 L-90,-170 L90,-170 L140,-96 L220,-90 L220,0 Z", fill: "#f2c230", ...X.ink(theme, 0.9) }, cab);
      T.el("path", { d: "M-76,-102 L-44,-154 L44,-154 L76,-102 Z", fill: "#cfe0ea", ...X.ink(theme, 0.6) }, cab);
      T.el("rect", { x: -40, y: -200, width: 80, height: 28, rx: 6, fill: "#fff6c8", ...X.ink(theme, 0.6) }, cab);
      let ch = ""; for (let k = 0; k < 16; k++) ch += `M${-200 + k * 25},-60 h12 v12 h-12 Z `;
      T.el("path", { d: ch, fill: theme.line.color }, cab);
      for (const x of [-130, 130]) { T.el("circle", { cx: x, cy: 0, r: 40, fill: "#2d2f33", ...X.ink(theme, 0.7) }, cab); T.el("circle", { cx: x, cy: 0, r: 16, fill: "#c9ccd0", ...X.ink(theme, 0.5) }, cab); }
      void bb;
      return { update(t) { const ph = Math.floor(t / 1.5) % 3; lights.forEach((l, i) => l.setAttribute("opacity", i === ph ? "1" : "0.25")); cab.setAttribute("transform", `translate(220,${G - 30 + (Math.floor(t * 12) % 2) * 3})`); } };
    },
  };
})(window);
