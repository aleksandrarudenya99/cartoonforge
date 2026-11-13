/**
 * Style pack: Storybook Flat Adventure · 2010s
 * Genre look of flat, illustrative adventure series inspired by mid-century picture books
 * and Nordic folklore: limited palette, flat shapes with no outline on scenery, simple
 * geometric mountains and pines, a giant soft-edged creature silhouette on the horizon,
 * paper-print texture. A genre, not any specific series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    sky: "#a9cfd8", skyLow: "#e8e2cf", mountain: "#5d8a99", mountainFar: "#88b0bb", pine: "#2f5d50", pineLight: "#4e8a6b",
    ground: "#cbb98a", ink: "#25313a", white: "#fffaf0", red: "#d4553b", yellow: "#f0c24b",
  };
  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 100, lineWidth: 4 };
  const SANS = "'Futura', 'Century Gothic', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 66, font: SANS, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 12, maxWidth: 880 };
  const cards = { bg: palette.mountain, fg: palette.white, accent: palette.yellow, font: SANS, frame: "none", transition: "fade", transitionColor: palette.ink, upper: true, kickerSpacing: 20 };

  /** Characters: thin dark line, flat limited palette, no shading. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "none", outline: palette.ink,
    body: palette.red, head: "#f2d6b8", face: "#f2d6b8", eye: palette.ink, glint: null,
    limb: palette.ink, limbWidth: 0.55, glove: palette.white, gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: palette.yellow, mouth: palette.ink, nose: palette.red,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.skyLow }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.sky], [100, palette.skyLow]] }),
      fx.paper(L, { color: "#fffaf0", opacity: 0.4, freq: 0.08 }),
      fx.grain(L, { opacity: 0.1 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const pine = (x, y, h, c) => T.el("path", { d: `M${x},${y - h} L${x - h * 0.3},${y - h * 0.45} L${x - h * 0.18},${y - h * 0.45} L${x - h * 0.4},${y} L${x + h * 0.4},${y} L${x + h * 0.18},${y - h * 0.45} L${x + h * 0.3},${y - h * 0.45} Z`, fill: c }, g);
    T.el("path", { d: S().ridge(-60, W + 60, G - 520, 300, { seed: 3, peaks: 4, bottom: G, sharp: true }), fill: P.mountainFar }, g);
    // giant soft creature silhouette on the horizon that slowly lifts its head
    const giant = T.el("g", {}, g);
    T.el("path", { d: "M-260,0 C-240,-260 -60,-330 40,-300 C140,-280 220,-200 260,0 Z", fill: P.mountain, opacity: 0.9 }, giant);
    const head = T.el("circle", { cx: 120, cy: -330, r: 70, fill: P.mountain, opacity: 0.9 }, giant);
    T.el("path", { d: S().ridge(-60, W + 60, G - 300, 160, { seed: 8, peaks: 5, bottom: G, sharp: true }), fill: P.mountain }, g);
    for (let i = 0; i < 9; i++) pine(40 + i * 125, G - 10 - (i % 2) * 30, 220 + (i % 3) * 50, i % 2 ? P.pine : P.pineLight);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.ground }, g);
    const birds = [0, 1, 2].map(() => T.el("path", { fill: "none", stroke: P.ink, "stroke-width": 4 }, g));
    return {
      update(t) {
        giant.setAttribute("transform", `translate(${W / 2 + 140},${G - 300})`);
        head.setAttribute("cy", String(-330 - Math.max(0, Math.sin(t * 0.4)) * 60));
        birds.forEach((b, i) => { const x = ((t * 60 + i * 300) % (W + 300)) - 150, y = 560 + i * 50, f = Math.sin(t * 7 + i) * 14; b.setAttribute("d", `M${x - 24},${y - f} L${x},${y} L${x + 24},${y - f}`); });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["storybook-flat-2018"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
