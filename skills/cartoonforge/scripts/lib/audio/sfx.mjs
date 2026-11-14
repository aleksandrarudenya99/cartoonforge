/**
 * sfx.mjs — synthesized sound effects and ambiences (no samples: original and free to use).
 *
 *   import { renderSfx } from "./sfx.mjs";
 *   const samples = renderSfx([{ name: "vortex", at: 4.2 }, { name: "rain", at: 4.5, dur: 3 }], 24);
 *
 * Each effect writes into a Track (instruments.mjs). One-shots ignore `dur`; ambiences fill it.
 * `gain` scales any effect. Adult-animation sound design leans on these: dry dialogue up front,
 * cartoon one-shots on the action, quiet place-ambience under it, a synth swoosh on every portal.
 */
import { SR, Track, hz, rng } from "./instruments.mjs";

const TAU = Math.PI * 2;
/** one-pole low-pass state helper */
const lp = (k) => { let y = 0; return (x) => (y += k * (x - y)); };
const fadeEnv = (s, dur, a = 0.15, r = 0.3) => Math.min(1, s / a) * Math.min(1, Math.max(0, (dur - s) / r));

export const SFX = {
  /** portal: rising filtered noise + warbling synth glide + soft low thump at the peak */
  vortex(T, at, { gain = 1, seed = 1 }) {
    const r = rng(seed), f1 = lp(0.02), f2 = lp(0.2);
    const D = 0.9;
    T._render(at, D, (s) => {
      const k = s / D, bright = 0.03 + k * 0.35;
      const n = r() * 2 - 1, low = f1(n);
      const band = (f2(n) - low) * (0.3 + bright);
      const glide = 180 * Math.pow(6, Math.sin(Math.PI * k * 0.9));
      const wob = Math.sin(TAU * glide * s + 3 * Math.sin(TAU * 7 * s)) * 0.25;
      return (band * 0.9 + wob) * Math.sin(Math.PI * k) * 0.5 * gain;
    });
    T._render(at + D * 0.45, 0.6, (s) => Math.sin(TAU * (70 - s * 40) * s) * Math.exp(-s * 6) * 0.45 * gain);
  },
  /** cartoon hop: quick upward sine slide */
  boing(T, at, { gain = 1 }) {
    T._render(at, 0.28, (s) => Math.sin(TAU * (260 + s * 1400) * s + 4 * Math.sin(TAU * 18 * s)) * Math.exp(-s * 9) * 0.22 * gain);
  },
  /** end sting: a detuned minor chord swelling then decaying */
  sting(T, at, { gain = 1 }) {
    for (const m of [57, 60, 64, 69]) T.pad(at, m, 1.4, 0.05 * gain);
    T.bell(at + 0.05, 81, 0.12 * gain);
  },
  /** rain: steady hiss with random drop ticks */
  rain(T, at, { dur = 3, gain = 1, seed = 2 }) {
    const r = rng(seed), f = lp(0.5), g = lp(0.04);
    T._render(at, dur, (s) => {
      const n = r() * 2 - 1, hi = f(n) - g(n);
      const tick = r() < 0.0015 ? (r() * 2 - 1) * 0.8 : 0;
      return (hi * 0.35 + tick) * fadeEnv(s, dur, 0.2, 0.25) * 0.5 * gain;
    });
  },
  /** big clock bell: low partials, long decay */
  bong(T, at, { gain = 1 }) {
    T._render(at, 3.5, (s) => {
      const env = Math.exp(-s * 1.1) * Math.min(1, s / 0.004);
      let v = 0;
      for (const [m, a] of [[1, 1], [2.0, 0.6], [2.76, 0.45], [5.4, 0.25], [0.5, 0.5]]) v += a * Math.sin(TAU * 196 * m * s);
      return v * env * 0.12 * gain;
    });
  },
  /** city rumble: low traffic noise with slow swells */
  city(T, at, { dur = 3, gain = 1, seed = 3 }) {
    const r = rng(seed), f = lp(0.01);
    T._render(at, dur, (s) => f(r() * 2 - 1) * 6 * (0.7 + 0.3 * Math.sin(TAU * 0.4 * s)) * fadeEnv(s, dur, 0.3, 0.3) * 0.35 * gain);
  },
  /** two-tone car horn, honk-honk */
  horn(T, at, { gain = 1, double = true }) {
    for (const [t0, d] of double ? [[0, 0.18], [0.26, 0.42]] : [[0, 0.4]]) {
      T._render(at + t0, d, (s) => {
        let v = 0;
        for (const f of [392, 494]) v += Math.sign(Math.sin(TAU * f * s)) * 0.5;
        return v * fadeEnv(s, d, 0.01, 0.04) * 0.09 * gain;
      });
    }
  },
  /** steam hiss in pulses */
  steam(T, at, { dur = 3, gain = 1, seed = 4 }) {
    const r = rng(seed), f = lp(0.6), g = lp(0.1);
    T._render(at, dur, (s) => { const n = r() * 2 - 1; return (f(n) - g(n)) * (0.5 + 0.5 * Math.sin(TAU * 0.7 * s) ** 2) * fadeEnv(s, dur) * 0.22 * gain; });
  },
  /** neon buzz: mains hum with harmonics, flickering */
  buzz(T, at, { dur = 3, gain = 1, seed = 5 }) {
    const r = rng(seed);
    let fl = 1;
    T._render(at, dur, (s, i) => {
      if (i % 800 === 0) fl = r() < 0.08 ? 0.2 : 1;
      let v = 0;
      for (const h of [1, 2, 3, 5]) v += Math.sin(TAU * 120 * h * s) / h;
      return v * fl * fadeEnv(s, dur) * 0.035 * gain;
    });
  },
  /** little jingle (vending machine / station chime) */
  chime(T, at, { gain = 1 }) {
    [84, 88, 91, 96].forEach((m, i) => T.bell(at + i * 0.11, m, 0.1 * gain));
  },
  /** robot bleeps: random square blips */
  bleeps(T, at, { gain = 1, seed = 6 }) {
    const r = rng(seed);
    for (let i = 0; i < 7; i++) T.square(at + i * 0.07, 76 + Math.floor(r() * 14), 0.05, 0.05 * gain, 0.25);
  },
  /** desert wind: low-passed noise that rises and falls */
  wind(T, at, { dur = 3, gain = 1, seed = 7 }) {
    const r = rng(seed), f = lp(0.02), g = lp(0.004);
    T._render(at, dur, (s) => { const n = r() * 2 - 1; return (f(n) - g(n)) * 3 * (0.4 + 0.6 * Math.sin(TAU * 0.3 * s + 1) ** 2) * fadeEnv(s, dur) * 0.4 * gain; });
  },
  /** sand gust: a short bright whoosh */
  gust(T, at, { gain = 1, seed = 8 }) {
    T.swish(at, 0.7, 0.22 * gain, seed);
  },
  /** sea waves: slow swells of filtered noise */
  waves(T, at, { dur = 3, gain = 1, seed = 9 }) {
    const r = rng(seed), f = lp(0.05), g = lp(0.006);
    T._render(at, dur, (s) => { const n = r() * 2 - 1, sw = Math.max(0, Math.sin(TAU * 0.28 * s)) ** 2; return (f(n) - g(n)) * 2.2 * (0.2 + sw) * fadeEnv(s, dur) * 0.4 * gain; });
  },
  /** pigeon coo: three warbly low notes */
  coo(T, at, { gain = 1 }) {
    [[0, 0.32, 330], [0.36, 0.22, 300], [0.62, 0.42, 340]].forEach(([t0, d, f]) =>
      T._render(at + t0, d, (s) => Math.sin(TAU * (f - 50 * (s / d)) * s + 1.5 * Math.sin(TAU * 25 * s)) * Math.sin(Math.PI * (s / d)) * 0.11 * gain));
  },
  /** street accordion: a short waltz phrase on the reed synth */
  accordion(T, at, { gain = 1 }) {
    const notes = [[69, 0.3], [72, 0.3], [76, 0.6], [74, 0.3], [72, 0.3], [71, 0.6], [69, 0.9]];
    let t = at;
    for (const [m, d] of notes) { T.reed(t, m, d * 0.95, 0.05 * gain); t += d; }
    for (let b = 0; b < 4; b++) { T.reed(at + b * 0.9, 45, 0.25, 0.04 * gain); T.reed(at + b * 0.9 + 0.3, 64, 0.2, 0.025 * gain); T.reed(at + b * 0.9 + 0.6, 64, 0.2, 0.025 * gain); }
  },
  /** samba groove: surdo + shaker + agogô for a bar or two */
  samba(T, at, { dur = 1.6, gain = 1, seed = 10 }) {
    const step = 0.125;
    for (let i = 0; i * step < dur; i++) {
      const t = at + i * step;
      T.hat(t, (i % 2 ? 0.035 : 0.06) * gain, seed + i);
      if (i % 8 === 4) T.taiko(t, 0.45 * gain, 55);
      if (i % 8 === 0) T.taiko(t, 0.25 * gain, 75);
      if ([2, 5, 7].includes(i % 8)) T.bell(t, i % 8 === 7 ? 86 : 81, 0.05 * gain);
    }
  },
  /** water lapping against stone */
  lap(T, at, { dur = 3, gain = 1, seed = 11 }) {
    const r = rng(seed), f = lp(0.08), g = lp(0.01);
    T._render(at, dur, (s) => { const n = r() * 2 - 1, k = Math.max(0, Math.sin(TAU * 0.8 * s)) ** 6; return (f(n) - g(n)) * k * 1.6 * fadeEnv(s, dur) * gain * 0.4; });
  },
  /** oar splash */
  splash(T, at, { gain = 1, seed = 12 }) {
    T.noise(at, 0.4, 0.3 * gain, seed, 0, 9);
  },
  /** mandolin tremolo phrase */
  mandolin(T, at, { gain = 1, seed = 13 }) {
    const notes = [76, 79, 77, 76, 74, 76];
    notes.forEach((m, i) => { for (let k = 0; k < 6; k++) T.pluck(at + i * 0.3 + k * 0.05, m, 0.08 * gain, seed + i * 7 + k); });
  },
};

/** render a list of { name, at, dur?, gain?, …opts } into a Float32Array of `seconds` */
export function renderSfx(list, seconds) {
  const T = new Track(seconds);
  for (const e of list) {
    const fn = SFX[e.name];
    if (!fn) { console.warn(`! unknown sfx "${e.name}" (have: ${Object.keys(SFX).join(", ")})`); continue; }
    fn(T, e.at, e);
  }
  return T.buf;
}
export const SFX_NAMES = Object.keys(SFX);
export { SR, hz };
