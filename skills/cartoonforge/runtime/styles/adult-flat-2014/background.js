/**
 * Adult Flat Comedy — BACKGROUND: alien night sky over a quiet suburb.
 *
 * Genre traits (from reference study):
 *   - painted backgrounds with an AIRBRUSH SPECKLE texture (sky and ground), unlike flat characters
 *   - big planets with ORGANIC blotchy spots in a darker tone of the same hue, thin outline
 *   - stars as soft dots of different sizes (some tinted), not perfect sparkles
 *   - drifting clusters of small bubbles / particles
 *   - far town lights as tiny yellow DASHES scattered over dark ground
 * Moves very little: deadpan staging.
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  T.styles["adult-flat-2014"].parts.background = {
    build({ g, theme, width: W, ground: G, look }) {
      const P = theme.palette, L = theme.line;
      const line = { stroke: L.color, "stroke-width": L.width, "stroke-linejoin": "round" };
      T.fx.spray(look, { target: g, freq: 0.85, amount: 0.32 }); // airbrush speckle on this layer only

      // sky: two soft bands (painted backgrounds are allowed a little gradient)
      const gid = "af-sky";
      const gr = T.el("linearGradient", { id: gid, x1: "0", y1: "0", x2: "0", y2: "1" }, look.defs);
      [[0, P.skyTop], [55, P.skyMid], [85, P.skyLow], [100, P.horizon]].forEach(([o, c]) => T.el("stop", { offset: `${o}%`, "stop-color": c }, gr));
      T.el("rect", { x: -60, y: -60, width: W + 120, height: G + 60, fill: `url(#${gid})` }, g);

      // stars: soft dots of mixed sizes, a few tinted
      const stars = Array.from({ length: 70 }, (_, i) => {
        const r = T.rng(i + 400);
        const tint = r() < 0.2 ? "#bcd2ff" : r() < 0.3 ? "#e8d0ff" : P.white;
        return { n: T.el("circle", { cx: r() * W, cy: 40 + r() * 980, r: (1.5 + r() * r() * 7).toFixed(1), fill: tint, opacity: (0.55 + r() * 0.45).toFixed(2) }, g), i };
      });

      // big blotchy planet, partly cut by the frame (bold framing)
      const planet = T.el("g", {}, g);
      T.el("circle", { ...line, cx: 0, cy: 0, r: 260, fill: P.planet }, planet);
      const rs = T.rng(77);
      for (let k = 0; k < 16; k++) {
        const a = rs() * Math.PI * 2, d = rs() * 200, cx = Math.cos(a) * d, cy = Math.sin(a) * d * 0.8;
        // organic blotch: a wobbly closed shape
        let path = "";
        const n = 7, rr = 16 + rs() * 46;
        for (let j = 0; j <= n; j++) { const aa = (j / n) * Math.PI * 2, q = rr * (0.6 + rs() * 0.6); path += `${j ? "L" : "M"}${(cx + Math.cos(aa) * q * 1.6).toFixed(1)},${(cy + Math.sin(aa) * q * 0.7).toFixed(1)} `; }
        T.el("path", { d: path + "Z", fill: P.planetShade, opacity: 0.85, "stroke-linejoin": "round" }, planet);
      }
      T.el("path", { d: "M90,-243 A260,260 0 0 1 90,243 A215,260 0 0 0 90,-243 Z", fill: "#000", opacity: 0.12 }, planet); // flat shadow crescent
      // clip the blotches to the planet disc
      const cp = T.el("clipPath", { id: "af-planet-clip" }, look.defs);
      T.el("circle", { r: 258 }, cp);
      [...planet.children].slice(1).forEach((c) => c.setAttribute("clip-path", "url(#af-planet-clip)"));

      // ringed little planet with a two-tone ring
      const small = T.el("g", { transform: `translate(${W - 190},380) rotate(-18)` }, g);
      T.el("ellipse", { cx: 0, cy: 0, rx: 120, ry: 26, fill: "none", stroke: "#7fd1c0", "stroke-width": 12 }, small);
      T.el("ellipse", { cx: 0, cy: 0, rx: 120, ry: 26, fill: "none", stroke: "#cfeee4", "stroke-width": 4 }, small);
      T.el("circle", { ...line, r: 62, fill: "#c98f6a" }, small);
      for (const [y, w] of [[-26, 80], [-4, 110], [20, 90]]) T.el("path", { d: `M${-w / 2},${y} q${w / 4},-8 ${w / 2},0 t${w / 2},0`, fill: "none", stroke: "#9c6a4c", "stroke-width": 9, "stroke-linecap": "round" }, small);
      T.el("path", { d: "M-118,8 Q0,40 118,-8", fill: "none", stroke: "#7fd1c0", "stroke-width": 12, "stroke-linecap": "round" }, small);

      // drifting particle clusters (bubbles) across the sky
      const bubbles = Array.from({ length: 60 }, (_, i) => {
        const r = T.rng(i * 13 + 9);
        return { n: T.el("circle", { fill: r() < 0.5 ? "#a8e6cf" : "#e7f7c8", stroke: "#5fa88f", "stroke-width": 1.5, opacity: 0.75 }, g), x: 600 + r() * 480 + r() * 200, y: 120 + r() * 380, rad: 3 + r() * 9, sp: 6 + r() * 10 };
      });

      // far ground with town lights as tiny dashes
      T.el("path", { ...line, d: T.shapes.ridge(-60, W + 60, G - 430, 70, { seed: 3, peaks: 3, bottom: G }), fill: P.hills }, g);
      const rl = T.rng(5);
      const lights = Array.from({ length: 90 }, () => T.el("rect", { x: (rl() * W).toFixed(0), y: (G - 380 + rl() * 280).toFixed(0), width: (6 + rl() * 10).toFixed(0), height: 3.5, rx: 1.5, fill: "#ffd76a", opacity: (0.6 + rl() * 0.4).toFixed(2) }, g));

      return {
        update(t) {
          stars.forEach(({ n, i }) => { if (i % 9 === 0) n.setAttribute("opacity", Math.floor(t * 2 + i) % 4 === 0 ? "0.3" : "0.9"); });
          planet.setAttribute("transform", `translate(${-40 + t * 1.2},${250})`);
          bubbles.forEach((b) => { b.n.setAttribute("cx", ((b.x - t * b.sp) % (W + 200)).toFixed(1)); b.n.setAttribute("cy", (b.y + Math.sin(t * 0.8 + b.x) * 8).toFixed(1)); b.n.setAttribute("r", b.rad.toFixed(1)); });
          lights.forEach((l, i) => { if (i % 11 === 0) l.setAttribute("opacity", Math.floor(t * 1.5 + i) % 3 ? "0.9" : "0.4"); });
        },
      };
    },
  };
})(window);
