#!/usr/bin/env node
// Render a film to a Reels-ready MP4.
//   npm run render -- hello-pip          → renders/hello-pip.mp4 (delivery quality)
//   npm run render:draft -- hello-pip    → fast preview quality
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";

const args = process.argv.slice(2);
const draft = args.includes("--draft");
const film = args.find((a) => !a.startsWith("--")) ?? "hello-pip";
const src = `films/${film}/index.html`;
if (!existsSync(src)) {
  console.error(`No film at ${src}`);
  process.exit(1);
}
mkdirSync("renders", { recursive: true });
const out = `renders/${film}${draft ? ".draft" : ""}.mp4`;
const res = spawnSync(
  "npx",
  ["hyperframes", "render", "-c", src, "-o", out, "-q", draft ? "draft" : "delivery", "--fps", "24", ...(draft ? [] : ["--max-bitrate", "12M"])],
  { stdio: "inherit", env: { ...process.env, HYPERFRAMES_SKIP_SKILLS: "1" } },
);
process.exit(res.status ?? 1);
