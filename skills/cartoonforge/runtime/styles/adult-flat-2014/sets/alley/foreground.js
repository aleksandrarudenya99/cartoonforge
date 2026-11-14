/** Set ALLEY — FOREGROUND: a wall faucet and a green bottle cut by the right edge, litter at the bottom. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("alley").foreground = {
    build({ g, theme, width: W, height: H }) {
      T.el("path", { d: `M${W + 40},1380 L${W - 70},1380 Q${W - 120},1380 ${W - 120},1440 L${W - 120},1470`, fill: "none", stroke: theme.line.color, "stroke-width": 36, "stroke-linecap": "round" }, g);
      T.el("path", { d: `M${W + 40},1380 L${W - 70},1380 Q${W - 120},1380 ${W - 120},1440 L${W - 120},1470`, fill: "none", stroke: "#9aa0a6", "stroke-width": 26, "stroke-linecap": "round" }, g);
      T.el("path", { d: `M${W - 40},${H + 40} L${W - 40},${H - 260} q0,-40 30,-60 l0,-90 l60,0 l0,90 q30,20 30,60 L${W + 80},${H + 40} Z`, fill: "#4f7a4a", ...X.ink(theme, 0.9) }, g);
      X.can(g, theme, { x: 160, y: H - 60, s: 2 });
      T.el("path", { d: `M520,${H - 70} l70,-12 l10,30 l-74,10 Z`, fill: "#efeee8", ...X.ink(theme, 0.6) }, g);
      return null;
    },
  };
})(window);
