/**
 * scenes.js — shared film grammar: title card, end card, iris / fade transitions.
 * Looks come from the style's `cards` theme, so every style gets bookends for free.
 *
 *   const ends = Toon.scenes.bookends(look.overlay, {
 *     width, height, duration, title, subtitle, theme: style.cards,
 *   });
 *   // in render(t):  ends.update(t, { x, y })   // focus point for the closing iris
 *
 * theme (style.cards):
 *   bg, fg            card colours
 *   font              CSS font-family
 *   frame             "double" | "ornament" | "none"
 *   transition        "iris" | "fade"
 *   transitionColor   colour of the iris / fade
 *   titleWeight, titleStyle, kickerSpacing, upper
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  function text(parent, s, x, y, size, theme, extra = {}) {
    const n = T.el("text", { x, y, "text-anchor": "middle", fill: theme.fg, "font-family": theme.font, "font-size": size, ...extra }, parent);
    n.textContent = s;
    return n;
  }

  function frame(g, W, H, theme) {
    if (theme.frame === "double") {
      T.el("rect", { x: 90, y: 560, width: W - 180, height: 800, rx: 40, fill: "none", stroke: theme.fg, "stroke-width": 8 }, g);
      T.el("rect", { x: 120, y: 590, width: W - 240, height: 740, rx: 26, fill: "none", stroke: theme.fg, "stroke-width": 3 }, g);
    } else if (theme.frame === "ornament") {
      // scalloped arch, like a shadow-theatre proscenium
      let d = `M110,1360 L110,700 Q110,560 250,560 L${W - 250},560 Q${W - 110},560 ${W - 110},700 L${W - 110},1360 Z`;
      T.el("path", { d, fill: "none", stroke: theme.fg, "stroke-width": 6 }, g);
      for (let i = 0; i < 13; i++) T.el("circle", { cx: 170 + i * ((W - 340) / 12), cy: 520, r: 14, fill: theme.fg }, g);
    } else if (theme.frame === "bar") {
      T.el("rect", { x: 0, y: 820, width: W, height: 14, fill: theme.accent || theme.fg }, g);
      T.el("rect", { x: 0, y: 1190, width: W, height: 14, fill: theme.accent || theme.fg }, g);
    }
  }

  function titleCard(parent, { width: W, height: H, title, subtitle, theme }) {
    const g = T.el("g", {}, parent);
    T.el("rect", { x: -60, y: -60, width: W + 120, height: H + 120, fill: theme.bg }, g);
    frame(g, W, H, theme);
    const up = (s) => (theme.upper ? s.toUpperCase() : s);
    text(g, up("cartoonforge"), W / 2, 760, 58, theme, { "letter-spacing": theme.kickerSpacing ?? 14 });
    text(g, "presents", W / 2, 838, 42, theme, { "font-style": "italic" });
    text(g, title, W / 2, 1010, Math.min(112, Math.floor(1560 / Math.max(1, title.length))), theme, { "font-weight": theme.titleWeight ?? "bold", "font-style": theme.titleStyle ?? "normal" });
    if (subtitle) text(g, `— ${subtitle} —`, W / 2, 1160, 36, theme, { "font-style": "italic" });
    return g;
  }

  function endCard(parent, { width: W, height: H, theme, text: main = "The End", sub = "made with code · github / cartoonforge" }) {
    const g = T.el("g", { opacity: 0 }, parent);
    text(g, main, W / 2, 940, 110, theme, { "font-style": "italic", "font-weight": "bold" });
    text(g, sub, W / 2, 1040, 34, theme);
    return g;
  }

  const irisPath = (W, H, cx, cy, r) =>
    `M-60,-60 H${W + 60} V${H + 60} H-60 Z M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z`;

  /**
   * Opening title card (0 → titleEnd) and closing transition + end card (last `outro` seconds).
   * Returns { update(t, focus) } where focus = {x, y} is where the closing iris closes.
   */
  function bookends(parent, { width: W, height: H, duration, title, subtitle, theme, titleEnd = 1.6, outro = 1.4 }) {
    const tc = theme.transitionColor || "#0b0a09";
    const cover = T.el("path", { fill: tc, "fill-rule": "evenodd" }, parent);
    const card = titleCard(parent, { width: W, height: H, title, subtitle, theme });
    const end = endCard(parent, { width: W, height: H, theme: { ...theme, fg: theme.endFg || theme.fg } });
    const D = duration;
    return {
      update(t, focus = { x: W / 2, y: H / 2 }) {
        card.setAttribute("opacity", String(1 - T.seg(t, titleEnd - 0.3, titleEnd - 0.15)));
        if (theme.transition === "fade") {
          const a = t < titleEnd ? 1 - T.seg(t, titleEnd - 0.3, titleEnd) : T.seg(t, D - outro, D - 0.55);
          cover.setAttribute("d", irisPath(W, H, W / 2, H / 2, 0));
          cover.setAttribute("opacity", a.toFixed(3));
        } else {
          const r = t < titleEnd
            ? T.track(t, [[titleEnd - 0.3, 0], [titleEnd, 1300, "outQuad"]])
            : T.track(t, [[D - outro, 1300], [D - 0.8, 230, "inOutSine"], [D - 0.55, 0, "inQuad"]]);
          const f = t < titleEnd + 3 ? { x: W / 2, y: focus.y } : focus;
          cover.setAttribute("d", irisPath(W, H, f.x, f.y, Math.max(0, r)));
        }
        end.setAttribute("opacity", T.seg(t, D - 0.55, D - 0.4).toFixed(2));
      },
    };
  }

  T.scenes = { titleCard, endCard, bookends, irisPath };
})(window);
