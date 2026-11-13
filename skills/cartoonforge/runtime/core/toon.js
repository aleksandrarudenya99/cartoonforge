/**
 * toon.js — tiny, dependency-free helpers for code-drawn cartoons.
 *
 * Every function here is PURE: same input → same output. That is the one rule
 * of code-rendered video: the renderer may ask for frame 212 before frame 3,
 * or ask for the same frame twice, and must get the same picture.
 *
 * Loaded as a classic script; exposes `window.Toon`.
 */
(function (global) {
  "use strict";

  // ---------------------------------------------------------------- math
  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  /** 0→1 progress of t inside [a, b] (clamped). */
  const seg = (t, a, b) => clamp((t - a) / (b - a));

  // ------------------------------------------------------------- easing
  const ease = {
    linear: (k) => k,
    inQuad: (k) => k * k,
    outQuad: (k) => 1 - (1 - k) * (1 - k),
    inOutSine: (k) => -(Math.cos(Math.PI * k) - 1) / 2,
    outBack: (k, s = 1.70158) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2),
    /** Overshoot-and-settle: the classic cartoon "boing". */
    outElastic: (k) =>
      k === 0 || k === 1 ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
  };

  /**
   * Keyframe track: track(t, [[time, value, easeName?], ...]).
   * The ease on a key shapes the segment that ARRIVES at that key.
   */
  function track(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t1, v1, e] = keys[i];
      const [t0, v0] = keys[i - 1];
      if (t <= t1) return lerp(v0, v1, (ease[e] || ease.inOutSine)(seg(t, t0, t1)));
    }
    return keys[keys.length - 1][1];
  }

  // ------------------------------------------------------------- timing
  /**
   * Animate "on twos": hold each drawing for 2 frames of 24 fps = 12 drawings/s.
   * This stepped motion is a big part of why hand-drawn cartoons feel hand-drawn.
   */
  const onTwos = (t, drawingsPerSecond = 12) => Math.floor(t * drawingsPerSecond + 1e-6) / drawingsPerSecond;
  /** Integer index of the current drawing — use it to seed per-drawing noise. */
  const drawingIndex = (t, drawingsPerSecond = 12) => Math.floor(t * drawingsPerSecond + 1e-6);

  // ------------------------------------------------------------- noise
  /** Seeded PRNG (mulberry32). Never use Math.random() in a film. */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let r = Math.imul(a ^ (a >>> 15), 1 | a);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  /** Deterministic value in [-1, 1] for (seed, i). */
  const hash = (seed, i) => rng(seed * 9973 + i * 7919)() * 2 - 1;
  /** Smooth 1-D value noise in [-1, 1]. */
  function noise(seed, x) {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    return lerp(hash(seed, i), hash(seed, i + 1), u);
  }

  // ------------------------------------------- principles of animation
  /**
   * Squash & stretch with constant volume.
   * amount > 0 stretches (tall + thin), < 0 squashes (short + wide).
   */
  function squash(amount) {
    const sy = 1 + amount;
    return { sx: 1 / Math.sqrt(sy), sy };
  }

  /**
   * Rubber-hose limb: one smooth curve from shoulder to hand, no elbow.
   * `bend` pushes the curve sideways (px); positive bends to the left of travel.
   */
  function hose(x0, y0, x1, y1, bend = 0) {
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const cx = mx + (-dy / len) * bend;
    const cy = my + (dx / len) * bend;
    return `M${x0.toFixed(1)},${y0.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }

  // ------------------------------------------------------------- svg
  const SVG_NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs = {}, parent) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }
  function set(node, attrs) {
    for (const k in attrs) node.setAttribute(k, attrs[k]);
  }

  // ------------------------------------------------------------- captions
  /**
   * Burned-in captions with words popping in as they are spoken.
   * cues: [{start, end, text}] (written by scripts/audio.mjs into cf-data.js)
   * opts: {x, y, size, font, fill, stroke, strokeWidth, maxWidth, weight, style, pop}
   * Returns update(t). Word timing inside a cue is proportional to word length.
   */
  function captions(parent, cues, opts = {}) {
    const o = Object.assign(
      { x: 540, y: 380, size: 72, font: "sans-serif", fill: "#fff", stroke: "#000", strokeWidth: 12,
        maxWidth: 920, weight: "bold", style: "normal", pop: 0.12, lineHeight: 1.15 },
      opts,
    );
    const g = el("g", { "text-anchor": "middle" }, parent);
    // measure real word widths with the actual font (same machine + font → same layout every frame)
    const probe = el("text", { "font-family": o.font, "font-size": o.size, "font-weight": o.weight, "font-style": o.style, opacity: 0 }, g);
    const widthOf = (s) => { probe.textContent = s; return probe.getComputedTextLength(); };
    const space = (widthOf("a a") - widthOf("aa") || o.size * 0.28) + o.size * 0.1;
    const built = cues.map((cue) => {
      const words = cue.text.split(/\s+/).filter(Boolean);
      const total = words.reduce((s, w) => s + w.length + 1, 0);
      let acc = 0;
      const timed = words.map((w) => {
        const at = cue.start + ((cue.end - cue.start) * 0.9 * acc) / total;
        acc += w.length + 1;
        return { w, at, width: widthOf(w) };
      });
      // greedy wrap
      const lines = [[]];
      let width = 0;
      for (const tw of timed) {
        const add = (lines[lines.length - 1].length ? space : 0) + tw.width;
        if (width + add > o.maxWidth && lines[lines.length - 1].length) { lines.push([]); width = 0; }
        width += lines[lines.length - 1].length ? space + tw.width : tw.width;
        lines[lines.length - 1].push(tw);
      }
      const group = el("g", { opacity: 0 }, g);
      const nodes = [];
      lines.forEach((ln, li) => {
        const lineW = ln.reduce((s, tw) => s + tw.width, 0) + space * (ln.length - 1);
        let cx = o.x - lineW / 2;
        const y = o.y + li * o.size * o.lineHeight;
        for (const tw of ln) {
          const attrs = { x: (cx + tw.width / 2).toFixed(1), y: y.toFixed(1), "font-family": o.font, "font-size": o.size,
            "font-weight": o.weight, "font-style": o.style, fill: o.fill, stroke: o.stroke,
            "stroke-width": o.strokeWidth, "paint-order": "stroke", "stroke-linejoin": "round" };
          const n = el("text", attrs, group);
          n.textContent = tw.w;
          nodes.push({ n, at: tw.at, x: cx + tw.width / 2, y });
          cx += tw.width + space;
        }
      });
      return { cue, group, nodes };
    });
    probe.remove();

    return function update(t) {
      for (const { cue, group, nodes } of built) {
        const on = t >= cue.start && t < cue.end + 0.25;
        group.setAttribute("opacity", on ? "1" : "0");
        if (!on) continue;
        for (const { n, at, x, y } of nodes) {
          const k = clamp((t - at) / o.pop);
          const s = k <= 0 ? 0 : ease.outBack(k, 2.2);
          n.setAttribute("opacity", k > 0 ? "1" : "0");
          n.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(3)}) translate(${(-x).toFixed(1)},${(-y).toFixed(1)})`);
        }
      }
    };
  }

  // ------------------------------------------------------------- film
  /**
   * Register a film with HyperFrames. `render(t)` is a pure function of time
   * that updates the DOM. GSAP is used only as the seekable clock.
   * Seek from your own tools with `tl.seek(t, false)`: GSAP's default seek suppresses
   * callbacks, and render(t) runs from onUpdate.
   */
  function film({ id = "main", duration, render }) {
    const clock = { t: 0 };
    const tl = gsap.timeline({ paused: true });
    tl.to(clock, {
      t: duration,
      duration,
      ease: "none",
      onUpdate: () => render(clock.t),
    });
    global.__timelines = global.__timelines || {};
    global.__timelines[id] = tl;
    render(0);
    tl.seek(0);
    return tl;
  }

  global.Toon = {
    clamp, lerp, seg, ease, track,
    onTwos, drawingIndex,
    rng, hash, noise,
    squash, hose,
    el, set, captions, film,
  };
})(window);
