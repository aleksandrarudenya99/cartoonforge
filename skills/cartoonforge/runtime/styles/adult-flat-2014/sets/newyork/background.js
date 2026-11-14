/** Set NEW YORK — BACKGROUND: violet-to-orange evening sky, a stepped art-deco spire, far towers with lit windows. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("newyork").background = {
    build({ g, theme, defs, look, width: W, ground: G }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.26 });
      X.sky(g, defs, { w: W + 120, h: G, stops: [[0, "#2a2f5a"], [50, "#6f4e7e"], [100, "#f0a066"]] });
      const clouds = X.cloudBands(g, { y0: 300, y1: 800, n: 7, color: "#c9708a", seed: 5, opacity: 0.6 });
      const r = T.rng(8);
      for (let i = 0; i < 10; i++) {
        const x = -40 + i * 120, h = 300 + r() * 400, top = G - 150 - h;
        T.el("rect", { x, y: top, width: 110, height: h, fill: "#4d5279", ...X.ink(theme, 0.4) }, g);
        for (let y = top + 20; y < G - 170; y += 34) for (let k = 0; k < 3; k++) if (r() < 0.35) T.el("rect", { x: x + 14 + k * 32, y, width: 18, height: 16, fill: "#ffd98a", opacity: 0.85 }, g);
      }
      // stepped art-deco spire
      const s = T.el("g", {}, g), cx = 600;
      [[220, 760], [170, 560], [120, 420], [80, 330], [40, 260]].forEach(([w, y]) => T.el("rect", { x: cx - w / 2, y, width: w, height: G - 150 - y, fill: "#5d6290", ...X.ink(theme, 0.6) }, s));
      T.el("path", { d: `M${cx - 14},260 L${cx},120 L${cx + 14},260 Z`, fill: "#7a80aa", ...X.ink(theme, 0.6) }, s);
      T.el("path", { d: `M${cx},120 l0,-70`, ...X.ink(theme, 0.6) }, s);
      for (let y = 360; y < G - 170; y += 40) T.el("path", { d: `M${cx - 30},${y} l60,0`, stroke: "#ffd98a", "stroke-width": 4, opacity: 0.7 }, s);
      const tip = T.el("circle", { cx, cy: 48, r: 7, fill: "#ff5a5a" }, g);
      return { update(t) { clouds.update(t); tip.setAttribute("opacity", Math.floor(t * 2) % 2 ? "1" : "0.25"); } };
    },
  };
})(window);
