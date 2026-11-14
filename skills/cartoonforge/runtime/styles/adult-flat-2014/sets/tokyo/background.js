/** Set TOKYO — BACKGROUND: deep night sky, a red-and-white lattice broadcast tower, far towers with lit windows. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("tokyo").background = {
    build({ g, theme, defs, look, width: W, ground: G }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.22 });
      X.sky(g, defs, { w: W + 120, h: G, stops: [[0, "#141a3a"], [70, "#2e2856"], [100, "#4a3266"]] });
      const r = T.rng(3);
      for (let i = 0; i < 40; i++) T.el("circle", { cx: r() * W, cy: r() * 700, r: 1.5 + r() * 2.5, fill: "#e9e4ff", opacity: 0.7 }, g);
      for (let i = 0; i < 9; i++) { const x = -40 + i * 130, h = 260 + r() * 360, top = G - 200 - h; T.el("rect", { x, y: top, width: 120, height: h, fill: "#2c2f52", ...X.ink(theme, 0.4) }, g); for (let y = top + 16; y < G - 210; y += 28) for (let k = 0; k < 4; k++) if (r() < 0.3) T.el("rect", { x: x + 10 + k * 28, y, width: 16, height: 12, fill: r() < 0.5 ? "#ffe9a8" : "#a8f0ff", opacity: 0.8 }, g); }
      // lattice tower
      const cx = 840, base = G - 260, top = 120;
      const tw = `M${cx - 120},${base} L${cx - 30},${top + 260} L${cx - 8},${top} L${cx + 8},${top} L${cx + 30},${top + 260} L${cx + 120},${base} Z`;
      T.el("path", { d: tw, fill: "#e2453a", ...X.ink(theme, 0.7) }, g);
      const cid = "af-tokyo-tower";
      T.el("path", { d: tw }, T.el("clipPath", { id: cid }, defs));
      const lat = T.el("g", { "clip-path": `url(#${cid})` }, g);
      for (let y = top; y < base; y += 150) T.el("rect", { x: cx - 140, y: y + 75, width: 280, height: 75, fill: "#f4f1ea" }, lat);
      for (let k = -30; k < 30; k++) { T.el("path", { d: `M${cx - 160 + k * 18},${base} l220,-800`, ...X.ink(theme, 0.25) }, lat); T.el("path", { d: `M${cx + 160 - k * 18},${base} l-220,-800`, ...X.ink(theme, 0.25) }, lat); }
      for (const [y, w] of [[base - 330, 150], [top + 240, 80]]) T.el("rect", { x: cx - w / 2, y, width: w, height: 40, rx: 8, fill: "#f4f1ea", ...X.ink(theme, 0.7) }, g);
      const tip = T.el("circle", { cx, cy: top - 6, r: 8, fill: "#ff5a5a" }, g);
      return { update(t) { tip.setAttribute("opacity", Math.floor(t * 2) % 2 ? "1" : "0.2"); } };
    },
  };
})(window);
