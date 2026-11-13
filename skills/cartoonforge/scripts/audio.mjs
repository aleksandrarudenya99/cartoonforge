#!/usr/bin/env node
/**
 * Voice-over + music + captions for a cartoonforge film.
 *
 *   node audio.mjs <film-dir>
 *
 * Reads <film-dir>/script.json:
 *   {
 *     "lang": "en",                  // en | ru | es | fr | it | pt | ja | zh | hi
 *     "voice": "af_heart",           // Kokoro voice (engine kokoro)
 *     "engine": "auto",              // auto | kokoro | say | espeak | none (captions only)
 *     "start": 1.8, "gap": 0.35,     // when the first line starts; pause between lines
 *     "lines": ["Hi!", {"text": "Look up!", "at": 5.2}],
 *     "recording": "my-voice.m4a",   // OPTIONAL: your own voice instead of TTS (lines then = caption text, optional)
 *     "voiceFx": "style",            // style (from style.json) | any name in lib/audio/fx.mjs VOICE_FX
 *     "music": true,                 // true = generate in the style's genre, false = none, or a path
 *     "musicVolume": 0.55,
 *     "minDuration": 10
 *   }
 *
 * Writes:
 *   assets/voice.wav, assets/music.wav, assets/soundtrack.wav (ducked mix, -14 LUFS for Instagram)
 *   cf-data.js   → window.CF = { duration, captions: [{start, end, text}], bpm }
 *   index.html   → soundtrack <audio> clip inserted, data-duration updated
 *
 * Voice licences: Kokoro voices are Apache-2.0 (commercial use OK). macOS `say` and espeak-ng are
 * fine for drafts. Most Piper voices are NON-commercial — not used here on purpose.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compose } from "./lib/audio/genres.mjs";
import { wav } from "./lib/audio/instruments.mjs";
import { MASTER, MUSIC_NOISE, musicFx, voiceFx } from "./lib/audio/fx.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const dir = resolve(process.argv[2] ?? ".");
const scriptPath = join(dir, "script.json");
if (!existsSync(scriptPath)) {
  console.error(`No ${scriptPath}`);
  process.exit(1);
}
const S = JSON.parse(readFileSync(scriptPath, "utf8"));
const html = readFileSync(join(dir, "index.html"), "utf8");
const styleSlug = (html.match(/lib\/styles\/([^/]+)\/style\.js/) || [])[1];
const meta = styleSlug && existsSync(join(dir, "lib", "styles", styleSlug, "style.json"))
  ? JSON.parse(readFileSync(join(dir, "lib", "styles", styleSlug, "style.json"), "utf8"))
  : {};
const assets = join(dir, "assets");
const tmp = join(assets, ".lines");
mkdirSync(tmp, { recursive: true });

const sh = (cmd, args, opts = {}) => spawnSync(cmd, args, { encoding: "utf8", ...opts });
const has = (cmd) => sh(process.platform === "win32" ? "where" : "which", [cmd]).status === 0;
const must = (r, what) => {
  if (r.status !== 0) {
    console.error(`✗ ${what}\n${r.stderr || ""}`);
    process.exit(1);
  }
  return r;
};
const duration = (f) => parseFloat(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).stdout);

// ---------------------------------------------------------------- engine
const KOKORO_LANG = { en: "a", "en-gb": "b", es: "e", fr: "f", it: "i", pt: "p", hi: "h", ja: "j", zh: "z" };
const ESPEAK_LANG = { en: "en-us", "en-gb": "en-gb", ru: "ru", es: "es", fr: "fr", it: "it", pt: "pt", de: "de", pl: "pl" };
const lang = (S.lang || "en").toLowerCase();
const kokoroOk = () => KOKORO_LANG[lang] && sh("python3", ["-c", "import kokoro, soundfile"]).status === 0;

let engine = S.recording ? "recording" : S.engine || "auto";
if (engine === "auto") {
  if (kokoroOk()) engine = "kokoro";
  else if (process.platform === "darwin" && has("say")) engine = "say";
  else if (has("espeak-ng")) engine = "espeak";
  else engine = "none";
  if (engine !== "kokoro") {
    console.warn(`! Kokoro not available${KOKORO_LANG[lang] ? "" : ` for "${lang}"`} — using "${engine}".` +
      (KOKORO_LANG[lang] ? "  For the good free voice: pip install kokoro soundfile" : ""));
  }
}
const speed = S.speed ?? meta.voice?.speed ?? 1;

function speak(text, out) {
  if (engine === "kokoro") {
    must(sh("python3", [join(HERE, "voice_kokoro.py"), text, "--voice", S.voice || "af_heart", "--lang", KOKORO_LANG[lang], "--speed", String(speed), "--out", out]), "kokoro");
  } else if (engine === "say") {
    const aiff = out.replace(/\.wav$/, ".aiff");
    must(sh("say", ["-r", String(Math.round(185 * speed)), "-o", aiff, ...(S.voice && S.engine === "say" ? ["-v", S.voice] : []), text]), "say");
    must(sh("ffmpeg", ["-loglevel", "error", "-y", "-i", aiff, "-ar", "24000", "-ac", "1", out]), "ffmpeg aiff→wav");
  } else if (engine === "espeak") {
    must(sh("espeak-ng", ["-v", ESPEAK_LANG[lang] || "en-us", "-s", String(Math.round(165 * speed)), "-w", out, text]), "espeak-ng");
  } else {
    return text.split(/\s+/).length / 2.7 + 0.3; // reading time, no audio
  }
  return duration(out);
}

// ---------------------------------------------------------------- voice + cues
const captions = [];
const voiceInputs = [];
let cursor = S.start ?? 1.8;
const voiceWav = join(assets, "voice.wav");
const DRY = join(tmp, "voice.dry.wav");

if (S.recording) {
  // ---- your own voice: trim silence at the edges, place it at `start`
  const src = resolve(dir, S.recording);
  if (!existsSync(src)) {
    console.error(`✗ recording not found: ${src}`);
    process.exit(1);
  }
  const rec = join(tmp, "recording.wav");
  must(sh("ffmpeg", ["-loglevel", "error", "-y", "-i", src, "-ac", "1", "-ar", "48000",
    "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,highpass=f=70",
    rec]), "recording import");
  const d = duration(rec);
  voiceInputs.push({ f: rec, at: cursor });
  captions.push(...captionsForRecording(rec, cursor, d));
  cursor += d + (S.gap ?? 0.35);
} else {
  (S.lines || []).forEach((line, i) => {
    const text = typeof line === "string" ? line : line.text;
    if (typeof line === "object" && line.at != null) cursor = line.at;
    const f = join(tmp, `line${i}.wav`);
    const d = speak(text, f);
    captions.push({ start: +cursor.toFixed(3), end: +(cursor + d).toFixed(3), text });
    if (engine !== "none") voiceInputs.push({ f, at: cursor });
    cursor += d + (S.gap ?? 0.35);
  });
}
const tail = 1.6; // end card
const DUR = +Math.max(S.minDuration ?? 10, cursor + tail).toFixed(2);
const bpm = S.bpm ?? meta.music?.bpm ?? 120;

if (voiceInputs.length) {
  const args = ["-loglevel", "error", "-y"];
  voiceInputs.forEach(({ f }) => args.push("-i", f));
  const chains = voiceInputs.map(({ at }, i) => `[${i}:a]aresample=48000,adelay=${Math.round(at * 1000)}:all=1[v${i}]`);
  const mix = `${voiceInputs.map((_, i) => `[v${i}]`).join("")}amix=inputs=${voiceInputs.length}:normalize=0,apad,atrim=0:${DUR}[out]`;
  args.push("-filter_complex", [...chains, mix].join(";"), "-map", "[out]", "-ac", "1", DRY);
  must(sh("ffmpeg", args), "voice mix");
  // ---- style the voice
  const fxName = S.voiceFx === undefined || S.voiceFx === "style" ? meta.voice?.fx || "none" : S.voiceFx;
  must(sh("ffmpeg", ["-loglevel", "error", "-y", "-i", DRY, "-af", voiceFx(fxName), "-ar", "48000", voiceWav]), `voice fx ${fxName}`);
  console.log(`✓ voice fx: ${fxName}`);
}

// ---------------------------------------------------------------- helpers
/** Caption cues for a recording: whisper word timestamps if available, else your `lines` spread over the speech. */
function captionsForRecording(wavPath, offset, dur) {
  const tr = sh("npx", ["--yes", "hyperframes@0.9.41", "transcribe", wavPath, "--json", "-l", lang.slice(0, 2), "-m", lang.startsWith("en") ? "small.en" : "small"], { cwd: dir, timeout: 600000 });
  let words = [];
  try {
    const found = [];
    const walk = (x) => {
      if (Array.isArray(x)) x.forEach(walk);
      else if (x && typeof x === "object") {
        const text = x.word ?? x.text;
        if (typeof text === "string" && typeof x.start === "number" && typeof x.end === "number" && !/\s\S/.test(text.trim())) found.push({ text: text.trim(), start: x.start, end: x.end });
        else Object.values(x).forEach(walk);
      }
    };
    walk(JSON.parse(tr.stdout.trim().split("\n").pop()));
    words = found.filter((w) => w.text);
  } catch {}
  if (words.length) {
    console.log(`✓ captions: ${words.length} words transcribed`);
    const cues = [];
    let cur = [];
    const flush = () => {
      if (!cur.length) return;
      cues.push({ start: +(offset + cur[0].start).toFixed(3), end: +(offset + cur[cur.length - 1].end).toFixed(3), text: cur.map((w) => w.text).join(" ") });
      cur = [];
    };
    words.forEach((w, i) => {
      if (cur.length && w.start - cur[cur.length - 1].end > 0.45) flush();
      cur.push(w);
      if (/[.!?…,;:]$/.test(w.text) && cur.length >= 3) flush();
      else if (cur.length >= 7) flush();
    });
    flush();
    return cues;
  }
  const lines = (S.lines || []).map((l) => (typeof l === "string" ? l : l.text));
  if (!lines.length) {
    console.warn("! no transcription and no `lines` → no captions (add the text to `lines` to get captions)");
    return [];
  }
  console.warn("! transcription unavailable — spreading your `lines` over the detected speech");
  // speech segments from silencedetect
  const sd = sh("ffmpeg", ["-i", wavPath, "-af", "silencedetect=n=-38dB:d=0.25", "-f", "null", "-"]).stderr || "";
  const segs = [];
  let s0 = 0;
  for (const m of sd.matchAll(/silence_(start|end): ([\d.]+)/g)) {
    if (m[1] === "start") { if (+m[2] > s0) segs.push([s0, +m[2]]); }
    else s0 = +m[2];
  }
  if (s0 < dur) segs.push([s0, dur]);
  const speech = segs.reduce((a, [x, y]) => a + (y - x), 0) || dur;
  const toReal = (k) => { // k in speech-seconds → real seconds
    for (const [x, y] of segs) { if (k <= y - x) return x + k; k -= y - x; }
    return dur;
  };
  const totalChars = lines.reduce((a, l) => a + l.length, 0);
  let acc = 0;
  return lines.map((text) => {
    const a = toReal((acc / totalChars) * speech);
    acc += text.length;
    const b = toReal((acc / totalChars) * speech);
    return { start: +(offset + a).toFixed(3), end: +(offset + b).toFixed(3), text };
  });
}

