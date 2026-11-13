/**
 * Style pack: Urban Occult Anime · 2020s
 * Genre look of modern supernatural action anime: a night city, deep black shadows,
 * violet / electric-blue auras with crackling outlines, glitch distortion on impacts,
 * fast camera. A genre, not any specific series: no existing characters, symbols or names.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    night: "#0d0b16", sky: "#1c1834", city: "#141224", window: "#7fd6ff", aura: "#8b5cf6", auraHot: "#38bdf8",
    ink: "#05040a", bone: "#eceaf5", neon: "#ff3d7f", street: "#1a1828",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 124, lineWidth: 9 };

  const BOLD = "'Oswald', 'Impact', 'Arial Narrow', 'DejaVu Sans Condensed', sans-serif";
  const caption = { y: 360, size: 80, font: BOLD, weight: "bold", style: "normal", fill: palette.bone, stroke: palette.ink, strokeWidth: 14, maxWidth: 900 };

  const cards = { bg: palette.night, fg: palette.bone, accent: palette.aura, font: BOLD, frame: "bar", transition: "fade", transitionColor: palette.ink, upper: true, kickerSpacing: 26 };

  /** Characters: heavy black line, flat fills, big black shadow shapes (shading: "black"). */
  const skin = {
    ink: palette.ink, white: palette.bone, lineWidth: motion.lineWidth, shading: "black", outline: palette.ink, aura: palette.aura,
    body: "#1f2433", head: "#e8d2c2", face: "#e8d2c2", eye: palette.ink, glint: palette.bone,
    limb: palette.ink, limbWidth: 0.9, glove: palette.bone, gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: palette.aura, mouth: palette.ink, nose: "#c9a896",
  };

  function install(svg, { width, height }) {
    const look = T.fx.stack(svg, { width, height, background: palette.night }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.night], [60, palette.sky], [100, "#2b2150"]] }),
      fx.bloom(L, { blur: 10, strength: 0.6 }),
      fx.grain(L, { opacity: 0.18, light: true, blend: "screen" }),
      fx.vignette(L, { color: palette.ink, strength: 0.75, inner: 42 }),
    ]);
    // glitch: horizontal slice offsets on beats (deterministic)
    const glitch = T.el("g", { opacity: 0 }, look.fxTop);
    const slices = Array.from({ length: 6 }, () => T.el("rect", { x: 0, width, fill: palette.aura, opacity: 0.25 }, glitch));
    look.speed = T.fx.speedLines(look, { color: palette.auraHot, count: 40 });
    const upd = look.update;
    look.glitch = 0;
    look.update = (t) => {
      upd(t);
      look.speed.update(t);
      glitch.setAttribute("opacity", String(look.glitch));
      const f = Math.floor(t * 24);
      slices.forEach((s, i) => { const r = T.rng(f * 9 + i); s.setAttribute("y", (r() * height).toFixed(0)); s.setAttribute("height", (4 + r() * 30).toFixed(0)); s.setAttribute("x", ((r() - 0.5) * 60).toFixed(0)); });
    };
    return look;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // moon
    T.el("circle", { cx: 260, cy: 560, r: 110, fill: "#e9e4ff", opacity: 0.9 }, g);
    // skyline layers with lit windows
    [[0.5, 21, 260, 500], [1, 33, 380, 760]].forEach(([o, seed, minH, maxH]) => {
      const r = T.rng(seed), grp = T.el("g", { opacity: o }, g);
      for (let x = -40; x < W + 40;) {
        const w = 80 + r() * 130, h = minH + r() * (maxH - minH);
        T.el("rect", { x, y: G - h, width: w, height: h, fill: P.city, stroke: P.ink, "stroke-width": 5 }, grp);
        for (let wy = G - h + 26; wy < G - 30; wy += 48) for (let wx = x + 14; wx < x + w - 16; wx += 32) if (r() < 0.3) T.el("rect", { x: wx, y: wy, width: 14, height: 22, fill: P.window, opacity: 0.8 }, grp);
        x += w + 6;
      }
    });
    // street + neon sign
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.street }, g);
    const neon = T.el("rect", { x: 740, y: G - 520, width: 200, height: 70, rx: 12, fill: "none", stroke: P.neon, "stroke-width": 8 }, g);
    // a crackling aura ring that flares on the bar
    const aura = T.el("path", { fill: "none", stroke: P.aura, "stroke-width": 10, "stroke-linejoin": "round" }, g);
    const auraHot = T.el("path", { fill: "none", stroke: P.auraHot, "stroke-width": 4 }, g);
    return {
      update(t, { beat }) {
        const f = Math.floor(t * 12);
        neon.setAttribute("opacity", T.hash(77, f) > -0.7 ? "1" : "0.25");
        const k = (t % (beat * 4)) / (beat * 4);
        const amp = k < 0.25 ? 1 - k * 4 : 0;
        let d = "";
        for (let i = 0; i <= 40; i++) {
          const a = (i / 40) * Math.PI * 2, rr = 520 + amp * 80 + T.hash(f * 31 + i, 1) * 40 * (0.3 + amp);
          d += `${i ? "L" : "M"}${(W / 2 + Math.cos(a) * rr * 0.7).toFixed(1)},${(G - 380 + Math.sin(a) * rr).toFixed(1)} `;
        }
        aura.setAttribute("d", d + "Z");
        auraHot.setAttribute("d", d + "Z");
        aura.setAttribute("opacity", (0.25 + amp * 0.7).toFixed(2));
        auraHot.setAttribute("opacity", (amp * 0.9).toFixed(2));
        look.glitch = amp > 0.6 ? 1 : 0;
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["urban-occult-2020"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
