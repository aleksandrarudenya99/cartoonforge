/**
 * Style pack: Adult Flat Comedy · 2010s — LAYERED pilot style.
 *
 * Files in this folder (each is one part, see core/stage.js):
 *   style.js       theme (palette, line, type, cards, captions) + fx + loads the parts below
 *   background.js  alien night sky, planets, far hills
 *   details.js     suburban street: houses, lamp, fence, mailbox, the dimensional tear
 *   character.js   HOW characters are drawn: proportions, head, eyes, nose, mouth, hands, line
 *   foreground.js  curb, grass tufts, litter, sidewalk crack
 *   motion.js      timing, deadpan acting, talking (mouth chart), blinking, walk, transitions
 *
 * Genre look of adult animated comedy (not any specific series): flat colour, thin even line,
 * muted everyday suburbia vs acid sci-fi accents, deadpan limited acting.
 */
(function (global) {
  "use strict";
  const T = global.Toon;
  const SLUG = "adult-flat-2014";

  const palette = {
    bg: "#1b2a3a",
    skyTop: "#14263b", skyMid: "#2c3f5e", skyLow: "#6b5a7a", horizon: "#b98a86",
    planet: "#d9a35b", planetShade: "#b8823f", ring: "#e8c98a", moon: "#cfd8c4",
    hills: "#2f3d4f", houseA: "#c9b79a", houseB: "#8fa3a8", roof: "#5b4a4a", trim: "#efe6d2",
    window: "#ffd98a", windowOff: "#3e4a5a", lawn: "#4f6b45", lawnDark: "#3c5536", sidewalk: "#a39e93", road: "#55565c",
    ink: "#1c1c1c", white: "#fbfaf6",
    tear: "#38f2d0", tearHot: "#f04fd8", tearCore: "#fdfcff",
  };

  const theme = {
    slug: SLUG,
    palette,
    line: { width: 4.5, color: palette.ink },
    font: "'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif",
    motion: { drawingsPerSecond: 12, filmFps: 24, bpm: 110, lineWidth: 4.5 },
  };

  const caption = { y: 360, size: 64, font: theme.font, weight: "bold", style: "normal", fill: palette.white, stroke: palette.ink, strokeWidth: 12, maxWidth: 900 };
  const cards = { bg: palette.ink, fg: palette.white, accent: palette.tear, font: theme.font, frame: "none", transition: "fade", transitionColor: palette.ink, upper: false };

  /** fx: flat look — no grain, almost no vignette, a tiny line wobble on the drawn layers. */
  const fx = (F, L) => [
    F.boil(L, { scale: 1.6, freq: 0.03, loop: 3, dps: 12 }),
    F.vignette(L, { color: "#000", strength: 0.22, inner: 62 }),
  ];

  const style = { slug: SLUG, theme, palette, caption, cards, fx, parts: {}, motion: theme.motion, skin: { ink: palette.ink, white: palette.white, lineWidth: 4.5 } };
  T.styles = T.styles || {};
  T.styles[SLUG] = style;

  // load the parts (classic scripts, in order, synchronously during parsing)
  const base = document.currentScript.src.replace(/style\.js(\?.*)?$/, "");
  for (const part of ["background", "details", "character", "foreground", "motion"]) {
    document.write(`<script src="${base}${part}.js"><\/script>`);
  }
})(window);
