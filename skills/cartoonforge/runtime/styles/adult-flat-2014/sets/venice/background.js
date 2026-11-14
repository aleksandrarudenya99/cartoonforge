/** Set VENICE — BACKGROUND: clear sky, a brick bell tower with a green pyramid cap, a stone arched bridge across the canal. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("venice").background = {
    build({ g, theme, defs, look, width: W, ground: G }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.22 });
      X.sky(g, defs, { w: W + 120, h: G, stops: [[0, "#9fcbe6"], [100, "#eef1ec"]] });
      const clouds = X.cloudBands(g, { y0: 60, y1: 600, n: 8, color: "#ffffff", seed: 7, opacity: 0.8 });
      const ct = T.el("g", {}, g), cx = 770;
      T.el("rect", { x: cx - 50, y: 330, width: 100, height: G - 420 - 330, fill: "#c96a50", ...X.ink(theme, 0.7) }, ct);
      for (let k = 1; k < 4; k++) T.el("path", { d: `M${cx - 50 + k * 25},340 l0,${G - 770}`, ...X.ink(theme, 0.3) }, ct);
      T.el("rect", { x: cx - 58, y: 250, width: 116, height: 90, fill: "#efe2c4", ...X.ink(theme, 0.7) }, ct);
      for (let k = 0; k < 3; k++) T.el("path", { d: `M${cx - 42 + k * 32},330 l0,-50 q10,-14 20,0 l0,50`, fill: "#5d5a4e", ...X.ink(theme, 0.4) }, ct);
      T.el("path", { d: `M${cx - 58},250 L${cx},130 L${cx + 58},250 Z`, fill: "#6fae8a", ...X.ink(theme, 0.7) }, ct);
      T.el("path", { d: `M${cx},130 l0,-30`, stroke: "#d9b45a", "stroke-width": 6 }, ct);
      // arched stone bridge in the distance
      const by = G - 420;
      T.el("path", { d: `M200,${by + 60} Q540,${by - 170} 880,${by + 60} L880,${by + 110} Q540,${by - 90} 200,${by + 110} Z`, fill: "#ebe0c8", ...X.ink(theme, 0.7) }, g);
      for (let k = 0; k < 7; k++) { const x = 330 + k * 60, y = by - 40 - Math.sin(((x - 200) / 680) * Math.PI) * 80; T.el("path", { d: `M${x},${y + 40} l0,-30 q14,-18 28,0 l0,30`, fill: "#bfb194", ...X.ink(theme, 0.4) }, g); }
      return { update(t) { clouds.update(t); } };
    },
  };
})(window);
