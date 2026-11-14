/** Set VENICE — FOREGROUND: a striped mooring pole and rope cut by the right edge, a pigeon-free iron bollard on the left. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("venice").foreground = {
    build({ g, theme, width: W, height: H }) {
      T.el("rect", { x: W - 90, y: 900, width: 60, height: 1100, fill: "#f4f1ea", ...X.ink(theme, 0.9) }, g);
      for (let y = 920; y < H; y += 120) T.el("path", { d: `M${W - 90},${y} l60,-40 l0,70 l-60,40 Z`, fill: "#d23a2f" }, g);
      T.el("path", { d: `M${W - 90},1400 Q${W - 300},1520 ${W - 420},${H + 40}`, fill: "none", stroke: theme.line.color, "stroke-width": 16 }, g);
      T.el("path", { d: `M${W - 90},1400 Q${W - 300},1520 ${W - 420},${H + 40}`, fill: "none", stroke: "#c9a46a", "stroke-width": 10, "stroke-dasharray": "14 6" }, g);
      T.el("path", { d: `M40,${H + 40} L40,${H - 200} Q90,${H - 260} 140,${H - 200} L140,${H + 40} Z`, fill: "#3a3d42", ...X.ink(theme, 0.9) }, g);
      return null;
    },
  };
})(window);
