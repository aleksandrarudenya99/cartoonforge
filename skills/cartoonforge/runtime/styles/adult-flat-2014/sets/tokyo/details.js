/** Set TOKYO — DETAILS: narrow neon street: vertical signs with made-up glyphs, a string of red paper lanterns, a glowing vending machine, wet street with neon reflections. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("tokyo").details = {
    build({ g, theme, defs, width: W, ground: G, height: H }) {
      for (const [x0, x1] of [[-60, 270], [810, W + 60]]) {
        T.el("rect", { x: x0, y: 200, width: x1 - x0, height: G - 160 - 200, fill: "#2b2f45", ...X.ink(theme, 0.8) }, g);
        X.shade(g, defs, X.rectD(x0, 200, x1 - x0, G - 360), "#151729", [[0, 0.7], [100, 0]]);
      }
      const signs = [[40, 300, "#ff4f9a", 1], [170, 460, "#4fe3ff", 2], [860, 330, "#ffd23f", 3], [990, 520, "#a77bff", 4], [880, 840, "#4fff9a", 5]];
      const glow = signs.map(([x, y, c, s]) => {
        X.shade(g, defs, X.ellD(x + 40, y + 160, 110, 220), c, [[0, 0.6], [100, 0]], { radial: true });
        const box = T.el("rect", { x, y, width: 80, height: 320, rx: 10, fill: "#1b1d2c", stroke: c, "stroke-width": 7 }, g);
        for (let k = 0; k < 5; k++) X.glyphs(g, theme, { x: x + 26, y: y + 60 + k * 56, n: 1, size: 30, color: c, seed: s * 10 + k, width: 4 });
        return box;
      });
      // lantern string
      T.el("path", { d: `M-60,500 Q${W / 2},640 ${W + 60},500`, fill: "none", ...X.ink(theme, 0.6) }, g);
      const lanterns = [140, 330, 540, 750, 940].map((x, i) => {
        const y = 500 + Math.sin((x / W) * Math.PI) * 140 * 0.98;
        const l = T.el("g", {}, g);
        T.el("path", { d: "M0,0 l0,20", ...X.ink(theme, 0.5) }, l);
        X.shade(l, defs, X.ellD(0, 70, 90, 90), "#ff7a4a", [[0, 0.5], [100, 0]], { radial: true });
        T.el("ellipse", { cx: 0, cy: 70, rx: 36, ry: 50, fill: "#e23b30", ...X.ink(theme, 0.7) }, l);
        for (const k of [-18, 0, 18]) T.el("path", { d: `M${k},24 Q${k * 1.6},70 ${k},116`, fill: "none", ...X.ink(theme, 0.35) }, l);
        for (const y2 of [18, 116]) T.el("rect", { x: -18, y: y2, width: 36, height: 10, fill: "#1e1e22", ...X.ink(theme, 0.4) }, l);
        return { l, x, y, ph: i };
      });
      // street with neon reflections
      const st = X.rectD(-60, G - 160, W + 120, H - G + 220);
      T.el("path", { d: st, fill: "#262a3a", ...X.ink(theme, 0.6) }, g);
      for (const [x, , c] of signs) X.shade(g, defs, X.rectD(x - 10, G - 120, 100, 380), c, [[0, 0.45], [100, 0]]);
      X.contours(g, theme, { y0: G - 120, y1: H - 40, n: 14, seed: 9, color: "#4a5070" });
      // vending machine
      const vm = T.el("g", { transform: `translate(830,${G - 40})` }, g);
      X.shade(vm, defs, X.ellD(110, -230, 220, 300), "#9ff0ff", [[0, 0.5], [100, 0]], { radial: true });
      T.el("rect", { x: 0, y: -470, width: 220, height: 470, rx: 10, fill: "#eef3f7", ...X.ink(theme, 0.9) }, vm);
      T.el("rect", { x: 18, y: -450, width: 184, height: 230, fill: "#bfeeff", ...X.ink(theme, 0.6) }, vm);
      for (let rr = 0; rr < 3; rr++) for (let c = 0; c < 5; c++) T.el("rect", { x: 28 + c * 35, y: -438 + rr * 74, width: 22, height: 50, rx: 6, fill: ["#e2453a", "#4a7fe2", "#f2c230", "#5ac46a", "#f4f1ea"][(rr + c) % 5], ...X.ink(theme, 0.4) }, vm);
      T.el("rect", { x: 40, y: -120, width: 140, height: 50, fill: "#2b2f45", ...X.ink(theme, 0.5) }, vm);
      return {
        update(t) {
          lanterns.forEach((L) => L.l.setAttribute("transform", `translate(${L.x},${L.y}) rotate(${(Math.sin(t * 1.8 + L.ph) * 5).toFixed(1)})`));
          glow.forEach((b, i) => b.setAttribute("opacity", Math.floor(t * 8 + i * 5) % 23 === 0 ? "0.4" : "1"));
        },
      };
    },
  };
})(window);
