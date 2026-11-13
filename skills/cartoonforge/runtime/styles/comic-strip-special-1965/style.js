/**
 * Style pack: Comic Strip TV Special · 1960s–80s
 * Genre look of TV specials adapted from newspaper comic strips: thin uneven pen line,
 * flat muted colours, very simple staging on a single horizon line, a big empty sky,
 * limited animation and deadpan holds, soft gentle snowfall, jazz piano trio feel.
 * A genre, not any specific strip: no characters, pets or catchphrases from existing strips.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    sky: "#9db7cf", skyLow: "#c9d6dd", snow: "#fbfaf5", ink: "#2b2b2b", tree: "#3f7a4a", trunk: "#7a5636",
    pond: "#bcd3e3", red: "#c9473a", yellow: "#efc94c", wall: "#d9c3a0",
  };
  const motion = { drawingsPerSecond: 8, filmFps: 24, bpm: 120, lineWidth: 4 };
  const HAND = "'Comic Sans MS', 'Chalkboard SE', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 64, font: HAND, weight: "bold", style: "normal", fill: palette.ink, stroke: palette.snow, strokeWidth: 12, maxWidth: 880 };
  const cards = { bg: palette.snow, fg: palette.ink, accent: palette.red, endFg: palette.ink, font: HAND, frame: "none", transition: "fade", transitionColor: palette.ink, upper: false };

  /** Characters: thin uneven pen line, flat muted fills, simple dot eyes, no shading. */
  const skin = {
    ink: palette.ink, white: palette.snow, lineWidth: motion.lineWidth, shading: "none", outline: palette.ink, dotEyes: true,
    body: palette.yellow, head: "#f4dcc0", face: "#f4dcc0", eye: palette.ink, glint: null,
    limb: palette.ink, limbWidth: 0.45, glove: "#f4dcc0", gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: palette.red, mouth: palette.ink, nose: palette.ink,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.skyLow }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.sky], [100, palette.skyLow]] }),
      fx.boil(L, { scale: 1.8, freq: 0.06, loop: 2, dps: motion.drawingsPerSecond }),
      fx.grain(L, { opacity: 0.12 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const line = { stroke: P.ink, "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" };
    // one horizon line, a frozen pond, a small tree, a brick wall to lean on
    T.el("path", { ...line, d: `M-60,${G - 120} Q${W / 2},${G - 150} ${W + 60},${G - 120} L${W + 60},${G + 700} L-60,${G + 700} Z`, fill: P.snow }, g);
    T.el("ellipse", { ...line, cx: W / 2 + 160, cy: G - 40, rx: 260, ry: 50, fill: P.pond }, g);
    const tree = T.el("g", { transform: `translate(170,${G - 110})` }, g);
    T.el("path", { ...line, d: "M-6,0 L-4,-90 L4,-90 L6,0 Z", fill: P.trunk }, tree);
    T.el("path", { ...line, d: "M0,-90 L-40,-40 L40,-40 Z M0,-140 L-30,-80 L30,-80 Z", fill: P.tree }, tree);
    const bulb = T.el("circle", { cx: 0, cy: -150, r: 8, fill: P.red }, tree);
    const wall = T.el("g", { transform: `translate(${W - 330},${G - 110})` }, g);
    T.el("rect", { ...line, x: 0, y: -170, width: 290, height: 170, fill: P.wall }, wall);
    for (let row = 1; row < 5; row++) T.el("line", { x1: 0, y1: -row * 34, x2: 290, y2: -row * 34, stroke: P.ink, "stroke-width": 2 }, wall);
    // gentle snowfall: big soft flakes
    const flakes = Array.from({ length: 36 }, () => T.el("circle", { fill: P.snow, stroke: P.ink, "stroke-width": 1.5 }, g));
    return {
      update(t) {
        bulb.setAttribute("opacity", Math.floor(t * 2) % 2 ? "1" : "0.55");
        flakes.forEach((f, i) => { const r = T.rng(i * 7 + 5), y = ((t * (25 + r() * 25) + r() * 1600) % 1600) + 120; f.setAttribute("cx", (r() * W + Math.sin(t * 0.8 + i) * 25).toFixed(1)); f.setAttribute("cy", y.toFixed(1)); f.setAttribute("r", (4 + r() * 6).toFixed(1)); });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["comic-strip-special-1965"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
