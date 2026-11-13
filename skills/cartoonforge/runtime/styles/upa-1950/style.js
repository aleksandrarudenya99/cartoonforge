/**
 * Style pack: UPA / Mid-century modern · 1950s
 * Flat colour shapes, thin line drawn slightly OFF the colour (line and colour are separate
 * layers), atomic-age motifs, limited animation that holds and snaps.
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  const palette = {
    paper: "#f3ead8", ink: "#2b2a28", mustard: "#e2a53a", teal: "#2f7f7a",
    coral: "#e0644b", sky: "#a9d3cb", olive: "#8a9a4b", cream: "#fbf5e8",
  };

  // limited animation: 8 drawings per second ("on threes"), poses snap on the beat
  const motion = { drawingsPerSecond: 8, filmFps: 24, bpm: 132, lineWidth: 5 };

  const SANS = "Futura, 'Century Gothic', 'Avenir Next', 'DejaVu Sans', sans-serif";
  const caption = {
    y: 380, size: 70, font: SANS, weight: "bold", style: "normal",
    fill: palette.ink, stroke: palette.cream, strokeWidth: 14, maxWidth: 900,
  };

  const cards = {
    bg: palette.teal, fg: palette.cream, accent: palette.mustard, font: SANS,
    frame: "bar", transition: "fade", transitionColor: palette.ink, upper: true,
    kickerSpacing: 18, titleStyle: "normal",
  };

  const skin = {
    ink: palette.ink, white: palette.cream, lineWidth: motion.lineWidth,
    body: palette.coral, head: palette.coral, face: palette.cream, eye: palette.ink, glint: null,
    limb: palette.ink, limbWidth: 0.45, glove: palette.cream, gloveLine: palette.ink,
    shoe: palette.ink, shoeShine: null, bow: palette.mustard, mouth: palette.ink, nose: palette.ink,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.paper }, (fx, L) => [
      fx.paper(L, { color: "#fff7e6", opacity: 0.35 }),
      fx.grain(L, { opacity: 0.12, freq: 0.9 }),
      fx.vignette(L, { color: palette.ink, strength: 0.18, inner: 65 }),
    ]);
  }

  /** Line + colour as separate, misregistered layers — the UPA signature. */
  function shape(parent, d, fill, { dx = 9, dy = -7, line = true, lw = motion.lineWidth } = {}) {
    const g = T.el("g", {}, parent);
    T.el("path", { d, fill, transform: `translate(${dx},${dy})` }, g);
    if (line) T.el("path", { d, fill: "none", stroke: palette.ink, "stroke-width": lw, "stroke-linejoin": "round" }, g);
    return g;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // big flat colour fields
    T.el("rect", { x: -60, y: 520, width: W + 120, height: G - 520, fill: P.sky }, g);
    T.el("path", { d: `M-60,${G - 260} L${W * 0.35},${G - 420} L${W * 0.7},${G - 300} L${W + 60},${G - 380} L${W + 60},${G} L-60,${G} Z`, fill: P.olive, opacity: 0.85 }, g);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 600, fill: P.mustard }, g);
    T.el("path", { d: `M-60,${G} L${W + 60},${G}`, stroke: P.ink, "stroke-width": 5 }, g);
    for (let i = 0; i < 7; i++) T.el("path", { d: `M${80 + i * 150},${G + 90 + (i % 2) * 120} l70,0`, stroke: P.ink, "stroke-width": 4, "stroke-linecap": "round" }, g);

    const sun = T.el("g", {}, g);
    shape(sun, "M-90,0 a90,90 0 1,0 180,0 a90,90 0 1,0 -180,0", P.coral, { dx: 14, dy: 10 });

    // atomic starbursts and boomerangs that snap between two poses on the beat
    const star = (s) => T.shapes.star(0, 0, s, 4, 0.25);
    const stars = [[160, 640, 34], [930, 760, 26], [700, 600, 18]].map(([x, y, s]) => {
      const n = T.el("g", {}, g);
      T.el("path", { d: star(s), fill: P.cream, stroke: P.ink, "stroke-width": 3 }, n);
      return { n, x, y };
    });
    const boomer = T.el("g", {}, g);
    shape(boomer, "M-70,0 Q0,-60 70,0 Q0,-25 -70,0 Z", P.teal, { dx: 6, dy: 6, lw: 4 });

    // geometric trees: lollipop + pine, colour offset from the line
    const trees = [
      { x: 860, kind: "lolly", fill: P.teal, h: 330 },
      { x: 990, kind: "pine", fill: P.olive, h: 260 },
      { x: 120, kind: "pine", fill: P.teal, h: 300 },
    ].map((tr) => {
      const n = T.el("g", {}, g);
      T.el("path", { d: `M0,0 L0,${-tr.h * 0.55}`, stroke: P.ink, "stroke-width": 6 }, n);
      const crown = T.el("g", {}, n);
      if (tr.kind === "lolly") shape(crown, `M-95,${-tr.h * 0.75} a95,95 0 1,0 190,0 a95,95 0 1,0 -190,0`, tr.fill);
      else shape(crown, `M0,${-tr.h} L-80,${-tr.h * 0.4} L80,${-tr.h * 0.4} Z`, tr.fill);
      return { n, x: tr.x };
    });

    return {
      update(t, { beat }) {
        const beatN = Math.floor(t / beat);
        const pose = beatN % 2; // limited animation: two drawings, alternate on the beat
        sun.setAttribute("transform", `translate(${W - 230},700) rotate(${pose ? 8 : -4})`);
        stars.forEach(({ n, x, y }, i) => n.setAttribute("transform", `translate(${x},${y}) rotate(${((beatN + i) % 3) * 15}) scale(${(pose + i) % 2 ? 1 : 0.8})`));
        boomer.setAttribute("transform", `translate(${330 + (beatN % 4) * 18},560) rotate(${pose ? -10 : 6})`);
        trees.forEach(({ n, x }, i) => n.setAttribute("transform", `translate(${x},${G}) rotate(${(pose + i) % 2 ? 2.5 : -2.5})`));
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["upa-1950"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
