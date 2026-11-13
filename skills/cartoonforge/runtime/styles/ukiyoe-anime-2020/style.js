/**
 * Style pack: Ukiyo-e Action Anime · 2020s
 * Genre look of modern action anime that paints elemental effects like woodblock prints:
 * swirling water / flame / wind drawn with ukiyo-e curls, brush outlines and flat layered
 * colour, over endless shifting halls of sliding doors (Escher-like impossible architecture).
 * A genre, not any specific film: no existing characters, patterns or technique names.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    night: "#14101f", hall: "#2a2238", wood: "#5a3a28", woodDark: "#3a2418", shoji: "#e9dcc0", lamp: "#ffcf7a",
    water: "#2c6fb5", waterLight: "#9fd3f5", foam: "#f4f1e6", flame: "#e2462e", flameLight: "#ffb347", ink: "#120e14", gold: "#d8a63c",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 116, lineWidth: 9 };

  const BRUSH = "'Yu Mincho', 'Hiragino Mincho ProN', 'Noto Serif', Georgia, 'DejaVu Serif', serif";
  const caption = { y: 360, size: 76, font: BRUSH, weight: "bold", style: "normal", fill: palette.foam, stroke: palette.ink, strokeWidth: 14, maxWidth: 900 };

  const cards = { bg: palette.night, fg: palette.foam, accent: palette.flame, font: BRUSH, frame: "bar", transition: "fade", transitionColor: palette.night, upper: false, kickerSpacing: 16 };

  /** Characters: brush-weight dark outline, flat layered colour, one cel-shadow. */
  const skin = {
    ink: palette.ink, white: palette.foam, lineWidth: motion.lineWidth, shading: "cel", outline: palette.ink, shadow: "rgba(18,14,20,0.25)",
    body: "#3b5e4a", head: "#f0d2b6", face: "#f0d2b6", eye: palette.ink, glint: palette.foam,
    limb: palette.ink, limbWidth: 0.8, glove: palette.foam, gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: palette.flame, mouth: palette.ink, nose: "#d8ad8c",
  };

  function install(svg, { width, height }) {
    const look = T.fx.stack(svg, { width, height, background: palette.night }, (fx, L) => [
      fx.paper(L, { color: "#3a3045", opacity: 0.25, freq: 0.05 }),
      fx.boil(L, { scale: 2.5, freq: 0.025, dps: motion.drawingsPerSecond }),
      fx.grain(L, { opacity: 0.14, light: true, blend: "screen" }),
      fx.vignette(L, { color: palette.night, strength: 0.7, inner: 45 }),
    ]);
    look.speed = T.fx.speedLines(look, { color: palette.foam, count: 40 });
    const upd = look.update;
    look.update = (t) => { upd(t); look.speed.update(t); };
    return look;
  }

  /** One hall "cell": floor, ceiling beams and a wall of sliding shoji doors, in perspective. */
  function hallCell(parent, P) {
    const n = T.el("g", {}, parent);
    const line = { stroke: P.woodDark, "stroke-width": 8 };
    T.el("rect", { x: -700, y: -900, width: 1400, height: 1800, fill: P.hall }, n);
    T.el("path", { d: "M-700,300 L-260,80 L260,80 L700,300 Z", fill: P.wood }, n); // floor
    T.el("path", { d: "M-700,-500 L-260,-260 L260,-260 L700,-500 Z", fill: P.woodDark }, n); // ceiling
    for (let i = 0; i < 6; i++) { // shoji wall at the back
      const x = -260 + i * (520 / 6);
      T.el("rect", { ...line, x, y: -260, width: 520 / 6, height: 340, fill: P.shoji }, n);
      for (let k = 1; k < 4; k++) T.el("line", { x1: x, y1: -260 + k * 85, x2: x + 520 / 6, y2: -260 + k * 85, stroke: P.woodDark, "stroke-width": 3 }, n);
    }
    for (const s of [-1, 1]) { // side walls with doors
      T.el("path", { ...line, d: `M${s * 700},-500 L${s * 260},-260 L${s * 260},80 L${s * 700},300 Z`, fill: P.shoji, opacity: 0.85 }, n);
      for (let k = 1; k < 4; k++) { const x = s * (260 + k * 110); T.el("line", { x1: x, y1: -260 - k * 60, x2: x, y2: 80 + k * 55, stroke: P.woodDark, "stroke-width": 6 }, n); }
    }
    T.el("circle", { cx: 0, cy: -200, r: 28, fill: P.lamp }, n);
    return n;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // three nested hall cells → endless corridor; they rotate and slide against each other
    const cells = [0.42, 0.7, 1.0].map(() => hallCell(g, P));
    // a ukiyo-e water swirl ribbon and a flame ribbon that sweep across on accents
    const water = T.el("g", { opacity: 0 }, g);
    for (let i = 0; i < 4; i++) {
      T.el("path", { d: S().wave(-260 + i * 210, 0, 240, 130, 1), fill: i % 2 ? P.water : P.waterLight, stroke: P.ink, "stroke-width": 6 }, water);
      T.el("path", { d: S().spiral(-260 + i * 210 + 200, -70, 34, 1.3, 1), fill: "none", stroke: P.foam, "stroke-width": 7, "stroke-linecap": "round" }, water);
    }
    const flame = T.el("g", { opacity: 0 }, g);
    for (let i = 0; i < 5; i++) {
      T.el("path", { d: S().brush(-300 + i * 150, 60, -220 + i * 150, -220, 50), fill: i % 2 ? P.flame : P.flameLight, stroke: P.ink, "stroke-width": 5 }, flame);
      T.el("path", { d: S().spiral(-210 + i * 150, -230, 26, 1.2, i % 2 ? 1 : -1), fill: "none", stroke: P.flameLight, "stroke-width": 6, "stroke-linecap": "round" }, flame);
    }
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.woodDark }, g);
    for (let x = -60; x < W + 60; x += 120) T.el("line", { x1: x, y1: G, x2: x - 200, y2: G + 700, stroke: P.wood, "stroke-width": 6 }, g);
    return {
      update(t, { beat }) {
        const bar = beat * 4;
        cells.forEach((c, i) => {
          const s = [0.42, 0.7, 1.0][i];
          const rot = Math.sin(t * 0.35 + i * 1.7) * (8 + i * 6) + Math.floor(t / bar) * 90 * (i === 0 ? 1 : 0);
          const shift = Math.sin(t * 0.5 + i) * 60 * (1 - s);
          c.setAttribute("transform", `translate(${W / 2 + shift},${G - 620}) rotate(${rot.toFixed(2)}) scale(${(s * (1 + 0.04 * Math.sin(t + i))).toFixed(3)})`);
        });
        const k = (t % (bar * 2)) / (bar * 2);
        const sweep = (on, x) => `translate(${x},${G - 260}) scale(${on ? 1 : 0.8})`;
        const wOn = k > 0.1 && k < 0.4, fOn = k > 0.6 && k < 0.9;
        water.setAttribute("opacity", wOn ? "0.95" : "0");
        water.setAttribute("transform", sweep(wOn, -300 + ((k - 0.1) / 0.3) * (W + 600)));
        flame.setAttribute("opacity", fOn ? "0.95" : "0");
        flame.setAttribute("transform", sweep(fOn, W + 300 - ((k - 0.6) / 0.3) * (W + 600)));
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["ukiyoe-anime-2020"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
