/** Set LONDON — BACKGROUND: low grey rain clouds, a gothic clock tower with a big white clock, a row of pinnacles, a wet road. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("london").background = {
    build({ g, theme, defs, look, width: W, ground: G }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.28 });
      X.sky(g, defs, { w: W + 120, h: G, stops: [[0, "#8e99a5"], [100, "#cbd2d8"]] });
      const clouds = X.cloudBands(g, { y0: 30, y1: 620, n: 11, color: "#7a8591", seed: 4, opacity: 0.9 });
      // row of gothic pinnacles
      let d = `M380,${G - 200} L380,${G - 300} `; for (let x = 380; x < 760; x += 38) d += `L${x + 8},${G - 300} L${x + 19},${G - 360} L${x + 30},${G - 300} `;
      T.el("path", { d: d + `L760,${G - 300} L760,${G - 200} Z`, fill: "#b8995e", ...X.ink(theme, 0.6) }, g);
      for (let x = 400; x < 760; x += 38) T.el("path", { d: `M${x},${G - 290} l0,80`, ...X.ink(theme, 0.35) }, g);
      // clock tower
      const cx = 880, tw = 220, body = 520;
      T.el("rect", { x: cx - tw / 2, y: body, width: tw, height: G - 200 - body, fill: "#c9a86a", ...X.ink(theme, 0.8) }, g);
      for (let k = 1; k < 6; k++) T.el("path", { d: `M${cx - tw / 2 + (k * tw) / 6},${body + 10} l0,${G - 220 - body}`, ...X.ink(theme, 0.35) }, g);
      for (let y = body + 80; y < G - 220; y += 110) T.el("path", { d: `M${cx - tw / 2},${y} l${tw},0`, ...X.ink(theme, 0.5) }, g);
      T.el("rect", { x: cx - tw / 2 - 14, y: 290, width: tw + 28, height: 240, fill: "#d6b97c", ...X.ink(theme, 0.8) }, g);
      T.el("circle", { cx, cy: 410, r: 96, fill: "#d9b45a", ...X.ink(theme, 0.8) }, g);
      T.el("circle", { cx, cy: 410, r: 80, fill: "#f4efe0", ...X.ink(theme, 0.6) }, g);
      for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; T.el("path", { d: `M${cx + Math.cos(a) * 66},${410 + Math.sin(a) * 66} L${cx + Math.cos(a) * 76},${410 + Math.sin(a) * 76}`, ...X.ink(theme, 0.5) }, g); }
      const hands = T.el("g", { transform: `translate(${cx},410)` }, g);
      const hm = T.el("path", { d: "M0,0 L0,-62", ...X.ink(theme, 1.1) }, hands);
      T.el("path", { d: "M0,0 L-36,-20", ...X.ink(theme, 1.4) }, hands);
      T.el("path", { d: `M${cx - tw / 2 - 14},290 L${cx - tw / 2 + 10},230 L${cx + tw / 2 - 10},230 L${cx + tw / 2 + 14},290 Z`, fill: "#b8995e", ...X.ink(theme, 0.7) }, g);
      for (let k = 0; k < 4; k++) T.el("path", { d: `M${cx - 80 + k * 46},288 l0,-40 q12,-16 24,0 l0,40`, fill: "#5d5a4e", ...X.ink(theme, 0.5) }, g);
      T.el("path", { d: `M${cx - tw / 2 + 10},230 L${cx},20 L${cx + tw / 2 - 10},230 Z`, fill: "#4c5a4f", ...X.ink(theme, 0.8) }, g);
      for (const sx of [-1, 1]) T.el("path", { d: `M${cx + sx * (tw / 2 - 4)},300 l${sx * 8},-120 l${sx * 8},120`, fill: "#b8995e", ...X.ink(theme, 0.5) }, g);
      T.el("path", { d: `M${cx},20 l0,-30`, stroke: "#d9b45a", "stroke-width": 8 }, g);
      X.shade(g, defs, X.rectD(cx - tw / 2, 230, tw, G - 430), "#7c6a42", [[0, 0], [55, 0], [100, 0.75]], { x1: 0, y1: 0, x2: 1, y2: 0 });
      // wet road
      T.el("rect", { x: -60, y: G - 200, width: W + 120, height: 110, fill: "#5e646b", ...X.ink(theme, 0.6) }, g);
      for (let x = 0; x < W; x += 160) T.el("rect", { x, y: G - 150, width: 80, height: 8, fill: "#e6e2d4" }, g);
      return { update(t) { clouds.update(t); hm.setAttribute("transform", `rotate(${t * 6})`); } };
    },
  };
})(window);
