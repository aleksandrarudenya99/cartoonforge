/**
 * Style pack: Comic Halftone · 1960s pop print (and its 2018+ revival in stylised animation)
 * Ben-Day dot fills, heavy black outlines, CMY print misregistration, sunburst rays,
 * panel borders and impact speed lines. Snappy motion on twos.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    paper: "#fdf6e3", ink: "#111111", yellow: "#ffd23f", red: "#ee4035", blue: "#2f6fdf", cyan: "#2ab7ca",
    magenta: "#e94f8a", white: "#ffffff",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 112, lineWidth: 9 };

  const PUNCH = "'Bangers', 'Impact', 'Arial Black', 'DejaVu Sans', sans-serif";
  const caption = { y: 360, size: 84, font: PUNCH, weight: "bold", style: "italic", fill: palette.ink, stroke: palette.yellow, strokeWidth: 16, maxWidth: 920 };

  const cards = { bg: palette.yellow, fg: palette.ink, accent: palette.red, font: PUNCH, frame: "bar", transition: "iris", transitionColor: palette.ink, upper: true, kickerSpacing: 8, titleStyle: "italic" };

  /** Characters: bold black outline, flat fill + halftone shading. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "halftone", outline: palette.ink,
    body: palette.blue, head: palette.blue, face: palette.white, eye: palette.ink, glint: palette.white,
    limb: palette.ink, limbWidth: 1, glove: palette.white, gloveLine: palette.ink, shoe: palette.red, shoeShine: palette.white,
    bow: palette.red, mouth: palette.ink, nose: palette.ink,
  };

  function install(svg, { width, height }) {
    const look = T.fx.stack(svg, { width, height, background: palette.paper }, (fx, L) => [
      fx.misregister(L, { dx: 7, dy: -5, color: palette.cyan, opacity: 0.5 }),
      fx.grain(L, { opacity: 0.12, freq: 1.1 }),
    ]);
    look.dots = T.fx.halftone(look, { color: palette.red, size: 16, dot: 4.2 }).id;
    look.dotsBlue = T.fx.halftone(look, { color: palette.blue, size: 14, dot: 3.4, angle: 45 }).id;
    look.speed = T.fx.speedLines(look, { color: palette.ink, count: 44 });
    const upd = look.update;
    look.update = (t) => { upd(t); look.speed.update(t); };
    // panel border around the frame
    T.el("rect", { x: 14, y: 14, width: width - 28, height: height - 28, fill: "none", stroke: palette.ink, "stroke-width": 16 }, look.fxTop);
    return look;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // sunburst rays behind everything
    const rays = T.el("g", {}, g);
    for (let k = 0; k < 18; k++) {
      const a0 = (k * Math.PI * 2) / 18, a1 = a0 + Math.PI / 18;
      T.el("path", { d: `M0,0 L${Math.cos(a0) * 1600},${Math.sin(a0) * 1600} L${Math.cos(a1) * 1600},${Math.sin(a1) * 1600} Z`, fill: k % 2 ? P.yellow : "#ffe58a" }, rays);
    }
    T.el("circle", { r: 1500, fill: `url(#${look.dots})`, opacity: 0.35 }, rays);
    // skyline blocks with halftone
    const city = T.el("g", {}, g);
    const r = T.rng(5);
    for (let i = 0, x = -40; x < W + 40; i++) {
      const w = 90 + r() * 110, h = 250 + r() * 420;
      T.el("rect", { x, y: G - h, width: w, height: h, fill: i % 2 ? P.blue : P.magenta, stroke: P.ink, "stroke-width": 7 }, city);
      T.el("rect", { x, y: G - h, width: w, height: h, fill: `url(#${look.dotsBlue})`, opacity: 0.6 }, city);
      for (let wy = G - h + 30; wy < G - 40; wy += 70) for (let wx = x + 18; wx < x + w - 30; wx += 44) T.el("rect", { x: wx, y: wy, width: 22, height: 34, fill: P.yellow, stroke: P.ink, "stroke-width": 3 }, city);
      x += w + 6;
    }
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.red, stroke: P.ink, "stroke-width": 9 }, g);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: `url(#${look.dots})`, opacity: 0.5 }, g);
    // a "POW" starburst that pops on the downbeats
    const pow = T.el("g", {}, look.overlay);
    T.el("path", { d: S().star(0, 0, 150, 12, 0.62), fill: P.white, stroke: P.ink, "stroke-width": 8 }, pow);
    const tx = T.el("text", { y: 26, "text-anchor": "middle", "font-family": PUNCH, "font-size": 86, fill: P.red, stroke: P.ink, "stroke-width": 4, "font-style": "italic" }, pow);
    tx.textContent = "POP!";
    return {
      update(t, { beat }) {
        rays.setAttribute("transform", `translate(${W / 2},${G - 520}) rotate(${(Math.floor(t * 4) * 2) % 360})`);
        const bar = Math.floor(t / (beat * 4));
        const k = (t % (beat * 4)) / beat;
        const show = bar % 2 === 1 && k < 0.9;
        pow.setAttribute("opacity", show ? "1" : "0");
        pow.setAttribute("transform", `translate(${bar % 4 === 1 ? 250 : 830},700) rotate(-12) scale(${show ? T.ease.outBack(Math.min(1, k * 3)) : 0})`);
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["comic-halftone-1966"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
