#!/usr/bin/env node
/**
 * Render a cartoonforge film and make a contact sheet for review.
 *
 *   node render.mjs <film-dir> [--draft] [--file index.html]
 *
 * Outputs in <film-dir>/renders/:
 *   <name>.mp4        Reels-ready H.264 (9:16, 24 fps, ≤12 Mbit/s)   (or .draft.mp4)
 *   <name>.sheet.png  10 frames tiled 5×2 — LOOK at this before calling the film done
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const argv = process.argv.slice(2);
const draft = argv.includes("--draft");
const fileIdx = argv.indexOf("--file");
const file = fileIdx >= 0 ? argv[fileIdx + 1] : "index.html";
const dir = resolve(argv.find((a, i) => !a.startsWith("--") && argv[i - 1] !== "--file") ?? ".");
const name = basename(dir);
const src = join(dir, file);

const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (r.status !== 0) {
    console.error(`✗ ${cmd} ${args.join(" ")} failed`);
    process.exit(r.status ?? 1);
  }
};
const has = (cmd) => spawnSync(process.platform === "win32" ? "where" : "which", [cmd]).status === 0;

if (!existsSync(src)) {
  console.error(`No film at ${src}`);
  process.exit(1);
}
if (!has("ffmpeg")) {
  console.error("✗ FFmpeg is required: https://ffmpeg.org/download.html (macOS: brew install ffmpeg)");
  process.exit(1);
}

// dependencies
const filmIsProject = existsSync(join(dir, "package.json"));
if (filmIsProject && !existsSync(join(dir, "node_modules", "gsap"))) run("npm", ["install", "--no-audit", "--no-fund"], { cwd: dir });

// Chrome: let hyperframes use its own, else fall back to a system Chrome
const env = { ...process.env, HYPERFRAMES_SKIP_SKILLS: "1" };
if (!env.HYPERFRAMES_BROWSER_PATH) {
  const candidates = [
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  ];
  const found = candidates.find(existsSync);
  if (found) env.HYPERFRAMES_BROWSER_PATH = found;
}

const outDir = join(dir, "renders");
mkdirSync(outDir, { recursive: true });
const out = join(outDir, `${name}${draft ? ".draft" : ""}.mp4`);
const cwd = filmIsProject ? dir : process.cwd();
run(
  "npx",
  ["--yes", "hyperframes@0.9.41", "render", "-c", filmIsProject ? file : src, "-o", out,
   "-q", draft ? "draft" : "delivery", "--fps", "24", ...(draft ? [] : ["--max-bitrate", "12M"]), "--quiet"],
  { cwd, env },
);

// contact sheet: 10 evenly spaced frames
const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], { encoding: "utf8" });
const dur = parseFloat(probe.stdout) || 10;
const sheet = join(outDir, `${name}.sheet.png`);
run("ffmpeg", [
  "-loglevel", "error", "-y", "-i", out,
  "-vf", `fps=${(10 / dur).toFixed(4)},scale=360:-1,tile=5x2`,
  "-frames:v", "1", sheet,
]);

console.log(`\n✓ video: ${out}\n✓ sheet: ${sheet}`);
