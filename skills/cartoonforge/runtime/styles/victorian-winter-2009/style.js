/**
 * Style pack: Victorian Winter 3D · 2009
 * Genre look of a gothic holiday 3D feature, faked in 2D: deep blue night, falling snow in
 * layers, gas-lamp pools of warm light, crooked Victorian rooftops and chimneys, cold mist,
 * long dramatic camera moves. A genre, not any specific film.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    night: "#0d1730", sky: "#1d2f55", roofs: "#121a2c", brick: "#3a2f3a", window: "#ffcf7a", lamp: "#ffd98a",
    snow: "#eef4ff", mist: "#9fb3d1", ink: "#0a0e18", white: "#ffffff",
  };

  const motion = { drawingsPerSecond: 24, filmFps: 24, bpm: 76, lineWidth: 0 };

  const SERIF = "'Baskerville', 'Libre Baskerville', Georgia, 'DejaVu Serif', serif";
  const caption = { y: 360, size: 68, font: SERIF, weight: "bold", style: "italic", fill: palette.white, stroke: palette.ink, strokeWidth: 12, maxWidth: 880 };

  const cards = { bg: palette.night, fg: palette.lamp, accent: palette.snow, font: SERIF, frame: "double", transition: "fade", transitionColor: "#05070d", upper: false, titleStyle: "italic" };

  /** Characters: no outline, cold-blue shadow side, warm lamp key light (shading: "soft3d"). */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: 6, shading: "soft3d", outline: null, key: palette.lamp, rim: "#9fc4ff",
    body: "#2b2b38", head: "#e9cbb1", face: "#e9cbb1", eye: palette.ink, glint: palette.white,
    limb: "#2b2b38", limbWidth: 1, glove: "#6b5a4a", gloveLine: "#3a2f26", shoe: "#1a1a1a", shoeShine: palette.white,
    bow: "#7a1f2b", mouth: "#4a2020", nose: "#d4a58c",
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.night }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.night], [70, palette.sky], [100, "#3a4f78"]] }),
      fx.bloom(L, { blur: 12, strength: 0.5 }),
      fx.grain(L, { opacity: 0.12, light: true, blend: "screen" }),
      fx.vignette(L, { color: "#05070d", strength: 0.75, inner: 42 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    T.el("circle", { cx: 240, cy: 480, r: 80, fill: "#dfe7ff", opacity: 0.85 }, g);
    // crooked rooftops with chimneys, two depths
    [[0.55, 5, 300], [1, 9, 160]].forEach(([o, seed, lift]) => {
      const r = T.rng(seed), grp = T.el("g", { opacity: o }, g);
      for (let x = -60; x < W + 60;) {
        const w = 160 + r() * 120, h = 360 + r() * 260, tilt = (r() - 0.5) * 40, top = G - lift - h;
        T.el("path", { d: `M${x},${G} L${x},${top + 60} L${x + w / 2 + tilt},${top} L${x + w},${top + 60} L${x + w},${G} Z`, fill: P.roofs }, grp);
        T.el("rect", { x: x + w * 0.7, y: top - 40, width: 26, height: 90, fill: P.roofs }, grp);
        T.el("path", { d: `M${x},${top + 60} L${x + w / 2 + tilt},${top} L${x + w},${top + 60} L${x + w},${top + 74} L${x + w / 2 + tilt},${top + 16} L${x},${top + 74} Z`, fill: P.snow, opacity: 0.85 }, grp);
        for (let wy = top + 110; wy < G - 80; wy += 120) if (r() < 0.6) T.el("rect", { x: x + w * 0.3, y: wy, width: 34, height: 52, fill: P.window, opacity: 0.9 }, grp);
        x += w + 10;
      }
    });
    // cobblestone street under snow, gas lamps
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: "#2a3550" }, g);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 40, fill: P.snow, opacity: 0.9 }, g);
    const lamps = [160, 920].map((x) => {
      const n = T.el("g", { transform: `translate(${x},${G})` }, g);
      T.el("ellipse", { cx: 0, cy: 10, rx: 170, ry: 30, fill: P.lamp, opacity: 0.25 }, n);
      T.el("rect", { x: -7, y: -420, width: 14, height: 420, fill: P.ink }, n);
      const glow = T.el("circle", { cx: 0, cy: -450, r: 60, fill: P.lamp, opacity: 0.35 }, n);
      T.el("path", { d: "M-24,-480 L24,-480 L16,-420 L-16,-420 Z", fill: P.lamp }, n);
      return glow;
    });
    const mist = T.el("rect", { x: -300, y: G - 120, width: W + 600, height: 160, rx: 80, fill: P.mist, opacity: 0.25 }, g);
    // three depths of snow
    const flakes = Array.from({ length: 90 }, (_, i) => ({ n: T.el("circle", { fill: P.snow }, i < 30 ? look.overlay : g), d: i < 30 ? 1 : i < 60 ? 0.6 : 0.35, i }));
    return {
      update(t) {
        lamps.forEach((l, i) => l.setAttribute("opacity", (0.3 + 0.1 * Math.abs(T.noise(i + 7, t * 3))).toFixed(2)));
        mist.setAttribute("x", (-300 + Math.sin(t * 0.2) * 120).toFixed(0));
        flakes.forEach(({ n, d, i }) => {
          const r = T.rng(i * 7 + 3);
          const y = ((t * (40 + 80 * d) + r() * 2000) % 2000) - 40;
          n.setAttribute("cx", (r() * W + Math.sin(t * (0.6 + r()) + i) * 30 * d).toFixed(1));
          n.setAttribute("cy", y.toFixed(1));
          n.setAttribute("r", (1.5 + d * 5 * r()).toFixed(1));
          n.setAttribute("opacity", (0.4 + d * 0.5).toFixed(2));
        });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["victorian-winter-2009"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
