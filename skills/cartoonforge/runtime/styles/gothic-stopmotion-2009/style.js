/**
 * Style pack: Gothic Stop-Motion · 1990s–2010s
 * Genre look of gothic puppet stop-motion: spindly elongated forms, spiral hills, crooked
 * fences and bare trees, a huge moon, cold teal-violet night or stark black-and-white, tiny
 * set "chatter" between poses, hand-made textures. A genre, not any specific film.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    night: "#0f1626", teal: "#2d5a6b", violet: "#4a3b6b", moon: "#f0ecd8", hill: "#1a2433", hillLight: "#2b3b52",
    tree: "#0a0d14", ink: "#05060a", bone: "#e8e4d8", orange: "#e8823a", fog: "#9fb2c4",
  };
  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 88, lineWidth: 5 };
  const SERIF = "'Garamond', 'EB Garamond', Georgia, 'DejaVu Serif', serif";
  const caption = { y: 360, size: 70, font: SERIF, weight: "bold", style: "italic", fill: palette.bone, stroke: palette.ink, strokeWidth: 12, maxWidth: 860 };
  const cards = { bg: palette.ink, fg: palette.bone, accent: palette.orange, font: SERIF, frame: "ornament", transition: "iris", transitionColor: palette.ink, upper: false, titleStyle: "italic" };

  /** Characters: spindly limbs, pale faces, stitched fabric / clay surface, dark eye sockets. */
  const skin = {
    ink: palette.ink, white: palette.bone, lineWidth: motion.lineWidth, shading: "clay", outline: null, spindly: true,
    body: "#2b2b3a", head: "#d9dcd6", face: "#d9dcd6", eye: palette.ink, glint: palette.bone,
    limb: "#2b2b3a", limbWidth: 0.55, glove: "#d9dcd6", gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: palette.orange, mouth: palette.ink, nose: "#b9bcb6",
  };

  function install(svg, { width, height }) {
    const look = T.fx.stack(svg, { width, height, background: palette.night }, (fx, L) => [
      fx.gradient(L, { radial: true, stops: [[0, palette.teal], [55, palette.violet], [100, palette.night]] }),
      fx.clay(L, { bump: 2, freq: 0.07, light: "#cfe3ff", strength: 0.3 }),
      fx.grain(L, { opacity: 0.12, light: true, blend: "screen" }),
      fx.vignette(L, { color: palette.ink, strength: 0.8, inner: 40 }),
    ]);
    look.effects = [T.fx.chatter(look, { amount: 1.3, dps: motion.drawingsPerSecond })];
    const upd = look.update;
    look.update = (t) => { upd(t); look.effects.forEach((e) => e.update(t)); };
    return look;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    T.el("circle", { cx: W / 2, cy: 640, r: 300, fill: P.moon }, g);
    // the spiral hill
    T.el("path", { d: `M${W / 2 - 520},${G} Q${W / 2 - 200},${G - 480} ${W / 2 + 40},${G - 520} Q${W / 2 + 120},${G - 520} ${W / 2 + 140},${G - 470} L${W / 2 + 520},${G} Z`, fill: P.hill }, g);
    T.el("path", { d: S().spiral(W / 2 + 120, G - 500, 90, 2.4, 1, Math.PI), fill: "none", stroke: P.hill, "stroke-width": 24, "stroke-linecap": "round" }, g);
    // bare twisted trees
    const tree = (x, s, dir) => {
      const n = T.el("g", { transform: `translate(${x},${G}) scale(${s})` }, g);
      T.el("path", { d: `M-14,0 C-10,-120 ${dir * 30},-220 ${dir * 10},-360 L${dir * 22},-360 C${dir * 46},-220 8,-120 14,0 Z`, fill: P.tree }, n);
      [[-260, -1], [-300, 1], [-340, -1]].forEach(([y, d]) => T.el("path", { d: `M${dir * 12},${y} C${d * 60},${y - 40} ${d * 90},${y - 10} ${d * 120},${y - 70}`, fill: "none", stroke: P.tree, "stroke-width": 8, "stroke-linecap": "round" }, n));
      T.el("path", { d: S().spiral(dir * 14, -380, 30, 1.5, dir), fill: "none", stroke: P.tree, "stroke-width": 7 }, n);
      return n;
    };
    tree(130, 1.2, 1); tree(950, 1.0, -1);
    // crooked fence and a glowing pumpkin-like lantern
    for (let i = 0; i < 9; i++) T.el("path", { d: `M${60 + i * 50},${G} L${66 + i * 50 + (i % 2 ? 6 : -6)},${G - 120 - (i % 3) * 15} L${84 + i * 50},${G - 110} L${80 + i * 50},${G} Z`, fill: P.tree }, g);
    const lantern = T.el("circle", { cx: W - 300, cy: G - 30, r: 34, fill: P.orange }, g);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.hill }, g);
    const fog = [0, 1].map(() => T.el("rect", { x: -200, width: W + 400, height: 80, rx: 40, fill: P.fog, opacity: 0.18 }, g));
    const bats = [0, 1, 2].map(() => T.el("path", { fill: P.ink }, g));
    return {
      update(t) {
        const step = Math.floor(t * 12);
        lantern.setAttribute("opacity", (0.7 + 0.3 * Math.abs(T.hash(5, step))).toFixed(2));
        fog.forEach((f, i) => { f.setAttribute("x", (-200 + Math.sin(t * 0.2 + i * 2) * 140).toFixed(0)); f.setAttribute("y", String(G - 80 + i * 90)); });
        bats.forEach((b, i) => { const x = ((t * 80 + i * 330) % (W + 300)) - 150, y = 520 + i * 60 + Math.sin(t * 2 + i) * 30, f = (step + i) % 2 ? 18 : -10; b.setAttribute("d", `M${x},${y} L${x - 34},${y - f} L${x - 18},${y + 4} L${x - 8},${y - 4} L${x},${y + 8} L${x + 8},${y - 4} L${x + 18},${y + 4} L${x + 34},${y - f} Z`); });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["gothic-stopmotion-2009"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
