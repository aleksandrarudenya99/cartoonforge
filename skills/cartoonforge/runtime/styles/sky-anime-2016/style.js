/**
 * Style pack: Hyperreal Sky Anime · 2010s
 * Genre look of modern romantic anime features: hyper-detailed, photographic skies at
 * golden hour and twilight, lens flares and light streaks, a comet trail, glittering city
 * below, soft clean character line. A genre, not any specific film.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    zenith: "#1b2a6b", twilight: "#5a4fb0", magenta: "#d77ab5", horizon: "#ffb36b", gold: "#ffe2a1",
    cloud: "#ffd9c4", cloudShade: "#8f6fb0", city: "#2a2f55", lights: "#ffe9a8", ink: "#2b2340", white: "#ffffff", comet: "#bfe8ff",
  };
  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 84, lineWidth: 4 };
  const SANS = "'Avenir Next', 'Helvetica Neue', 'DejaVu Sans', sans-serif";
  const caption = { y: 360, size: 64, font: SANS, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 10, maxWidth: 880 };
  const cards = { bg: palette.zenith, fg: palette.white, accent: palette.horizon, font: SANS, frame: "none", transition: "fade", transitionColor: palette.white, endFg: palette.ink, upper: false };

  /** Characters: soft clean line, gentle two-tone shading, warm rim light from the sunset. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "cel", outline: palette.ink, shadow: "rgba(90,79,176,0.3)", rim: palette.gold,
    body: "#3a4f8c", head: "#f6d9c6", face: "#f6d9c6", eye: palette.ink, glint: palette.white,
    limb: palette.ink, limbWidth: 0.5, glove: "#f6d9c6", gloveLine: palette.ink, shoe: palette.ink, shoeShine: palette.white,
    bow: "#e0475b", mouth: palette.ink, nose: "#e3b8a3",
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.horizon }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.zenith], [35, palette.twilight], [60, palette.magenta], [82, palette.horizon], [100, palette.gold]] }),
      fx.bloom(L, { blur: 14, strength: 0.6 }),
      fx.grain(L, { opacity: 0.06, light: true, blend: "screen" }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene, H2 = 900;
    const stars = Array.from({ length: 50 }, (_, i) => { const r = T.rng(i + 77); return T.el("circle", { cx: r() * W, cy: 60 + r() * 500, r: 1 + r() * 2.5, fill: P.white }, g); });
    const comet = T.el("g", {}, g);
    T.el("path", { d: S().brush(0, 0, -520, -380, 16), fill: P.comet, opacity: 0.55 }, comet);
    T.el("path", { d: S().brush(0, 0, -380, -330, 8), fill: P.white, opacity: 0.7 }, comet);
    T.el("circle", { r: 12, fill: P.white }, comet);
    // layered sunset clouds with lit edges
    const clouds = [[820, 0.9], [640, 1.3], [980, 1.1]].map(([y, s], i) => {
      const n = T.el("g", {}, g);
      T.el("path", { d: S().cloud(-300, 300, 0, 70, 6), fill: P.cloudShade, opacity: 0.85 }, n);
      T.el("path", { d: S().cloud(-290, 290, -8, 60, 6), fill: P.cloud, opacity: 0.9 }, n);
      return { n, y, s, i };
    });
    // city with glittering lights
    const r = T.rng(91), lights = [];
    for (let x = -40; x < W + 40;) {
      const w = 60 + r() * 100, h = 140 + r() * 360;
      T.el("rect", { x, y: G - h, width: w, height: h, fill: P.city }, g);
      for (let wy = G - h + 16; wy < G - 16; wy += 30) for (let wx = x + 8; wx < x + w - 10; wx += 20) if (r() < 0.3) lights.push(T.el("rect", { x: wx, y: wy, width: 8, height: 12, fill: P.lights }, g));
      x += w + 3;
    }
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: "#1d2140" }, g);
    const flare = T.el("g", {}, look.overlay);
    [[0, 60, 0.35], [0.3, 30, 0.25], [0.6, 80, 0.12], [0.85, 20, 0.3]].forEach(([k, rr, o]) => T.el("circle", { r: rr, fill: P.gold, opacity: o, "data-k": k }, flare));
    return {
      update(t) {
        comet.setAttribute("transform", `translate(${700 + t * 18},${360 + t * 10})`);
        stars.forEach((s, i) => s.setAttribute("opacity", (0.3 + 0.7 * Math.abs(T.noise(i, t * 1.2))).toFixed(2)));
        clouds.forEach(({ n, y, s, i }) => n.setAttribute("transform", `translate(${W / 2 + Math.sin(t * 0.1 + i) * 80 + (i - 1) * 260},${y}) scale(${s})`));
        lights.forEach((l, i) => { if (i % 7 === 0) l.setAttribute("opacity", T.hash(i, Math.floor(t * 3)) > 0 ? "1" : "0.4"); });
        // lens flare along a line from the sun (bottom-right) through the centre
        const sx = W - 160, sy = G - 120 + Math.sin(t * 0.3) * 20;
        [...flare.children].forEach((c) => { const k = +c.getAttribute("data-k"); c.setAttribute("cx", String(sx + (W / 2 - sx) * k * 2)); c.setAttribute("cy", String(sy + (H2 - sy) * k * 2)); });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["sky-anime-2016"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
