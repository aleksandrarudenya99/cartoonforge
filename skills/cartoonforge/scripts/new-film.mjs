#!/usr/bin/env node
/**
 * Scaffold a self-contained cartoon film project.
 *
 *   node new-film.mjs <slug> [--style rubber-hose-1930] [--title "Hello, Pip!"] [--dir ./cartoons]
 *   node new-film.mjs <slug> --update-lib [--dir ./cartoons]   refresh lib/ of an existing film to this skill's runtime
 *
 * Creates <dir>/<slug>/ with:
 *   index.html        the film (edit render(t))
 *   lib/              a copy of the cartoonforge runtime: core + the style + characters
 *   package.json      gsap + hyperframes
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RUNTIME = join(SKILL, "runtime");

const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : def;
};
const slug = argv.find((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
const styles = readdirSync(join(RUNTIME, "styles"));
const style = opt("style", "rubber-hose-1930");
const title = opt("title", "Hello, Pip!");
const outDir = resolve(opt("dir", "./cartoons"), slug ?? "");

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: new-film.mjs <slug> [--style <style>] [--title <title>] [--dir <dir>]\nslug: lowercase letters, digits, dashes");
  process.exit(1);
}
if (!styles.includes(style)) {
  console.error(`Unknown style "${style}". Available: ${styles.join(", ")}`);
  process.exit(1);
}
if (argv.includes("--update-lib")) {
  const html = readFileSync(join(outDir, "index.html"), "utf8");
  const st = (html.match(/lib\/styles\/([^/]+)\/style\.js/) || [])[1] ?? style;
  cpSync(join(RUNTIME, "core"), join(outDir, "lib", "core"), { recursive: true });
  cpSync(join(RUNTIME, "characters"), join(outDir, "lib", "characters"), { recursive: true });
  cpSync(join(RUNTIME, "styles", st), join(outDir, "lib", "styles", st), { recursive: true });
  console.log(`Updated ${outDir}/lib (style: ${st})`);
  process.exit(0);
}
if (existsSync(join(outDir, "index.html"))) {
  console.error(`${outDir}/index.html already exists — not overwriting.`);
  process.exit(1);
}

mkdirSync(join(outDir, "lib", "styles"), { recursive: true });
cpSync(join(RUNTIME, "core"), join(outDir, "lib", "core"), { recursive: true });
cpSync(join(RUNTIME, "characters"), join(outDir, "lib", "characters"), { recursive: true });
cpSync(join(RUNTIME, "styles", style), join(outDir, "lib", "styles", style), { recursive: true });

const meta = JSON.parse(readFileSync(join(RUNTIME, "styles", style, "style.json"), "utf8"));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const tpl = opt("template", null); // e.g. --template worlds → templates/film-worlds.html (layered styles)
const html = readFileSync(join(SKILL, "templates", meta.layered ? (tpl ? `film-${tpl}.html` : "film-layered.html") : "film.html"), "utf8")
  .replaceAll("{{STYLE}}", style)
  .replaceAll("{{TITLE}}", esc(title))
  .replaceAll("{{SUBTITLE}}", esc(meta.subtitle ?? meta.name));
writeFileSync(join(outDir, "index.html"), html);
if (meta.layered) writeFileSync(join(outDir, "cast.js"), "// the user's characters: window.CAST = [ {spec}, … ] (see lib/characters/README.md)\nwindow.CAST = null;\n");
writeFileSync(join(outDir, "cf-data.js"), `window.CF = ${JSON.stringify({ duration: 10, captions: [] })};\n`);
writeFileSync(
  join(outDir, "script.json"),
  JSON.stringify(
    {
      lang: "en",
      voice: "af_heart",
      engine: "auto",
      start: 1.8,
      gap: 0.35,
      lines: ["Hi! I'm Pip.", "I'm a cartoon drawn entirely in code."],
      music: true,
      musicVolume: 0.55,
      minDuration: 10,
    },
    null,
    2,
  ) + "\n",
);

writeFileSync(
  join(outDir, "package.json"),
  JSON.stringify(
    {
      name: slug,
      private: true,
      type: "module",
      description: `${title} — a cartoonforge film (${style})`,
      dependencies: { gsap: "^3.15.0" },
      devDependencies: { hyperframes: "0.9.41" },
    },
    null,
    2,
  ) + "\n",
);
writeFileSync(
  join(outDir, "hyperframes.json"),
  JSON.stringify({ paths: { blocks: "compositions", components: "compositions/components", assets: "assets" } }, null, 2) + "\n",
);
writeFileSync(join(outDir, ".gitignore"), "node_modules/\nrenders/\n.hyperframes/\nassets/.lines/\n");

console.log(`Created ${outDir}
  style: ${style}
  next:  1. write the voice-over / captions in ${join(outDir, "script.json")}
         2. node ${join(SKILL, "scripts", "audio.mjs")} ${outDir}     (voice + music + captions)
         3. edit ${join(outDir, "index.html")} → render(t)
         4. node ${join(SKILL, "scripts", "render.mjs")} ${outDir} --draft`);
