/**
 * Style pack: Nihonga Drama · 2020s
 * Genre look of modern anime painted like nihonga / ukiyo-e: flat mineral-pigment colour,
 * gold-leaf cloud bands, a crimson sun, mountains in layers, drifting smoke that stands
 * out against the flat painting, and big typographic overlays across the frame.
 * A genre, not any specific series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    silk: "#efe4cc", gold: "#d4a945", goldDeep: "#a9802c", crimson: "#c0392b", indigo: "#2e3f5c", azurite: "#3f6e8c",
    malachite: "#4f7f5f", ink: "#1b1714", smoke: "#f7f2e8", vermilion: "#d9542b",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 88, lineWidth: 7 };

  const MINCHO = "'Yu Mincho', 'Hiragino Mincho ProN', 'Noto Serif', Georgia, 'DejaVu Serif', serif";
  const caption = { y: 360, size: 70, font: MINCHO, weight: "bold", style: "normal", fill: palette.ink, stroke: palette.silk, strokeWidth: 12, maxWidth: 880 };

  const cards = { bg: palette.silk, fg: palette.ink, accent: palette.crimson, endFg: palette.ink, font: MINCHO, frame: "bar", transition: "fade", transitionColor: palette.silk, upper: true, kickerSpacing: 30 };

  /** Characters: fine ink line, flat mineral colours, no shading (nihonga). */
  const skin = {
    ink: palette.ink, white: palette.smoke, lineWidth: motion.lineWidth, shading: "none", outline: palette.ink,
    body: palette.indigo, head: "#f0dcc4", face: "#f0dcc4", eye: palette.ink, glint: null,
    limb: palette.ink, limbWidth: 0.6, glove: palette.smoke, gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: palette.crimson, mouth: palette.ink, nose: "#d9b597",
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.silk }, (fx, L) => [
      fx.paper(L, { color: "#fff8e8", opacity: 0.6, freq: 0.06 }),
      fx.grain(L, { opacity: 0.1 }),
      fx.vignette(L, { color: palette.goldDeep, strength: 0.3, inner: 55 }),
    ]);
  }

  /** Gold-leaf cloud band (suyari-gasumi): a long rounded bar with scalloped ends. */
  function goldBand(parent, P, x, y, w, h) {
    const n = T.el("g", {}, parent);
    T.el("rect", { x, y, width: w, height: h, rx: h / 2, fill: P.gold, stroke: P.goldDeep, "stroke-width": 4 }, n);
    for (let i = 0; i < 3; i++) T.el("circle", { cx: x + 30 + i * 28, cy: y + (i % 2 ? h * 0.3 : h * 0.7), r: h * 0.35, fill: P.gold, stroke: P.goldDeep, "stroke-width": 4 }, n);
    return n;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const sun = T.el("circle", { r: 150, fill: P.crimson }, g);
    // layered mountains in mineral colours
    T.el("path", { d: S().ridge(-80, W + 80, G - 520, 260, { seed: 5, peaks: 4, bottom: G }), fill: P.azurite }, g);
    T.el("path", { d: S().ridge(-80, W + 80, G - 330, 200, { seed: 9, peaks: 5, bottom: G }), fill: P.malachite }, g);
    // a distant tower/castle silhouette (generic) and a broadcast mast
    const tower = T.el("g", { transform: `translate(${W - 220},${G - 330})` }, g);
    for (let i = 0; i < 3; i++) T.el("path", { d: `M${-90 + i * 22},${-i * 70} L${90 - i * 22},${-i * 70} L${60 - i * 22},${-i * 70 - 40} L${-60 + i * 22},${-i * 70 - 40} Z`, fill: P.ink }, tower);
    T.el("path", { d: `M180,${G - 300} L200,${G - 760} L220,${G - 300} Z M190,${G - 560} L210,${G - 560}`, fill: P.vermilion, stroke: P.ink, "stroke-width": 3 }, g);
    const bands = [[-200, G - 760, 720, 70], [520, G - 640, 760, 64], [-100, G - 260, 600, 60]].map(([x, y, w, h]) => ({ n: goldBand(g, P, x, y, w, h), x }));
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.goldDeep, opacity: 0.85 }, g);
    // drifting smoke (soft, the one non-flat element)
    const smoke = Array.from({ length: 7 }, () => T.el("ellipse", { fill: P.smoke, opacity: 0.0 }, g));
    // typographic overlay (Latin, to stay universal): big outlined word drifting across
    const type = T.el("text", { y: 1260, "font-family": MINCHO, "font-size": 260, "font-weight": "bold", fill: "none", stroke: P.crimson, "stroke-width": 4, opacity: 0.35, "letter-spacing": 30 }, look.overlay);
    type.textContent = "THREE";
    return {
      update(t) {
        sun.setAttribute("transform", `translate(${W / 2},${G - 820 + Math.sin(t * 0.2) * 10})`);
        bands.forEach(({ n }, i) => n.setAttribute("transform", `translate(${(Math.sin(t * 0.15 + i) * 40).toFixed(1)},0)`));
        smoke.forEach((s, i) => {
          const r = T.rng(i * 5 + 3), k = ((t * 0.12 + r()) % 1);
          s.setAttribute("cx", (r() * W + k * 120).toFixed(1));
          s.setAttribute("cy", (G - 100 - k * 500).toFixed(1));
          s.setAttribute("rx", (80 + k * 220).toFixed(1));
          s.setAttribute("ry", (30 + k * 90).toFixed(1));
          s.setAttribute("opacity", (Math.sin(Math.PI * k) * 0.55).toFixed(2));
        });
        type.setAttribute("x", (W - (t * 40) % (W + 1400)).toFixed(0));
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["nihonga-drama-2026"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
