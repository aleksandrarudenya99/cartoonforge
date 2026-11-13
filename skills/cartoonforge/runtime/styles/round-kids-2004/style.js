/**
 * Style pack: Round Kids Toon · 2000s
 * Genre look of gentle kids' animation built from circles: round characters, soft rolling
 * green hills, a clean blue sky, bright friendly primaries, thin soft outline, bouncy
 * but calm timing. A genre, not any specific series.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    sky: "#7ec8f2", skyLow: "#d9f1ff", hill1: "#8fd46a", hill2: "#6bbf4e", hill3: "#4fa63b", path: "#f2dfa0",
    ink: "#2e4057", white: "#ffffff", red: "#ff6b6b", yellow: "#ffd93d", pink: "#ff9ec7", house: "#ffb563",
  };
  const motion = { drawingsPerSecond: 12, filmFps: 24, bpm: 112, lineWidth: 5 };
  const ROUND = "'Nunito', 'Arial Rounded MT Bold', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 72, font: ROUND, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 14, maxWidth: 880 };
  const cards = { bg: palette.sky, fg: palette.white, accent: palette.yellow, font: ROUND, frame: "none", transition: "iris", transitionColor: palette.ink, upper: false };

  /** Characters: a ball body (head = body), soft thin line, bright flat colour. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: motion.lineWidth, shading: "none", outline: palette.ink, roundBody: true,
    body: palette.pink, head: palette.pink, face: palette.pink, eye: palette.ink, glint: palette.white,
    limb: palette.pink, limbWidth: 1.1, glove: palette.pink, gloveLine: palette.ink, shoe: palette.pink, shoeShine: null,
    bow: palette.yellow, mouth: palette.ink, nose: palette.red,
  };

  function install(svg, { width, height }) {
    return T.fx.stack(svg, { width, height, background: palette.sky }, (fx, L) => [
      fx.gradient(L, { stops: [[0, palette.sky], [100, palette.skyLow]] }),
    ]);
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    const line = { stroke: P.ink, "stroke-width": 4 };
    const sun = T.el("circle", { ...line, r: 80, fill: P.yellow }, g);
    const clouds = [[220, 560], [760, 470]].map(([x, y]) => ({ n: T.el("path", { ...line, d: S().cloud(-110, 110, 0, 60, 3), fill: P.white }, g), x, y }));
    // three rolling hills of overlapping circles
    [[G - 260, 700, P.hill1, -100], [G - 160, 620, P.hill2, 560], [G - 60, 820, P.hill3, 180]].forEach(([y, r, c, x]) => T.el("circle", { ...line, cx: x, cy: y + r, r, fill: c }, g));
    // a round little house on a hill
    const house = T.el("g", { transform: `translate(${W - 240},${G - 250})` }, g);
    T.el("circle", { ...line, r: 110, fill: P.house }, house);
    T.el("circle", { ...line, cx: 0, cy: 40, r: 38, fill: "#a0522d" }, house);
    T.el("circle", { ...line, cx: -50, cy: -30, r: 24, fill: "#cdeeff" }, house);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: P.hill3 }, g);
    T.el("path", { d: `M${W / 2 - 80},${G + 700} Q${W / 2},${G + 200} ${W / 2 - 20},${G} L${W / 2 + 20},${G} Q${W / 2 + 40},${G + 200} ${W / 2 + 80},${G + 700} Z`, fill: P.path }, g);
    const flowers = Array.from({ length: 10 }, (_, i) => T.el("circle", { r: 9, fill: i % 2 ? P.red : P.yellow, stroke: P.ink, "stroke-width": 2 }, g));
    return {
      update(t, { beat }) {
        const b = Math.pow(Math.sin(Math.PI * ((t % beat) / beat)), 2);
        sun.setAttribute("transform", `translate(${W - 200},420) scale(${1 + b * 0.05})`);
        clouds.forEach(({ n, x, y }, i) => n.setAttribute("transform", `translate(${x + Math.sin(t * 0.4 + i) * 30},${y})`));
        flowers.forEach((f, i) => { f.setAttribute("cx", String(60 + i * 105)); f.setAttribute("cy", (G + 60 + (i % 3) * 70 - b * 8).toFixed(1)); });
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["round-kids-2004"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
