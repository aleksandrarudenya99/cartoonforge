/**
 * Style pack: Early CGI Feature · 1995–2001
 * The look of the first 3D features, faked in 2D: glossy plastic surfaces with hard white
 * specular highlights, simple single-key lighting, clean solid colours, crisp drop shadows,
 * slightly too-perfect geometry, a toy-scale world (wallpaper, floorboards, blocks).
 * Full motion on ones. A genre, not any specific film.
 */
(function (global) {
  "use strict";
  const T = global.Toon, S = () => T.shapes;

  const palette = {
    wall: "#7fb2e5", wallDeep: "#5a8fc8", cloud: "#ffffff", floor: "#c58a4e", floorDark: "#9c6532", block: ["#e53935", "#fbc02d", "#43a047", "#1e88e5"],
    ink: "#20262e", white: "#ffffff", shadow: "rgba(0,0,0,0.25)",
  };

  const motion = { drawingsPerSecond: 24, filmFps: 24, bpm: 116, lineWidth: 0 };

  const ROUND = "'Helvetica Neue', 'Arial', 'DejaVu Sans', sans-serif";
  const caption = { y: 370, size: 72, font: ROUND, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 12, maxWidth: 900 };

  const cards = { bg: "#0f2340", fg: palette.white, accent: "#fbc02d", font: ROUND, frame: "none", transition: "fade", transitionColor: "#000", upper: false };

  /** Characters: no outline, plastic gloss: base colour + darker side + hard white specular. */
  const skin = {
    ink: palette.ink, white: palette.white, lineWidth: 6, shading: "gloss", outline: null, specular: palette.white,
    body: "#e53935", head: "#fbc02d", face: "#fff3d6", eye: palette.ink, glint: palette.white,
    limb: "#1e88e5", limbWidth: 1.1, glove: palette.white, gloveLine: "#cfd8dc", shoe: "#5d4037", shoeShine: palette.white,
    bow: "#43a047", mouth: "#4e2a2a", nose: "#e57373",
  };

  function install(svg, { width, height }) {
    const look = T.fx.stack(svg, { width, height, background: palette.wall }, (fx, L) => [
      fx.paperShadow(L, { dx: 10, dy: 14, blur: 6, opacity: 0.28 }), // crisp CG drop shadows
      fx.vignette(L, { color: "#000", strength: 0.22, inner: 60 }),
    ]);
    const gl = (id, a, b) => { const gr = T.el("linearGradient", { id, x1: "0", y1: "0", x2: "0", y2: "1" }, look.defs); T.el("stop", { offset: "0%", "stop-color": a }, gr); T.el("stop", { offset: "100%", "stop-color": b }, gr); };
    gl("cgi-wall", palette.wall, palette.wallDeep);
    gl("cgi-floor", palette.floor, palette.floorDark);
    return look;
  }

  function scenery(look, { width: W, ground: G }) {
    const P = palette, g = look.scene;
    // a toy-scale room: cloud wallpaper, skirting board, wooden floor in perspective, blocks
    T.el("rect", { x: -60, y: -60, width: W + 120, height: G + 60, fill: "url(#cgi-wall)" }, g);
    for (let row = 0; row < 5; row++) for (let col = 0; col < 4; col++) T.el("path", { d: S().cloud(-80, 80, 0, 40, 3), fill: P.cloud, opacity: 0.9, transform: `translate(${120 + col * 280 + (row % 2) * 140},${260 + row * 230})` }, g);
    T.el("rect", { x: -60, y: G - 70, width: W + 120, height: 70, fill: P.white }, g);
    T.el("rect", { x: -60, y: G, width: W + 120, height: 700, fill: "url(#cgi-floor)" }, g);
    for (let i = -6; i <= 6; i++) T.el("line", { x1: W / 2 + i * 60, y1: G, x2: W / 2 + i * 240, y2: G + 700, stroke: P.floorDark, "stroke-width": 4 }, g);
    const blocks = [[120, 0, 140], [240, 1, 120], [170, 2, 110], [880, 3, 150]].map(([x, c, s], i) => {
      const n = T.el("g", {}, g);
      T.el("rect", { x: 0, y: -s, width: s, height: s, rx: 10, fill: P.block[c] }, n);
      T.el("rect", { x: s * 0.62, y: -s, width: s * 0.38, height: s, rx: 10, fill: "#000", opacity: 0.15 }, n); // shaded side
      T.el("rect", { x: s * 0.12, y: -s * 0.88, width: s * 0.22, height: s * 0.1, rx: 4, fill: P.white, opacity: 0.85 }, n); // specular
      T.el("text", { x: s * 0.33, y: -s * 0.3, "text-anchor": "middle", "font-family": ROUND, "font-size": s * 0.5, "font-weight": "bold", fill: P.white }, n).textContent = "ABCD"[i];
      return { n, x, y: i === 2 ? G - 140 : G, i };
    });
    const ball = T.el("g", {}, g);
    T.el("circle", { r: 70, fill: "#fbc02d" }, ball);
    T.el("path", { d: "M-70,0 A70,70 0 0,0 70,0 Z", fill: "#e53935" }, ball);
    T.el("ellipse", { cx: -24, cy: -32, rx: 18, ry: 10, fill: P.white, opacity: 0.9 }, ball);
    return {
      update(t, { beat }) {
        blocks.forEach(({ n, x, y }) => n.setAttribute("transform", `translate(${x},${y})`));
        const k = (t % (beat * 2)) / (beat * 2), h = Math.abs(Math.sin(Math.PI * k)) * 200;
        ball.setAttribute("transform", `translate(${780 + Math.sin(t * 0.5) * 60},${G - 70 - h}) rotate(${t * 120})`);
      },
    };
  }

  T.styles = T.styles || {};
  T.styles["early-cgi-1995"] = { palette, motion, caption, cards, skin, install, scenery };
})(window);
