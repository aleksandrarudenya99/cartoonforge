/**
 * Adult Flat Comedy — CHARACTER RULES: how ANY character is drawn in this style.
 * (The character itself — hair, outfit, colours, props — comes from the user's spec.)
 *
 * The look:
 *   - head wider than tall, sits on a thin neck; body narrow, limbs thin tubes
 *   - eyes: two big white circles almost touching, tiny dot pupils of slightly different sizes
 *   - nose: a single curved bump line; mouth: a wide flat line, opens into a wide shape
 *   - hands: 4 fingers (3 + thumb), simple rounded mitten
 *   - line: thin, even, near-black; NO shading, NO texture — flat fills only
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  T.styles["adult-flat-2014"].parts.character = {
    rules: {
      proportions: { headR: 118, headShape: "wideOval", torsoH: 225, torsoW: 168, hipW: 136, legLen: 290, limbW: 19, neckLen: 38, neckW: 32, handR: 22, footL: 66, scale: 1 },
      line: { width: 4.5, color: "#1c1c1c" },
      eyes: { type: "bigRound", size: 31, gap: 31, pupilSize: 4.6, y: -0.1 },
      brows: { type: "line", width: 4 },
      nose: { type: "bump" },
      mouth: { type: "wide", width: 72 },
      hands: { type: "mitten", fingers: 4 },
      limbs: { type: "tube" },
      hair: { scale: 1 },
      shading: { type: "none" },
    },
  };
})(window);
