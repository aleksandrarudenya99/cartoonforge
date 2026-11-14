/** Set PARIS — BACKGROUND: soft morning sky, the iron lattice tower across the river, the Seine and its stone quay. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("paris").background = {
    build({ g, theme, defs, look, width: W, ground: G }) {
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.22 });
      X.sky(g, defs, { w: W + 120, h: G, stops: [[0, "#a9cfe8"], [60, "#cfe3ee"], [100, "#f5e8cf"]] });
      const clouds = X.cloudBands(g, { y0: 80, y1: 700, n: 8, color: "#ffffff", opacity: 0.7, seed: 3 });
      for (let i = 0; i < 9; i++) { const r = T.rng(i + 30), x = i * 130 - 40, h = 50 + r() * 70; T.el("path", { d: X.rectD(x, G - 330 - h, 120, h), fill: "#b9c3cf", ...X.ink(theme, 0.4) }, g); }
      // lattice tower: tapered legs, an arch, three decks, lattice clipped to the silhouette
      const x = 300, base = G - 330, top = 110;
      const tower = `M${x - 190},${base} Q${x - 110},${base - 300} ${x - 55},${base - 480} L${x - 30},${base - 720} L${x - 11},${top + 80} L${x},${top} L${x + 11},${top + 80} L${x + 30},${base - 720} L${x + 55},${base - 480} Q${x + 110},${base - 300} ${x + 190},${base} Z`;
      const holes = `M${x - 128},${base} Q${x},${base - 330} ${x + 128},${base} Z M${x - 38},${base - 470} L${x - 20},${base - 690} L${x + 20},${base - 690} L${x + 38},${base - 470} Z`;
      T.el("path", { d: tower + " " + holes, "fill-rule": "evenodd", fill: "#a07a55", ...X.ink(theme, 0.75) }, g);
      const cid = "af-paris-tower";
      T.el("path", { d: tower + " " + holes, "clip-rule": "evenodd" }, T.el("clipPath", { id: cid }, defs));
      const lat = T.el("g", { "clip-path": `url(#${cid})` }, g);
      for (let k = -40; k < 60; k++) { T.el("path", { d: `M${x - 220 + k * 22},${base} l300,-900`, ...X.ink(theme, 0.28) }, lat); T.el("path", { d: `M${x + 220 - k * 22},${base} l-300,-900`, ...X.ink(theme, 0.28) }, lat); }
      X.shade(lat, defs, X.rectD(x, top, 200, base - top), "#6d4f33", [[0, 0.7], [100, 0]], { x1: 1, y1: 0, x2: 0, y2: 0 });
      for (const [y, w, h] of [[base - 330, 300, 26], [base - 600, 130, 18], [top + 150, 46, 14]]) T.el("rect", { x: x - w / 2, y, width: w, height: h, fill: "#8d6a48", ...X.ink(theme, 0.7) }, g);
      T.el("path", { d: `M${x},${top} l0,-60`, ...X.ink(theme, 0.7) }, g);
      // river + quay
      const river = T.el("rect", { x: -60, y: G - 330, width: W + 120, height: 130, fill: "#7fb3c9", ...X.ink(theme, 0.6) }, g);
      const ripples = Array.from({ length: 12 }, (_, i) => T.el("path", { d: `M0,0 l${40 + (i % 3) * 20},0`, stroke: "#d8eef6", "stroke-width": 4, "stroke-linecap": "round" }, g));
      T.el("rect", { x: -60, y: G - 200, width: W + 120, height: 60, fill: "#d8c7a2", ...X.ink(theme, 0.7) }, g);
      for (let i = 0; i < 14; i++) T.el("path", { d: `M${i * 85 + (i % 2) * 40},${G - 200} l0,30 M${i * 85},${G - 170} l0,30`, ...X.ink(theme, 0.35) }, g);
      T.el("path", { d: `M-60,${G - 170} L${W + 60},${G - 170}`, ...X.ink(theme, 0.35) }, g);
      return { update(t) { clouds.update(t); ripples.forEach((n, i) => n.setAttribute("transform", `translate(${((i * 97 + t * 22) % (W + 100)) - 50},${G - 310 + (i % 5) * 22})`)); void river; } };
    },
  };
})(window);
