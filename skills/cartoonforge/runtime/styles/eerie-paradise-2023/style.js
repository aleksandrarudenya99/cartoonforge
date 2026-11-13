/**
 * Style pack: Eerie Paradise Anime · 2020s
 * Genre look of dark-fantasy anime set in a "paradise" that is deadly: lush, poison-bright
 * flowers and petals over misty jungle, soft pastel light against deep shadow, drifting
 * glowing spores. Beauty that feels wrong. A genre, not any specific series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    mist: "#e8eef0", skyTop: "#bcd7d3", skyLow: "#f2dfe6", jungle: "#2f4b3f", jungleDeep: "#16261f",
    petal: "#f49ac1", petalDeep: "#c2457a", lotus: "#f7e7a1", spore: "#d8ffcf", ink: "#1a1416", bone: "#f5efe6", blood: "#9e1b32",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 84, lineWidth: 7 };

  const SERIF = "'Noto Serif', Georgia, 'DejaVu Serif', serif";
  const caption = { y: 360, size: 72, font: SERIF, weight: "bold", style: "normal", fill: palette.bone, stroke: palette.ink, strokeWidth: 12, maxWidth: 880 };

  const cards = { bg: palette.jungleDeep, fg: palette.bone, accent: palette.petal, font: SERIF, frame: "bar", transition: "fade", transitionColor: palette.mist, endFg: palette.ink, upper: false, kickerSpacing: 18 };

  /** Characters: fine dark line, soft fills, a cool cel-shadow. */
  const skin = {
    ink: palette.ink, white: palette.bone, lineWidth: motion.lineWidth, shading: "cel", outline: palette.ink, shadow: "rgba(47,75,63,0.35)",
    body: "#e9e2d4", head: "#f1d6c4", face: "#f1d6c4", eye: palette.ink, glint: palette.bone,
    limb: palette.ink, limbWidth: 0.7, glove: palette.bone, gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: palette.blood, mouth: palette.ink, nose: "#d9ab98",
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.skyLow }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.skyTop], [55, palette.skyLow], [100, palette.mist]] }),
      fx.bloom(L, { blur: 8, strength: 0.4 }),
      fx.grain(L, { opacity: 0.12 }),
      fx.vignette(L, { color: palette.jungleDeep, strength: 0.65, inner: 48 }),
    ]);
  }

  function flower(parent, P, size, petals = 7) {
    const n = T.el("g", {}, parent);
    for (let k = 0; k < petals; k++) T.el("path", { d: `M0,0 C${size * 0.4},${-size * 0.3} ${size * 0.35},${-size} 0,${-size * 1.05} C${-size * 0.35},${-size} ${-size * 0.4},${-size * 0.3} 0,0 Z`, fill: k % 2 ? P.petal : P.petalDeep, transform: `rotate(${(k * 360) / petals})`, stroke: P.ink, "stroke-width": 3 }, n);
    T.el("circle", { r: size * 0.22, fill: P.lotus, stroke: P.ink, "stroke-width": 3 }, n);
    return n;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // misty jungle silhouettes, far to near
    [[G - 560, 0.25, 3], [G - 420, 0.5, 7], [G - 260, 0.85, 12]].forEach(([y, o, seed]) => T.el("path", { d: S().ridge(-80, W + 80, y, 220, { seed, peaks: 9, bottom: G + 10 }), fill: P.jungle, opacity: o }, g));
    const mist = [0, 1].map(() => T.el("rect", { x: -300, width: W + 600, height: 90, rx: 45, fill: P.mist, opacity: 0.6 }, g));
    // giant hanging leaves from the top
    const leaves = [60, 300, 820, 1010].map((x, i) => {
      const n = T.el("g", {}, g);
      T.el("path", { d: S().brush(0, -40, (i % 2 ? 60 : -60), 300 + i * 40, 70), fill: P.jungleDeep }, n);
      return { n, x, i };
    });
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.jungleDeep }, g);
    // oversized flowers near the ground
    const flowers = [[110, G - 30, 120], [960, G - 60, 150], [520, G + 90, 80]].map(([x, y, s], i) => ({ n: flower(g, P, s, 7 + (i % 2)), x, y, i }));
    // glowing spores + falling petals
    const spores = Array.from({ length: 34 }, () => T.el("circle", { fill: P.spore }, g));
    const petals = Array.from({ length: 14 }, () => T.el("ellipse", { rx: 9, ry: 16, fill: P.petal, stroke: P.ink, "stroke-width": 2 }, g));
    return {
      update(t) {
        mist.forEach((m, i) => { m.setAttribute("x", (-300 + Math.sin(t * 0.2 + i * 2) * 140).toFixed(0)); m.setAttribute("y", String(G - 380 + i * 170)); });
        leaves.forEach(({ n, x, i }) => n.setAttribute("transform", `translate(${x},0) rotate(${(Math.sin(t * 0.7 + i) * 4).toFixed(2)})`));
        flowers.forEach(({ n, x, y, i }) => n.setAttribute("transform", `translate(${x},${y}) rotate(${(t * 6 * (i % 2 ? 1 : -1)).toFixed(1)}) scale(${(1 + Math.sin(t * 1.3 + i) * 0.03).toFixed(3)})`));
        spores.forEach((s, i) => {
          const r = T.rng(i * 7 + 2);
          s.setAttribute("cx", (r() * W + Math.sin(t * 0.8 + i) * 40).toFixed(1));
          s.setAttribute("cy", (G - ((t * (15 + r() * 30) + r() * 1400) % 1400)).toFixed(1));
          s.setAttribute("r", (2 + r() * 4).toFixed(1));
          s.setAttribute("opacity", (0.3 + 0.7 * Math.abs(T.noise(i, t * 2))).toFixed(2));
        });
        petals.forEach((p, i) => {
          const r = T.rng(i * 11 + 5);
          const y = ((t * (60 + r() * 50) + r() * 1600) % 1600) + 200;
          p.setAttribute("transform", `translate(${(r() * W + Math.sin(t + i) * 60).toFixed(1)},${y.toFixed(1)}) rotate(${(t * 90 + i * 40) % 360})`);
        });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["eerie-paradise-2023"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
