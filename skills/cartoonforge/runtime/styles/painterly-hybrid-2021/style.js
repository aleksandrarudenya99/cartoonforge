/**
 * Style pack: Painterly Hybrid · 2020s
 * Genre look of painterly 2D/3D hybrid series: visible brush strokes painted over volume,
 * graphic hard shadows, hand-painted texture on everything, neon against smoky industrial
 * dusk, 2D-drawn effects (sparks, smoke) over 3D forms. A genre, not any specific series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    dusk: "#2a2b3d", haze: "#7a6c7d", glow: "#f2a65a", neon: "#4fd1c5", neonPink: "#ff4fa3", brick: "#6d4c41",
    steel: "#46505e", smoke: "#9aa0a8", ink: "#15161c", bone: "#efe6da",
  };
  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 96, lineWidth: 5 };
  const SERIF = "'Cinzel', 'Trajan Pro', Georgia, 'DejaVu Serif', serif";
  const caption = { y: 360, size: 70, font: SERIF, weight: "bold", style: "normal", fill: palette.bone, stroke: palette.ink, strokeWidth: 12, maxWidth: 880 };
  const cards = { bg: palette.dusk, fg: palette.bone, accent: palette.neon, font: SERIF, frame: "bar", transition: "fade", transitionColor: palette.ink, upper: true, kickerSpacing: 26 };

  /** Characters: thin painted line, graphic hard shadows, brush texture (shading: "cel"). */
  const skin = {
    ink: palette.ink, white: palette.bone, lineWidth: motion.lineWidth, shading: "cel", outline: palette.ink, shadow: "rgba(21,22,28,0.35)", texture: "brush",
    body: "#3d5a80", head: "#e3c4a8", face: "#e3c4a8", eye: palette.ink, glint: palette.bone,
    limb: palette.ink, limbWidth: 0.7, glove: "#5a4636", gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: palette.neonPink, mouth: palette.ink, nose: "#c9a48b",
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.dusk }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.dusk], [55, palette.haze], [100, palette.glow]] }),
      fx.paper(L, { color: "#ffffff", opacity: 0.22, freq: 0.012 }), // big brush-like texture
      fx.boil(L, { scale: 2, freq: 0.04, loop: 2, dps: motion.drawingsPerSecond }),
      fx.bloom(L, { blur: 9, strength: 0.45 }),
      fx.vignette(L, { color: palette.ink, strength: 0.6, inner: 45 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // industrial towers with painted strokes on their faces
    const r = T.rng(17);
    for (let x = -40; x < W + 40;) {
      const w = 110 + r() * 140, h = 400 + r() * 600;
      T.el("rect", { x, y: G - h, width: w, height: h, fill: r() < 0.5 ? P.steel : P.brick }, g);
      for (let k = 0; k < 6; k++) T.el("path", { d: S().brush(x + r() * w, G - r() * h, x + r() * w, G - r() * h, 6 + r() * 10), fill: P.bone, opacity: 0.08 }, g);
      T.el("rect", { x: x + w * 0.65, y: G - h, width: w * 0.35, height: h, fill: P.ink, opacity: 0.35 }, g); // hard graphic shadow side
      x += w + 8;
    }
    const signs = [[150, G - 620, P.neon], [760, G - 760, P.neonPink]].map(([x, y, c]) => T.el("rect", { x, y, width: 170, height: 60, rx: 10, fill: "none", stroke: c, "stroke-width": 8 }, g));
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.ink }, g);
    const smoke = Array.from({ length: 8 }, () => T.el("path", { fill: P.smoke }, g));
    const sparks = Array.from({ length: 24 }, () => T.el("path", { fill: P.glow }, g));
    return {
      update(t) {
        signs.forEach((s, i) => s.setAttribute("opacity", T.hash(40 + i, Math.floor(t * 12)) > -0.8 ? "1" : "0.3"));
        smoke.forEach((s, i) => { const rr = T.rng(i * 3 + 7), k = (t * 0.08 + rr()) % 1, x = rr() * W, y = G - 200 - k * 900; s.setAttribute("d", S().cloud(x - 120 - k * 80, x + 120 + k * 80, y, 60 + k * 50, 4)); s.setAttribute("opacity", (Math.sin(Math.PI * k) * 0.35).toFixed(2)); });
        sparks.forEach((s, i) => { const rr = T.rng(i * 5 + 1), k = (t * (0.4 + rr() * 0.5) + rr()) % 1, x = 300 + rr() * 500 + k * 200 * (rr() - 0.5), y = G - 300 + k * 320; s.setAttribute("d", S().brush(x, y, x + 10, y + 18, 3)); s.setAttribute("opacity", (1 - k).toFixed(2)); });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["painterly-hybrid-2021"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
