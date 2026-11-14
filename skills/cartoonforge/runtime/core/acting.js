/**
 * acting.js — shared performance engine: talking, blinking, breathing, gestures, walking.
 * A style's motion part only sets PARAMETERS; this file turns them into poses. Deterministic.
 *
 *   const act = Toon.acting(style.parts.motion.rules, { captions: CF.captions, seed: 3 });
 *   const a = act.at(t, { walking, speed });   // → { mouth, blink, headTilt, headBob, browUp, breathe,
 *                                               //     lean, stepL, stepR, handL, handR, talking }
 *   character.pose({ x, y, ...a, t });
 *
 * MOTION RULES (style.parts.motion.rules):
 *   timing   { dps, holdMin, ease }                 drawings per second, min hold, default ease
 *   talk     { shapes: [0, .35, .7, 1], rate, mode, jaw, headBob, browOnStress, gestureEvery, gestureSize }
 *              mode: "flap" (random open/close per syllable) | "vowel" (opens on vowels) | "snap" (holds then snaps)
 *   blink    { every, dur, double }                  seconds between blinks, blink length, chance of a double blink
 *   idle     { breathe, sway, slouch }               breathing amount, body sway, constant lean
 *   walk     { stride, bob, armSwing, bounce, lean }
 *   gesture  { hold, rest }                          gesture pose holds
 *   secondary{ lag }                                  hair / scarf lag (rig reads t)
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  const DEFAULT = {
    timing: { dps: 12, holdMin: 0.25, ease: "inOutSine" },
    talk: { shapes: [0, 0.35, 0.7, 1], rate: 10, mode: "vowel", jaw: 1, headBob: 2, browOnStress: 0.6, gestureEvery: 1.6, gestureSize: 1 },
    blink: { every: 3.2, dur: 0.12, double: 0.2 },
    idle: { breathe: 0.012, sway: 1.2, slouch: 0 },
    walk: { stride: 46, bob: 10, armSwing: 40, bounce: 0.04, lean: 2 },
    gesture: { hold: 0.6 },
  };
  const merge = (a, b) => { const o = { ...a }; for (const k in b || {}) o[k] = typeof b[k] === "object" && !Array.isArray(b[k]) ? { ...a[k], ...b[k] } : b[k]; return o; };

  function acting(rulesIn, { captions = [], seed = 1 } = {}) {
    const R = merge(DEFAULT, rulesIn);
    const vowels = /[aeiouyаеёиоуыэюя]/i;

    // syllable-ish timeline per cue: one beat per vowel group, deterministic
    const beats = captions.map((c, ci) => {
      const groups = c.text.match(/[aeiouyаеёиоуыэюя]+/gi) || ["a"];
      const n = Math.max(1, groups.length);
      const step = (c.end - c.start) / n;
      return { ...c, n, step, ci, stress: c.text.split(/\s+/).map((w, i) => ({ i, long: w.length > 5 })) };
    });

    function mouthAt(t) {
      const cue = beats.find((b) => t >= b.start && t < b.end);
      if (!cue) return { m: 0, talking: false, cue: null };
      const k = (t - cue.start) / cue.step, i = Math.floor(k), ph = k - i;
      const S = R.talk.shapes;
      let m;
      if (R.talk.mode === "flap") {
        const pick = Math.floor(Math.abs(T.hash(seed * 31 + cue.ci, i)) * S.length);
        m = S[pick] * (ph < 0.7 ? 1 : 0.3);
      } else if (R.talk.mode === "snap") {
        m = ph < 0.5 ? S[S.length - 1] : S[1];
      } else { // vowel: open on the vowel, close between
        const peak = S[Math.min(S.length - 1, 1 + (Math.abs(T.hash(seed + cue.ci * 7, i)) * (S.length - 1)) | 0)];
        m = peak * Math.sin(Math.PI * Math.min(1, ph * 1.2));
      }
      // quantise to the style's mouth chart, changing only at the style's drawing rate
      const q = Math.floor(t * R.talk.rate) / R.talk.rate;
      if (q !== t) { /* stepped by rate below */ }
      return { m: m * R.talk.jaw, talking: true, cue, i };
    }

    function blinkAt(t) {
      const every = R.blink.every, n = Math.floor(t / every);
      const t0 = n * every + Math.abs(T.hash(seed + 5, n)) * every * 0.5;
      const d = R.blink.dur;
      let b = t >= t0 && t < t0 + d ? Math.sin((Math.PI * (t - t0)) / d) : 0;
      if (T.hash(seed + 9, n) > 1 - R.blink.double * 2) { const t1 = t0 + d * 1.6; if (t >= t1 && t < t1 + d) b = Math.sin((Math.PI * (t - t1)) / d); }
      return b;
    }

    return {
      rules: R,
      at(tRaw, { walking = false, phase } = {}) {
        const t = Math.floor(tRaw * R.timing.dps + 1e-6) / R.timing.dps; // style drawing rate
        const tq = Math.floor(tRaw * R.talk.rate + 1e-6) / R.talk.rate;  // mouth chart rate
        const { m, talking, cue, i } = mouthAt(tq);
        const blink = blinkAt(t);
        const breathe = Math.sin(t * 2 * Math.PI * 0.25) * R.idle.breathe;
        const sway = Math.sin(t * 0.9 + seed) * R.idle.sway;
        const out = { mouth: m, blink, talking, squash: breathe, lean: R.idle.slouch + sway, headTilt: 0, headBob: 0, browUp: 0, handL: { x: 0, y: 0 }, handR: { x: 0, y: 0 } };

        if (talking) {
          // head bobs on syllables, brows lift on stressed (long) words, a hand gesture every N seconds
          out.headTilt = Math.sin(i * 1.7 + seed) * R.talk.headBob;
          out.browUp = cue && /[!?]/.test(cue.text) ? R.talk.browOnStress : 0;
          const g = Math.floor((t - cue.start) / R.talk.gestureEvery);
          const gs = R.talk.gestureSize, which = Math.abs(T.hash(seed + 21, g + cue.ci * 10));
          if (which > 0.35) out.handR = { x: -40 * gs, y: -150 * gs * (0.6 + which * 0.4) };
          if (which > 0.75) out.handL = { x: 30 * gs, y: -110 * gs };
        }
        if (walking) {
          const s = Math.sin(phase ?? t * Math.PI * 2);
          out.stepL = { x: s * R.walk.stride, y: -Math.max(0, s) * R.walk.stride };
          out.stepR = { x: -s * R.walk.stride, y: -Math.max(0, -s) * R.walk.stride };
          out.handL = { x: -s * R.walk.armSwing, y: -Math.abs(s) * 14 };
          out.handR = { x: s * R.walk.armSwing, y: -Math.abs(s) * 14 };
          out.squash += -R.walk.bounce * Math.abs(Math.cos(phase ?? t * Math.PI * 2));
          out.lean += R.walk.lean + s * 2;
          out.y = -Math.abs(s) * R.walk.bob;
        }
        return out;
      },
    };
  }

  T.acting = acting;
})(window);
