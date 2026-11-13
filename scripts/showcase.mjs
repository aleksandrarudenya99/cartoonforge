#!/usr/bin/env node
/**
 * Build the GitHub showcase from the style packs.
 *
 *   npm run showcase                 render every style's example, refresh gallery + Pages
 *   npm run showcase -- --no-render  re-make previews from existing renders (renders only missing ones)
 *   npm run showcase -- --gallery-only   rebuild README gallery + docs/ only, no rendering at all
 *   npm run showcase -- rubber-hose-1930   just this style
 *
 * Example films use a test character; real films use the user's own characters.
 *
 * For each style in skills/cartoonforge/runtime/styles/<slug>/:
 *   examples/<slug>/            a Pip film in that style (scaffolded if missing)
 *   docs/media/<slug>.mp4       web-size reel with sound   (GitHub Pages)
 *   docs/media/<slug>.gif       silent loop of the key action (README)
 *   docs/media/<slug>.jpg       poster frame
 * Then rewrites the gallery in README.md and docs/index.html.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SKILL = "skills/cartoonforge";
const STYLES = join(SKILL, "runtime", "styles");
const argv = process.argv.slice(2);
const noRender = argv.includes("--no-render");
const galleryOnly = argv.includes("--gallery-only"); // just rebuild README + docs/ from existing media
const only = argv.filter((a) => !a.startsWith("--"));

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
const ff = (...args) => run("ffmpeg", ["-loglevel", "error", "-y", ...args]);

const styles = readdirSync(STYLES)
  .filter((s) => existsSync(join(STYLES, s, "style.json")))
  .map((s) => JSON.parse(readFileSync(join(STYLES, s, "style.json"), "utf8")));

mkdirSync("docs/media", { recursive: true });

for (const st of galleryOnly ? [] : styles) {
  if (only.length && !only.includes(st.slug)) continue;
  const ex = join("examples", st.slug);
  if (!existsSync(join(ex, "index.html"))) {
    run("node", [join(SKILL, "scripts/new-film.mjs"), st.slug, "--dir", "examples", "--style", st.slug, "--title", "Hello, Pip!"]);
  }
  run("node", [join(SKILL, "scripts/new-film.mjs"), st.slug, "--dir", "examples", "--update-lib"]);
  if (!existsSync(join(ex, "assets/soundtrack.wav"))) run("node", [join(SKILL, "scripts/audio.mjs"), ex]);
  const master = join(ex, "renders", `${st.slug}.mp4`);
  if (!noRender || !existsSync(master)) run("node", [join(SKILL, "scripts/render.mjs"), ex]);

  ff("-i", master, "-vf", "scale=540:-2", "-c:v", "libx264", "-preset", "veryfast", "-crf", "27", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", `docs/media/${st.slug}.mp4`);
  ff("-ss", "6.0", "-i", master, "-frames:v", "1", "-vf", "scale=540:-2", "-q:v", "3", `docs/media/${st.slug}.jpg`);
  const g = st.showcase?.gif ?? [4.3, 3.4];
  ff("-ss", String(g[0]), "-t", String(g[1]), "-i", master, "-filter_complex",
    "fps=12,scale=270:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=48[p];[b][p]paletteuse=dither=bayer:bayer_scale=4",
    "-loop", "0", `docs/media/${st.slug}.gif`);
  console.log(`✓ ${st.slug}`);
}

// ------------------------------------------------------------- README gallery
const repo = "https://aleksandrarudenya99.github.io/cartoonforge";
const ready = styles.filter((s) => existsSync(`docs/media/${s.slug}.gif`));
const cell = (s) =>
  `<td align="center" width="33%"><a href="${repo}/#${s.slug}"><img src="docs/media/${s.slug}.gif" width="200" alt="${s.name}"></a><br><b>${s.name}</b> · ${s.era}<br><sub>${s.tagline}</sub></td>`;
const pending = styles.filter((s) => !ready.includes(s));
const soon = (p) => `<td align="center" width="33%"><br><br><b>${p.name}</b> · ${p.era}<br><sub>${p.tagline}</sub><br><sub><i>preview coming soon</i></sub><br><br></td>`;
const cells = [...ready.map(cell), ...pending.map(soon)];
let rows = "";
for (let i = 0; i < cells.length; i += 3) rows += `<tr>\n${cells.slice(i, i + 3).join("\n")}\n</tr>\n`;
const gallery = `<!-- gallery:start -->\n<table>\n${rows}</table>\n\n▶ **Watch them with sound:** ${repo}\n<!-- gallery:end -->`;
const readme = readFileSync("README.md", "utf8");
writeFileSync("README.md", readme.replace(/<!-- gallery:start -->[\s\S]*<!-- gallery:end -->/, gallery));

// ------------------------------------------------------------- Pages site
const data = { styles: ready, planned: pending };
const tpl = readFileSync("scripts/site.template.html", "utf8");
writeFileSync("docs/index.html", tpl.replace("/*DATA*/null", JSON.stringify(data)));
writeFileSync("docs/.nojekyll", "");
console.log(`✓ README gallery + docs/index.html (${ready.length} rendered, ${pending.length} without preview yet)`);
