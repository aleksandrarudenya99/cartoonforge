/** Set LONDON — FOREGROUND: slanted rain over everything. */
(function (global) {
  "use strict";
  const T = global.Toon, AF = T.styles["adult-flat-2014"], X = AF.props;
  AF.set("london").foreground = {
    build({ g, width: W, height: H }) {
      const r = T.rng(7), drops = Array.from({ length: 70 }, () => ({ n: T.el("path", { d: "M0,0 l-10,44", stroke: "#e9eff4", "stroke-width": 3, "stroke-linecap": "round", opacity: (0.4 + r() * 0.5).toFixed(2) }, g), x: r() * (W + 200), y: r() * H, sp: 900 + r() * 500 }));
      return { update(t) { drops.forEach((d) => d.n.setAttribute("transform", `translate(${(d.x - ((t * d.sp * 0.22) % (W + 200))).toFixed(1)},${((d.y + t * d.sp) % (H + 60)) - 60})`)); } };
    },
  };
})(window);
