/**
 * Adult Flat Comedy — CHARACTER RULES: how ANY character is drawn in this style.
 * (The character itself — hair, outfit, colours, props — comes from the user's spec.)
 *
 * The look (from studying reference frames of the genre):
 *   - big round head on a thin neck, adult body of normal length, thin tube limbs, slight slouch
 *   - eyes: big white circles set WIDE apart, slightly different sizes, tiny irregular speck pupils
 *     drifting outward; heavy lids for tired / unimpressed looks
 *   - brows: thin, high, worried; nose: small open "C"; ears: "C" curves
 *   - mouth: small sulky line; open = dark red with a top row of teeth and a tongue
 *   - hands: 4 long thin separate fingers
 *   - clothes: simple shapes with a couple of crease lines
 *   - line: thin, even, near-black; NO shading on characters — flat fills only
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  T.styles["adult-flat-2014"].parts.character = {
    rules: {
      // adult proportions: big round head (~1:4.5 of height), normal-length thin body, slight slouch
      proportions: { headR: 112, headShape: "round", torsoH: 245, torsoW: 160, hipW: 132, legLen: 330, limbW: 18, neckLen: 30, neckW: 30, handR: 22, footL: 64, scale: 1 },
      line: { width: 3.6, color: "#161616" },
      // eyes: big white circles set WIDE apart (not touching), slightly different sizes,
      // tiny irregular specks for pupils that drift a little outward
      eyes: { type: "bigRound", size: 36, gap: 46, sizes: [1, 0.93], pupil: "speck", pupilSize: 3.2, diverge: 0.12, y: -0.16, lidRest: 0, bags: false, lineWidth: 3.2 },
      brows: { type: "worried", width: 3 },      // thin, high on the forehead, inner ends lifted
      nose: { type: "c" },                       // a small open C curve
      mouth: { type: "toothy", width: 56 },      // sulky little line; opens dark red with teeth + tongue
      hands: { type: "fingers", fingers: 4 },    // long thin separate fingers
      ears: "c",
      folds: true,                               // a couple of crease lines on clothes
      limbs: { type: "tube" },
      hair: { scale: 1 },
      shading: { type: "none" },                 // flat fills on characters
    },
  };
})(window);