// ---------------------------------------------------------------- music
const musicWav = join(assets, "music.wav");
let haveMusic = false;
if (S.music === true) {
  const raw = join(tmp, "music.raw.wav");
  writeFileSync(raw, wav(compose({ genre: meta.music?.genre || "ragtime", bpm, seconds: DUR, seed: S.seed ?? 7 })));
  // style colouring (lib/audio/fx.mjs): e.g. gramophone = band-limited + crackle
  const mfx = meta.music?.fx ?? meta.music?.lofi ?? "none";
  const nz = MUSIC_NOISE[mfx];
  const fx = nz
    ? `[0:a]aresample=48000,${musicFx(mfx)}[m];anoisesrc=d=${DUR}:c=${nz.color}:a=${nz.amp}:r=48000[n];[m][n]amix=inputs=2:normalize=0[out]`
    : `[0:a]aresample=48000,${musicFx(mfx)}[out]`;
  must(sh("ffmpeg", ["-loglevel", "error", "-y", "-i", raw, "-filter_complex", fx, "-map", "[out]", "-t", String(DUR), "-ac", "1", musicWav]), "music fx");
  haveMusic = true;
} else if (typeof S.music === "string") {
  const src = resolve(dir, S.music);
  must(sh("ffmpeg", ["-loglevel", "error", "-y", "-i", src, "-t", String(DUR), "-ar", "48000", "-ac", "1", "-af", `afade=t=out:st=${DUR - 1.2}:d=1.2`, musicWav]), "music import");
  haveMusic = true;
}

