/**
 * instruments.mjs — tiny deterministic synths that write into a Float32 buffer.
 * Everything is generated (no samples), so the music is original and free to use.
 */
export const SR = 32000;

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let r = Math.imul(a ^ (a >>> 15), 1 | a);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
export const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

export class Track {
  constructor(seconds) {
    this.buf = new Float32Array(Math.ceil(seconds * SR));
  }
  _render(t, seconds, fn) {
    const start = Math.floor(t * SR);
    const n = Math.floor(seconds * SR);
    for (let i = 0; i < n && start + i < this.buf.length; i++) if (start + i >= 0) this.buf[start + i] += fn(i / SR, i);
  }

  /** piano: a few harmonics, fast attack, exponential decay; `detune` = honky-tonk */
  piano(t, midi, dur, vel = 0.3, detune = 0.004) {
    const f = hz(midi);
    this._render(t, dur + 0.4, (s) => {
      const env = Math.min(1, s / 0.004) * Math.exp(-s * (2.2 + midi / 40)) * (s > dur ? Math.exp(-(s - dur) * 12) : 1);
      let v = 0;
      for (const [h, a] of [[1, 1], [2, 0.45], [3, 0.22], [4, 0.1]]) v += a * (Math.sin(2 * Math.PI * f * h * s) + Math.sin(2 * Math.PI * f * h * (1 + detune) * s)) * 0.5;
      return v * env * vel;
    });
  }
  /** soft sine bass / tuba */
  bass(t, midi, dur, vel = 0.35) {
    const f = hz(midi);
    this._render(t, dur, (s) => (Math.sin(2 * Math.PI * f * s) + 0.3 * Math.sin(4 * Math.PI * f * s)) * Math.min(1, s / 0.02) * Math.exp(-s * 3) * vel);
  }
  /** plucked upright bass: woody attack, quick decay */
  upright(t, midi, dur, vel = 0.4) {
    const f = hz(midi);
    this._render(t, dur + 0.2, (s) => {
      const env = Math.min(1, s / 0.006) * Math.exp(-s * 4.5);
      return (Math.sin(2 * Math.PI * f * s) + 0.5 * Math.sin(4 * Math.PI * f * s) * Math.exp(-s * 18) + 0.2 * Math.sin(6 * Math.PI * f * s) * Math.exp(-s * 30)) * env * vel;
    });
  }
  /** vibraphone: pure tone with motor tremolo */
  vibes(t, midi, dur, vel = 0.2) {
    const f = hz(midi);
    this._render(t, dur + 1.2, (s) => {
      const env = Math.min(1, s / 0.003) * Math.exp(-s * 1.4);
      const trem = 1 - 0.35 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 5.5 * s));
      return (Math.sin(2 * Math.PI * f * s) + 0.12 * Math.sin(2 * Math.PI * f * 4 * s) * Math.exp(-s * 8)) * env * trem * vel;
    });
  }
  /** music box / celesta: bright bell, short */
  bell(t, midi, vel = 0.2) {
    const f = hz(midi);
    this._render(t, 1.6, (s) => {
      const env = Math.min(1, s / 0.002) * Math.exp(-s * 3.2);
      return (Math.sin(2 * Math.PI * f * s) + 0.35 * Math.sin(2 * Math.PI * f * 2.76 * s) * Math.exp(-s * 6) + 0.15 * Math.sin(2 * Math.PI * f * 5.4 * s) * Math.exp(-s * 12)) * env * vel;
    });
  }
  /** plucked string (Karplus–Strong): zither / guzheng / guitar */
  pluck(t, midi, vel = 0.3, seed = 1, damp = 0.996) {
    const f = hz(midi);
    const N = Math.max(2, Math.round(SR / f));
    const r = rng(seed);
    const ring = new Float32Array(N).map(() => r() * 2 - 1);
    let idx = 0;
    this._render(t, 2.5, () => {
      const a = ring[idx], b = ring[(idx + 1) % N];
      ring[idx] = damp * 0.5 * (a + b); // averaging = the string's natural low-pass
      idx = (idx + 1) % N;
      return a * vel;
    });
  }
  /** breathy flute / pad: slow attack, vibrato, a little air */
  flute(t, midi, dur, vel = 0.12, seed = 3) {
    const f = hz(midi);
    const r = rng(seed);
    let air = 0;
    this._render(t, dur + 0.5, (s) => {
      const env = Math.min(1, s / 0.18) * (s > dur ? Math.exp(-(s - dur) * 6) : 1);
      const vib = Math.sin(2 * Math.PI * 5 * s) * 0.004 * Math.min(1, s / 0.6);
      air = air * 0.9 + (r() * 2 - 1) * 0.1;
      return (Math.sin(2 * Math.PI * f * (1 + vib) * s) + 0.15 * Math.sin(4 * Math.PI * f * s) + air * 0.25) * env * vel;
    });
  }
  /** noise burst: brush / hat / woodblock (tone = pitched click) */
  noise(t, dur, vel, seed, tone = 0, decay = 25) {
    const r = rng(seed);
    let prev = 0;
    this._render(t, dur, (s) => {
      let v = r() * 2 - 1;
      if (tone) v = 0.6 * Math.sin(2 * Math.PI * tone * s) + 0.4 * v;
      prev = prev * 0.5 + v * 0.5;
      return prev * Math.exp(-s * (tone ? 40 : decay)) * vel;
    });
  }
  /** brush sweep on a snare: long soft swish */
  swish(t, dur, vel, seed) {
    const r = rng(seed);
    let prev = 0;
    this._render(t, dur, (s) => {
      prev = prev * 0.7 + (r() * 2 - 1) * 0.3;
      return prev * Math.sin(Math.PI * Math.min(1, s / dur)) * vel;
    });
  }
  /** pulse/square wave (chiptune lead); duty 0.125 / 0.25 / 0.5 */
  square(t, midi, dur, vel = 0.12, duty = 0.5) {
    const f = hz(midi);
    this._render(t, dur, (s) => (((s * f) % 1) < duty ? 1 : -1) * Math.min(1, s / 0.002) * (s > dur - 0.02 ? Math.max(0, (dur - s) / 0.02) : 1) * vel);
  }
  /** triangle wave (chiptune bass) */
  tri(t, midi, dur, vel = 0.3) {
    const f = hz(midi);
    this._render(t, dur, (s) => (4 * Math.abs(((s * f) % 1) - 0.5) - 1) * (s > dur - 0.02 ? Math.max(0, (dur - s) / 0.02) : 1) * vel);
  }
  /** bright saw (brass stab / synth lead), band-limited by summing harmonics */
  saw(t, midi, dur, vel = 0.12, harmonics = 8) {
    const f = hz(midi);
    this._render(t, dur + 0.12, (s) => {
      let v = 0;
      for (let h = 1; h <= harmonics; h++) v += Math.sin(2 * Math.PI * f * h * s) / h;
      const env = Math.min(1, s / 0.015) * (s > dur ? Math.exp(-(s - dur) * 25) : 1);
      return v * 0.6 * env * vel;
    });
  }
  /** electric piano (FM-ish bell-tine) */
  epiano(t, midi, dur, vel = 0.15) {
    const f = hz(midi);
    this._render(t, dur + 0.6, (s) => {
      const mod = Math.sin(2 * Math.PI * f * s) * 1.8 * Math.exp(-s * 6);
      const env = Math.min(1, s / 0.004) * Math.exp(-s * 1.6) * (s > dur ? Math.exp(-(s - dur) * 8) : 1);
      return Math.sin(2 * Math.PI * f * s + mod) * env * vel;
    });
  }
  /** soft synth / string pad: detuned sines, slow attack */
  pad(t, midi, dur, vel = 0.06) {
    const f = hz(midi);
    this._render(t, dur + 0.8, (s) => {
      const env = Math.min(1, s / 0.5) * (s > dur ? Math.exp(-(s - dur) * 3) : 1);
      let v = 0;
      for (const d of [-0.006, 0, 0.006]) v += Math.sin(2 * Math.PI * f * (1 + d) * s) + 0.3 * Math.sin(4 * Math.PI * f * (1 + d) * s);
      return v * env * vel;
    });
  }
  /** accordion / harmonium: reedy square-ish with tremolo */
  reed(t, midi, dur, vel = 0.08) {
    const f = hz(midi);
    this._render(t, dur + 0.1, (s) => {
      let v = 0;
      for (const [h, a] of [[1, 1], [3, 0.33], [5, 0.2], [7, 0.12]]) v += a * Math.sin(2 * Math.PI * f * h * s);
      const trem = 1 - 0.2 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 6 * s));
      return v * trem * Math.min(1, s / 0.03) * (s > dur ? Math.exp(-(s - dur) * 20) : 1) * vel;
    });
  }
  snare(t, vel = 0.25, seed = 1) {
    const r = rng(seed);
    this._render(t, 0.22, (s) => ((r() * 2 - 1) * 0.8 + Math.sin(2 * Math.PI * 190 * s) * 0.4) * Math.exp(-s * 18) * vel);
  }
  hat(t, vel = 0.06, seed = 1, open = false) {
    const r = rng(seed);
    let prev = 0;
    this._render(t, open ? 0.25 : 0.05, (s) => { const n = r() * 2 - 1; const hp = n - prev; prev = n; return hp * Math.exp(-s * (open ? 12 : 60)) * vel; });
  }
  /** big low drum (taiko / timpani) */
  taiko(t, vel = 0.6, pitch = 70) {
    this._render(t, 0.9, (s) => Math.sin(2 * Math.PI * (pitch + 60 * Math.exp(-s * 20)) * s) * Math.exp(-s * 4.5) * vel);
  }
  kick(t, vel = 0.5) {
    this._render(t, 0.25, (s) => Math.sin(2 * Math.PI * (50 + 90 * Math.exp(-s * 30)) * s) * Math.exp(-s * 12) * vel);
  }
}

/** Float32 mono → 16-bit WAV, peak-normalised to -1 dBFS. */
export function wav(samples, sampleRate = SR) {
  let peak = 0;
  for (const v of samples) peak = Math.max(peak, Math.abs(v));
  const g = peak > 0 ? 0.89 / peak : 1;
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i] * g)) * 32767), 44 + i * 2);
  return buf;
}
