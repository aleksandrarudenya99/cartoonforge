"""Kokoro TTS (Apache-2.0, free for commercial use) → WAV.

    python3 voice_kokoro.py --voice af_heart --lang a --speed 1.0 --out line.wav "Hello there"

Two backends, tried in order:
  1. kokoro       pip install kokoro soundfile            (model from HuggingFace, ~330 MB)
  2. kokoro-onnx  pip install kokoro-onnx soundfile       (same model as ONNX, from GitHub releases)
     model files: kokoro-v1.0.onnx + voices-v1.0.bin in $CF_KOKORO_DIR (default ~/.cache/cartoonforge/kokoro)
     https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
Lang codes: a=US English, b=UK English, e=Spanish, f=French, i=Italian, p=Portuguese, h=Hindi, j=Japanese, z=Chinese.
Voices: af_heart, af_bella, am_michael, am_fenrir, bf_emma, bm_george, … (see Kokoro VOICES.md)
"""
import argparse
import os
import sys

import numpy as np
import soundfile as sf

ap = argparse.ArgumentParser()
ap.add_argument("text")
ap.add_argument("--voice", default="af_heart")
ap.add_argument("--lang", default="a")
ap.add_argument("--speed", type=float, default=1.0)
ap.add_argument("--out", required=True)
a = ap.parse_args()

try:
    from kokoro import KPipeline

    pipe = KPipeline(lang_code=a.lang)
    chunks = [audio for _, _, audio in pipe(a.text, voice=a.voice, speed=a.speed)]
    if not chunks:
        sys.exit("kokoro produced no audio")
    sf.write(a.out, np.concatenate(chunks), 24000)
except ImportError:
    from kokoro_onnx import Kokoro

    d = os.environ.get("CF_KOKORO_DIR", os.path.expanduser("~/.cache/cartoonforge/kokoro"))
    langs = {"a": "en-us", "b": "en-gb", "e": "es", "f": "fr-fr", "i": "it", "p": "pt-br", "h": "hi", "j": "ja", "z": "cmn"}
    k = Kokoro(os.path.join(d, "kokoro-v1.0.onnx"), os.path.join(d, "voices-v1.0.bin"))
    audio, sr = k.create(a.text, voice=a.voice, speed=a.speed, lang=langs.get(a.lang, "en-us"))
    sf.write(a.out, audio, sr)
