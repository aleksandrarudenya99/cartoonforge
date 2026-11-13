/**
 * Style pack: Cel Anime · 1980s
 * Hand-painted cels: flat colours with one hard cel-shadow, airbrushed sunset skies,
 * a striped retro sun, glowing city lights (bloom), film grain, light leaks.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    night: "#1b1035", violet: "#4b2a6b", pink: "#ff6f91", peach: "#ffb38a", gold: "#ffd27a",
    city: "#241a3e", window: "#ffe7a3", ink: "#1a1225", skin: "#ffd9c2", shadow: "#c98fa0", white: "#fff4f8",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 104, lineWidth: 6 };

  const SANS = "'Avenir Next', 'Helvetica Neue', 'DejaVu Sans', sans-serif";
  const caption = { y: 380, size: 70, font: SANS, weight: "bold", style: "italic", fill: palette.white, stroke: palette.ink, strokeWidth: 12, maxWidth: 900 };

  const cards = { bg: palette.night, fg: palette.white, accent: palette.pink, font: SANS, frame: "bar", transition: "fade", transitionColor: palette.night, upper: true, kickerSpacing: 22, titleStyle: "italic" };

  /** Characters: thin dark-violet line, flat colour + one hard cel-shadow tone. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "cel", outline: palette.ink, shadow: palette.shadow,
    body: "#3d6fd1", head: palette.skin, face: palette.skin, eye: palette.ink, glint: palette.white,
    limb: palette.ink, limbWidth: 0.6, glove: palette.white, gloveLine: palette.ink, shoe: palette.pink, shoeShine: palette.white,
    bow: palette.pink, mouth: palette.ink, nose: palette.shadow,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.night }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.night], [35, palette.violet], [62, palette.pink], [80, palette.peach], [100, palette.gold]] }),
      fx.bloom(L, { blur: 9, strength: 0.5 }),
      fx.grain(L, { opacity: 0.16, light: true, blend: "screen" }),
      fx.vignette(L, { color: palette.night, strength: 0.5 }),
      fx.flicker(L, { color: palette.peach, amount: 0.03 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // striped retro sun
    const sun = T.el("g", {}, g);
    const clip = T.el("clipPath", { id: "cel-sun" }, look.defs);
    T.el("circle", { r: 230 }, clip);
    const sg = T.el("g", { "clip-path": "url(#cel-sun)" }, sun);
    T.el("circle", { r: 230, fill: P.gold }, sg);
    for (let i = 0; i < 6; i++) T.el("rect", { x: -240, y: 40 + i * 34, width: 480, height: 6 + i * 3, fill: P.pink }, sg);
    // stars
    const stars = Array.from({ length: 26 }, (_, i) => {
      const r = T.rng(i + 10);
      return T.el("path", { d: S().star(r() * W, 120 + r() * 520, 3 + r() * 5, 4, 0.3), fill: P.white }, g);
    });
    // skyline with lit windows
    const r = T.rng(21);
    const city = T.el("g", {}, g);
    for (let x = -30; x < W + 30;) {
      const w = 70 + r() * 120, h = 220 + r() * 520;
      T.el("rect", { x, y: G - h, width: w, height: h, fill: P.city }, city);
      for (let wy = G - h + 24; wy < G - 30; wy += 46) for (let wx = x + 12; wx < x + w - 16; wx += 30) if (r() < 0.45) T.el("rect", { x: wx, y: wy, width: 14, height: 22, fill: P.window }, city);
      x += w + 4;
    }
    // power lines (a very 80s anime silhouette)
    const pole = (x) => { T.el("rect", { x: x - 9, y: G - 760, width: 18, height: 760, fill: P.ink }, g); T.el("rect", { x: x - 90, y: G - 720, width: 180, height: 12, fill: P.ink }, g); };
    pole(140); pole(960);
    for (const dy of [0, 26]) T.el("path", { d: `M50,${G - 712 + dy} Q550,${G - 600 + dy} 1050,${G - 712 + dy}`, fill: "none", stroke: P.ink, "stroke-width": 3 }, g);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.ink }, g);
    return {
      update(t) {
        sun.setAttribute("transform", `translate(${W / 2},${G - 620 + t * 6})`);
        stars.forEach((s, i) => s.setAttribute("opacity", (0.4 + 0.6 * Math.abs(T.noise(i, t * 1.5))).toFixed(2)));
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["cel-anime-1985"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
