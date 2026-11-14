/** Set HOME — FOREGROUND: a green armchair cut by the bottom-left frame corner, tall books bottom-right. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("home").foreground = {
    build({ g, theme, defs, height: H, width: W }) {
      const back = `M-80,${H - 330} Q-80,${H - 380} -20,${H - 380} L220,${H - 380} Q290,${H - 380} 290,${H - 300} L290,${H + 40} L-80,${H + 40} Z`;
      T.el("path", { d: back, fill: "#86c294", ...X.ink(theme, 0.9) }, g);
      X.shade(g, defs, back, "#4f8a5f", [[0, 0], [50, 0.2], [100, 0.85]]);
      const arm = `M180,${H - 220} Q180,${H - 280} 250,${H - 280} L300,${H - 280} Q360,${H - 280} 360,${H - 210} L360,${H + 40} L180,${H + 40} Z`;
      T.el("path", { d: arm, fill: "#7dba8b", ...X.ink(theme, 0.9) }, g);
      T.el("path", { d: `M200,${H - 240} Q260,${H - 262} 340,${H - 240}`, fill: "none", stroke: "#bfe6c8", "stroke-width": 8, "stroke-linecap": "round" }, g);
      ["#6f7fb5", "#a95f6e", "#8d8fbf"].forEach((c, i) => {
        const x = W - 200 + i * 70, top = H - 420 + i * 30;
        T.el("rect", { x, y: top, width: 70, height: H - top + 40, rx: 10, fill: c, ...X.ink(theme, 0.8) }, g);
        T.el("path", { d: `M${x + 10},${top + 30} l50,0 M${x + 10},${top + 50} l50,0`, ...X.ink(theme, 0.5) }, g);
      });
      return null;
    },
  };
})(window);
