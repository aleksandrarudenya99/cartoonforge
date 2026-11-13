/**
 * fx.mjs — FFmpeg filter presets shared by every style.
 *
 *   voiceFx(name)   how the style treats a voice (TTS or the user's recording)
 *   musicFx(name)   how the style ages / colours its music
 *   MASTER          final loudness for Instagram / TikTok / Shorts (−14 LUFS, −1.5 dBTP)
 *
 * Style packs choose by name in style.json: "voice": {"fx": "..."}, "music": {"fx": "..."}.
 */
const pitch = (k) => `asetrate=48000*${k},aresample=48000,atempo=${(1 / k).toFixed(4)}`;

export const VOICE_FX = {
  none: "anull",
  // 1930s: narrow band, nasal, slightly brighter pitch
  gramophone: `${pitch(1.06)},highpass=f=320,lowpass=f=3300,equalizer=f=1500:t=q:w=1.2:g=5,acompressor=threshold=-18dB:ratio=4,volume=1.4`,
  // 1950s TV / radio announcer: mid-forward, compressed, a touch of room
  radio: "highpass=f=180,lowpass=f=5000,equalizer=f=2200:t=q:w=1:g=4,acompressor=threshold=-20dB:ratio=5,aecho=0.6:0.4:35:0.15,volume=1.3",
  // storyteller in a theatre: warm, with hall reverb (silhouette / fairy tale)
  storyteller: "highpass=f=90,equalizer=f=250:t=q:w=1:g=2,aecho=0.7:0.5:60|120:0.25|0.15,volume=1.1",
  // calm, airy, distant (ink-wash): soft highs, long gentle echo
  airy: "highpass=f=120,lowpass=f=9000,aecho=0.8:0.6:180|360:0.22|0.12,volume=1.1",
  cartoon: `${pitch(1.22)},equalizer=f=2500:t=q:w=1:g=3`,
  // punchy comic narrator: tight, bright, compressed
  comic: "highpass=f=120,equalizer=f=3000:t=q:w=1:g=4,acompressor=threshold=-22dB:ratio=6:attack=5,volume=1.4",
  // 80s anime / VHS: soft highs, slight wobble
  vhs: "lowpass=f=6500,vibrato=f=0.8:d=0.015,acompressor=threshold=-20dB:ratio=3",
  // dramatic action hero: low-mid weight, compression, big room
  hero: "highpass=f=80,equalizer=f=180:t=q:w=1:g=3,acompressor=threshold=-24dB:ratio=6,aecho=0.7:0.5:70|140:0.22|0.12,volume=1.3",
  // TV broadcast: clean, light compression
  tv: "highpass=f=100,lowpass=f=9000,acompressor=threshold=-20dB:ratio=3,volume=1.2",
  // 16-bit game: bit-crushed
  bitcrush: "acrusher=bits=8:mode=log:aa=1:samples=4,volume=1.1",
  // dark / occult: lowered pitch, echo
  shadow: `${pitch(0.93)},aecho=0.8:0.6:90|180:0.3|0.18,volume=1.2`,
  chipmunk: pitch(1.55),
};

export const MUSIC_FX = {
  none: "anull",
  gramophone: "highpass=f=180,lowpass=f=3800",
  // tape: warm top end, very slight wow
  tape: "lowpass=f=7500,vibrato=f=0.6:d=0.02",
  hall: "aecho=0.8:0.7:90|170:0.3|0.2",
  mist: "lowpass=f=8000,aecho=0.8:0.7:240|480:0.28|0.16",
  vhs: "lowpass=f=9000,vibrato=f=0.5:d=0.03",
  cinema: "aecho=0.8:0.6:60|120:0.2|0.12,equalizer=f=80:t=q:w=1:g=3",
  bitcrush: "acrusher=bits=6:mode=log:aa=1:samples=2",
  broadcast: "highpass=f=60,lowpass=f=12000,acompressor=threshold=-18dB:ratio=3",
};

/** Extra noise bed per music fx (crackle for gramophone, hiss for tape). */
export const MUSIC_NOISE = { gramophone: { color: "brown", amp: 0.012 }, tape: { color: "pink", amp: 0.004 }, vhs: { color: "white", amp: 0.003 } };

export const MASTER = "loudnorm=I=-14:TP=-1.5:LRA=11";

export const voiceFx = (name) => VOICE_FX[name] ?? VOICE_FX.none;
export const musicFx = (name) => MUSIC_FX[name] ?? MUSIC_FX.none;
