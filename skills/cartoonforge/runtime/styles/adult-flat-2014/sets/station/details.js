/**
 * Set STATION — DETAILS: hazard-stripe double doors with a blinking warning lamp, an alien
 * travel-ad screen with made-up glyphs, light slots, a vertical pipe, a round wall light, a vent.
 * Wall items are skewed toward the vanishing point.
 */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("station").details = {
    build({ g, theme, defs }) {
      const VX = 560, VY = 1100;
      T.el("rect", { x: 330, y: 830, width: 460, height: 430, fill: "#9aa3b0", ...X.ink(theme, 0.8) }, g);
      X.hazard(g, defs, theme, { x: 348, y: 852, w: 204, h: 398 });
      X.hazard(g, defs, theme, { x: 568, y: 852, w: 204, h: 398 });
      T.el("path", { d: "M560,840 L560,1260", ...X.ink(theme, 0.9) }, g);
      const warn = T.el("path", { d: "M530,826 q30,-34 60,0 Z", fill: "#f39a3a", ...X.ink(theme, 0.6) }, g);

      // left wall: alien travel-ad screen on poles + glyph caption
      const ad = T.el("g", { transform: X.wallSkew(150, 760, VX, VY) }, g);
      for (const x of [110, 190]) T.el("rect", { x, y: 380, width: 16, height: 240, fill: "#5d6470", ...X.ink(theme, 0.6) }, ad);
      T.el("path", { d: "M40,380 Q150,230 260,380 Z", fill: "#eef2f6", ...X.ink(theme, 0.7) }, ad);
      T.el("rect", { x: 20, y: 600, width: 260, height: 190, rx: 16, fill: "#c9d2dd", ...X.ink(theme, 0.8) }, ad);
      T.el("rect", { x: 36, y: 616, width: 228, height: 158, rx: 8, fill: "#c79ae8", ...X.ink(theme, 0.5) }, ad);
      T.el("path", { d: X.hillD(36, 264, 740, 40, { seed: 3, bumps: 2, bottom: 774 }), fill: "#7d5a74", ...X.ink(theme, 0.4) }, ad);
      T.el("path", { d: "M90,720 l24,-40 l24,40 Z", fill: "#e2533a", ...X.ink(theme, 0.4) }, ad);
      T.el("circle", { cx: 220, cy: 650, r: 14, fill: "#f2c8f0", ...X.ink(theme, 0.3) }, ad);
      X.glyphs(ad, theme, { x: 52, y: 668, n: 7, size: 24, color: "#b9f2ef", seed: 4, width: 3 });
      // light slots + vertical pipe on the left wall
      const slots = [];
      for (const [x, y] of [[214, 960], [262, 1010]]) { const s = T.el("g", { transform: X.wallSkew(x, y + 120, VX, VY) }, g); slots.push(...X.lightSlot(s, theme, { x: x - 13, y, w: 26, h: 240 })); }
      X.pipe(g, theme, "M290,700 L290,1300", 18, { step: 40 });
      // right wall: round light, vent, little green panel
      T.el("ellipse", { cx: 900, cy: 880, rx: 30, ry: 48, fill: "#f8fbff", ...X.ink(theme, 0.7) }, g);
      const vent = T.el("g", { transform: X.wallSkew(930, 1150, VX, VY) }, g);
      X.vent(vent, theme, { x: 890, y: 1080, w: 80, h: 150, n: 7 });
      const pan = T.el("g", { transform: X.wallSkew(950, 960, VX, VY) }, g);
      T.el("path", { d: "M880,980 L1010,950 L1010,990 L880,1010 Z", fill: "#5aa86a", ...X.ink(theme, 0.6) }, pan);
      for (let i = 0; i < 4; i++) T.el("path", { d: `M${900 + i * 28},990 q8,-14 16,0`, fill: "#bff0a0", ...X.ink(theme, 0.4) }, pan);
      return {
        update(t) {
          warn.setAttribute("fill", Math.floor(t * 2) % 2 ? "#f39a3a" : "#ffe08a");
          slots.forEach((s, i) => s.setAttribute("opacity", Math.floor(t * 6 + i * 3) % 7 === 0 ? "0.3" : "1"));
        },
      };
    },
  };
})(window);
