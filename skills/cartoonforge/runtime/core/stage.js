/**
 * stage.js — the shared component every style plugs into.
 *
 * A layered style is split into parts, each in its own file:
 *   theme       palette, line, type, motion            (styles/<s>/style.js)
 *   background  sky and far scenery                     (styles/<s>/background.js)
 *   details     mid-ground props and small details      (styles/<s>/details.js)
 *   character   HOW any character is drawn in the style (styles/<s>/character.js)
 *   foreground  close elements in front of characters   (styles/<s>/foreground.js)
 *   fx          film texture (from core/fx.js)          (styles/<s>/style.js → fx)
 *
 * Toon.stage builds the layer stack in a fixed order and calls each part:
 *
 *   back  →  background   (part.build(ctx) → { update(t, beat) })
 *   mid   →  details
 *   chars →  characters    (characters are added by the film / cast)
 *   front →  foreground
 *   overlay → captions, cards, transitions
 *   fxTop  → grain, vignette…   (fixed to the frame)
 *
 * ctx passed to every part: { T, g (its layer), look, theme, width, height, ground, defs, layers, scene }
 * `scene` picks one of the style's sets (e.g. street, desert, garage) when the style has several;
 * pass an array to build several and switch with stage.showScene(name).
 * `layers` lets a part draw into a neighbour layer when needed (e.g. a rift glow behind characters).
 *
 * Legacy single-file styles (install + scenery) still work: stage wraps them.
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  function stage(svg, style, { width, height, ground, scene }) {
    // legacy style: one install() + one scenery()
    if (!style.parts) {
      const look = style.install(svg, { width, height });
      const world = style.scenery(look, { width, height, ground });
      return {
        look, layers: { back: look.scene, mid: look.scene, chars: look.scene, front: look.scene, overlay: look.overlay },
        update(t, beat) { look.update(t); world.update(t, { beat }); },
      };
    }

    const theme = style.theme;
    const look = T.fx.stack(svg, { width, height, background: theme.palette.bg }, style.fx || (() => []));
    const g = look.scene;
    const layers = {
      back: T.el("g", { "data-layer": "background" }, g),
      mid: T.el("g", { "data-layer": "details" }, g),
      chars: T.el("g", { "data-layer": "characters" }, g),
      front: T.el("g", { "data-layer": "foreground" }, g),
      overlay: look.overlay,
    };
    const ctx = (layer, name) => ({ T, g: layers[layer], look, theme, width, height, ground, defs: look.defs, layers, scene: name });
    // one or several sets: each set gets its own sub-group per layer, only one is shown at a time
    const names = Array.isArray(scene) ? scene : [scene || style.defaultScene];
    const sets = names.map((name) => {
      const groups = [], built = [];
      for (const [part, layer] of [["background", "back"], ["details", "mid"], ["foreground", "front"]]) {
        const sub = T.el("g", { "data-scene": name }, layers[layer]);
        groups.push(sub);
        const b = style.parts[part] ? style.parts[part].build({ ...ctx(layer, name), g: sub }) : null;
        if (b) built.push(b);
      }
      return { name, groups, built };
    });
    let current = 0;
    const showScene = (which) => {
      const i = typeof which === "number" ? which : Math.max(0, names.indexOf(which));
      if (i === current && sets[i].shown) return;
      sets.forEach((s, k) => { s.shown = k === i; for (const g of s.groups) g.setAttribute("display", k === i ? "inline" : "none"); });
      current = i;
    };
    showScene(0);

    return {
      look, layers, theme, scenes: names,
      get scene() { return names[current]; },
      /** switch the visible set (name or index) — for films that travel between places */
      showScene,
      /** draw one character from a spec with this style's character rules */
      cast(spec, opts = {}) {
        const kit = T.characters.kit;
        return kit.build(opts.parent || layers.chars, spec, style.parts.character.rules, { theme, defs: look.defs, ...opts });
      },
      /** show only some layers (for breakdown sheets): stage.only(["back","mid"]) */
      only(names) {
        for (const k of ["back", "mid", "chars", "front"]) layers[k].setAttribute("opacity", !names || names.includes(k) ? "1" : "0");
      },
      update(t, beat) {
        look.update(t);
        for (const b of sets[current].built) b.update && b.update(t, beat);
      },
    };
  }

  T.stage = stage;
})(window);