// ---------------------------------------------------------------- mix
const soundtrack = join(assets, "soundtrack.wav");
const mv = S.musicVolume ?? 0.55;
let filter, inputs;
if (haveMusic && voiceInputs.length) {
  inputs = ["-i", musicWav, "-i", voiceWav];
  filter = `[0:a]volume=${mv}[m];[1:a]asplit=2[v][sc];[m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350[md];[md][v]amix=inputs=2:normalize=0,${MASTER},aresample=48000,apad=whole_dur=${DUR}[out]`;
} else if (haveMusic) {
  inputs = ["-i", musicWav];
  filter = `[0:a]volume=${mv},${MASTER},aresample=48000,apad=whole_dur=${DUR}[out]`;
} else if (voiceInputs.length) {
  inputs = ["-i", voiceWav];
  filter = `[0:a]${MASTER},aresample=48000,apad=whole_dur=${DUR}[out]`;
}
const hasAudio = Boolean(filter);
if (hasAudio) {
  must(sh("ffmpeg", ["-loglevel", "error", "-y", ...inputs, "-filter_complex", filter, "-map", "[out]", "-ar", "48000", "-ac", "2", soundtrack]), "final mix");
}

// ---------------------------------------------------------------- film data
writeFileSync(join(dir, "cf-data.js"), `window.CF = ${JSON.stringify({ duration: DUR, bpm, captions }, null, 2)};\n`);

let out = html.replace(/data-duration="[\d.]+"/g, `data-duration="${DUR}"`);
const tag = `<audio id="soundtrack" class="clip" data-start="0" data-duration="${DUR}" data-track-index="1" data-volume="1" src="assets/soundtrack.wav"></audio>`;
out = out.replace(/\s*<audio id="soundtrack"[^>]*><\/audio>/, "");
if (hasAudio) out = out.replace("<!-- cf:audio -->", `<!-- cf:audio -->\n      ${tag}`);
writeFileSync(join(dir, "index.html"), out);

console.log(`✓ voice: ${engine}${engine === "espeak" ? " (robotic — fine for drafts; install Kokoro for the real voice)" : ""}`);
console.log(`✓ duration: ${DUR}s · ${captions.length} caption cue(s) · music: ${haveMusic ? (S.music === true ? meta.music?.genre || "ragtime" : "file") : "none"}`);
if (hasAudio) console.log(`✓ ${soundtrack}`);
