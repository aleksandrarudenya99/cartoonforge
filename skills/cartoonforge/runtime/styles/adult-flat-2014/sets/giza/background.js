/** Set GIZA — BACKGROUND: hot pale sky with a white sun, three pyramids with lit and shaded faces and step lines, a reclining stone guardian. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("giza").background = {
    build({ g, theme, defs, look, width: W, ground: G }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.3 });
      X.sky(g, defs, { w: W + 120, h: G, stops: [[0, "#efc36a"], [60, "#f6dc95"], [100, "#fbecc6"]] });
      X.shade(g, defs, X.ellD(820, 300, 260, 260), "#fffbe6", [[0, 1], [45, 0.8], [100, 0]], { radial: true });
      T.el("circle", { cx: 820, cy: 300, r: 100, fill: "#fff8dc", ...X.ink(theme, 0.4) }, g);
      T.el("path", { d: X.hillD(-80, W + 80, G - 300, 40, { seed: 4, bumps: 3 }), fill: "#ebc983", ...X.ink(theme, 0.5) }, g);
      const pyr = (cx, base, hw, h, seed) => {
        T.el("path", { d: `M${cx - hw},${base} L${cx},${base - h} L${cx + hw * 0.35},${base} Z`, fill: "#ecc57d", ...X.ink(theme, 0.7) }, g);
        T.el("path", { d: `M${cx + hw * 0.35},${base} L${cx},${base - h} L${cx + hw},${base} Z`, fill: "#c9944e", ...X.ink(theme, 0.7) }, g);
        const r = T.rng(seed);
        for (let y = base - 26; y > base - h + 30; y -= 26) { const k = (base - y) / h, xl = cx - hw * (1 - k), xr = cx + hw * (1 - k); for (let x = xl + r() * 30; x < xr - 20; x += 50 + r() * 60) T.el("path", { d: `M${x.toFixed(0)},${y} l${(20 + r() * 30).toFixed(0)},0`, ...X.ink(theme, 0.3) }, g); }
        X.shade(g, defs, `M${cx - hw},${base} L${cx},${base - h} L${cx + hw},${base} Z`, "#a8743a", [[0, 0], [70, 0], [100, 0.5]]);
      };
      pyr(830, G - 290, 230, 330, 2);
      pyr(1030, G - 290, 120, 170, 3);
      pyr(300, G - 250, 420, 600, 1);
      // reclining guardian (generic stone lion with a headdress)
      const s = T.el("g", { transform: `translate(620,${G - 260})` }, g);
      T.el("path", { d: "M-110,0 L-110,-40 Q-80,-62 40,-58 L70,-58 L70,0 Z", fill: "#d9ab64", ...X.ink(theme, 0.6) }, s);
      T.el("path", { d: "M40,-58 L44,-120 L96,-120 L104,-58 Z", fill: "#d9ab64", ...X.ink(theme, 0.6) }, s);
      T.el("path", { d: "M50,-112 L90,-112 M54,-100 L86,-100", ...X.ink(theme, 0.35) }, s);
      return null;
    },
  };
})(window);
