"""Voice acting on a TTS line: intonation contour, voice crack, stammer.

    python3 voice_acting.py in.wav out.wav --from 0 --to -6 --crack 7 --stammer 2

TTS voices read flat. Cartoon delivery lives in pitch movement, not loudness
(see references/voice-acting.md). This bends the pitch over the line with a
smooth variable-rate resample ("tape bend"):
  --from / --to   semitones at the start / end of the line (contour: fall = panic or defeat, rise = question/hope)
  --crack         semitones of a quick upward yelp on the first syllable (voice cracking, surprise)
  --wobble        semitones of nervous wobble (fast irregular vibrato)
  --swoop         semitones of slow wide up-and-down swings (~2.5 Hz): hysterical shrieking
  --stammer N     repeat the first syllable N times ("I-I-I…")
Static pitch / speed / gain are applied afterwards by audio.mjs (ffmpeg).
"""
import argparse

import numpy as np
import soundfile as sf

ap = argparse.ArgumentParser()
ap.add_argument("inp")
ap.add_argument("out")
ap.add_argument("--from", dest="st0", type=float, default=0)
ap.add_argument("--to", dest="st1", type=float, default=0)
ap.add_argument("--crack", type=float, default=0)
ap.add_argument("--wobble", type=float, default=0)
ap.add_argument("--swoop", type=float, default=0)
ap.add_argument("--stammer", type=int, default=0)
a = ap.parse_args()

y, sr = sf.read(a.inp)
if y.ndim > 1:
    y = y.mean(axis=1)

# trim leading silence so the crack / stammer land on the first syllable
env = np.convolve(np.abs(y), np.ones(256) / 256, mode="same")
thr = env.max() * 0.08
start = int(np.argmax(env > thr))
lead, y = y[:start], y[start:]
n = len(y)
t = np.arange(n) / sr
dur = n / sr

st = a.st0 + (a.st1 - a.st0) * (t / max(dur, 1e-6)) ** 1.2
if a.crack:
    st += a.crack * np.exp(-((t - 0.06) / 0.07) ** 2)  # a quick jump up and back on the first syllable
if a.wobble:
    rng = np.random.default_rng(3)
    ph = np.cumsum(2 * np.pi * (7 + 3 * rng.standard_normal(n) * 0.02) / sr)
    st += a.wobble * np.sin(ph) * (0.6 + 0.4 * np.sin(2 * np.pi * 1.3 * t))

if a.swoop:
    st += a.swoop * np.sin(2 * np.pi * 2.4 * t + 0.5) + a.swoop * 0.6 * (t / max(dur, 1e-6)) ** 3  # swings, then a shrill rise at the end
rate = 2 ** (st / 12)  # playback-rate curve: higher pitch = read faster
pos = np.concatenate([[0], np.cumsum(rate)[:-1]])
pos = pos[pos < n - 1]
out = np.interp(pos, np.arange(n), y)

if a.stammer > 0:
    syl = out[: int(0.12 * sr)]
    fade = np.linspace(1, 0, len(syl)) ** 0.5
    gap = np.zeros(int(0.07 * sr))
    pre = np.concatenate([np.concatenate([syl * fade, gap]) for _ in range(a.stammer)])
    out = np.concatenate([pre, out])

out = np.concatenate([lead, out])
peak = np.abs(out).max() or 1
sf.write(a.out, out / max(1, peak / 0.98), sr)
