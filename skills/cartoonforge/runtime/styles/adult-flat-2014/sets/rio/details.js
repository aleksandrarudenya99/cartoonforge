/** Set RIO — DETAILS: golden beach, swaying palms, a striped umbrella, and the wavy black-and-white mosaic promenade underfoot. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("rio").details = {
    build({ g, theme, defs, width: W, ground: G, height: H }) {
      T.el("rect", { x: -60, y: G - 170, width: W + 120, height: 120, fill: "#f3d39a", ...X.ink(theme, 0.6) }, g);
      X.pebbles(g, theme, { y0: G - 160, y1: G - 60, n: 20, colors: ["#d8b070", "#e9c890"], seed: 4 });
      const umb = T.el("g", { transform: `translate(930,${G - 60})` }, g);
      T.el("path", { d: "M0,0 L-30,-320", ...X.ink(theme, 1.2) }, umb);
      T.el("path", { d: "M-190,-280 Q-30,-420 130,-320 Z", fill: "#f4efe4", ...X.ink(theme, 0.8) }, umb);
      for (const [a, b] of [[-190, -120], [-50, 20]]) T.el("path", { d: `M${a},-280 Q-30,-420 ${b},-300 Z`, fill: "#3fa9c9" }, umb);
      T.el("path", { d: "M-190,-280 Q-30,-420 130,-320", fill: "none", ...X.ink(theme, 0.8) }, umb);
      // mosaic promenade
      const prom = X.rectD(-60, G - 60, W + 120, H - G + 120);
      T.el("path", { d: prom, fill: "#f4f1e8", ...X.ink(theme, 0.7) }, g);
      for (let k = 0; k < 6; k++) { const y = G - 20 + k * 82; let d = `M-80,${y} `; for (let x = -80; x < W + 80; x += 120) d += `q30,-40 60,0 t60,0 `; d += `L${W + 80},${y + 30} `; for (let x = W + 80; x > -80; x -= 120) d += `q-30,40 -60,0 t-60,0 `; T.el("path", { d: d + "Z", fill: "#262628" }, g); }
      X.shade(g, defs, prom, "#9c8a6a", [[0, 0.5], [12, 0], [100, 0]]);
      const palms = [[60, 1], [1010, -1]].map(([x, s]) => {
        const p = T.el("g", {}, g);
        T.el("path", { d: `M0,0 Q${s * 40},-300 ${s * 10},-620`, fill: "none", stroke: theme.line.color, "stroke-width": 36, "stroke-linecap": "round" }, p);
        T.el("path", { d: `M0,0 Q${s * 40},-300 ${s * 10},-620`, fill: "none", stroke: "#9a7a52", "stroke-width": 28, "stroke-linecap": "round" }, p);
        for (let k = 0; k < 8; k++) T.el("path", { d: `M${s * 10},${-560 - k * 8} l0,-6`, ...X.ink(theme, 0.4) }, p);
        const crown = T.el("g", { transform: `translate(${s * 10},-620)` }, p);
        for (let k = 0; k < 7; k++) { const a = -Math.PI + (k / 6) * Math.PI; T.el("path", { d: `M0,0 Q${Math.cos(a) * 120},${Math.sin(a) * 120 - 40} ${Math.cos(a) * 220},${Math.sin(a) * 90 + 60} Q${Math.cos(a) * 110},${Math.sin(a) * 110 - 10} 0,0 Z`, fill: "#4f9a52", ...X.ink(theme, 0.6) }, crown); }
        return { crown, x, s };
      });
      return { update(t) { palms.forEach((p, i) => { p.crown.parentNode.setAttribute("transform", `translate(${p.x},${G - 60})`); p.crown.setAttribute("transform", `translate(${p.s * 10},-620) rotate(${(Math.sin(t * 1.4 + i) * 4).toFixed(1)})`); }); } };
    },
  };
})(window);
