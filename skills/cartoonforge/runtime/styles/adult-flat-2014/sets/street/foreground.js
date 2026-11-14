/**
 * Adult Flat Comedy — FOREGROUND: what sits in front of the characters at the bottom of frame.
 * Curb edge, a crack in the sidewalk, grass tufts poking out, a crushed can. Small, still,
 * slightly grimy: the comedy lives in the mundane details.
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  T.styles["adult-flat-2014"].set("street").foreground = {
    build({ g, theme, width: W, ground: G }) {
      const P = theme.palette, L = theme.line;
      const line = { stroke: L.color, "stroke-width": L.width, "stroke-linejoin": "round", "stroke-linecap": "round" };
      // curb
      T.el("rect", { ...line, x: -60, y: G + 112, width: W + 120, height: 26, fill: "#bdb7aa" }, g);
      // crack
      T.el("path", { ...line, d: `M${W * 0.62},${G + 18} l18,24 l-12,20 l26,22 l-6,22`, fill: "none", "stroke-width": L.width * 0.8 }, g);
      // grass tufts along the lawn edge
      const tufts = [40, 190, 420, 600, 860, 1010].map((x, i) => T.el("path", { ...line, d: `M${x},${G + 4} l8,-30 l6,26 l8,-36 l6,34 l8,-24 l4,30`, fill: P.lawnDark }, g));
      // crushed can
      const can = T.el("g", { transform: `translate(${W * 0.3},${G + 80}) rotate(-18)` }, g);
      T.el("path", { ...line, d: "M-30,-14 L26,-18 L32,-4 L20,4 L30,14 L-28,16 Z", fill: "#d9534f" }, can);
      T.el("path", { ...line, d: "M-12,-15 l4,30", fill: "none", "stroke-width": L.width * 0.7 }, can);
      return {
        update(t) {
          tufts.forEach((tf, i) => tf.setAttribute("transform", `translate(${Math.floor(t * 3 + i) % 2 ? 1.5 : 0},0)`));
        },
      };
    },
  };
})(window);
