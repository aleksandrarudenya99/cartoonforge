/**
 * Adult Flat Comedy — DETAILS: a plain suburban street at night, plus one sci-fi intrusion.
 * Small everyday props carry the joke: TV antenna, power lines, lit windows, mailbox,
 * trash can, hydrant, a street lamp's flat light cone — and a glowing dimensional tear
 * floating above the lawn, pulling small debris into it.
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  T.styles["adult-flat-2014"].parts.details = {
    build({ g, theme, width: W, ground: G }) {
      const P = theme.palette, L = theme.line;
      const line = { stroke: L.color, "stroke-width": L.width, "stroke-linejoin": "round", "stroke-linecap": "round" };
      const thin = { ...line, "stroke-width": L.width * 0.7 };

      // power lines + poles
      for (const x of [70, W - 70]) {
        T.el("rect", { ...line, x: x - 10, y: G - 820, width: 20, height: 760, fill: "#5a4636" }, g);
        T.el("rect", { ...line, x: x - 70, y: G - 790, width: 140, height: 14, fill: "#5a4636" }, g);
      }
      for (const dy of [0, 24]) T.el("path", { ...thin, d: `M10,${G - 784 + dy} Q${W / 2},${G - 690 + dy} ${W - 10},${G - 784 + dy}`, fill: "none" }, g);

      // two houses (one cut off by the frame edge — sitcom framing)
      const house = (x, w, h, wall, windows) => {
        const n = T.el("g", { transform: `translate(${x},${G - 90})` }, g);
        T.el("rect", { ...line, x: 0, y: -h, width: w, height: h, fill: wall }, n);
        T.el("path", { ...line, d: `M-26,${-h} L${w / 2},${-h - 150} L${w + 26},${-h} Z`, fill: P.roof }, n);
        // TV antenna
        T.el("path", { ...thin, d: `M${w * 0.7},${-h - 95} l0,-90 M${w * 0.7 - 40},${-h - 165} l80,0 M${w * 0.7 - 28},${-h - 140} l56,0`, fill: "none" }, n);
        const lit = [];
        windows.forEach(([wx, wy, on]) => {
          T.el("rect", { ...line, x: wx, y: -h + wy, width: 90, height: 80, fill: on ? P.window : P.windowOff }, n);
          T.el("path", { ...thin, d: `M${wx + 45},${-h + wy} l0,80 M${wx},${-h + wy + 40} l90,0`, fill: "none" }, n);
          if (on) lit.push(n.lastChild.previousSibling);
        });
        T.el("rect", { ...line, x: w * 0.4, y: -150, width: 80, height: 150, fill: P.trim }, n); // door
        T.el("circle", { cx: w * 0.4 + 64, cy: -76, r: 5, fill: L.color }, n);
        return lit;
      };
      const litA = house(-120, 430, 330, P.houseA, [[40, 70, true], [300, 70, false]]);
      const litB = house(W - 260, 420, 300, P.houseB, [[60, 60, false], [260, 60, true]]);

      // lawn + sidewalk band behind the character
      T.el("rect", { ...line, x: -60, y: G - 96, width: W + 120, height: 110, fill: P.lawn }, g);
      T.el("rect", { ...line, x: -60, y: G, width: W + 120, height: 120, fill: P.sidewalk }, g);
      for (let x = 60; x < W; x += 180) T.el("path", { ...thin, d: `M${x},${G} l-14,120`, fill: "none" }, g);
      T.el("rect", { ...line, x: -60, y: G + 120, width: W + 120, height: 600, fill: P.road }, g);

      // street lamp with a flat light cone (no glow: flat comedy lighting)
      const lamp = T.el("g", { transform: `translate(${W - 330},${G - 10})` }, g);
      const cone = T.el("path", { d: "M70,-470 L-90,0 L230,0 Z", fill: P.window, opacity: 0.16 }, lamp);
      T.el("path", { ...line, d: "M0,0 L0,-460 Q0,-490 30,-490 L70,-490", fill: "none", "stroke-width": L.width * 2.2 }, lamp);
      T.el("path", { ...line, d: "M48,-498 L92,-498 L84,-470 L56,-470 Z", fill: P.window }, lamp);

      // mailbox, trash can, hydrant
      const mb = T.el("g", { transform: `translate(150,${G - 40})` }, g);
      T.el("rect", { ...line, x: -6, y: -110, width: 12, height: 110, fill: "#6b5a4a" }, mb);
      T.el("path", { ...line, d: "M-40,-110 L40,-110 L40,-160 Q0,-190 -40,-160 Z", fill: "#7c8b9a" }, mb);
      const flag = T.el("rect", { ...line, x: 38, y: -170, width: 8, height: 40, fill: "#d9534f" }, mb);
      const can = T.el("g", { transform: `translate(${W - 120},${G - 30})` }, g);
      T.el("path", { ...line, d: "M-46,0 L-38,-130 L38,-130 L46,0 Z", fill: "#5f7a6a" }, can);
      const lid = T.el("rect", { ...line, x: -50, y: -150, width: 100, height: 22, rx: 6, fill: "#6f8a7a" }, can);
      T.el("path", { ...thin, d: "M-20,-110 l-4,90 M0,-110 l0,90 M20,-110 l4,90", fill: "none" }, can);
      const hyd = T.el("g", { transform: `translate(310,${G + 20})` }, g);
      T.el("path", { ...line, d: "M-24,0 L-24,-70 Q0,-100 24,-70 L24,0 Z M-38,-50 l14,0 M24,-50 l14,0", fill: "#c94f3f" }, hyd);

      // the dimensional tear: jagged rip with layered glow, plus debris pulled toward it
      const tear = T.el("g", {}, g);
      const glowOuter = T.el("path", { fill: P.tearHot, opacity: 0.55 }, tear);
      const glowMid = T.el("path", { fill: P.tear }, tear);
      const core = T.el("path", { fill: P.tearCore, ...thin }, tear);
      const debris = Array.from({ length: 9 }, (_, i) => T.el("path", { ...thin, fill: ["#c9b79a", "#7c8b9a", "#d9534f"][i % 3] }, g));
      const TX = W - 250, TY = G - 560;
      const rip = (sc, seed, k) => {
        let d = "";
        const n = 14;
        for (let i = 0; i <= n; i++) {
          const a = (i / n) * Math.PI * 2;
          const jag = 1 + (i % 2 ? 0.34 : -0.12) + T.hash(seed, i + k) * 0.18;
          d += `${i ? "L" : "M"}${(TX + Math.cos(a) * 95 * sc * jag).toFixed(1)},${(TY + Math.sin(a) * 210 * sc * jag).toFixed(1)} `;
        }
        return d + "Z";
      };

      return {
        update(t) {
          const k = Math.floor(t * 8); // the rip re-jags 8×/s: crackling, not smooth
          const pulse = 1 + Math.sin(t * 3) * 0.05;
          glowOuter.setAttribute("d", rip(1.35 * pulse, 11, k));
          glowMid.setAttribute("d", rip(1.0 * pulse, 12, k));
          core.setAttribute("d", rip(0.55, 13, k));
          debris.forEach((dn, i) => {
            const r = T.rng(i * 17 + 3), ph = (t * (0.25 + r() * 0.2) + r()) % 1;
            const a0 = r() * Math.PI * 2, rad = (1 - ph) * (260 + r() * 120);
            const x = TX + Math.cos(a0 + ph * 6) * rad, y = TY + Math.sin(a0 + ph * 6) * rad * 1.3;
            const s = 12 * (1 - ph * 0.8);
            dn.setAttribute("d", `M${(x - s).toFixed(1)},${(y - s * 0.6).toFixed(1)} l${(s * 2).toFixed(1)},${(s * 0.4).toFixed(1)} l${(-s * 0.6).toFixed(1)},${(s * 1.2).toFixed(1)} Z`);
          });
          litA.concat(litB).forEach((w, i) => w && w.setAttribute("fill", Math.floor(t * 0.5 + i) % 7 === 3 ? P.windowOff : P.window));
          flag.setAttribute("transform", `rotate(${Math.floor(t * 2) % 2 ? -8 : 0} 42 -130)`);
          lid.setAttribute("transform", `rotate(${Math.max(0, Math.sin(t * 1.3)) > 0.97 ? -12 : 0} -50 -150)`);
          cone.setAttribute("opacity", T.hash(3, Math.floor(t * 12)) > -0.92 ? "0.16" : "0.06"); // occasional lamp flicker
        },
      };
    },
  };
})(window);
