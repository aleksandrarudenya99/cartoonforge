#!/usr/bin/env node
// Copy the skill runtime into every examples/<film>/lib (runs after npm install).
import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
if (existsSync("examples")) {
  for (const f of readdirSync("examples")) {
    if (existsSync(`examples/${f}/index.html`)) {
      spawnSync("node", ["skills/cartoonforge/scripts/new-film.mjs", f, "--dir", "examples", "--update-lib"], { stdio: "inherit" });
    }
  }
}
