/**
 * Style pack: Paper Cut-out · 1950s–60s
 * Construction-paper shapes with torn edges, brass paper-fastener joints, layers that
 * cast small shadows on each other, jerky pinned-puppet motion. Lineage: Czech, Soviet
 * and Chinese (jianzhi) cut-out films; later TV cut-out comedy.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    board: "#e9dcc0", sky: "#8fc1d4", grass: "#6e9b4c", grassDark: "#4f7a37", hill: "#b9c77a",
    red: "#d2553f", orange: "#e8913a", yellow: "#f1c94b", ink: "#2a2420", cream: "#fbf3df", brass: "#c9a23f",
  };

  // pinned puppets move in held, slightly jerky steps
  const motion = { drawingsPerSecond: 10, filmFps: 24, bpm: 116, lineWidth: 4 };

  const ROUND = "'Cooper Black', 'Arial Rounded MT Bold', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 72, font: ROUND, weight: "bold", style: "normal", fill: palette.cream, stroke: palette.ink, strokeWidth: 14, maxWidth: 900 };

  const cards = { bg: palette.red, fg: palette.cream, accent: palette.yellow, font: ROUND, frame: "double", transition: "fade", transitionColor: palette.ink, upper: false, titleStyle: "normal" };

  /** How any character is drawn: flat paper colours, no outline, pins at the joints. */
  const skin = {
    ink: palette.ink, white: palette.cream, lineWidth: motion.lineWidth, shading: "paper", outline: null, joints: palette.brass,
    body: palette.orange, head: palette.orange, face: palette.cream, eye: palette.ink, glint: null,
    limb: palette.ink, limbWidth: 0.8, glove: palette.cream, gloveLine: palette.ink, shoe: palette.red, shoeShine: null,
    bow: palette.yellow, mouth: palette.ink, nose: palette.red,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.board }, (fx, L) => [
      fx.paper(L, { color: "#fff6e3", opacity: 0.6, freq: 0.05 }),
      fx.paperShadow(L, { dx: 5, dy: 7, blur: 3, opacity: 0.33 }),
      fx.grain(L, { opacity: 0.1 }),
      fx.vignette(L, { color: palette.ink, strength: 0.25, inner: 60 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // torn paper layers: jagged ridges (jag = torn edge)
    T.el("rect", { x: -60, y: 480, width: W + 120, height: G - 480, fill: P.sky }, g);
    const sun = T.el("g", {}, g);
    T.el("path", { d: S().star(0, 0, 120, 12, 0.72), fill: P.yellow }, sun);
    T.el("circle", { r: 70, fill: P.orange }, sun);
    const cloudA = T.el("path", { d: S().cloud(-130, 130, 0, 70, 4), fill: P.cream }, g);
    const cloudB = T.el("path", { d: S().cloud(-100, 100, 0, 55, 3), fill: P.cream }, g);
    T.el("path", { d: S().ridge(-60, W + 60, G - 330, 160, { seed: 4, peaks: 4, bottom: G, jag: 14 }), fill: P.hill }, g);
    T.el("path", { d: S().ridge(-60, W + 60, G - 150, 110, { seed: 9, peaks: 6, bottom: G + 600, jag: 10 }), fill: P.grass }, g);
    T.el("path", { d: S().ridge(-60, W + 60, G + 60, 40, { seed: 2, peaks: 9, bottom: G + 700, jag: 8 }), fill: P.grassDark }, g);
    // paper trees: trunk strip + stacked circles, pinned with a brass fastener
    const trees = [[140, 1.0, P.grassDark], [930, 0.85, P.red]].map(([x, s, c]) => {
      const n = T.el("g", {}, g);
      T.el("rect", { x: -14, y: -300, width: 28, height: 300, fill: "#7a5434" }, n);
      const crown = T.el("g", {}, n);
      for (const [cx, cy, r] of [[0, -330, 110], [-70, -270, 70], [75, -265, 75]]) T.el("circle", { cx, cy, r, fill: c }, crown);
      T.el("circle", { cx: 0, cy: -300, r: 7, fill: P.brass }, n);
      return { n, x, s, crown };
    });
    return {
      update(t, { beat }) {
        const step = Math.floor(t / beat);
        sun.setAttribute("transform", `translate(${W - 200},650) rotate(${step * 7.5})`);
        cloudA.setAttribute("transform", `translate(${260 + (step % 6) * 14},600)`);
        cloudB.setAttribute("transform", `translate(${700 - (step % 5) * 12},560)`);
        trees.forEach(({ n, x, s, crown }, i) => {
          n.setAttribute("transform", `translate(${x},${G - 40}) scale(${s})`);
          crown.setAttribute("transform", `rotate(${(step + i) % 2 ? 3 : -3} 0 -300)`); // pinned wobble
        });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["paper-cutout-1960"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
