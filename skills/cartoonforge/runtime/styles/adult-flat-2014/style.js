/**
 * Style pack: Adult Flat Comedy · 2010s
 * Genre look of adult animated comedy: flat colours, thin even line, slightly muted
 * "real-world" palette for everyday scenes plus acid sci-fi accents (glowing rifts, alien
 * skies), deadpan limited acting, sitcom staging. A genre, not any specific series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    sky: "#8fb7c9", skyAlt: "#b2d1c0", hills: "#a9b48a", wall: "#e8d9bf", road: "#8b8577", ink: "#2b2a2a", white: "#fbfaf6",
    portal: "#7cff4f", portalDeep: "#2fae2b", acid: "#c86bff", sun: "#f4d77a",
  };
  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 110, lineWidth: 4 };
  const SANS = "'Helvetica Neue', 'Arial', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 66, font: SANS, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 12, maxWidth: 900 };
  const cards = { bg: palette.ink, fg: palette.white, accent: palette.portal, font: SANS, frame: "none", transition: "fade", transitionColor: palette.ink, upper: false };

  /** Characters: thin even line, flat fills, no shading, deadpan. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "none", outline: palette.ink,
    body: "#6a8caf", head: "#e9cdb4", face: "#e9cdb4", eye: palette.white, glint: palette.ink,
    limb: palette.ink, limbWidth: 0.5, glove: "#e9cdb4", gloveLine: palette.ink, shoe: palette.ink, shoeShine: null,
    bow: "#c0504d", mouth: palette.ink, nose: "#d9b39b",
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.sky }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.sky], [100, palette.skyAlt]] }),
      fx.vignette(L, { color: "#000", strength: 0.15, inner: 65 }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const line = { stroke: P.ink, "stroke-width": 4, "stroke-linejoin": "round" };
    T.el("circle", { ...line, cx: 180, cy: 520, r: 70, fill: P.sun }, g);
    T.el("path", { ...line, d: S().ridge(-60, W + 60, G - 330, 120, { seed: 2, peaks: 3, bottom: G }), fill: P.hills }, g);
    // a plain suburban garage-house (sitcom set) + mailbox
    const house = T.el("g", { transform: `translate(80,${G})` }, g);
    T.el("rect", { ...line, x: 0, y: -360, width: 520, height: 360, fill: P.wall }, house);
    T.el("rect", { ...line, x: 40, y: -230, width: 220, height: 230, fill: "#cdbfa5" }, house);
    for (let k = 1; k < 5; k++) T.el("line", { x1: 40, y1: -230 + k * 46, x2: 260, y2: -230 + k * 46, stroke: P.ink, "stroke-width": 3 }, house);
    T.el("rect", { ...line, x: 330, y: -280, width: 120, height: 100, fill: "#9fc6d6" }, house);
    T.el("path", { ...line, d: "M-30,-360 L260,-470 L550,-360 Z", fill: "#8c6f5a" }, house);
    T.el("rect", { ...line, x: -60, y: G, width: W + 120, height: 700, fill: P.road }, g);
    // sci-fi accent: a swirling green rift that opens on the bar
    const rift = T.el("g", {}, g);
    const rings = [0, 1, 2, 3].map((i) => T.el("ellipse", { fill: i % 2 ? P.portal : P.portalDeep, stroke: P.ink, "stroke-width": 3 }, rift));
    const swirl = T.el("path", { fill: "none", stroke: "#d8ffcf", "stroke-width": 6, "stroke-linecap": "round" }, rift);
    return {
      update(t, { beat }) {
        const k = (t % (beat * 8)) / (beat * 8);
        const open = k < 0.1 ? k / 0.1 : k > 0.6 ? Math.max(0, 1 - (k - 0.6) / 0.1) : 1;
        rift.setAttribute("opacity", open > 0.01 ? "1" : "0");
        rings.forEach((rg, i) => { rg.setAttribute("cx", String(W - 230)); rg.setAttribute("cy", String(G - 560)); rg.setAttribute("rx", String((150 - i * 32) * open)); rg.setAttribute("ry", String((230 - i * 48) * open)); });
        swirl.setAttribute("d", S().spiral(W - 230, G - 560, 120 * open, 2.2, 1, t * 4));
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["adult-flat-2014"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
