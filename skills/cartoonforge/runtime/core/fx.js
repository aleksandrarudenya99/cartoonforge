/**
 * fx.js — shared film textures and the standard layer stack every style uses.
 *
 * A style pack should NOT re-implement grain, boil, vignettes…: it picks effects
 * from here and tunes them. Every effect is deterministic: update(t) only.
 *
 *   const look = Toon.fx.stack(svg, { width, height, background: "#ebe4d2" }, (fx, L) => [
 *     fx.boil(L, { scale: 5 }),          // wobbling outlines on the scene
 *     fx.grain(L, { opacity: 0.3 }),
 *     fx.vignette(L, { strength: 0.5 }),
 *   ]);
 *   // look = { scene, overlay, back, update(t), defs, width, height }
 *
 * Layer order (bottom → top):
 *   weave (moves with gate weave)
 *     back      background colour / gradient / paper
 *     scene     what films draw (style filters like boil apply here)
 *     overlay   title cards, iris, captions — not affected by scene filters
 *   fxTop       grain, dirt, vignette, flicker — fixed to the frame
 */
(function (global) {
  "use strict";
  const T = global.Toon;
  let uid = 0;
  const id = (name) => `cf-${name}-${++uid}`;

  function stack(svg, { width, height, background = "#fff" }, pick) {
    const { el } = T;
    const defs = el("defs", {}, svg);
    const weave = el("g", {}, svg);
    const back = el("g", {}, weave);
    if (background) el("rect", { x: -60, y: -60, width: width + 120, height: height + 120, fill: background }, back);
    const scene = el("g", {}, weave);
    const overlay = el("g", {}, weave);
    const fxTop = el("g", { "pointer-events": "none" }, svg);
    const L = { svg, defs, weave, back, scene, overlay, fxTop, width, height };
    const effects = (pick ? pick(fx, L) : []).filter(Boolean);
    const look = {
      ...L,
      update(t) {
        for (const e of effects) e.update && e.update(t);
      },
    };
    look.update(0);
    return look;
  }

  const fx = {
    /** Outline wobble that changes with every drawing ("boil"). Applied to the scene layer. */
    boil(L, { freq = 0.018, scale = 5, octaves = 2, loop = 4, dps = 12, target } = {}) {
      const fid = id("boil");
      const f = T.el("filter", { id: fid, x: "-5%", y: "-5%", width: "110%", height: "110%" }, L.defs);
      const n = T.el("feTurbulence", { type: "fractalNoise", baseFrequency: String(freq), numOctaves: String(octaves), seed: "1", result: "n" }, f);
      T.el("feDisplacementMap", { in: "SourceGraphic", in2: "n", scale: String(scale), xChannelSelector: "R", yChannelSelector: "G" }, f);
      (target || L.scene).setAttribute("filter", `url(#${fid})`);
      return { id: fid, update: (t) => n.setAttribute("seed", String(1 + (T.drawingIndex(t, dps) % loop))) };
    },

    /** Film / paper grain, new every frame. */
    grain(L, { opacity = 0.3, freq = 0.85, fps = 24, blend = "multiply", light = false } = {}) {
      const fid = id("grain");
      const f = T.el("filter", { id: fid, x: "0", y: "0", width: "100%", height: "100%" }, L.defs);
      const n = T.el("feTurbulence", { type: "fractalNoise", baseFrequency: String(freq), numOctaves: "1", seed: "1", result: "g" }, f);
      const m = light ? "0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.55" : "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.15";
      T.el("feColorMatrix", { in: "g", type: "matrix", values: m }, f);
      T.el("rect", { x: 0, y: 0, width: L.width, height: L.height, filter: `url(#${fid})`, opacity: String(opacity), style: `mix-blend-mode:${blend}` }, L.fxTop);
      return { update: (t) => n.setAttribute("seed", String(1 + (Math.floor(t * fps + 1e-6) % 97))) };
    },

    /** Static paper texture under the scene (fibres + slight lighting). */
    paper(L, { color = "#efe7d6", opacity = 0.5, freq = 0.04 } = {}) {
      const fid = id("paper");
      const f = T.el("filter", { id: fid, x: "0", y: "0", width: "100%", height: "100%" }, L.defs);
      T.el("feTurbulence", { type: "fractalNoise", baseFrequency: String(freq), numOctaves: "4", seed: "7", result: "n" }, f);
      const light = T.el("feDiffuseLighting", { in: "n", "lighting-color": color, surfaceScale: "2", result: "l" }, f);
      T.el("feDistantLight", { azimuth: "45", elevation: "60" }, light);
      T.el("rect", { x: -60, y: -60, width: L.width + 120, height: L.height + 120, filter: `url(#${fid})`, opacity: String(opacity), style: "mix-blend-mode:multiply" }, L.back);
      return null;
    },

    /** Darker (or coloured) edges. */
    vignette(L, { color = "#000", strength = 0.5, inner = 55, cy = 48 } = {}) {
      const gid = id("vig");
      const gr = T.el("radialGradient", { id: gid, cx: "50%", cy: `${cy}%`, r: "70%" }, L.defs);
      T.el("stop", { offset: `${inner}%`, "stop-color": color, "stop-opacity": "0" }, gr);
      T.el("stop", { offset: "100%", "stop-color": color, "stop-opacity": String(strength) }, gr);
      T.el("rect", { x: 0, y: 0, width: L.width, height: L.height, fill: `url(#${gid})` }, L.fxTop);
      return null;
    },

    /** Projector lamp flicker. */
    flicker(L, { color = "#fff", amount = 0.07, fps = 24, seed = 5 } = {}) {
      const r = T.el("rect", { x: 0, y: 0, width: L.width, height: L.height, fill: color, opacity: "0" }, L.fxTop);
      return { update: (t) => r.setAttribute("opacity", (Math.abs(T.hash(seed, Math.floor(t * fps + 1e-6))) * amount).toFixed(3)) };
    },

    /** The whole frame drifting a few px, like film in a projector gate. */
    weave(L, { x = 3, y = 4 } = {}) {
      return { update: (t) => L.weave.setAttribute("transform", `translate(${(T.noise(11, t * 1.3) * x).toFixed(2)},${(T.noise(23, t * 0.9) * y).toFixed(2)})`) };
    },

    /** Dust specks and vertical scratches, re-seeded every frame. */
    dirt(L, { specks = 5, scratch = 0.35, colors = ["#141210", "#f7f3e8"], fps = 24 } = {}) {
      const g = T.el("g", {}, L.fxTop);
      return {
        update(t) {
          const frame = Math.floor(t * fps + 1e-6);
          while (g.firstChild) g.removeChild(g.firstChild);
          const r = T.rng(1000 + frame);
          const n = Math.floor(r() * specks);
          for (let i = 0; i < n; i++) {
            T.el("ellipse", { cx: (r() * L.width).toFixed(0), cy: (r() * L.height).toFixed(0), rx: (1 + r() * 5).toFixed(1), ry: (1 + r() * 3).toFixed(1),
              fill: r() < 0.7 ? colors[0] : colors[1], opacity: (0.4 + r() * 0.5).toFixed(2) }, g);
          }
          if (r() < scratch) {
            const x = r() * L.width;
            T.el("line", { x1: x, y1: 0, x2: x + (r() - 0.5) * 30, y2: L.height, stroke: colors[0], "stroke-width": (0.8 + r() * 1.6).toFixed(1), opacity: "0.35" }, g);
          }
        },
      };
    },

    /** Ink that bleeds into the paper: soft, feathered, uneven edges (ink-wash). Applied to `target`. */
    inkBleed(L, { target, blur = 2.2, spread = 9, freq = 0.035, loop = 3, dps = 12 } = {}) {
      const fid = id("ink");
      const f = T.el("filter", { id: fid, x: "-10%", y: "-10%", width: "120%", height: "120%" }, L.defs);
      const n = T.el("feTurbulence", { type: "fractalNoise", baseFrequency: String(freq), numOctaves: "3", seed: "2", result: "n" }, f);
      T.el("feDisplacementMap", { in: "SourceGraphic", in2: "n", scale: String(spread), xChannelSelector: "R", yChannelSelector: "G", result: "d" }, f);
      T.el("feGaussianBlur", { in: "d", stdDeviation: String(blur), result: "b" }, f);
      T.el("feComposite", { in: "d", in2: "b", operator: "arithmetic", k1: "0", k2: "0.55", k3: "0.6", k4: "0" }, f);
      (target || L.scene).setAttribute("filter", `url(#${fid})`);
      return { id: fid, update: (t) => n.setAttribute("seed", String(2 + (T.drawingIndex(t, dps) % loop))) };
    },

    /** Lace / cut-paper edge: tiny high-frequency displacement, no blur (silhouette). */
    cutEdge(L, { target, scale = 2.5, freq = 0.25 } = {}) {
      const fid = id("cut");
      const f = T.el("filter", { id: fid, x: "-2%", y: "-2%", width: "104%", height: "104%" }, L.defs);
      T.el("feTurbulence", { type: "turbulence", baseFrequency: String(freq), numOctaves: "1", seed: "3", result: "n" }, f);
      T.el("feDisplacementMap", { in: "SourceGraphic", in2: "n", scale: String(scale), xChannelSelector: "R", yChannelSelector: "G" }, f);
      (target || L.scene).setAttribute("filter", `url(#${fid})`);
      return null;
    },

    /** A dot pattern you can use as a fill: `fill="url(#id)"` (comic / print). */
    halftone(L, { color = "#000", size = 14, dot = 4, angle = 20 } = {}) {
      const pid = id("dots");
      const p = T.el("pattern", { id: pid, width: size, height: size, patternUnits: "userSpaceOnUse", patternTransform: `rotate(${angle})` }, L.defs);
      T.el("circle", { cx: size / 2, cy: size / 2, r: dot, fill: color }, p);
      return { id: pid, update: null };
    },

    /** Print misregistration: a tinted copy of the scene shifted by (dx, dy) under the original. */
    misregister(L, { target, dx = 6, dy = -4, color = "#2ab7ca", opacity = 0.55 } = {}) {
      const fid = id("misreg");
      const f = T.el("filter", { id: fid, x: "-3%", y: "-3%", width: "106%", height: "106%" }, L.defs);
      T.el("feFlood", { "flood-color": color, "flood-opacity": String(opacity), result: "c" }, f);
      T.el("feComposite", { in: "c", in2: "SourceAlpha", operator: "in", result: "tint" }, f);
      T.el("feOffset", { in: "tint", dx: String(dx), dy: String(dy), result: "shift" }, f);
      const m = T.el("feMerge", {}, f);
      T.el("feMergeNode", { in: "shift" }, m);
      T.el("feMergeNode", { in: "SourceGraphic" }, m);
      (target || L.scene).setAttribute("filter", `url(#${fid})`);
      return null;
    },

    /** Soft glow on bright parts (80s cel / neon). */
    bloom(L, { target, blur = 10, strength = 0.55 } = {}) {
      const fid = id("bloom");
      const f = T.el("filter", { id: fid, x: "-5%", y: "-5%", width: "110%", height: "110%" }, L.defs);
      T.el("feGaussianBlur", { in: "SourceGraphic", stdDeviation: String(blur), result: "b" }, f);
      T.el("feComposite", { in: "SourceGraphic", in2: "b", operator: "arithmetic", k1: "0", k2: "1", k3: String(strength), k4: "0" }, f);
      (target || L.scene).setAttribute("filter", `url(#${fid})`);
      return null;
    },

    /** Paper layers casting a small shadow on each other (cut-out). */
    paperShadow(L, { target, dx = 5, dy = 7, blur = 3, opacity = 0.35 } = {}) {
      const fid = id("pshadow");
      const f = T.el("filter", { id: fid, x: "-5%", y: "-5%", width: "112%", height: "112%" }, L.defs);
      T.el("feDropShadow", { dx: String(dx), dy: String(dy), stdDeviation: String(blur), "flood-color": "#000", "flood-opacity": String(opacity) }, f);
      if (target !== false) (target || L.scene).setAttribute("filter", `url(#${fid})`);
      return { id: fid, update: null };
    },

    /** Diagonal hatching pattern for shadows: fill="url(#id)" (manga / action anime). */
    hatch(L, { color = "#000", gap = 9, width = 2.2, angle = 35 } = {}) {
      const pid = id("hatch");
      const p = T.el("pattern", { id: pid, width: gap, height: gap, patternUnits: "userSpaceOnUse", patternTransform: `rotate(${angle})` }, L.defs);
      T.el("line", { x1: 0, y1: 0, x2: 0, y2: gap, stroke: color, "stroke-width": width }, p);
      return { id: pid, update: null };
    },

    /** Big chunky pixels: pixelates the target (16-bit games). size = pixel size in px. */
    pixelate(L, { target, size = 8 } = {}) {
      const fid = id("pix");
      const f = T.el("filter", { id: fid, x: "0", y: "0", width: "100%", height: "100%" }, L.defs);
      const h = size / 2;
      T.el("feFlood", { x: String(h), y: String(h), width: "1", height: "1" }, f);
      T.el("feComposite", { width: String(size), height: String(size) }, f);
      T.el("feTile", { result: "grid" }, f);
      T.el("feComposite", { in: "SourceGraphic", in2: "grid", operator: "in" }, f);
      T.el("feMorphology", { operator: "dilate", radius: String(h) }, f);
      (target || L.scene).setAttribute("filter", `url(#${fid})`);
      (target || L.scene).setAttribute("shape-rendering", "crispEdges");
      return null;
    },

    /** CRT / broadcast scanlines. */
    scanlines(L, { gap = 4, opacity = 0.12, color = "#000" } = {}) {
      const pid = id("scan");
      const p = T.el("pattern", { id: pid, width: 4, height: gap, patternUnits: "userSpaceOnUse" }, L.defs);
      T.el("rect", { x: 0, y: 0, width: 4, height: gap / 2, fill: color }, p);
      T.el("rect", { x: 0, y: 0, width: L.width, height: L.height, fill: `url(#${pid})`, opacity: String(opacity) }, L.fxTop);
      return null;
    },

    /** Radial speed lines around (cx, cy). Returns { update(t), set(amount 0..1, cx, cy) }. */
    speedLines(L, { color = "#000", count = 46, inner = 360, seed = 9, parent } = {}) {
      const g = T.el("g", { opacity: 0 }, parent || L.overlay);
      const r = T.rng(seed);
      const lines = Array.from({ length: count }, () => ({ a: r() * Math.PI * 2, w: 2 + r() * 10, n: T.el("path", { fill: color }, g) }));
      let amt = 0, cx = L.width / 2, cy = L.height / 2;
      return {
        set(a, x = cx, y = cy) { amt = a; cx = x; cy = y; },
        update(t) {
          g.setAttribute("opacity", amt.toFixed(2));
          if (amt <= 0) return;
          const frame = Math.floor(t * 12);
          lines.forEach(({ a, w, n }, i) => {
            const j = T.hash(seed + i, frame) * 0.04;
            const r0 = inner * (0.8 + Math.abs(T.hash(seed * 3 + i, frame)) * 0.5), r1 = 1600;
            const p0x = cx + Math.cos(a + j) * r0, p0y = cy + Math.sin(a + j) * r0;
            const ax = cx + Math.cos(a + j + w / 900) * r1, ay = cy + Math.sin(a + j + w / 900) * r1;
            const bx = cx + Math.cos(a + j - w / 900) * r1, by = cy + Math.sin(a + j - w / 900) * r1;
            n.setAttribute("d", `M${p0x.toFixed(0)},${p0y.toFixed(0)} L${ax.toFixed(0)},${ay.toFixed(0)} L${bx.toFixed(0)},${by.toFixed(0)} Z`);
          });
        },
      };
    },

    /** Background gradient (sky, stage light). stops: [[offset%, colour], …] */
    gradient(L, { stops, vertical = true, radial = false } = {}) {
      const gid = id("bg");
      const gr = radial
        ? T.el("radialGradient", { id: gid, cx: "50%", cy: "55%", r: "75%" }, L.defs)
        : T.el("linearGradient", { id: gid, x1: "0", y1: "0", x2: vertical ? "0" : "1", y2: vertical ? "1" : "0" }, L.defs);
      for (const [o, c] of stops) T.el("stop", { offset: `${o}%`, "stop-color": c }, gr);
      T.el("rect", { x: -60, y: -60, width: L.width + 120, height: L.height + 120, fill: `url(#${gid})` }, L.back);
      return null;
    },
  };

  T.fx = Object.assign(fx, { stack });
})(window);
