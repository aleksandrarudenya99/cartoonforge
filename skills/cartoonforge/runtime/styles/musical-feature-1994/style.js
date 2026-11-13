/**
 * Style pack: Classic Musical Feature · 1990s
 * Genre look of hand-drawn musical feature films: elegant tapered ink lines, rich
 * painted backgrounds, an epic vista under a huge setting sun, god-rays, warm
 * golden-hour colour, layered depth and gentle camera drift. Full motion on ones/twos.
 * A genre, not any specific film.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    skyTop: "#5b2a5e", skyMid: "#e0603a", skyLow: "#ffc15a", sun: "#fff0b3", rock: "#7a3f2b", rockLit: "#c46a3b",
    plain: "#d79a43", plainDark: "#a86a2a", tree: "#3b2a24", ink: "#3a2016", white: "#fff7e8",
  };

  const motion = { drawingsPerSecond: 24, filmFps: 24, bpm: 92, lineWidth: 4 };

  const SERIF = "'Trajan Pro', 'Cinzel', Georgia, 'DejaVu Serif', serif";
  const caption = { y: 360, size: 70, font: SERIF, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 12, maxWidth: 880 };

  const cards = { bg: "#2a1420", fg: palette.sun, accent: palette.skyLow, font: SERIF, frame: "none", transition: "fade", transitionColor: "#140a10", upper: true, kickerSpacing: 30, titleWeight: "normal" };

  /** Characters: fine tapered warm-brown line, soft two-tone shading, golden rim light. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "cel", outline: palette.ink, shadow: "rgba(90,30,40,0.3)", rim: palette.sun,
    body: "#c9874a", head: "#d99a5c", face: "#f3d2a4", eye: palette.ink, glint: palette.white,
    limb: palette.ink, limbWidth: 0.6, glove: "#f3d2a4", gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: "#b3312a", mouth: palette.ink, nose: "#a8653b",
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.skyLow }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.skyTop], [40, palette.skyMid], [75, palette.skyLow], [100, "#ffe1a0"]] }),
      fx.bloom(L, { blur: 14, strength: 0.35 }),
      fx.grain(L, { opacity: 0.08 }),
      fx.vignette(L, { color: "#2a1420", strength: 0.5, inner: 50 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const sun = T.el("circle", { r: 300, fill: P.sun, opacity: 0.95 }, g);
    const rays = T.el("g", { opacity: 0.18 }, g);
    for (let k = 0; k < 12; k++) T.el("path", { d: `M0,0 L${Math.cos((k / 12) * Math.PI - Math.PI) * 1800},${Math.sin((k / 12) * Math.PI - Math.PI) * 1800} L${Math.cos(((k + 0.4) / 12) * Math.PI - Math.PI) * 1800},${Math.sin(((k + 0.4) / 12) * Math.PI - Math.PI) * 1800} Z`, fill: P.sun }, rays);
    // far mesas, mid plain, a dramatic rock outcrop in front (generic promontory)
    const far = T.el("path", { d: S().ridge(-200, W + 200, G - 360, 160, { seed: 14, peaks: 5, bottom: G, sharp: true }), fill: "#9c5a5a", opacity: 0.6 }, g);
    T.el("rect", { x: -60, y: G - 220, width: W + 120, height: 240, fill: P.plain }, g);
    const acacias = [[240, 0.6], [700, 0.45]].map(([x, s]) => {
      const n = T.el("g", { transform: `translate(${x},${G - 210}) scale(${s})` }, g);
      T.el("path", { d: "M-10,0 L-6,-160 L6,-160 L10,0 Z M0,-150 L-60,-200 M0,-150 L70,-210", fill: P.tree, stroke: P.tree, "stroke-width": 10 }, n);
      T.el("ellipse", { cx: 0, cy: -220, rx: 160, ry: 30, fill: P.tree }, n);
      return n;
    });
    T.el("path", { d: `M-60,${G} L-60,${G - 520} C80,${G - 560} 260,${G - 470} 360,${G - 420} L420,${G - 400} L360,${G - 340} C300,${G - 200} 360,${G - 60} 520,${G} Z`, fill: P.rock }, g);
    T.el("path", { d: `M-60,${G - 520} C80,${G - 560} 260,${G - 470} 360,${G - 420} L420,${G - 400} L360,${G - 380} C240,${G - 440} 80,${G - 500} -60,${G - 480} Z`, fill: P.rockLit }, g);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.plainDark }, g);
    const birds = [0, 1, 2, 3].map(() => T.el("path", { fill: "none", stroke: P.ink, "stroke-width": 4 }, g));
    return {
      update(t) {
        const drift = Math.sin(t * 0.12) * 20; // slow camera drift (multiplane feel)
        sun.setAttribute("transform", `translate(${W / 2 + 120 + drift * 0.2},${G - 330 + t * 3})`);
        rays.setAttribute("transform", `translate(${W / 2 + 120},${G - 330}) rotate(${Math.sin(t * 0.2) * 3})`);
        far.setAttribute("transform", `translate(${drift * 0.4},0)`);
        acacias.forEach((a, i) => a.setAttribute("transform", `translate(${[240, 700][i] + drift * 0.7},${G - 210}) scale(${[0.6, 0.45][i]})`));
        birds.forEach((b, i) => { const x = ((t * 50 + i * 260) % (W + 400)) - 200, y = 600 + i * 40 + Math.sin(t + i) * 20, f = Math.sin(t * 8 + i) * 12; b.setAttribute("d", `M${x - 22},${y - f} Q${x - 10},${y - 6} ${x},${y} Q${x + 10},${y - 6} ${x + 22},${y - f}`); });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["musical-feature-1994"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
