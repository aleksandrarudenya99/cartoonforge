/** Set RIO — BACKGROUND: sunset sky, a granite dome mountain with a cable car, a tiny statue on a far hilltop, ocean with moving wave lines. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("rio").background = {
    build({ g, theme, defs, look, width: W, ground: G }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.26 });
      X.sky(g, defs, { w: W + 120, h: G, stops: [[0, "#ff8a6e"], [45, "#ffb48a"], [100, "#ffe0a6"]] });
      const clouds = X.cloudBands(g, { y0: 160, y1: 700, n: 8, color: "#f7a0a0", seed: 6, opacity: 0.8 });
      X.shade(g, defs, X.ellD(300, G - 420, 220, 220), "#fff2c4", [[0, 1], [40, 0.7], [100, 0]], { radial: true });
      T.el("circle", { cx: 300, cy: G - 420, r: 80, fill: "#fff4cc" }, g);
      // far hill with a tiny statue
      T.el("path", { d: `M-80,${G - 330} Q60,${G - 640} 200,${G - 330} Z`, fill: "#6f7f8a", ...X.ink(theme, 0.5) }, g);
      T.el("path", { d: `M60,${G - 600} l0,-46 M42,${G - 636} l36,0`, stroke: "#eef0f2", "stroke-width": 6, "stroke-linecap": "round" }, g);
      // dome mountains + cable car
      const dome = (cx, w, h, seed) => { const d = `M${cx - w / 2},${G - 330} C${cx - w / 2},${G - 330 - h} ${cx + w / 2},${G - 330 - h * 1.15} ${cx + w / 2},${G - 330} Z`; T.el("path", { d, fill: "#5d7b62", ...X.ink(theme, 0.7) }, g); X.shade(g, defs, d, "#2f4a3a", [[0, 0], [50, 0], [100, 0.8]], { x1: 0, y1: 0, x2: 1, y2: 0 }); X.contours(g, theme, { x0: cx - w * 0.35, x1: cx + w * 0.2, y0: G - 330 - h * 0.7, y1: G - 360, n: 6, seed, color: "#3a5442" }); };
      dome(650, 260, 300, 3);
      dome(900, 380, 620, 4);
      T.el("path", { d: `M650,${G - 560} L900,${G - 800}`, ...X.ink(theme, 0.5) }, g);
      const car = T.el("g", {}, g);
      T.el("path", { d: "M0,0 l0,18", ...X.ink(theme, 0.5) }, car);
      T.el("rect", { x: -22, y: 18, width: 44, height: 30, rx: 6, fill: "#e8e2d4", ...X.ink(theme, 0.6) }, car);
      // ocean
      T.el("rect", { x: -60, y: G - 330, width: W + 120, height: 160, fill: "#3f9fbf", ...X.ink(theme, 0.6) }, g);
      const waves = Array.from({ length: 10 }, (_, i) => T.el("path", { d: "M0,0 q15,-8 30,0 t30,0", fill: "none", stroke: "#cdeef8", "stroke-width": 4, "stroke-linecap": "round" }, g));
      return { update(t) { clouds.update(t); const k = (t * 0.08) % 1; car.setAttribute("transform", `translate(${650 + 250 * k},${G - 560 - 240 * k})`); waves.forEach((n, i) => n.setAttribute("transform", `translate(${((i * 123 + t * 30) % (W + 120)) - 60},${G - 300 + (i % 4) * 36})`)); } };
    },
  };
})(window);
