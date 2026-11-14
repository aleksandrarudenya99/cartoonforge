/** Set PARIS — FOREGROUND: a striped café awning cut by the top-right corner, a bistro table with coffee and a croissant, a bobbing pigeon. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("paris").foreground = {
    build({ g, theme, defs, width: W, height: H }) {
      const aw = T.el("g", {}, g);
      T.el("path", { d: `M640,-60 L${W + 60},-60 L${W + 60},170 L640,170 Z`, fill: "#f4efe4", ...X.ink(theme, 0.8) }, aw);
      for (let x = 650; x < W + 60; x += 90) T.el("rect", { x, y: -60, width: 45, height: 230, fill: "#c9473f" }, aw);
      let sc = `M640,170 `; for (let x = 640; x < W + 60; x += 45) sc += `q22.5,34 45,0 `;
      T.el("path", { d: sc + `L${W + 60},150 L640,150 Z`, fill: "#c9473f", ...X.ink(theme, 0.8) }, aw);
      const tx = 930, ty = H - 230;
      T.el("path", { d: `M${tx},${ty + 20} L${tx - 20},${H + 40} M${tx},${ty + 20} L${tx + 20},${H + 40}`, ...X.ink(theme, 1.4) }, g);
      T.el("ellipse", { cx: tx, cy: ty, rx: 170, ry: 34, fill: "#dfe4e6", ...X.ink(theme, 0.9) }, g);
      T.el("path", { d: `M${tx - 60},${ty - 4} l10,-46 l50,0 l10,46 Z`, fill: "#f7f3ea", ...X.ink(theme, 0.6) }, g);
      T.el("path", { d: `M${tx + 10},${ty - 36} q22,0 18,16 q-4,10 -16,8`, fill: "none", ...X.ink(theme, 0.6) }, g);
      T.el("path", { d: `M${tx + 40},${ty - 6} q30,-40 90,-10 q-20,16 -46,14 q-26,4 -44,-4 Z`, fill: "#e0a24e", ...X.ink(theme, 0.6) }, g);
      for (const k of [0, 1, 2]) T.el("path", { d: `M${tx + 66 + k * 18},${ty - 26 + k * 2} q6,8 0,18`, fill: "none", ...X.ink(theme, 0.4) }, g);
      const pig = T.el("g", {}, g);
      T.el("ellipse", { cx: 0, cy: 0, rx: 46, ry: 30, fill: "#9aa3ad", ...X.ink(theme, 0.7) }, pig);
      T.el("circle", { cx: -40, cy: -30, r: 18, fill: "#7f8a95", ...X.ink(theme, 0.6) }, pig);
      T.el("path", { d: "M-58,-30 l-12,4 l12,4", fill: "#e3a24a", ...X.ink(theme, 0.4) }, pig);
      T.el("circle", { cx: -44, cy: -34, r: 3, fill: theme.line.color }, pig);
      T.el("path", { d: "M-10,28 l0,18 M10,28 l0,18", stroke: "#d9734f", "stroke-width": 4 }, pig);
      T.el("path", { d: "M40,-6 l30,10 l-30,10", fill: "#7f8a95", ...X.ink(theme, 0.5) }, pig);
      return { update(t) { const b = Math.floor(t * 4) % 2; pig.setAttribute("transform", `translate(${150 + ((t * 30) % 60)},${H - 140}) rotate(${b ? 12 : 0})`); } };
    },
  };
})(window);
