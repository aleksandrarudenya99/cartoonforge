/**
 * Style pack: Dark Anime Action · 2010s
 * Genre look of grim action anime: desaturated steel / olive palette with one blood-red
 * accent, thick uneven outlines, hatched shadows, storm sky, drifting embers and smoke,
 * impact frames with speed lines and camera shake. A genre, not any specific series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    sky: "#6f7a7c", skyDark: "#3b4246", cloud: "#8d9692", stone: "#5b5f58", stoneDark: "#34372f",
    ink: "#151515", red: "#b3261e", ember: "#ff8a3d", bone: "#e9e4da", olive: "#5e6a45",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 100, lineWidth: 11 };

  const BOLD = "'Oswald', 'Impact', 'Arial Narrow', 'DejaVu Sans Condensed', sans-serif";
  const caption = { y: 360, size: 80, font: BOLD, weight: "bold", style: "normal", fill: palette.bone, stroke: palette.ink, strokeWidth: 14, maxWidth: 900 };

  const cards = { bg: "#16181a", fg: palette.bone, accent: palette.red, font: BOLD, frame: "bar", transition: "fade", transitionColor: "#0c0d0e", upper: true, kickerSpacing: 24 };

  /** Characters: thick outline, muted fills, hatched shadow side. */
  const skin = {
    ink: palette.ink, white: palette.bone, lineWidth: motion.lineWidth, shading: "hatch", outline: palette.ink,
    body: palette.olive, head: "#d9c3a8", face: "#d9c3a8", eye: palette.ink, glint: palette.bone,
    limb: palette.ink, limbWidth: 0.9, glove: palette.bone, gloveLine: palette.ink, shoe: "#3a2a20", shoeShine: null,
    bow: palette.red, mouth: palette.ink, nose: "#a8907a",
  };

  function install(svg, { width, height }) {
    const look = T.fx.stack(svg, { width, height, background: palette.sky }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.skyDark], [55, palette.sky], [100, "#9aa29b"]] }),
      fx.boil(L, { scale: 3, freq: 0.03, dps: motion.drawingsPerSecond }),
      fx.grain(L, { opacity: 0.25 }),
      fx.vignette(L, { color: "#0c0d0e", strength: 0.75, inner: 45 }),
    ]);
    look.hatch = T.fx.hatch(look, { color: palette.ink, gap: 10, width: 2.4 }).id;
    look.speed = T.fx.speedLines(look, { color: palette.bone, count: 50 });
    const upd = look.update;
    look.update = (t) => { upd(t); look.speed.update(t); };
    return look;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const line = { stroke: P.ink, "stroke-width": motion.lineWidth, "stroke-linejoin": "round" };
    // storm clouds, two drifting layers
    const clouds = [0, 1].map((i) => T.el("path", { d: S().ridge(-200, W + 200, 260 + i * 150, 120, { seed: 30 + i, peaks: 7, bottom: 120 + i * 130 }), fill: i ? P.cloud : P.skyDark, opacity: 0.8 }, g));
    // jagged cliffs and a ruined tower
    T.el("path", { ...line, d: S().ridge(-60, W + 60, G - 420, 380, { seed: 12, peaks: 5, bottom: G, sharp: true, jag: 30 }), fill: P.stone }, g);
    T.el("path", { d: S().ridge(-60, W + 60, G - 420, 380, { seed: 12, peaks: 5, bottom: G, sharp: true, jag: 30 }), fill: `url(#${look.hatch})`, opacity: 0.45 }, g);
    const tower = T.el("g", {}, g);
    T.el("path", { ...line, d: `M-70,0 L-55,-520 L-20,-560 L10,-500 L40,-545 L60,-500 L70,0 Z`, fill: P.stoneDark }, tower);
    for (let y = -460; y < -40; y += 90) T.el("rect", { x: -18, y, width: 36, height: 50, fill: P.ink }, tower);
    tower.setAttribute("transform", `translate(${W - 170},${G})`);
    T.el("rect", { ...line, x: -60, y: G, width: W + 120, height: 700, fill: P.stoneDark }, g);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: `url(#${look.hatch})`, opacity: 0.5 }, g);
    // embers rising
    const embers = Array.from({ length: 30 }, () => T.el("circle", { fill: P.ember }, g));
    return {
      update(t) {
        clouds.forEach((c, i) => c.setAttribute("transform", `translate(${(-t * (12 + i * 10)).toFixed(1)},0)`));
        embers.forEach((e, i) => {
          const r = T.rng(i * 13 + 1);
          const sp = 60 + r() * 120, x0 = r() * W, ph = r() * 20;
          const y = G + 100 - ((t * sp + ph * 100) % 1500);
          e.setAttribute("cx", (x0 + Math.sin(t * 2 + i) * 30).toFixed(1));
          e.setAttribute("cy", y.toFixed(1));
          e.setAttribute("r", (2 + r() * 4).toFixed(1));
          e.setAttribute("opacity", (0.4 + 0.6 * Math.abs(T.noise(i, t * 3))).toFixed(2));
        });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["dark-anime-2013"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
