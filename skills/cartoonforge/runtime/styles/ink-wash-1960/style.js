/**
 * Style pack: Ink Wash · 1960s
 * Brush-and-ink painting brought to life: grey ink gradations that bleed into rice paper,
 * no outlines, mountains in mist, lots of empty space, a red seal. Lineage: Chinese
 * ink-wash animation that began in Shanghai in 1960.
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  const palette = {
    paper: "#f1ece0", ink: "#1d1c1a", wash: "rgba(29,28,26,0.55)", light: "rgba(29,28,26,0.22)",
    seal: "#b5352a", mist: "#f7f3ea",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 72, lineWidth: 8 };

  const SERIF = "'Songti SC', 'Noto Serif', Georgia, 'DejaVu Serif', serif";
  const caption = {
    y: 360, size: 68, font: SERIF, weight: "normal", style: "normal",
    fill: palette.ink, stroke: palette.paper, strokeWidth: 10, maxWidth: 860,
  };

  const cards = {
    bg: palette.paper, fg: palette.ink, endFg: palette.ink, font: SERIF, frame: "none",
    transition: "fade", transitionColor: palette.paper, upper: false, kickerSpacing: 20, titleWeight: "normal",
  };

  // Pip painted in ink: translucent wash body, paper-white face
  const skin = {
    ink: palette.ink, white: palette.paper, lineWidth: motion.lineWidth,
    body: "rgba(29,28,26,0.82)", head: "rgba(29,28,26,0.9)", face: palette.paper, eye: palette.ink, glint: palette.paper,
    limb: "rgba(29,28,26,0.9)", limbWidth: 0.7, glove: palette.paper, gloveLine: palette.ink,
    shoe: palette.ink, shoeShine: null, bow: palette.seal, mouth: palette.ink, nose: palette.ink,
  };

  function install(svg, { width, height }) {
    const look = T.fx.stack(svg, { width, height, background: palette.paper }, (fx, L) => [
      fx.paper(L, { color: "#fffaf0", opacity: 0.55, freq: 0.03 }),
      fx.inkBleed(L, { blur: 1.8, spread: 7 }),
      fx.grain(L, { opacity: 0.1, freq: 0.7 }),
    ]);
    return look;
  }

  /** A soft mountain range: ink fading to paper toward the bottom (the "wash"). */
  function range(parent, defs, { y, h, opacity, seed, peaks = 5, W }) {
    const gid = `wash-${seed}`;
    const gr = T.el("linearGradient", { id: gid, x1: "0", y1: "0", x2: "0", y2: "1" }, defs);
    T.el("stop", { offset: "0%", "stop-color": palette.ink, "stop-opacity": String(opacity) }, gr);
    T.el("stop", { offset: "100%", "stop-color": palette.ink, "stop-opacity": "0" }, gr);
    const r = T.rng(seed);
    let d = `M-80,${y + h}`;
    for (let i = 0; i <= peaks; i++) {
      const x = -80 + ((W + 160) * i) / peaks;
      const py = y + r() * h * 0.5;
      d += ` Q${(x - (W + 160) / peaks / 2).toFixed(0)},${(py - h * (0.3 + r() * 0.5)).toFixed(0)} ${x.toFixed(0)},${py.toFixed(0)}`;
    }
    d += ` L${W + 80},${y + h * 1.6} L-80,${y + h * 1.6} Z`;
    return T.el("path", { d, fill: `url(#${gid})` }, parent);
  }

  const stroke = (...a) => T.shapes.brush(...a);

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const far = range(g, look.defs, { y: 760, h: 300, opacity: 0.22, seed: 3, peaks: 4, W });
    const mid = range(g, look.defs, { y: 960, h: 300, opacity: 0.4, seed: 8, peaks: 6, W });
    const mist = [0, 1].map(() => T.el("rect", { x: -200, width: W + 400, height: 70, rx: 35, fill: P.mist, opacity: 0.75 }, g));
    // water / ground as one wide horizontal wash stroke
    T.el("path", { d: stroke(-60, G + 8, W + 60, G + 8, 22), fill: P.light }, g);
    const ripples = [0, 1, 2].map(() => T.el("ellipse", { fill: "none", stroke: P.ink, "stroke-width": 3 }, g));

    // reeds / bamboo on the left
    const reeds = [40, 95, 150, 980].map((x, i) => {
      const n = T.el("g", {}, g);
      const h = 380 + (i % 3) * 90;
      T.el("path", { d: stroke(0, 0, (i % 2 ? 18 : -14), -h, 7), fill: P.ink, opacity: 0.85 }, n);
      for (let k = 1; k < 4; k++) {
        const y = (-h * k) / 4, dir = k % 2 ? 1 : -1;
        T.el("path", { d: stroke(0, y, dir * 110, y - 60, 12), fill: P.ink, opacity: 0.75 }, n);
      }
      return { n, x, i };
    });

    // red seal (not bled: overlay)
    const seal = T.el("g", { transform: `translate(${W - 150},1330)` }, look.overlay);
    T.el("rect", { x: 0, y: 0, width: 92, height: 92, rx: 8, fill: P.seal, opacity: 0.88 }, seal);
    const sl = (s, y) => { const n = T.el("text", { x: 46, y, "text-anchor": "middle", fill: P.paper, "font-family": SERIF, "font-size": 34, "font-weight": "bold" }, seal); n.textContent = s; };
    sl("C", 42); sl("F", 80);

    return {
      update(t, { beat }) {
        far.setAttribute("transform", `translate(${(-t * 4).toFixed(1)},0)`);
        mid.setAttribute("transform", `translate(${(-t * 9).toFixed(1)},0)`);
        mist.forEach((m, i) => { m.setAttribute("x", (-200 + Math.sin(t * 0.25 + i * 2) * 120).toFixed(0)); m.setAttribute("y", String(1020 + i * 150)); });
        ripples.forEach((r, i) => {
          const k = ((t / (beat * 2) + i / 3) % 1);
          r.setAttribute("cx", String(300 + i * 220));
          r.setAttribute("cy", String(G + 40));
          r.setAttribute("rx", (20 + k * 160).toFixed(1));
          r.setAttribute("ry", (4 + k * 18).toFixed(1));
          r.setAttribute("opacity", ((1 - k) * 0.45).toFixed(2));
        });
        reeds.forEach(({ n, x, i }) => n.setAttribute("transform", `translate(${x},${G}) rotate(${(Math.sin(t * 0.9 + i) * 3).toFixed(2)})`));
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["ink-wash-1960"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
