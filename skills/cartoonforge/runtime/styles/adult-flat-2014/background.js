/**
 * Adult Flat Comedy — BACKGROUND: alien night sky over a quiet suburb.
 * Flat colour bands (no soft gradients inside shapes), a ringed planet, a second moon,
 * a few twinkling stars, far hills. Moves very little: deadpan staging.
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  T.styles["adult-flat-2014"].parts.background = {
    build({ g, theme, width: W, ground: G }) {
      const P = theme.palette, L = theme.line;
      const line = { stroke: L.color, "stroke-width": L.width, "stroke-linejoin": "round" };
      // flat sky bands (adult flat comedy skies are banded, not airbrushed)
      [[0, P.skyTop], [560, P.skyMid], [980, P.skyLow], [G - 300, P.horizon]].forEach(([y, c], i, a) => {
        const next = i < a.length - 1 ? a[i + 1][0] : G;
        T.el("rect", { x: -60, y, width: W + 120, height: next - y + 2, fill: c }, g);
      });
      // stars: dots + a few 4-point sparkles
      const stars = Array.from({ length: 34 }, (_, i) => {
        const r = T.rng(i + 400), big = r() < 0.18;
        return { n: big ? T.el("path", { d: T.shapes.star(r() * W, 80 + r() * 820, 9, 4, 0.22), fill: P.white }, g) : T.el("circle", { cx: r() * W, cy: 80 + r() * 860, r: 2 + r() * 2.5, fill: P.white }, g), i };
      });
      // ringed planet (flat, outlined, one flat shadow crescent)
      const planet = T.el("g", { transform: "translate(250,520)" }, g);
      T.el("ellipse", { ...line, cx: 0, cy: 0, rx: 230, ry: 46, fill: "none", stroke: P.ring, "stroke-width": 14, transform: "rotate(-14)" }, planet);
      T.el("circle", { ...line, r: 150, fill: P.planet }, planet);
      T.el("path", { d: "M40,-143 A150,150 0 0 1 40,143 A120,150 0 0 0 40,-143 Z", fill: P.planetShade }, planet);
      for (const [x, y, w] of [[-80, -40, 90], [-30, 30, 120], [-70, 80, 60]]) T.el("path", { d: `M${x},${y} q${w / 2},-10 ${w},0`, stroke: P.planetShade, "stroke-width": 8, fill: "none", "stroke-linecap": "round" }, planet);
      T.el("path", { d: "M-226,40 Q0,110 226,-70", fill: "none", stroke: P.ring, "stroke-width": 14, "stroke-linecap": "round", transform: "rotate(0)" }, planet); // front of the ring
      // small second moon
      T.el("circle", { ...line, cx: W - 170, cy: 330, r: 52, fill: P.moon }, g);
      T.el("circle", { cx: W - 185, cy: 318, r: 10, fill: "#aab5a2" }, g);
      T.el("circle", { cx: W - 152, cy: 348, r: 6, fill: "#aab5a2" }, g);
      // far hills, flat
      T.el("path", { ...line, d: T.shapes.ridge(-60, W + 60, G - 420, 90, { seed: 3, peaks: 3, bottom: G }), fill: P.hills }, g);
      return {
        update(t) {
          stars.forEach(({ n, i }) => n.setAttribute("opacity", Math.floor(t * 2 + i) % 5 === 0 ? "0.35" : "1"));
          planet.setAttribute("transform", `translate(${250 + t * 1.5},520)`);
        },
      };
    },
  };
})(window);
