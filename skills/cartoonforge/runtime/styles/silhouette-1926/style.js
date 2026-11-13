/**
 * Style pack: Silhouette Theatre · 1920s
 * Black cut-paper puppets with lace-like edges in front of a glowing tinted backdrop,
 * ornamental vines, curly trees, depth by lighter far layers. Shadow-play and early
 * silhouette film lineage (1920s Germany; much older shadow-puppet theatre).
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  const palette = {
    ink: "#0d0a08", glow: "#f6d48a", amber: "#e9a24a", rose: "#c8655a", indigo: "#2b2440", cream: "#fbecc8",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 96, lineWidth: 8 };

  const SERIF = "Georgia, 'DejaVu Serif', serif";
  const caption = {
    y: 360, size: 74, font: SERIF, weight: "bold", style: "italic",
    fill: palette.ink, stroke: palette.cream, strokeWidth: 12, maxWidth: 880,
  };

  const cards = {
    bg: palette.ink, fg: palette.glow, font: SERIF, frame: "ornament",
    transition: "fade", transitionColor: palette.ink, upper: false, kickerSpacing: 10,
    titleStyle: "italic",
  };

  // Pip as a cut-out: all black, eyes and mouth cut through so the glow shows
  const skin = {
    ink: palette.ink, white: palette.glow, lineWidth: motion.lineWidth,
    body: palette.ink, head: palette.ink, face: palette.ink, eye: palette.glow, glint: palette.ink,
    limb: palette.ink, limbWidth: 0.85, glove: palette.ink, gloveLine: palette.ink,
    shoe: palette.ink, shoeShine: null, bow: palette.ink, mouth: palette.glow, nose: palette.ink,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.amber }, (fx, L) => [
      fx.gradient(L, { radial: true, stops: [[0, palette.glow], [45, palette.amber], [78, palette.rose], [100, palette.indigo]] }),
      fx.weave(L, { x: 1.5, y: 2 }),
      fx.cutEdge(L, { scale: 2.2 }),
      fx.grain(L, { opacity: 0.22 }),
      fx.vignette(L, { color: palette.ink, strength: 0.6, inner: 50 }),
      fx.flicker(L, { color: palette.glow, amount: 0.05 }),
    ]);
  }

  const spiral = (...a) => T.shapes.spiral(...a);

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const ink = (o = 1) => ({ fill: P.ink, opacity: o });
    const stroke = (w) => ({ fill: "none", stroke: P.ink, "stroke-width": w, "stroke-linecap": "round" });

    // far layer: soft hills and distant domes (lighter = farther)
    T.el("path", { ...ink(0.28), d: `M-60,${G - 200} Q160,${G - 360} 360,${G - 260} T760,${G - 300} T${W + 60},${G - 240} L${W + 60},${G} L-60,${G} Z` }, g);
    for (const [x, h] of [[300, 300], [380, 220], [690, 260]]) {
      T.el("path", { ...ink(0.4), d: `M${x - 34},${G - 140} L${x - 34},${G - h} Q${x},${G - h - 90} ${x + 34},${G - h} L${x + 34},${G - 140} Z` }, g);
    }
    // ground with curly grass
    T.el("rect", { ...ink(), x: -60, y: G - 6, width: W + 120, height: 700 }, g);
    const grass = T.el("g", {}, g);
    for (let i = 0; i < 18; i++) T.el("path", { ...stroke(5), d: spiral(30 + i * 62, G - 22 - (i % 3) * 10, 18, 1.1, i % 2 ? 1 : -1) }, grass);

    // curly tree
    const tree = T.el("g", {}, g);
    T.el("path", { ...ink(), d: "M-26,0 C-20,-120 -40,-220 -10,-330 L14,-330 C20,-220 8,-120 26,0 Z" }, tree);
    const branches = T.el("g", {}, tree);
    [[-1, -300, 120], [1, -330, 140], [-1, -390, 90], [1, -420, 80]].forEach(([dir, y, len], i) => {
      T.el("path", { ...stroke(10), d: `M0,${y} Q${dir * len * 0.5},${y - 60} ${dir * len},${y - 40}` }, branches);
      T.el("path", { ...stroke(7), d: spiral(dir * len, y - 40 - 26, 26, 1.4, dir, Math.PI / 2) }, branches);
      for (let k = 0; k < 4; k++) T.el("ellipse", { ...ink(), cx: dir * (len * 0.3 + k * len * 0.2), cy: y - 50 - (k % 2) * 30, rx: 9, ry: 20, transform: `rotate(${dir * 40} ${dir * (len * 0.3 + k * len * 0.2)} ${y - 50 - (k % 2) * 30})` }, branches);
      if (i === 1) T.el("circle", { ...ink(), cx: 0, cy: -470, r: 22 }, branches);
    });

    // hanging vines from the top edge (proscenium)
    const vines = [80, 270, 810, 1000].map((x, i) => {
      const n = T.el("g", {}, g);
      const len = 140 + (i % 2) * 60;
      T.el("path", { ...stroke(6), d: `M0,-20 C${i % 2 ? 30 : -30},${len * 0.4} ${i % 2 ? -30 : 30},${len * 0.7} 0,${len}` }, n);
      T.el("path", { ...stroke(5), d: spiral(0, len + 22, 22, 1.3, i % 2 ? 1 : -1, -Math.PI / 2) }, n);
      for (let k = 1; k < 4; k++) T.el("ellipse", { ...ink(), cx: (k % 2 ? 14 : -14), cy: (len * k) / 4, rx: 8, ry: 16 }, n);
      return { n, x };
    });

    // birds
    const birds = [0, 1, 2].map(() => T.el("path", { ...stroke(6) }, g));

    return {
      update(t, { beat }) {
        const sway = Math.sin((t / beat) * Math.PI * 0.5);
        tree.setAttribute("transform", `translate(870,${G}) rotate(${(sway * 2).toFixed(2)})`);
        branches.setAttribute("transform", `rotate(${(sway * 1.5).toFixed(2)} 0 -330)`);
        vines.forEach(({ n, x }, i) => n.setAttribute("transform", `translate(${x},0) rotate(${(Math.sin(t * 1.2 + i) * 4).toFixed(2)})`));
        grass.setAttribute("transform", `translate(${(Math.sin(t * 2) * 3).toFixed(1)},0)`);
        birds.forEach((b, i) => {
          const x = ((t * (70 + i * 25) + i * 380) % (W + 300)) - 150;
          const y = 620 + i * 70 + Math.sin(t * 1.5 + i) * 25;
          const flap = Math.sin(t * 9 + i * 2) * 18;
          b.setAttribute("d", `M${x - 34},${y - flap} Q${x - 14},${y - 10} ${x},${y} Q${x + 14},${y - 10} ${x + 34},${y - flap}`);
        });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["silhouette-1926"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
