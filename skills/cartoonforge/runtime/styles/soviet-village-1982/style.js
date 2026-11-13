/**
 * Style pack: Soviet Village Cartoon · 1980s
 * Genre look of late-Soviet hand-drawn shorts about village life: naive, slightly wobbly
 * drawing with thin dark line, warm muted folk palette (ochre, brick, faded green), whitewashed
 * huts with thatched roofs, sunflowers, a wattle fence, a big moon over a deep-blue night or a
 * hazy summer day. Unhurried, deadpan timing. A genre, not any specific film.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    night: "#1f2f4f", nightLow: "#4b5f7d", moon: "#f3e6b3", hut: "#efe6d2", thatch: "#b98a4a", thatchDark: "#8a6230",
    field: "#7a8f4a", fieldDark: "#5b6d34", fence: "#6b4b2e", sunflower: "#f2b632", ink: "#2a221c", white: "#fbf6ea", window: "#ffd27a",
  };

  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 90, lineWidth: 4 };

  const HAND = "'Georgia', 'DejaVu Serif', serif";
  const caption = { y: 360, size: 66, font: HAND, weight: "bold", style: "italic", fill: palette.white, stroke: palette.ink, strokeWidth: 10, maxWidth: 880 };

  const cards = { bg: palette.night, fg: palette.moon, accent: palette.sunflower, font: HAND, frame: "none", transition: "fade", transitionColor: "#0e1626", upper: false, titleStyle: "italic" };

  /** Characters: thin wobbly dark line, muted flat folk colours, no shading. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "none", outline: palette.ink,
    body: "#9a8a6a", head: "#9a8a6a", face: "#e8dcc4", eye: palette.ink, glint: null,
    limb: palette.ink, limbWidth: 0.55, glove: "#e8dcc4", gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: "#b3412e", mouth: palette.ink, nose: palette.ink,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.night }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.night], [80, palette.nightLow], [100, "#6d7b8f"]] }),
      fx.boil(L, { scale: 3, freq: 0.02, loop: 3, dps: motion.drawingsPerSecond }), // gentle naive wobble
      fx.paper(L, { color: "#f4ead2", opacity: 0.22, freq: 0.04 }),
      fx.grain(L, { opacity: 0.16 }),
      fx.vignette(L, { color: "#0e1626", strength: 0.5 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const line = { stroke: P.ink, "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" };
    const moon = T.el("circle", { ...line, r: 120, fill: P.moon }, g);
    const stars = Array.from({ length: 30 }, (_, i) => { const r = T.rng(i + 50); return T.el("circle", { cx: r() * W, cy: 160 + r() * 560, r: 2 + r() * 3, fill: P.moon }, g); });
    T.el("path", { ...line, d: S().ridge(-60, W + 60, G - 200, 70, { seed: 33, peaks: 4, bottom: G }), fill: P.fieldDark }, g);
    // whitewashed hut with thatched roof and a lit window
    const hut = T.el("g", { transform: `translate(${W - 430},${G - 40})` }, g);
    T.el("path", { ...line, d: "M0,0 L0,-220 L320,-220 L320,0 Z", fill: P.hut }, hut);
    T.el("path", { ...line, d: "M-50,-200 C40,-380 280,-380 370,-200 C260,-230 60,-230 -50,-200 Z", fill: P.thatch }, hut);
    for (let k = 0; k < 7; k++) T.el("path", { d: `M${-20 + k * 55},${-220} l20,-90`, stroke: P.thatchDark, "stroke-width": 3 }, hut);
    const win = T.el("rect", { ...line, x: 200, y: -170, width: 70, height: 70, fill: P.window }, hut);
    T.el("path", { d: "M235,-170 L235,-100 M200,-135 L270,-135", stroke: P.ink, "stroke-width": 4 }, hut);
    // wattle fence
    const fence = T.el("g", {}, g);
    for (let x = 0; x < 560; x += 46) T.el("path", { ...line, d: `M${x},${G} L${x + 4},${G - 170}`, "stroke-width": 7, stroke: P.fence }, fence);
    for (let k = 0; k < 4; k++) T.el("path", { d: `M-10,${G - 40 - k * 32} Q140,${G - 52 - k * 32} 280,${G - 40 - k * 32} T570,${G - 40 - k * 32}`, fill: "none", stroke: P.fence, "stroke-width": 9 }, fence);
    // sunflowers that nod
    const sun = [80, 240, 420].map((x, i) => {
      const n = T.el("g", {}, g);
      T.el("path", { ...line, d: `M0,0 C10,-120 -10,-220 0,-300`, fill: "none", "stroke-width": 7, stroke: P.fieldDark }, n);
      const head = T.el("g", { transform: "translate(0,-300)" }, n);
      T.el("path", { ...line, d: S().star(0, 0, 60, 14, 0.65), fill: P.sunflower }, head);
      T.el("circle", { ...line, r: 30, fill: "#5a3a1f" }, head);
      return { n, head, x, i };
    });
    T.el("rect", { ...line, x: -60, y: G, width: W + 120, height: 700, fill: P.field }, g);
    return {
      update(t) {
        moon.setAttribute("transform", `translate(${260 + t * 3},${500 - t * 2})`);
        stars.forEach((s, i) => s.setAttribute("opacity", (0.5 + 0.5 * Math.abs(T.noise(i, t))).toFixed(2)));
        win.setAttribute("opacity", (0.85 + 0.15 * Math.abs(T.noise(4, t * 2))).toFixed(2));
        sun.forEach(({ n, head, x, i }) => { n.setAttribute("transform", `translate(${x},${G - 10})`); head.setAttribute("transform", `translate(0,-300) rotate(${(Math.sin(t * 0.7 + i) * 8).toFixed(2)})`); });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["soviet-village-1982"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
