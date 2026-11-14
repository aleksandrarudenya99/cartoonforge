/** Set DUSK — FOREGROUND: big spires cut by the frame edges, crystals at the bottom corners. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("dusk").foreground = {
    build({ g, theme, height: H, width: W }) {
      X.spire(g, theme, { x: 10, base: H + 60, h: 640, w: 150, fill: "#eab34a", shadeC: "#c98a2f", eye: "#d7ec7a", seed: 90 });
      X.spire(g, theme, { x: W - 10, base: H + 60, h: 470, w: 130, fill: "#e9a94a", shadeC: "#c4812e", seed: 91 });
      X.crystals(g, theme, { x: 220, y: H - 30, n: 3, s: 150, seed: 92 });
      X.pebbles(g, theme, { y0: H - 180, y1: H - 20, n: 10, colors: ["#b5655a", "#8a5aa8"], seed: 93 });
      return null;
    },
  };
})(window);
