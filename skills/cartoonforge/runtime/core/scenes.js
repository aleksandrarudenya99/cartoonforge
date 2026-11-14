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

  /**
   * Transition between two shots. Returns { update(t) } that covers the frame around `at`.
   *   type: cut | fade | iris | wipe | tear | swirl
   *   tear  = a jagged rip sweeps across (sci-fi / adult comedy)
   *   swirl = a spiral closes and opens (whimsical)
   */
  function transition(parent, { width: W, height: H, at, dur = 0.5, type = "fade", color = "#000", glow = null, vortex = null }) {
    const g = T.el("g", { opacity: 0 }, parent);
    const cover = T.el("path", { fill: color }, g);
    const edge = glow ? T.el("path", { fill: "none", stroke: glow, "stroke-width": 18, "stroke-linejoin": "round", opacity: 0.9 }, g) : null;
    return {
      update(t) {
        const k = (t - (at - dur / 2)) / dur; // 0 → 1 across the transition
        if (type === "cut" || k <= 0 || k >= 1) { g.setAttribute("opacity", "0"); return; }
        g.setAttribute("opacity", "1");
        const cl = k < 0.5 ? k * 2 : (1 - k) * 2; // 0 → 1 → 0 coverage
        if (type === "fade") { cover.setAttribute("d", `M-60,-60 H${W + 60} V${H + 60} H-60 Z`); g.setAttribute("opacity", cl.toFixed(3)); }
        else if (type === "iris") cover.setAttribute("d", irisPath(W, H, W / 2, H / 2, (1 - cl) * 1300));
        else if (type === "wipe") { const x = k < 0.5 ? -60 : -60 + (k - 0.5) * 2 * (W + 120); const w = k < 0.5 ? cl * (W + 120) : W + 60 - x; cover.setAttribute("d", `M${x},-60 h${w} V${H + 60} H${x} Z`); }
        else if (type === "tear") {
          // jagged vertical rip; seeded so the same jag shows for the whole transition
          const front = k < 0.5 ? -60 + cl * (W + 160) : W + 100;
          const back = k < 0.5 ? -60 : -60 + (k - 0.5) * 2 * (W + 160);
          let d = `M${back},-60 L${front},-60`;
          const pts = [];
          for (let y = -60, i = 0; y <= H + 60; y += 90, i++) pts.push([front + T.hash(77, i) * 50, y]);
          for (const [x, y] of pts) d += ` L${x.toFixed(0)},${y}`;
          d += ` L${back},${H + 60} Z`;
          cover.setAttribute("d", d);
          if (edge) edge.setAttribute("d", "M" + pts.map(([x, y]) => `${x.toFixed(0)},${y}`).join(" L"));
        } else if (type === "vortex") {
          // a swirling portal that opens from the centre to fill the frame, then closes on the new place
          if (!g.__vx) {
            const C = vortex || {};
            const gid = `vx-${Math.random().toString(36).slice(2, 7)}`;
            const gr = T.el("radialGradient", { id: gid }, g);
            [[0, C.dark || "#5a1a96", 1], [55, C.body || "#a94de8", 1], [82, C.rim || "#eac0ff", 1], [100, C.glow || "#d98cff", 0]].forEach(([o, c, a]) => T.el("stop", { offset: `${o}%`, "stop-color": c, "stop-opacity": a }, gr));
            const disc = T.el("ellipse", { fill: `url(#${gid})` }, g);
            const arms = T.el("g", {}, g);
            for (let k = 0; k < 3; k++) T.el("path", { d: T.shapes.spiral(0, 0, 100, 1.4, 1, (k * Math.PI * 2) / 3), fill: "none", stroke: k ? C.light || "#f6d9ff" : C.dark || "#5a1a96", "stroke-width": k ? 5 : 14, "stroke-linecap": "round", opacity: 0.85 }, arms);
            g.__vx = { disc, arms };
            cover.setAttribute("d", "");
          }
          const R = Math.pow(cl, 0.8) * 1250 + 1;
          g.__vx.disc.setAttribute("cx", W / 2); g.__vx.disc.setAttribute("cy", H * 0.42);
          g.__vx.disc.setAttribute("rx", (R * 0.85).toFixed(1)); g.__vx.disc.setAttribute("ry", (R * 1.25).toFixed(1));
          g.__vx.arms.setAttribute("transform", `translate(${W / 2},${H * 0.42}) scale(${(R * 0.008).toFixed(3)},${(R * 0.0115).toFixed(3)}) rotate(${(-t * 400).toFixed(1)})`);
        } else if (type === "swirl") {
          cover.setAttribute("d", irisPath(W, H, W / 2, H / 2, (1 - cl) * 1300));
          if (edge) edge.setAttribute("d", T.shapes.spiral(W / 2, H / 2, (1 - cl) * 900 + 40, 1.5, 1, t * 8));
        }
      },
    };
  }

  T.scenes = { titleCard, endCard, bookends, irisPath, transition };
})(window);
