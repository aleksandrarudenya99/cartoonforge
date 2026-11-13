/**
 * Style pack: Brick Toy Animation · 2010s
 * Genre look of animation where the whole world is built from plastic toy bricks: studs on
 * every top surface, glossy plastic with hard specular highlights, stepped "built" shapes
 * (even clouds and water), stop-motion-like 12 fps snapping. Generic interlocking bricks
 * only: no brand names, logos or minifigure designs.
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  const palette = {
    sky: "#6ec6ff", skyLow: "#bfe8ff", base: "#3fae49", baseDark: "#2c8a35", red: "#d7322d", yellow: "#f5c518",
    blue: "#1f6fd1", white: "#f4f4f4", grey: "#9aa1a8", ink: "#1b1f24", brown: "#7a4a24", water: "#3fa6e0",
  };
  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 128, lineWidth: 0, stud: 40 };
  const BOLD = "'Arial Black', 'Helvetica Neue', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 68, font: BOLD, weight: "bold", style: "normal", fill: palette.yellow, stroke: palette.ink, strokeWidth: 14, maxWidth: 880 };
  const cards = { bg: palette.red, fg: palette.white, accent: palette.yellow, font: BOLD, frame: "bar", transition: "iris", transitionColor: palette.ink, upper: true, kickerSpacing: 10 };

  /** Characters: glossy plastic, no outline, hard specular (shading: "gloss"), blocky parts. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: 6, shading: "gloss", outline: null, specular: palette.white, blocky: true,
    body: palette.blue, head: palette.yellow, face: palette.yellow, eye: palette.ink, glint: palette.white,
    limb: palette.blue, limbWidth: 1.2, glove: palette.yellow, gloveLine: "#d9a90f", shoe: palette.ink, shoeShine: palette.white,
    bow: palette.red, mouth: palette.ink, nose: palette.yellow,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.skyLow }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.sky], [100, palette.skyLow]] }),
      fx.paperShadow(L, { dx: 8, dy: 10, blur: 4, opacity: 0.25 }),
      fx.vignette(L, { color: "#000", strength: 0.2, inner: 60 }),
    ]);
  }

  /** One brick: body, darker front face, studs on top, a specular glint. */
  function brick(parent, x, y, wStuds, color, s = motion.stud) {
    const w = wStuds * s, h = s * 1.2;
    const n = T.el("g", { transform: `translate(${x},${y})` }, parent);
    T.el("rect", { x: 0, y: 0, width: w, height: h, rx: 4, fill: color }, n);
    T.el("rect", { x: 0, y: h * 0.7, width: w, height: h * 0.3, rx: 4, fill: "#000", opacity: 0.15 }, n);
    for (let i = 0; i < wStuds; i++) {
      T.el("rect", { x: i * s + s * 0.18, y: -s * 0.22, width: s * 0.64, height: s * 0.26, rx: 4, fill: color }, n);
      T.el("rect", { x: i * s + s * 0.24, y: -s * 0.18, width: s * 0.14, height: s * 0.08, rx: 2, fill: palette.white, opacity: 0.6 }, n);
    }
    T.el("rect", { x: s * 0.2, y: h * 0.15, width: s * 0.5, height: s * 0.12, rx: 3, fill: palette.white, opacity: 0.45 }, n);
    return n;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene, s = motion.stud;
    // stepped brick clouds
    const clouds = [[180, 520], [700, 420]].map(([x, y]) => {
      const n = T.el("g", {}, g);
      brick(n, 0, 0, 6, P.white); brick(n, s, -s * 1.2, 4, P.white); brick(n, s * 2, -s * 2.4, 2, P.white);
      return { n, x, y };
    });
    // a built house and a tree
    const house = T.el("g", { transform: `translate(${W - 420},${G})` }, g);
    for (let row = 0; row < 6; row++) for (let k = 0; k < 2; k++) brick(house, k * 4 * s + (row % 2) * 2 * s - (row % 2 ? s * 2 : 0) + (row % 2 ? s * 2 : 0), -(row + 1) * s * 1.2, 4, row === 3 && k === 1 ? P.blue : P.red);
    for (let row = 0; row < 3; row++) brick(house, row * s, -(7 + row) * s * 1.2, 8 - row * 2, P.grey);
    const tree = T.el("g", { transform: `translate(120,${G})` }, g);
    for (let row = 0; row < 5; row++) brick(tree, 2 * s, -(row + 1) * s * 1.2, 1, P.brown);
    [[0, 6, 5], [s, 7, 3], [2 * s, 8, 1]].forEach(([dx, row, w]) => brick(tree, dx, -row * s * 1.2, w, P.baseDark));
    // baseplate with studs
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.base }, g);
    for (let x = -40; x < W + 40; x += s) for (let y = G + 20; y < G + 600; y += s) T.el("circle", { cx: x, cy: y, r: s * 0.28, fill: P.baseDark }, g);
    // a blue water strip made of 1-stud tiles that ripple in steps
    const water = Array.from({ length: Math.ceil((W + 80) / s) }, (_, i) => T.el("rect", { x: -40 + i * s, width: s - 2, height: s * 0.5, rx: 4, fill: P.water }, g));
    return {
      update(t) {
        const step = Math.floor(t * 12);
        clouds.forEach(({ n, x, y }, i) => n.setAttribute("transform", `translate(${x + ((step * 4 + i * 200) % (W + 400)) - 200},${y})`));
        water.forEach((w, i) => w.setAttribute("y", String(G + 260 + ((step + i) % 3 === 0 ? -6 : 0))));
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["brick-toy-2014"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
