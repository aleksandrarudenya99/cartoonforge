/**
 * Set ALLEY — DETAILS: two grimy plaster walls framing the view. Airbrushed stains, cracks with
 * bricks showing through, an electrical box with a conduit pipe, a fire-escape ladder, a wall
 * lamp, a back door with a riveted kick plate, a torn flyer; cracked asphalt with debris,
 * a crushed can and an open cardboard box. The sci-fi intrusion: a swirling portal.
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("alley").details = {
    build({ g, theme, defs, width: W, ground: G, height: H }) {
      const ST = G - 300;
      // asphalt alley floor
      const fl = `M-60,${ST + 110} L${W + 60},${ST + 110} L${W + 60},${H + 60} L-60,${H + 60} Z`;
      T.el("path", { d: fl, fill: "#a9aaa6", ...X.ink(theme, 0.6) }, g);
      X.shade(g, defs, fl, "#7c7d79", [[0, 0.6], [20, 0], [70, 0], [100, 0.5]]);
      X.contours(g, theme, { y0: ST + 150, y1: H - 60, n: 22, seed: 7 });
      X.pebbles(g, theme, { y0: ST + 140, y1: H - 40, n: 30, colors: ["#6f706c", "#8d8e8a"], seed: 8 });

      const wall = (x0, x1, seedBase) => {
        const d = X.rectD(x0, -60, x1 - x0, ST + 170);
        T.el("path", { d, fill: "#b8aca4", ...X.ink(theme, 0.8) }, g);
        const r = T.rng(seedBase);
        for (let i = 0; i < 6; i++) X.shade(g, defs, X.ellD(x0 + r() * (x1 - x0), 100 + r() * 1100, 70 + r() * 90, 90 + r() * 140), "#8a7a72", [[0, 0.8], [100, 0]], { radial: true });
        X.shade(g, defs, X.rectD(x0, ST - 60, x1 - x0, 170), "#6f655e", [[0, 0], [100, 0.85]]);
      };
      wall(-60, 210, 11);
      wall(870, W + 60, 12);
      // left wall: electrical box + conduit, fire-escape ladder, cracks, brick patch
      X.pipe(g, theme, "M-60,180 L120,330", 18, { step: 60, fill: "#b9bec4", band: "#8a9097" });
      T.el("rect", { x: 100, y: 300, width: 90, height: 140, rx: 6, fill: "#a6abb1", ...X.ink(theme, 0.7) }, g);
      T.el("rect", { x: 116, y: 318, width: 58, height: 104, fill: "none", ...X.ink(theme, 0.45) }, g);
      for (const x of [60, 130]) T.el("rect", { x, y: -60, width: 14, height: 300, fill: "#5d6068", ...X.ink(theme, 0.6) }, g);
      for (let y = -40; y < 230; y += 50) T.el("path", { d: `M60,${y} l84,0`, ...X.ink(theme, 1.4) }, g);
      X.crack(g, theme, { x: 150, y: 520, len: 140, ang: 2.0, seed: 3 });
      X.crack(g, theme, { x: 190, y: 1180, len: 110, ang: 2.4, seed: 4 });
      X.brickPatch(g, defs, theme, { cx: 30, cy: 760, rx: 80, ry: 60, seed: 5 });
      // dumpster with trash bags (left, by the wall)
      T.el("path", { d: `M-60,${G - 40} L190,${G - 40} L170,${G + 260} L-60,${G + 260} Z`, fill: "#4f7a8f", ...X.ink(theme, 0.9) }, g);
      T.el("path", { d: `M-60,${G - 40} L200,${G - 40} L200,${G - 10} L-60,${G - 10} Z`, fill: "#3f6578", ...X.ink(theme, 0.7) }, g);
      for (const [x, y, rx, ry, c] of [[0, G - 110, 110, 90, "#3f5a52"], [110, G - 140, 80, 70, "#7a8a5a"], [40, G - 210, 70, 60, "#456a62"]]) { T.el("path", { d: X.blob(x, y, rx, ry, { seed: x + 9, n: 9, irr: 0.15 }), fill: c, ...X.ink(theme, 0.7) }, g); T.el("path", { d: `M${x - 10},${y - ry + 6} l10,-22 l12,20`, fill: "none", ...X.ink(theme, 0.6) }, g); }
      T.el("path", { d: `M140,${G - 170} l40,-70 l14,8 l-38,72 Z`, fill: "#7a4a2a", ...X.ink(theme, 0.5) }, g); // bottle
      // right wall: lamp, back door with kick plate, flyer, cracks, brick patch, faucet
      T.el("path", { d: "M1060,300 L960,300 L960,330", fill: "none", stroke: theme.line.color, "stroke-width": 13, "stroke-linecap": "round" }, g);
      T.el("path", { d: "M1060,300 L960,300 L960,330", fill: "none", stroke: "#8d939b", "stroke-width": 7, "stroke-linecap": "round" }, g);
      T.el("path", { d: "M910,370 Q960,320 1010,370 Z", fill: "#6c727a", ...X.ink(theme, 0.7) }, g);
      T.el("rect", { x: 940, y: 520, width: 160, height: ST + 110 - 520, fill: "#8d7e7c", ...X.ink(theme, 0.8) }, g);
      T.el("rect", { x: 958, y: 540, width: 142, height: ST + 110 - 540, fill: "#a4928f", ...X.ink(theme, 0.6) }, g);
      T.el("rect", { x: 958, y: ST - 10, width: 142, height: 110, fill: "#d9d6cf", ...X.ink(theme, 0.6) }, g);
      for (let i = 0; i < 5; i++) T.el("circle", { cx: 975 + i * 26, cy: ST + 6, r: 4, fill: "none", ...X.ink(theme, 0.4) }, g);
      T.el("circle", { cx: 980, cy: 900, r: 14, fill: "#e8e6e0", ...X.ink(theme, 0.5) }, g);
      T.el("path", { d: "M880,760 L940,750 L944,840 L930,852 L944,880 L884,890 L880,860 L890,846 Z", fill: "#efeee8", ...X.ink(theme, 0.5) }, g);
      for (let i = 0; i < 4; i++) T.el("path", { d: `M892,${780 + i * 22} q12,-6 24,0 t20,0`, fill: "none", ...X.ink(theme, 0.3) }, g);
      X.crack(g, theme, { x: 1040, y: 460, len: 130, ang: 1.9, seed: 6 });
      X.brickPatch(g, defs, theme, { cx: 1090, cy: 180, rx: 60, ry: 110, seed: 7 });
      // open cardboard box + can on the ground
      const bx = 700, by = G + 40;
      T.el("path", { d: `M${bx},${by} L${bx + 230},${by} L${bx + 230},${by - 100} L${bx},${by - 100} Z`, fill: "#c9a87a", ...X.ink(theme, 0.7) }, g);
      T.el("path", { d: `M${bx},${by - 100} L${bx - 30},${by - 140} L${bx + 200},${by - 140} L${bx + 230},${by - 100}`, fill: "#b8956a", ...X.ink(theme, 0.6) }, g);
      T.el("path", { d: `M${bx + 90},${by - 60} l40,20 m-20,-30 l-10,40`, fill: "none", ...X.ink(theme, 0.45) }, g);
      X.can(g, theme, { x: 300, y: G + 10, s: 1.1 });
      X.can(g, theme, { x: 900, y: G + 230, s: 1.3 });

      // the sci-fi intrusion: a swirling portal on the wall (genre vortex, violet by default)
      const portal = X.portal(g, defs, theme, { cx: 150, cy: 1000, rx: 105, ry: 200, colors: "violet", seed: 3 });
      return { update(t) { portal.update(t); } };
    },
  };
})(window);
