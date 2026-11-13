/**
 * Style pack: Saturday Morning Cartoon · 1980s
 * Genre look of 80s TV adventure cartoons: clean cel animation, bold primary colours,
 * painted backgrounds with airbrushed skies, sewer-pipe / harbour / city adventure
 * settings, action poses, a slightly soft broadcast picture. A genre, not any series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    skyTop: "#2a5fa8", skyLow: "#f3a65a", sea: "#1f7aa8", dock: "#8a5a32", dockDark: "#5e3b1f", brick: "#b5523b",
    ink: "#1b1b1b", white: "#ffffff", green: "#3fae49", red: "#e53935", yellow: "#ffcc29", blue: "#1e63c9",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 126, lineWidth: 6 };

  const BOLD = "'Arial Black', 'Impact', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 70, font: BOLD, weight: "bold", style: "normal", fill: palette.yellow, stroke: palette.ink, strokeWidth: 14, maxWidth: 900 };

  const cards = { bg: palette.blue, fg: palette.yellow, accent: palette.red, font: BOLD, frame: "bar", transition: "iris", transitionColor: palette.ink, upper: true, kickerSpacing: 12 };

  /** Characters: clean black line, bold primary fills, simple cel-shadow. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "cel", outline: palette.ink, shadow: "rgba(0,0,0,0.18)",
    body: palette.green, head: palette.green, face: "#fff0d6", eye: palette.ink, glint: palette.white,
    limb: palette.ink, limbWidth: 0.7, glove: palette.white, gloveLine: palette.ink, shoe: palette.red, shoeShine: palette.white,
    bow: palette.yellow, mouth: palette.ink, nose: palette.ink,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.skyLow }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.skyTop], [60, "#c97a7f"], [100, palette.skyLow]] }), // airbrushed sunset
      fx.scanlines(L, { gap: 4, opacity: 0.06 }),
      fx.grain(L, { opacity: 0.1 }),
      fx.vignette(L, { color: "#000", strength: 0.3, inner: 55 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const line = { stroke: P.ink, "stroke-width": 5, "stroke-linejoin": "round" };
    // harbour adventure: sea, skyline, dock, crates, a lighthouse
    const r = T.rng(8);
    for (let x = -40; x < W + 40;) { const w = 80 + r() * 100, h = 160 + r() * 300; T.el("rect", { x, y: G - 280 - h, width: w, height: h, fill: "#4a4f7a", opacity: 0.8 }, g); x += w + 8; }
    T.el("rect", { x: -60, y: G - 280, width: W + 120, height: 300, fill: P.sea }, g);
    const glints = Array.from({ length: 16 }, () => T.el("rect", { height: 6, fill: P.white, opacity: 0.7 }, g));
    const light = T.el("g", { transform: `translate(${W - 160},${G - 40})` }, g);
    T.el("path", { ...line, d: "M-50,0 L-30,-420 L30,-420 L50,0 Z", fill: P.white }, light);
    for (let i = 0; i < 3; i++) T.el("path", { d: `M${-46 + i * 7},${-100 - i * 110} L${46 - i * 7},${-100 - i * 110} L${44 - i * 7},${-150 - i * 110} L${-44 + i * 7},${-150 - i * 110} Z`, fill: P.red }, light);
    const beam = T.el("path", { fill: P.yellow, opacity: 0.35 }, g);
    T.el("rect", { ...line, x: -60, y: G - 20, width: W + 120, height: 700, fill: P.dock }, g);
    for (let x = -60; x < W + 60; x += 70) T.el("line", { x1: x, y1: G - 20, x2: x, y2: G + 700, stroke: P.dockDark, "stroke-width": 5 }, g);
    for (const [x, s] of [[90, 1], [200, 0.8]]) T.el("rect", { ...line, x, y: G - 20 - 150 * s, width: 150 * s, height: 150 * s, fill: "#c98a4b" }, g);
    return {
      update(t) {
        glints.forEach((gl, i) => { const rr = T.rng(i * 3 + 1); gl.setAttribute("x", (rr() * W + Math.sin(t * 2 + i) * 30).toFixed(0)); gl.setAttribute("y", (G - 250 + rr() * 220).toFixed(0)); gl.setAttribute("width", (20 + Math.abs(Math.sin(t * 3 + i)) * 40).toFixed(0)); });
        const a = Math.sin(t * 0.8) * 0.6;
        const lx = W - 160, ly = G - 480;
        beam.setAttribute("d", `M${lx},${ly} L${lx - 900},${ly - 200 + a * 400} L${lx - 900},${ly + 40 + a * 400} Z`);
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["saturday-morning-1987"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
