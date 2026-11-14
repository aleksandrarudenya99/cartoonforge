/**
 * Nova — the TEST character (for checking styles, not a product mascot).
 * Chosen because she has many parts each style must reinterpret: a hair bun with loose
 * strands, round glasses, a scarf that swings, an open jacket over a shirt with a patch,
 * a backpack with straps, sneakers with a stripe, and a blinking gadget in her hand.
 * A user's character spec uses the same fields (see characters/README.md).
 */
(function (global) {
  "use strict";
  const T = global.Toon;
  T.characters = T.characters || {};
  T.characters.test = T.characters.test || {};
  T.characters.test.nova = {
    name: "Nova",
    kind: "human",
    skin: "#f2c7a5",
    eyes: "#6a4a2a",
    hair: { type: "bun", color: "#4a2f5c", strands: 3 },
    glasses: { color: "#2a2a2a" },
    freckles: true,
    outfit: { jacket: "#e8833a", shirt: "#f4f0e6", pants: "#2f4a6d", shoes: "#ecebe6", scarf: "#3fae9a", accent: "#ffd23f", gadget: "#9aa4ad" },
    backpack: "#6b4b8a",
    prop: "gadget",
  };
})(window);
