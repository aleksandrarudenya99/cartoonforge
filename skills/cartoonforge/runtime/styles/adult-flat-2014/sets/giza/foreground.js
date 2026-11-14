/** Set GIZA — FOREGROUND: a little scarab beetle crossing the sand, heat shimmer specks. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("giza").foreground = {
    build({ g, theme, width: W, height: H }) {
      const b = T.el("g", {}, g);
      T.el("ellipse", { cx: 0, cy: 0, rx: 30, ry: 22, fill: "#2f6a5a", ...X.ink(theme, 0.7) }, b);
      T.el("path", { d: "M0,-22 L0,22", ...X.ink(theme, 0.5) }, b);
      T.el("circle", { cx: 32, cy: 0, r: 10, fill: "#2f6a5a", ...X.ink(theme, 0.6) }, b);
      const legs = T.el("path", { fill: "none", ...X.ink(theme, 0.5) }, b);
      return { update(t) { const k = Math.floor(t * 10) % 2 ? 6 : -6; legs.setAttribute("d", `M-14,18 l${k},14 M8,20 l${-k},14 M-14,-18 l${k},-14 M8,-20 l${-k},-14`); b.setAttribute("transform", `translate(${W - 200 + ((t * 30) % 160)},${H - 160}) rotate(-8)`); } };
    },
  };
})(window);
