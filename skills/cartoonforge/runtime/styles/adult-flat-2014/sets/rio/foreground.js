/** Set RIO — FOREGROUND: a coconut drink with a straw and a tiny umbrella. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("rio").foreground = {
    build({ g, theme, height: H }) {
      const c = T.el("g", { transform: `translate(150,${H - 120})` }, g);
      T.el("path", { d: "M40,-120 L90,-260", ...X.ink(theme, 1.4), stroke: "#ff5f8a" }, c);
      T.el("circle", { cx: 0, cy: 0, r: 110, fill: "#7a4a2a", ...X.ink(theme, 0.9) }, c);
      T.el("ellipse", { cx: 0, cy: -80, rx: 82, ry: 26, fill: "#f4efe4", ...X.ink(theme, 0.7) }, c);
      T.el("path", { d: "M-20,-90 L-60,-200 M-110,-200 Q-60,-250 -10,-200 Z", fill: "#ffd23f", ...X.ink(theme, 0.6) }, c);
      return null;
    },
  };
})(window);
