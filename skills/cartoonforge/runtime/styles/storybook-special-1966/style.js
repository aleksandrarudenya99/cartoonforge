/**
 * Style pack: Storybook TV Special · 1960s
 * Genre look of 1960s holiday TV specials adapted from rhyming picture books: impossibly
 * curvy, leaning architecture and trees, limited flat palette with lots of paper white,
 * scratchy pen line, spiral snow, limited animation that holds poses for comic timing.
 * A genre, not any specific special: no characters, towns or creatures from existing books.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    paper: "#f7f3ea", sky: "#3f5f8a", skyLow: "#7d97b8", snow: "#ffffff", ink: "#1d1d26", red: "#c8323a", green: "#5c8f4e",
    pink: "#e6a1b8", yellow: "#f1cf5b", house: "#e8d9c4",
  };
  const motion = { drawingsPerSecond: 8, filmFps: 24, bpm: 108, lineWidth: 5 };
  const SERIF = "'Century Schoolbook', 'Georgia', 'DejaVu Serif', serif";
  const caption = { y: 360, size: 68, font: SERIF, weight: "bold", style: "italic", fill: palette.snow, stroke: palette.ink, strokeWidth: 12, maxWidth: 880 };
  const cards = { bg: palette.red, fg: palette.snow, accent: palette.green, font: SERIF, frame: "double", transition: "iris", transitionColor: palette.ink, upper: false, titleStyle: "italic" };

  /** Characters: scratchy pen line, flat limited fills, lots of white, no shading. */
  const skin = {
    ink: palette.ink, white: palette.snow, lineWidth: motion.lineWidth, shading: "none", outline: palette.ink,
    body: palette.green, head: palette.green, face: palette.snow, eye: palette.ink, glint: palette.snow,
    limb: palette.ink, limbWidth: 0.55, glove: palette.snow, gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: palette.red, mouth: palette.ink, nose: palette.ink,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.sky }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.sky], [100, palette.skyLow]] }),
      fx.boil(L, { scale: 2.5, freq: 0.05, loop: 2, dps: motion.drawingsPerSecond }), // scratchy pen
      fx.grain(L, { opacity: 0.12 }),
      fx.vignette(L, { color: "#0d1220", strength: 0.35 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const line = { stroke: P.ink, "stroke-width": 5, "stroke-linejoin": "round", "stroke-linecap": "round" };
    // a tall curvy mountain with a spiral path
    T.el("path", { ...line, d: `M${W - 420},${G - 200} C${W - 380},${G - 700} ${W - 160},${G - 900} ${W - 140},${G - 1150} C${W - 120},${G - 900} ${W + 40},${G - 600} ${W + 60},${G - 200} Z`, fill: P.snow }, g);
    T.el("path", { d: S().spiral(W - 150, G - 1000, 90, 2, 1), fill: "none", stroke: P.ink, "stroke-width": 3 }, g);
    // impossibly curvy, leaning houses (stacked bulbs)
    const houses = [[60, 1, P.house, P.red], [330, -1, P.pink, P.green], [600, 1, P.yellow, P.red]].map(([x, dir, wall, roof], i) => {
      const n = T.el("g", {}, g);
      T.el("path", { ...line, d: `M0,0 C-10,-120 ${dir * 30},-200 ${dir * 10},-300 L${dir * 10 + 150},-310 C${dir * 30 + 160},-200 170,-120 170,0 Z`, fill: wall }, n);
      T.el("path", { ...line, d: `M${dir * 10 - 30},-300 C${dir * 30},-420 ${dir * 80},-480 ${dir * 140},-560 C${dir * 120},-470 ${dir * 140 + 60},-380 ${dir * 10 + 190},-310 Z`, fill: roof }, n);
      T.el("path", { ...line, d: `M60,-180 C60,-220 110,-220 110,-180 L110,-120 L60,-120 Z`, fill: P.yellow }, n);
      T.el("path", { ...line, d: S().spiral(dir * 140, -575, 22, 1.4, dir), fill: "none" }, n);
      return { n, x, i };
    });
    // curly trees
    [[930, 0.9], [520, 0.6]].forEach(([x, s]) => {
      const n = T.el("g", { transform: `translate(${x},${G}) scale(${s})` }, g);
      T.el("path", { ...line, d: "M-8,0 C-20,-140 30,-240 -10,-380", fill: "none", "stroke-width": 10 }, n);
      for (let k = 0; k < 3; k++) T.el("path", { ...line, d: S().cloud(-70 + k * 10, 70 - k * 10, -260 - k * 70, 50, 3), fill: P.green }, n);
    });
    T.el("path", { ...line, d: `M-60,${G - 10} Q${W / 2},${G - 70} ${W + 60},${G - 10} L${W + 60},${G + 700} L-60,${G + 700} Z`, fill: P.snow }, g);
    // spiral snowflakes
    const flakes = Array.from({ length: 30 }, () => T.el("path", { fill: "none", stroke: P.snow, "stroke-width": 3 }, g));
    return {
      update(t, { beat }) {
        const b = Math.floor(t / beat);
        houses.forEach(({ n, x, i }) => n.setAttribute("transform", `translate(${x},${G - 20}) rotate(${(b + i) % 2 ? 2 : -2} 85 0)`));
        flakes.forEach((f, i) => { const r = T.rng(i * 13 + 2), y = ((t * (30 + r() * 30) + r() * 1600) % 1600) + 100; f.setAttribute("d", S().spiral(r() * W + Math.sin(t + i) * 20, y, 6 + r() * 6, 1.3, 1, t)); });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["storybook-special-1966"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
