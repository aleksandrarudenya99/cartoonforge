/** Set PARIS — DETAILS: a cream stone building with a blue-grey mansard roof and iron balconies, a plane tree, a green double lamp, cobbles. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("paris").details = {
    build({ g, theme, defs, width: W, ground: G, height: H }) {
      const bx = 690, top = 420, bot = G - 140;
      T.el("rect", { x: bx, y: top + 130, width: W - bx + 60, height: bot - top - 130, fill: "#efe2c4", ...X.ink(theme, 0.8) }, g);
      T.el("path", { d: `M${bx - 20},${top + 130} L${bx + 20},${top} L${W + 60},${top} L${W + 60},${top + 130} Z`, fill: "#7d8ea3", ...X.ink(theme, 0.8) }, g);
      for (const dx of [70, 230]) { T.el("path", { d: `M${bx + dx},${top + 110} l0,-60 q30,-30 60,0 l0,60 Z`, fill: "#efe2c4", ...X.ink(theme, 0.6) }, g); T.el("rect", { x: bx + dx + 12, y: top + 62, width: 36, height: 48, fill: "#a9c6d6", ...X.ink(theme, 0.4) }, g); }
      T.el("rect", { x: bx - 30, y: top + 126, width: W - bx + 90, height: 16, fill: "#e3d3b0", ...X.ink(theme, 0.6) }, g);
      for (let f = 0; f < 3; f++) {
        const fy = top + 180 + f * 230;
        for (const dx of [40, 200, 340]) {
          T.el("rect", { x: bx + dx, y: fy, width: 80, height: 160, fill: "#a9c6d6", ...X.ink(theme, 0.6) }, g);
          T.el("path", { d: `M${bx + dx + 40},${fy} l0,160 M${bx + dx + 14},${fy + 120} l50,-90`, ...X.ink(theme, 0.35) }, g);
          T.el("rect", { x: bx + dx - 8, y: fy - 14, width: 96, height: 12, fill: "#e3d3b0", ...X.ink(theme, 0.4) }, g);
        }
        if (f !== 1) { // continuous wrought-iron balcony
          T.el("path", { d: `M${bx + 20},${fy + 120} L${W + 60},${fy + 120}`, ...X.ink(theme, 0.9) }, g);
          let d = ""; for (let xx = bx + 26; xx < W + 60; xx += 14) d += `M${xx},${fy + 120} l0,40 `;
          T.el("path", { d, ...X.ink(theme, 0.4) }, g);
          T.el("path", { d: `M${bx + 20},${fy + 160} L${W + 60},${fy + 160}`, ...X.ink(theme, 0.9) }, g);
        }
      }
      X.shade(g, defs, X.rectD(bx, top + 130, W - bx + 60, bot - top - 130), "#bfa77e", [[0, 0], [60, 0], [100, 0.7]], { x1: 0, y1: 0, x2: 1, y2: 0 });
      X.puffTree(g, defs, theme, { x: 120, y: G - 130, s: 1.25, crown: "#86b56f", shadeC: "#4f7f45", hi: "#c4e3a2", trunk: "#9a8566", seed: 5 });
      // cobbles
      const ground = X.rectD(-60, G - 140, W + 120, H - G + 200);
      T.el("path", { d: ground, fill: "#cdbb9c", ...X.ink(theme, 0.7) }, g);
      for (let row = 0; row < 16; row++) { const y = G - 120 + row * 34 * (1 + row * 0.04), w = 36 + row * 4; let d = ""; for (let x = -40 + (row % 2) * w * 0.5; x < W + 60; x += w) d += `M${x},${y} q${w / 2},-12 ${w},0 `; T.el("path", { d, fill: "none", ...X.ink(theme, 0.3) }, g); }
      X.shade(g, defs, ground, "#9c8662", [[0, 0.5], [15, 0], [80, 0], [100, 0.5]]);
      // double street lamp
      const L = T.el("g", { transform: `translate(330,${G - 120})` }, g);
      T.el("path", { d: "M-10,0 L-6,-520 L6,-520 L10,0 Z", fill: "#2f4a3a", ...X.ink(theme, 0.7) }, L);
      T.el("path", { d: "M-70,-470 Q0,-540 70,-470", fill: "none", stroke: theme.line.color, "stroke-width": 12, "stroke-linecap": "round" }, L);
      T.el("path", { d: "M-70,-470 Q0,-540 70,-470", fill: "none", stroke: "#2f4a3a", "stroke-width": 6, "stroke-linecap": "round" }, L);
      for (const sx of [-70, 70]) T.el("path", { d: `M${sx - 22},-470 l44,0 l-10,-50 l-24,0 Z`, fill: "#f4e7b0", ...X.ink(theme, 0.6) }, L);
      T.el("rect", { x: -24, y: -30, width: 48, height: 30, fill: "#2f4a3a", ...X.ink(theme, 0.6) }, L);
      return null;
    },
  };
})(window);
