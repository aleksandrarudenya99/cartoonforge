/**
 * Style pack: Claymation · 1990s–2000s
 * Genre look of plasticine stop-motion: everything is clay with bumps and thumbprints
 * (lit by a soft key light), chunky rounded sets, wide toothy mouths, 12 poses per second
 * with slight set "chatter", warm cosy palette or muted grey-brown for melancholic tales.
 * A genre, not any specific film or studio.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    wall: "#d9c7a7", wallpaper: "#c4ad86", floor: "#8a6a4d", floorDark: "#6e5139", window: "#bfe0ea", sky: "#e9dcc0",
    clay: "#e8d2b4", ink: "#2e241c", white: "#fbf6ec", green: "#7a9a5a", red: "#b5513d", grey: "#8c8a85",
  };
  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 108, lineWidth: 0 };
  const SERIF = "Georgia, 'DejaVu Serif', serif";
  const caption = { y: 370, size: 68, font: SERIF, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 12, maxWidth: 880 };
  const cards = { bg: palette.red, fg: palette.white, accent: palette.green, font: SERIF, frame: "double", transition: "fade", transitionColor: palette.ink, upper: false };

  /** Characters: no outline, clay surface (shading: "clay"), chunky rounded forms. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: 6, shading: "clay", outline: null,
    body: palette.green, head: palette.clay, face: palette.clay, eye: palette.white, glint: palette.ink,
    limb: palette.green, limbWidth: 1.3, glove: palette.clay, gloveLine: "#c9a987", shoe: "#5a4636", shoeShine: null,
    bow: palette.red, mouth: palette.ink, nose: "#d8b48f",
  };

  function install(svg, { width, height }) {
    const look = T.fx.stack(svg, { width, height, background: palette.wall }, (fx, L) => [
      fx.clay(L, { bump: 3.5, freq: 0.05, strength: 0.4 }),
      fx.paperShadow(L, { target: false }),
      fx.vignette(L, { color: palette.ink, strength: 0.45, inner: 50 }),
      fx.grain(L, { opacity: 0.08 }),
    ]);
    look.effects = [T.fx.chatter(look, { amount: 1.6, dps: motion.drawingsPerSecond })];
    const upd = look.update;
    look.update = (t) => { upd(t); look.effects.forEach((e) => e.update(t)); };
    return look;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // cosy room set: wallpaper stripes, a window, a shelf, a rug
    T.el("rect", { x: -60, y: -60, width: W + 120, height: G + 60, fill: P.wall }, g);
    for (let x = -40; x < W + 40; x += 90) T.el("rect", { x, y: -60, width: 40, height: G + 60, fill: P.wallpaper, opacity: 0.6 }, g);
    const win = T.el("g", { transform: `translate(${W - 380},520)` }, g);
    T.el("rect", { x: -20, y: -20, width: 320, height: 380, rx: 18, fill: "#a27b55" }, win);
    T.el("rect", { x: 0, y: 0, width: 280, height: 340, rx: 10, fill: P.window }, win);
    const cloud = T.el("path", { d: S().cloud(-60, 60, 0, 30, 3), fill: P.white }, win);
    T.el("rect", { x: 135, y: 0, width: 12, height: 340, fill: "#a27b55" }, win);
    T.el("rect", { x: 0, y: 165, width: 280, height: 12, fill: "#a27b55" }, win);
    T.el("rect", { x: 80, y: 760, width: 360, height: 26, rx: 10, fill: "#a27b55" }, g);
    [[120, P.red], [190, P.green], [270, "#d9a441"]].forEach(([x, c], i) => T.el("rect", { x, y: 660 - i * 10, width: 54, height: 100 + i * 10, rx: 14, fill: c }, g));
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.floor }, g);
    for (let x = -60; x < W + 60; x += 110) T.el("line", { x1: x, y1: G, x2: x - 60, y2: G + 700, stroke: P.floorDark, "stroke-width": 6 }, g);
    T.el("ellipse", { cx: W / 2, cy: G + 60, rx: 420, ry: 70, fill: P.red, opacity: 0.85 }, g);
    return {
      update(t) {
        cloud.setAttribute("transform", `translate(${((Math.floor(t * 12) * 3) % 360) - 40},90)`); // stepped like real stop-motion
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["claymation-1995"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
