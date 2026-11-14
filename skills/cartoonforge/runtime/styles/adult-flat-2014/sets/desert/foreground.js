/** Set DESERT — FOREGROUND: a purple boulder cut by the bottom frame edge, big tufts, pebbles. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("desert").foreground = {
    build({ g, theme, height: H }) {
      X.rock(g, theme, { x: 660, y: H - 10, rx: 170, ry: 80, fill: "#8d6cc4", facet: "#b597e2", seed: 41 });
      X.tufts(g, theme, { x0: 0, x1: 1080, y0: H - 220, y1: H - 40, n: 9, color: "#c8efae", seed: 42, sMin: 1.3, sMax: 1.8 });
      X.pebbles(g, theme, { y0: H - 200, y1: H - 20, n: 10, colors: ["#8a3a52", "#6e4a9a"], seed: 43 });
      return null;
    },
  };
})(window);
