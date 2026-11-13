/**
 * Style pack: TV Anime Adventure · late 1990s–2000s
 * Genre look of bright TV adventure anime: clean cel colours with one hard shadow,
 * big blue sky with towering clouds, grassy field, impact flashes with speed lines,
 * snappy limited motion with held poses. A genre, not any specific series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    skyTop: "#2f8fe0", skyLow: "#9ad4ff", cloud: "#ffffff", cloudShade: "#c9dcf0", grass: "#62c04a", grassShade: "#3f9a33",
    path: "#e7c98f", ink: "#1e1e2a", white: "#ffffff", flash: "#fff6a8", red: "#ef3b36", yellow: "#ffd23f",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 132, lineWidth: 6 };

  const SANS = "'Arial Black', 'Helvetica Neue', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 70, font: SANS, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 14, maxWidth: 900 };

  const cards = { bg: palette.red, fg: palette.white, accent: palette.yellow, font: SANS, frame: "bar", transition: "iris", transitionColor: palette.ink, upper: true, kickerSpacing: 10 };

  /** Characters: clean dark line, flat colour + one hard cel-shadow. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "cel", outline: palette.ink, shadow: "rgba(30,30,60,0.22)",
    body: palette.red, head: "#ffd8b8", face: "#ffd8b8", eye: palette.ink, glint: palette.white,
    limb: palette.ink, limbWidth: 0.6, glove: palette.white, gloveLine: palette.ink, shoe: palette.ink, shoeShine: palette.white,
    bow: palette.yellow, mouth: palette.ink, nose: "#e8b394",
  };

  function install(svg, { width, height }) {
    const look = T.fx.stack(svg, { width, height, background: palette.skyLow }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.skyTop], [65, palette.skyLow], [100, "#e6f6ff"]] }),
      fx.grain(L, { opacity: 0.06 }),
    ]);
    look.speed = T.fx.speedLines(look, { color: palette.ink, count: 40 });
    const upd = look.update;
    look.update = (t) => { upd(t); look.speed.update(t); };
    return look;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const line = { stroke: P.ink, "stroke-width": 5, "stroke-linejoin": "round" };
    // towering cumulus with a cel-shadow underside
    const clouds = [[230, 760, 1.3], [820, 640, 1]].map(([x, y, s]) => {
      const n = T.el("g", {}, g);
      T.el("path", { ...line, d: S().cloud(-200, 200, 0, 150, 4), fill: P.cloud }, n);
      T.el("path", { d: S().cloud(-180, 180, 0, 50, 4), fill: P.cloudShade }, n);
      return { n, x, y, s };
    });
    T.el("path", { ...line, d: S().ridge(-60, W + 60, G - 200, 90, { seed: 3, peaks: 4, bottom: G }), fill: P.grassShade }, g);
    T.el("rect", { ...line, x: -60, y: G - 20, width: W + 120, height: 700, fill: P.grass }, g);
    T.el("path", { ...line, d: `M${W / 2 - 120},${G + 700} L${W / 2 - 40},${G - 20} L${W / 2 + 40},${G - 20} L${W / 2 + 120},${G + 700} Z`, fill: P.path }, g);
    const tufts = Array.from({ length: 12 }, (_, i) => T.el("path", { d: `M${40 + i * 90},${G + 60 + (i % 3) * 80} l12,-30 l12,30 l12,-22 l12,22`, fill: "none", stroke: P.grassShade, "stroke-width": 5 }, g));
    // impact flash star that pops on accents
    const flash = T.el("path", { d: S().star(0, 0, 260, 10, 0.45), fill: P.flash, stroke: P.ink, "stroke-width": 6, opacity: 0 }, look.overlay);
    return {
      update(t, { beat }) {
        clouds.forEach(({ n, x, y, s }, i) => n.setAttribute("transform", `translate(${x + Math.sin(t * 0.3 + i) * 20},${y}) scale(${s})`));
        tufts.forEach((tf, i) => tf.setAttribute("transform", `translate(${Math.floor(t * 4 + i) % 2 ? 3 : 0},0)`));
        const k = (t % (beat * 8)) / beat;
        const on = k > 6 && k < 6.5;
        flash.setAttribute("opacity", on ? "0.9" : "0");
        flash.setAttribute("transform", `translate(${W / 2},${G - 520}) rotate(${Math.floor(t * 24) * 7})`);
        look.speed.set(on ? 1 : 0, W / 2, G - 520);
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["tv-anime-1999"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
