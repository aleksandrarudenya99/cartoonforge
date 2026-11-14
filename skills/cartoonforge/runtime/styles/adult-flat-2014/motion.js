/**
 * Adult Flat Comedy — MOTION: timing, acting, talking, transitions.
 *
 * Feel: DEADPAN. Mostly still bodies, long holds, small head bobs while talking, bored
 * double-blinks, sudden snaps for gags. Walks are slumped with almost no bounce.
 *
 * Talking (mouth chart): 4 shapes — closed line · slightly open · open · wide yell.
 *   Mode "flap": the jaw picks a shape per syllable (not smooth), changing ~8×/s.
 *   The head barely moves; brows lift on questions/exclamations; a lazy hand gesture
 *   about every 2 s of speech.
 *
 * Transitions: hard cuts between shots (the default for TV comedy); a jagged "tear" rip
 * for sci-fi moments; the reel opens on a plain title card and closes with a fade.
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  T.styles["adult-flat-2014"].parts.motion = {
    rules: {
      timing: { dps: 12, holdMin: 0.4, ease: "outQuad" },
      talk: { shapes: [0, 0.3, 0.62, 1], rate: 8, mode: "flap", jaw: 0.9, headBob: 1.2, browOnStress: 0.5, gestureEvery: 2.2, gestureSize: 0.75 },
      blink: { every: 2.6, dur: 0.16, double: 0.35 },
      idle: { breathe: 0.008, sway: 0.5, slouch: -2 },
      walk: { stride: 34, bob: 4, armSwing: 22, bounce: 0.015, lean: 4 },
      gesture: { hold: 0.8 },
    },
    transitions: {
      between: { type: "cut" },
      special: { type: "tear", dur: 0.5, color: "#1c1c1c", glow: "#38f2d0" },
      open: { type: "cut" },
      close: { type: "fade" },
    },
  };
})(window);
