#!/usr/bin/env node
/**
 * Fast review without rendering: screenshot a film at chosen times and tile them.
 * Seconds instead of minutes — use it while iterating, render.mjs for the real thing.
 *
 *   node stills.mjs <film-dir> [t1 t2 …]      default: 10 evenly spaced times
 *   → <film-dir>/renders/<name>.stills.png
 */
import { createRequire } from "node:module";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const argv = process.argv.slice(2);
const dir = resolve(argv[0] ?? ".");
const name = basename(dir);
const req = createRequire(join(dir, "package.json"));
let puppeteer;
try {
  puppeteer = req("puppeteer-core");
} catch {
  try {
    puppeteer = createRequire(import.meta.url)("puppeteer-core");
  } catch {
    console.error("puppeteer-core not found — run `npm install` in the film folder first (it comes with hyperframes).");
    process.exit(1);
  }
}
const chrome = process.env.HYPERFRAMES_BROWSER_PATH || [
  "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
].find(existsSync);
if (!chrome) {
  console.error("Chrome not found — set HYPERFRAMES_BROWSER_PATH");
  process.exit(1);
}

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, protocolTimeout: 60000, args: ["--no-sandbox", "--allow-file-access-from-files", "--no-first-run", "--disable-sync", "--disable-background-networking", "--disable-component-update", "--disable-default-apps"] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(pathToFileURL(join(dir, "index.html")).href, { waitUntil: "domcontentloaded", timeout: 30000 });
const dur = await page.evaluate(() => window.__timelines?.main?.duration() ?? 10);
const times = argv.slice(1).map(Number).filter((n) => !Number.isNaN(n));
if (!times.length) for (let i = 0; i < 10; i++) times.push(+((dur * (i + 0.5)) / 10).toFixed(2));

const tmp = join(dir, "renders", ".stills");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
for (const [i, t] of times.entries()) {
  await page.evaluate((t) => window.__timelines.main.seek(t), t);
  await page.screenshot({ path: join(tmp, `${String(i).padStart(2, "0")}.png`) });
}
await browser.close();
if (errors.length) console.error("✗ page errors:\n  " + errors.join("\n  "));

const out = join(dir, "renders", `${name}.stills.png`);
const cols = Math.min(5, times.length);
spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-pattern_type", "glob", "-i", join(tmp, "*.png"),
  "-vf", `scale=360:-1,tile=${cols}x${Math.ceil(times.length / cols)}`, "-frames:v", "1", out], { stdio: "inherit" });
rmSync(tmp, { recursive: true, force: true });
console.log(`✓ ${out}  (t = ${times.join(", ")})`);
