/** Set GIZA — DETAILS: rippled sand with contour strokes and dry tufts, a camel strolling past, rocks. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("giza").details = {
    build({ g, theme, defs, width: W, ground: G, height: H }) {
      const sand = X.hillD(-80, W + 80, G - 230, 30, { seed: 6, bumps: 2, bottom: H + 60 });
      T.el("path", { d: sand, fill: "#edcf8e", ...X.ink(theme, 0.7) }, g);
      X.shade(g, defs, sand, "#c9a060", [[0, 0.6], [10, 0], [70, 0], [100, 0.5]]);
      X.contours(g, theme, { y0: G - 200, y1: H - 40, n: 26, seed: 7 });
      X.tufts(g, theme, { y0: G - 200, y1: H - 120, n: 10, color: "#c9b26a", seed: 8 });
      X.rock(g, theme, { x: 960, y: G + 40, rx: 70, ry: 30, fill: "#c9944e", facet: "#e3b26a", seed: 9 });
      const camel = T.el("g", {}, g);
      T.el("path", { d: "M-90,-120 Q-70,-190 -30,-150 Q0,-210 40,-150 Q70,-140 70,-110 L74,-60 L60,-60 L56,-100 L-60,-100 L-64,-60 L-78,-60 Z", fill: "#c8955a", ...X.ink(theme, 0.7) }, camel);
      T.el("path", { d: "M60,-130 Q100,-170 110,-220 L134,-222 L140,-206 L120,-200 Q112,-150 74,-110 Z", fill: "#c8955a", ...X.ink(theme, 0.7) }, camel);
      T.el("circle", { cx: 124, cy: -212, r: 3, fill: theme.line.color }, camel);
      const legs = T.el("path", { fill: "none", ...X.ink(theme, 1.6), stroke: "#8a6238" }, camel);
      T.el("path", { d: "M-92,-118 q-20,10 -26,40", fill: "none", ...X.ink(theme, 0.6) }, camel);
      return { update(t) { const st = Math.floor(t * 6) % 2 ? 12 : -12, x = 60 + ((t * 40) % 300); legs.setAttribute("d", `M-56,-62 l${st},62 M-30,-62 l${-st},62 M30,-62 l${st},62 M56,-62 l${-st},62`); camel.setAttribute("transform", `translate(${x},${G - 150 + (st > 0 ? -3 : 0)}) scale(0.9)`); } };
    },
  };
})(window);
