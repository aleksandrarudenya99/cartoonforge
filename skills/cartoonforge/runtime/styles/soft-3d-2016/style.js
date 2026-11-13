/**
 * Style pack: Soft 3D Feature · 2010s
 * The look of a family 3D feature, faked in 2D: no outlines, soft radial/linear gradients
 * for volume, warm key light + cool rim light, rounded chunky shapes, a sunny modern city
 * with depth haze. Full motion (on ones). Characters (often animals) come from the user.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    skyTop: "#5fb7ff", skyLow: "#cfeaff", haze: "#e9f4ff", tower: "#9cc3e4", towerWarm: "#f2c49b", leaf: "#58b368", leafDark: "#2f8a4f",
    road: "#7f8a99", walk: "#e6ddd0", ink: "#26303b", white: "#ffffff", key: "#ffe2a8", rim: "#a8e1ff",
  };

  // full motion: on ones
  const motion = { drawingsPerSecond: 24, filmFps: 24, bpm: 118, lineWidth: 0 };

  const ROUND = "'Nunito', 'Avenir Next Rounded', 'Arial Rounded MT Bold', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 72, font: ROUND, weight: "bold", style: "normal", fill: palette.white, stroke: "#1f4e79", strokeWidth: 14, maxWidth: 900 };

  const cards = { bg: "#1f4e79", fg: palette.white, accent: palette.key, font: ROUND, frame: "none", transition: "fade", transitionColor: "#0f2a44", upper: false, titleStyle: "normal" };

  /** Characters: no outline, gradient volume, warm key + cool rim light (shading: "soft3d"). */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: 6, shading: "soft3d", outline: null, key: palette.key, rim: palette.rim,
    body: "#ff9f5a", head: "#ffb27a", face: "#fff1e2", eye: palette.ink, glint: palette.white,
    limb: "#e98a4a", limbWidth: 1.1, glove: "#fff1e2", gloveLine: "#e9c7a9", shoe: "#3a4a5c", shoeShine: palette.white,
    bow: "#4fa3ff", mouth: "#5a2d2d", nose: "#5a3a3a",
  };

  function install(svg, { width, height }) {
    const look = T.fx.stack(svg, { width, height, background: palette.skyLow }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.skyTop], [70, palette.skyLow], [100, palette.haze]] }),
      fx.bloom(L, { blur: 12, strength: 0.25 }),
      fx.vignette(L, { color: "#0f2a44", strength: 0.2, inner: 60 }),
    ]);
    // shared gradients for "3D" volume
    const vol = (id, a, b) => { const gr = T.el("linearGradient", { id, x1: "0", y1: "0", x2: "1", y2: "1" }, look.defs); T.el("stop", { offset: "0%", "stop-color": a }, gr); T.el("stop", { offset: "100%", "stop-color": b }, gr); };
    vol("s3d-tower", "#c9e2f6", palette.tower);
    vol("s3d-warm", "#ffe0c2", palette.towerWarm);
    vol("s3d-leaf", palette.leaf, palette.leafDark);
    const rg = T.el("radialGradient", { id: "s3d-sun", cx: "50%", cy: "50%", r: "50%" }, look.defs);
    T.el("stop", { offset: "0%", "stop-color": "#fffbe6" }, rg);
    T.el("stop", { offset: "100%", "stop-color": "#fffbe6", "stop-opacity": "0" }, rg);
    return look;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    T.el("circle", { cx: 860, cy: 520, r: 320, fill: "url(#s3d-sun)" }, g);
    // rounded towers, far ones hazier
    [[0.45, 4, 520, 900], [0.8, 8, 380, 700]].forEach(([o, seed, minH, maxH], layer) => {
      const r = T.rng(seed), grp = T.el("g", { opacity: o }, g);
      for (let x = -40; x < W + 40;) {
        const w = 120 + r() * 120, h = minH + r() * (maxH - minH);
        T.el("rect", { x, y: G - h, width: w, height: h + 40, rx: 36, fill: r() < 0.5 ? "url(#s3d-tower)" : "url(#s3d-warm)" }, grp);
        T.el("rect", { x: x + w - 18, y: G - h + 30, width: 10, height: h - 60, rx: 5, fill: P.white, opacity: 0.5 }, grp); // rim light
        for (let wy = G - h + 50; wy < G - 50; wy += 70) T.el("rect", { x: x + 24, y: wy, width: w - 48, height: 26, rx: 13, fill: "#ffffff", opacity: 0.35 }, grp);
        x += w + 18 + layer * 10;
      }
    });
    // round trees in planters
    const trees = [150, 930].map((x) => {
      const n = T.el("g", {}, g);
      T.el("rect", { x: -16, y: -240, width: 32, height: 240, rx: 14, fill: "#8a5a3c" }, n);
      const crown = T.el("g", {}, n);
      for (const [cx, cy, rr] of [[0, -300, 120], [-80, -240, 80], [80, -235, 85]]) T.el("circle", { cx, cy, r: rr, fill: "url(#s3d-leaf)" }, crown);
      T.el("ellipse", { cx: -40, cy: -360, rx: 40, ry: 22, fill: P.white, opacity: 0.35 }, crown);
      return { n, x, crown };
    });
    T.el("rect", { x: -60, y: G - 10, width: W + 120, height: 130, fill: P.walk }, g);
    T.el("rect", { x: -60, y: G + 120, width: W + 120, height: 600, fill: P.road }, g);
    for (let x = 30; x < W; x += 200) T.el("rect", { x, y: G + 280, width: 110, height: 18, rx: 9, fill: P.white, opacity: 0.85 }, g);
    // soft contact shadow area where characters stand
    T.el("ellipse", { cx: W / 2, cy: G + 10, rx: 420, ry: 26, fill: "#000", opacity: 0.08 }, g);
    return {
      update(t) {
        trees.forEach(({ n, x, crown }, i) => {
          n.setAttribute("transform", `translate(${x},${G - 10})`);
          crown.setAttribute("transform", `rotate(${(Math.sin(t * 1.1 + i) * 2).toFixed(2)} 0 -240)`);
        });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["soft-3d-2016"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
