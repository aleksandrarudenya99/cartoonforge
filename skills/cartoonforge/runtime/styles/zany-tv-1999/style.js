/**
 * Style pack: Zany TV Cartoon · late 1990s
 * Genre look of late-90s cable TV cartoons: wobbly, lively hand-inked outlines, odd and
 * exaggerated proportions, saturated slightly-off colours, textured painted backgrounds,
 * extreme squash & stretch, cheap-but-funny holds. A genre, not any specific series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    sky: "#7fd3e8", skyDeep: "#3fa7c9", ground: "#e9c46a", groundDark: "#c9973f", lime: "#b6e04a", purple: "#8e5bd8",
    orange: "#ff8f3d", ink: "#2a1f1a", white: "#fffdf3", pink: "#ff7eb6",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 138, lineWidth: 8 };

  const FUN = "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 74, font: FUN, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 14, maxWidth: 900 };

  const cards = { bg: palette.purple, fg: palette.white, accent: palette.lime, font: FUN, frame: "bar", transition: "iris", transitionColor: palette.ink, upper: false, titleStyle: "normal" };

  /** Characters: wobbly thick line, saturated flat colours, no shading. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "none", outline: palette.ink,
    body: palette.lime, head: palette.lime, face: palette.white, eye: palette.ink, glint: palette.white,
    limb: palette.ink, limbWidth: 0.8, glove: palette.white, gloveLine: palette.ink, shoe: palette.ink, shoeShine: palette.white,
    bow: palette.pink, mouth: palette.ink, nose: palette.orange,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.sky }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.skyDeep], [100, palette.sky]] }),
      fx.paper(L, { color: "#ffffff", opacity: 0.25, freq: 0.09 }), // painted-board texture
      fx.boil(L, { scale: 6, freq: 0.022, loop: 3, dps: motion.drawingsPerSecond }), // lively wobble
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const line = { stroke: P.ink, "stroke-width": 7, "stroke-linejoin": "round", "stroke-linecap": "round" };
    // squiggly sun with uneven rays
    const sun = T.el("g", {}, g);
    T.el("path", { ...line, d: S().star(0, 0, 130, 9, 0.62, 0.2), fill: P.orange }, sun);
    T.el("circle", { ...line, r: 70, fill: "#ffd84a" }, sun);
    // tilted, wonky buildings / houses
    const houses = [[60, -6, P.purple, 420], [380, 4, P.pink, 520], [760, -3, P.orange, 460]].map(([x, rot, c, h]) => {
      const n = T.el("g", { transform: `translate(${x},${G}) rotate(${rot})` }, g);
      T.el("path", { ...line, d: `M0,0 L10,${-h} L250,${-h - 30} L260,0 Z`, fill: c }, n);
      T.el("path", { ...line, d: `M60,${-h * 0.6} l60,4 l-4,70 l-60,-4 Z M150,${-h * 0.75} l60,-6 l4,80 l-60,6 Z`, fill: "#fff6b8" }, n);
      return n;
    });
    T.el("path", { ...line, d: S().ridge(-60, W + 60, G + 10, 30, { seed: 6, peaks: 8, bottom: G + 700 }), fill: P.ground }, g);
    for (let i = 0; i < 10; i++) T.el("ellipse", { cx: 60 + i * 110, cy: G + 140 + (i % 3) * 110, rx: 22, ry: 8, fill: P.groundDark }, g);
    return {
      update(t, { beat }) {
        const b = Math.floor(t / beat);
        sun.setAttribute("transform", `translate(${W - 180},560) rotate(${b * 11}) scale(${b % 2 ? 1.06 : 0.96},${b % 2 ? 0.94 : 1.04})`);
        houses.forEach((h, i) => {
          const base = [[60, -6], [380, 4], [760, -3]][i];
          const sq = (b + i) % 2 ? 0.97 : 1.03; // houses breathe on the beat
          h.setAttribute("transform", `translate(${base[0]},${G}) rotate(${base[1]}) scale(${(2 - sq).toFixed(2)},${sq.toFixed(2)})`);
        });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["zany-tv-1999"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
