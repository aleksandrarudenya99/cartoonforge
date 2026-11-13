/**
 * Style pack: Magical Sparkle Anime · 1990s
 * Genre look of 90s magical-girl TV anime: pastel pinks and lilacs, glittering stars and
 * sparkles, flowing ribbons, a shimmering "transformation" background of soft colour
 * bands and bubbles, starry night city. A genre, not any specific series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    night: "#2a1f5c", lilac: "#b79cf0", pink: "#ff9ccf", rose: "#ff5fa2", mint: "#9ff0e0", gold: "#ffe08a",
    white: "#ffffff", ink: "#3a2350", city: "#3b2f75", window: "#ffe9a8",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 120, lineWidth: 5 };

  const SCRIPT = "'Brush Script MT', 'Comic Sans MS', 'DejaVu Sans', cursive";
  const caption = { y: 370, size: 70, font: "Georgia, 'DejaVu Serif', serif", weight: "bold", style: "italic", fill: palette.white, stroke: palette.rose, strokeWidth: 12, maxWidth: 900 };

  const cards = { bg: palette.pink, fg: palette.white, accent: palette.gold, font: "Georgia, 'DejaVu Serif', serif", frame: "double", transition: "fade", transitionColor: palette.white, endFg: palette.rose, upper: false, titleStyle: "italic" };

  /** Characters: thin plum line, pastel fills, sparkle highlights in the eyes. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "cel", outline: palette.ink, shadow: "rgba(183,156,240,0.35)",
    body: palette.white, head: "#ffe3d3", face: "#ffe3d3", eye: palette.ink, glint: palette.white,
    limb: palette.ink, limbWidth: 0.5, glove: palette.white, gloveLine: palette.ink, shoe: palette.rose, shoeShine: palette.white,
    bow: palette.rose, mouth: palette.ink, nose: "#f3bfae",
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.night }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.night], [45, "#5a3fa0"], [75, palette.lilac], [100, palette.pink]] }),
      fx.bloom(L, { blur: 10, strength: 0.55 }),
      fx.grain(L, { opacity: 0.08, light: true, blend: "screen" }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // shimmering transformation bands
    const bands = [P.pink, P.mint, P.gold, P.lilac].map((c, i) => T.el("path", { fill: c, opacity: 0.22 }, g));
    // crescent moon
    T.el("path", { d: "M0,-120 A120,120 0 1,0 0,120 A90,90 0 1,1 0,-120 Z", fill: P.gold, transform: `translate(${W - 230},520)` }, g);
    // city silhouette with warm windows
    const r = T.rng(42), city = T.el("g", {}, g);
    for (let x = -40; x < W + 40;) {
      const w = 90 + r() * 110, h = 200 + r() * 420;
      T.el("rect", { x, y: G - h, width: w, height: h, fill: P.city }, city);
      for (let wy = G - h + 24; wy < G - 30; wy += 46) for (let wx = x + 12; wx < x + w - 16; wx += 30) if (r() < 0.35) T.el("rect", { x: wx, y: wy, width: 12, height: 20, fill: P.window }, city);
      x += w + 6;
    }
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: "#24194d" }, g);
    // ribbons and sparkles
    const ribbon = T.el("path", { fill: "none", stroke: P.rose, "stroke-width": 14, "stroke-linecap": "round", opacity: 0.85 }, g);
    const sparkles = Array.from({ length: 40 }, () => T.el("path", { fill: P.white }, g));
    const bubbles = Array.from({ length: 12 }, () => T.el("circle", { fill: "none", stroke: P.white, "stroke-width": 3, opacity: 0.6 }, g));
    return {
      update(t) {
        bands.forEach((b, i) => {
          const y = 300 + i * 220 + Math.sin(t * 0.8 + i) * 60;
          b.setAttribute("d", `M-60,${y} Q${W / 2},${y - 160 + Math.sin(t + i) * 80} ${W + 60},${y} L${W + 60},${y + 110} Q${W / 2},${y - 50} -60,${y + 110} Z`);
        });
        let d = "";
        for (let i = 0; i <= 30; i++) { const x = -60 + (i * (W + 120)) / 30; d += `${i ? "L" : "M"}${x.toFixed(0)},${(700 + Math.sin(i * 0.5 + t * 2.4) * 90).toFixed(1)} `; }
        ribbon.setAttribute("d", d);
        sparkles.forEach((s, i) => {
          const r = T.rng(i * 17 + 4);
          const tw = Math.abs(Math.sin(t * (2 + r() * 3) + i));
          s.setAttribute("d", S().star(r() * W, 120 + r() * (G - 400), 4 + tw * 14, 4, 0.18));
          s.setAttribute("opacity", tw.toFixed(2));
        });
        bubbles.forEach((b, i) => {
          const r = T.rng(i * 23 + 9), k = (t * 0.15 + r()) % 1;
          b.setAttribute("cx", (r() * W + Math.sin(t + i) * 30).toFixed(0));
          b.setAttribute("cy", (G - k * 1200).toFixed(0));
          b.setAttribute("r", (10 + r() * 30).toFixed(0));
        });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["magical-sparkle-1992"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
