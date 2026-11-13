"""Kokoro TTS (Apache-2.0, free for commercial use) → 24 kHz WAV.

    python3 voice_kokoro.py --voice af_heart --lang a --speed 1.0 --out line.wav "Hello there"

Install once:  pip install kokoro soundfile   (first run downloads the model, ~330 MB)
Lang codes: a=US English, b=UK English, e=Spanish, f=French, i=Italian, p=Portuguese, h=Hindi, j=Japanese, z=Chinese.
Voices: af_heart, af_bella, am_michael, am_fenrir, bf_emma, bm_george, … (see Kokoro VOICES.md)
"""
import argparse
import sys

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ap = argparse.ArgumentParser()
ap.add_argument("text")
ap.add_argument("--voice", default="af_heart")
ap.add_argument("--lang", default="a")
ap.add_argument("--speed", type=float, default=1.0)
ap.add_argument("--out", required=True)
a = ap.parse_args()

pipe = KPipeline(lang_code=a.lang)
chunks = [audio for _, _, audio in pipe(a.text, voice=a.voice, speed=a.speed)]
if not chunks:
    sys.exit("kokoro produced no audio")
sf.write(a.out, np.concatenate(chunks), 24000)
