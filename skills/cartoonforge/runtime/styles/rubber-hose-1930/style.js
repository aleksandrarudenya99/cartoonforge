/**
 * Style pack: Rubber Hose · 1930
 *
 * A style pack = data + two functions:
 *   palette, motion, caption, cards, skin   (data the film and shared code read)
 *   install(svg, {width, height}) → look    (layer stack + film texture, from core/fx.js)
 *   scenery(look, {width, height, ground}) → { update(t, {beat}) }   (the world)
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  const palette = { paper: "#ebe4d2", paperShade: "#d6cdb6", ink: "#141210", grey: "#8d877a", white: "#f7f3e8" };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 120, lineWidth: 10 };

  // burned-in captions: 1930s intertitle lettering, cream with a heavy ink outline
  const caption = {
    y: 380, size: 78, font: "Georgia, 'DejaVu Serif', serif", weight: "bold", style: "italic",
    fill: palette.white, stroke: palette.ink, strokeWidth: 16, maxWidth: 900,
  };

  // title / end cards and transitions (core/scenes.js)
  const cards = {
    bg: palette.ink, fg: palette.paper, font: "Georgia, 'DejaVu Serif', serif",
    frame: "double", transition: "iris", transitionColor: "#0b0a09", upper: true,
  };

  // how Pip is drawn in this style (characters/pip/rig.js)
  const skin = { ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.paper }, (fx, L) => [
      fx.weave(L, { x: 3, y: 4 }),
      fx.boil(L, { scale: 5, dps: motion.drawingsPerSecond }),
      fx.dirt(L, { colors: [palette.ink, palette.white] }),
      fx.grain(L, { opacity: 0.32 }),
      fx.vignette(L, { color: palette.ink, strength: 0.55 }),
      fx.flicker(L, { color: palette.white, amount: 0.07 }),
    ]);
  }

  /** Hills, a rubber tree, clouds and flowers — everything bounces to the beat. */
  function scenery(look, { width: W, ground: G }) {
    const P = palette, lw = motion.lineWidth, g = look.scene;
    const line = { fill: "none", stroke: P.ink, "stroke-width": lw, "stroke-linecap": "round", "stroke-linejoin": "round" };
    const bg = T.el("g", {}, g);
    T.el("path", { ...line, d: `M-40,${G - 260} C200,${G - 420} 420,${G - 300} 560,${G - 330} C760,${G - 380} 900,${G - 470} ${W + 40},${G - 300} L${W + 40},${G} L-40,${G} Z`, fill: P.paperShade }, bg);
    T.el("path", { ...line, d: `M-40,${G} L${W + 40},${G}` }, bg);
    T.el("rect", { x: -40, y: G, width: W + 80, height: 500, fill: P.grey, opacity: 0.35 }, bg);
    for (let i = 0; i < 9; i++) T.el("path", { ...line, d: `M${60 + i * 130},${G + 70 + (i % 3) * 90} l50,0`, "stroke-width": lw * 0.6 }, bg);

    const tree = T.el("g", {}, g);
    const trunk = T.el("path", { ...line, "stroke-width": 30 }, tree);
    const crown = T.el("g", {}, tree);
    T.el("path", { d: "M-150,0 C-190,-90 -110,-170 -40,-150 C-20,-230 90,-230 110,-150 C190,-170 210,-60 150,0 C110,50 -110,50 -150,0 Z", fill: P.ink }, crown);
    T.el("path", { d: "M-90,-60 C-60,-110 -10,-110 10,-70", fill: "none", stroke: P.white, "stroke-width": 12, "stroke-linecap": "round" }, crown);

    const clouds = [[230, 215, 0.9], [830, 170, 0.75]].map(([x, y, s]) => {
      const c = T.el("g", {}, g);
      T.el("path", { ...line, d: "M-120,20 C-150,-30 -90,-70 -50,-50 C-30,-100 50,-100 70,-50 C120,-70 160,-20 120,20 Z", fill: P.white }, c);
      return { c, x, y, s };
    });
    const flowers = [[150, 1], [930, -1]].map(([x, dir]) => {
      const f = T.el("g", {}, g);
      const stem = T.el("path", { ...line }, f);
      const head = T.el("g", {}, f);
      for (let k = 0; k < 5; k++) T.el("ellipse", { ...line, cx: 0, cy: -30, rx: 16, ry: 30, fill: P.white, "stroke-width": lw * 0.7, transform: `rotate(${k * 72})` }, head);
      T.el("circle", { r: 18, fill: P.ink }, head);
      return { stem, head, x, dir };
    });

    return {
      update(t, { beat }) {
        const bounce = Math.pow(Math.sin(Math.PI * ((t % beat) / beat)), 2);
        const sway = Math.sin((t / beat) * Math.PI) * 9;
        trunk.setAttribute("d", T.hose(820, G - 6, 820 + sway * 2, G - 330, sway * 3));
        crown.setAttribute("transform", `translate(${820 + sway * 2},${G - 330}) rotate(${sway * 0.6}) scale(${1 + bounce * 0.05},${1 - bounce * 0.05})`);
        clouds.forEach(({ c, x, y, s }, i) => c.setAttribute("transform", `translate(${x + Math.sin(t * 0.6 + i) * 20},${y + bounce * 14}) scale(${s})`));
        flowers.forEach(({ stem, head, x, dir }) => {
          const tip = x + Math.sin((t / beat) * Math.PI) * 26 * dir;
          stem.setAttribute("d", T.hose(x, G, tip, G - 170 + bounce * 14, 14 * dir));
          head.setAttribute("transform", `translate(${tip},${G - 200 + bounce * 14}) rotate(${t * 40 * dir})`);
        });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["rubber-hose-1930"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
