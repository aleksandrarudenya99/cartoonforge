/**
 * Set HOME — BACKGROUND: an ordinary family room. Cream walls airbrushed darker under the
 * ceiling and in the corners, plank floor in one-point perspective, an arched doorway into a
 * pink hall with stairs, a window onto soft green hills, curtains on a ring rod, framed pictures.
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("home").background = {
    build({ g, theme, defs, look, width: W, ground: G, height: H }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.2 });
      const FL = G - 170, VX = 540, VY = 760; // floor line, vanishing point
      T.el("rect", { x: -60, y: -60, width: W + 120, height: 230, fill: "#e4d9b2" }, g); // ceiling strip
      T.el("rect", { x: -60, y: 170, width: W + 120, height: FL - 170, fill: "#efe5c3", ...X.ink(theme, 0.6) }, g);
      X.shade(g, defs, X.rectD(-60, 170, W + 120, 220), "#c9b98a", [[0, 0.85], [100, 0]]);
      X.shade(g, defs, X.rectD(W - 140, 170, 200, FL - 170), "#c9b98a", [[0, 0], [100, 0.7]], { x1: 0, y1: 0, x2: 1, y2: 0 });

      // arched doorway into a pink hall (cut by the left frame edge)
      const door = `M-60,${FL} L-60,520 Q-60,380 90,380 L190,380 Q320,380 320,520 L320,${FL} Z`;
      T.el("path", { d: door, fill: "#f6f0dc", ...X.ink(theme, 0.8) }, g);
      const inner = `M-60,${FL} L-60,540 Q-50,420 95,420 L185,420 Q285,420 285,540 L285,${FL} Z`;
      T.el("path", { d: inner, fill: "#ecc8bf", ...X.ink(theme, 0.7) }, g);
      X.shade(g, defs, inner, "#c99a92", [[0, 0.7], [40, 0], [100, 0.3]]);
      T.el("path", { d: `M-60,${FL - 40} L130,${FL - 40} L130,${FL}`, fill: "none", ...X.ink(theme, 0.5) }, g);
      for (let i = 0; i < 5; i++) T.el("path", { d: `M${-40 + i * 34},${FL - 40 - i * 34} l34,0 l0,-34`, fill: "none", ...X.ink(theme, 0.55) }, g); // stairs
      T.el("path", { d: `M-40,${FL - 150} L170,${FL - 360}`, stroke: theme.line.color, "stroke-width": 13, "stroke-linecap": "round" }, g);
      T.el("path", { d: `M-40,${FL - 150} L170,${FL - 360}`, stroke: "#f6f0dc", "stroke-width": 8, "stroke-linecap": "round" }, g);
      for (let i = 0; i < 5; i++) T.el("path", { d: `M${-10 + i * 40},${FL - 180 - i * 40} l0,${120}`, ...X.ink(theme, 0.5) }, g);
      X.picture(g, theme, { x: 60, y: 470, w: 80, h: 100, art: "boat", seed: 2 });

      // window onto green hills
      const wx = 560, wy = 470, ww = 440, wh = 430;
      T.el("rect", { x: wx, y: wy, width: ww, height: wh, fill: "#dfeae0" }, g);
      T.el("path", { d: X.hillD(wx, wx + ww, wy + wh * 0.6, 50, { seed: 3, bumps: 2, bottom: wy + wh }), fill: "#b7cf9b" }, g);
      T.el("path", { d: X.hillD(wx, wx + ww, wy + wh * 0.78, 30, { seed: 4, bumps: 3, bottom: wy + wh }), fill: "#a3c188" }, g);
      X.cloudBands(g, { x0: wx, x1: wx + ww - 200, y0: wy + 30, y1: wy + 160, n: 3, color: "#f5f8f2", seed: 5, wMin: 120, wMax: 220 });
      for (const k of [0.25, 0.6]) T.el("path", { d: `M${wx + ww * k},${wy + wh * 0.9} l${ww * 0.18},${-wh * 0.75}`, stroke: "#ffffff", "stroke-width": 10, opacity: 0.45, "stroke-linecap": "round" }, g);
      T.el("rect", { x: wx, y: wy, width: ww, height: wh, fill: "none", stroke: "#e9dfc2", "stroke-width": 16 }, g);
      T.el("rect", { x: wx - 8, y: wy - 8, width: ww + 16, height: wh + 16, fill: "none", ...X.ink(theme, 0.7) }, g);
      T.el("rect", { x: wx + 8, y: wy + 8, width: ww - 16, height: wh - 16, fill: "none", ...X.ink(theme, 0.5) }, g);
      for (const k of [1 / 3, 2 / 3]) T.el("rect", { x: wx + ww * k - 6, y: wy, width: 12, height: wh, fill: "#e9dfc2", ...X.ink(theme, 0.45) }, g);
      T.el("rect", { x: wx - 20, y: wy + wh, width: ww + 40, height: 18, fill: "#f6f0dc", ...X.ink(theme, 0.6) }, g);
      X.curtain(g, defs, theme, { x: wx - 50, top: wy - 70, w: 90, h: 560, color: "#cf9a92", shadeC: "#a86e68", seed: 6, side: -1 });
      X.curtain(g, defs, theme, { x: wx + ww - 40, top: wy - 70, w: 90, h: 560, color: "#cf9a92", shadeC: "#a86e68", seed: 7, side: 1 });
      X.rod(g, theme, { x0: wx - 70, x1: wx + ww + 70, y: wy - 76, rings: [wx - 40, wx - 20, wx, wx + ww - 30, wx + ww - 5, wx + ww + 25] });

      X.picture(g, theme, { x: 370, y: 520, w: 140, h: 170, art: "flowers", seed: 8 });
      X.picture(g, theme, { x: 760, y: 1000, w: 200, h: 150, art: "hills", seed: 9 });
      T.el("rect", { x: 470, y: 1180, width: 28, height: 44, rx: 4, fill: "#f6f0dc", ...X.ink(theme, 0.5) }, g); // outlet
      T.el("path", { d: "M480,1195 l0,8 M488,1195 l0,8", ...X.ink(theme, 0.4) }, g);

      // baseboard + plank floor in perspective
      T.el("rect", { x: -60, y: FL - 22, width: W + 120, height: 22, fill: "#f6f0dc", ...X.ink(theme, 0.6) }, g);
      T.el("rect", { x: -60, y: FL, width: W + 120, height: H - FL + 60, fill: "#d9b98b", ...X.ink(theme, 0.6) }, g);
      const k = (H + 40 - VY) / (FL - VY), r = T.rng(10);
      for (let x = -700; x < W + 700; x += 120) {
        T.el("path", { d: `M${x},${FL} L${(VX + (x - VX) * k).toFixed(0)},${H + 40}`, ...X.ink(theme, 0.4) }, g);
        for (let j = 0; j < 3; j++) { const t = 0.1 + r() * 0.85, y = FL + t * (H - FL), x0 = VX + (x - VX) * ((y - VY) / (FL - VY)), x1 = VX + (x + 120 - VX) * ((y - VY) / (FL - VY)); T.el("path", { d: `M${x0.toFixed(0)},${y.toFixed(0)} L${x1.toFixed(0)},${y.toFixed(0)}`, ...X.ink(theme, 0.35) }, g); }
      }
      X.shade(g, defs, X.rectD(-60, FL, W + 120, 260), "#a7835a", [[0, 0.7], [100, 0]]);
      return null;
    },
  };
})(window);
