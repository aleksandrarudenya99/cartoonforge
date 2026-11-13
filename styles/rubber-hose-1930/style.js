/**
 * Style pack: Rubber Hose · 1930
 *
 * What makes the look (each item is one block below):
 *   1. Palette     — warm paper, black ink, one mid grey. No colour.
 *   2. Line boil   — outlines wobble a little on every new drawing (feTurbulence
 *                    + feDisplacementMap, seed changes on twos).
 *   3. Film grain  — fresh noise every frame (24 fps).
 *   4. Dirt        — dust specks and vertical scratches, seeded per frame.
 *   5. Flicker     — projector lamp brightness jitter.
 *   6. Gate weave  — the whole frame drifts a few px, like film in a gate.
 *   7. Vignette    — darker corners from an old lens.
 *
 * Usage:
 *   const look = Toon.styles["rubber-hose-1930"].install(svg, { width, height });
 *   // draw your scene into look.scene
 *   // call look.update(t) from your film's render(t)
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  const palette = {
    paper: "#ebe4d2",
    paperShade: "#d6cdb6",
    ink: "#141210",
    grey: "#8d877a",
    white: "#f7f3e8",
  };

  const motion = {
    drawingsPerSecond: 12, // animate on twos
    filmFps: 24,
    bpm: 120, // 1930s cartoons bounce everything to the music
    lineWidth: 10,
  };

  function install(svg, { width, height, intensity = 1 }) {
    const { el } = T;
    const defs = el("defs", {}, svg);

    // 2. line boil
    const boil = el("filter", { id: "rh-boil", x: "-5%", y: "-5%", width: "110%", height: "110%" }, defs);
    const boilNoise = el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.018", numOctaves: "2", seed: "1", result: "n" }, boil);
    el("feDisplacementMap", { in: "SourceGraphic", in2: "n", scale: String(5 * intensity), xChannelSelector: "R", yChannelSelector: "G" }, boil);

    // 3. grain
    const grainF = el("filter", { id: "rh-grain", x: "0", y: "0", width: "100%", height: "100%" }, defs);
    const grainNoise = el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.85", numOctaves: "1", seed: "1", result: "g" }, grainF);
    el("feColorMatrix", { in: "g", type: "matrix", values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.15" }, grainF);

    // 7. vignette
    const vig = el("radialGradient", { id: "rh-vignette", cx: "50%", cy: "48%", r: "70%" }, defs);
    el("stop", { offset: "55%", "stop-color": palette.ink, "stop-opacity": "0" }, vig);
    el("stop", { offset: "100%", "stop-color": palette.ink, "stop-opacity": String(0.55 * intensity) }, vig);

    // layer stack
    const weave = el("g", {}, svg); // 6. gate weave moves everything below
    el("rect", { x: -40, y: -40, width: width + 80, height: height + 80, fill: palette.paper }, weave);
    const scene = el("g", { filter: "url(#rh-boil)" }, weave);
    const overlay = el("g", {}, weave); // for iris masks, title cards etc. (film draws here)

    const fx = el("g", { "pointer-events": "none" }, svg);
    const dirt = el("g", {}, fx);
    el("rect", { x: 0, y: 0, width, height, filter: "url(#rh-grain)", opacity: String(0.32 * intensity), style: "mix-blend-mode:multiply" }, fx);
    el("rect", { x: 0, y: 0, width, height, fill: "url(#rh-vignette)" }, fx);
    const flicker = el("rect", { x: 0, y: 0, width, height, fill: palette.white, opacity: "0" }, fx);

    function update(t) {
      const drawing = T.drawingIndex(t, motion.drawingsPerSecond);
      const frame = Math.floor(t * motion.filmFps + 1e-6);

      boilNoise.setAttribute("seed", String(1 + (drawing % 4))); // a few drawings loop: calmer boil
      grainNoise.setAttribute("seed", String(1 + (frame % 97)));

      // 6. gate weave
      const wx = T.noise(11, t * 1.3) * 3 * intensity;
      const wy = T.noise(23, t * 0.9) * 4 * intensity;
      weave.setAttribute("transform", `translate(${wx.toFixed(2)},${wy.toFixed(2)})`);

      // 5. flicker
      flicker.setAttribute("opacity", (Math.abs(T.hash(5, frame)) * 0.07 * intensity).toFixed(3));

      // 4. dirt: rebuild per frame from seed (cheap: a handful of nodes)
      while (dirt.firstChild) dirt.removeChild(dirt.firstChild);
      const r = T.rng(1000 + frame);
      const specks = Math.floor(r() * 5 * intensity);
      for (let i = 0; i < specks; i++) {
        el("ellipse", {
          cx: (r() * width).toFixed(0), cy: (r() * height).toFixed(0),
          rx: (1 + r() * 5).toFixed(1), ry: (1 + r() * 3).toFixed(1),
          fill: r() < 0.7 ? palette.ink : palette.white, opacity: (0.4 + r() * 0.5).toFixed(2),
        }, dirt);
      }
      if (r() < 0.35 * intensity) {
        const x = r() * width;
        el("line", { x1: x, y1: 0, x2: x + (r() - 0.5) * 30, y2: height, stroke: palette.ink, "stroke-width": (0.8 + r() * 1.6).toFixed(1), opacity: "0.35" }, dirt);
      }
    }

    update(0);
    return { scene, overlay, update, defs };
  }

  global.Toon.styles = global.Toon.styles || {};
  global.Toon.styles["rubber-hose-1930"] = { palette, motion, install };
})(window);
