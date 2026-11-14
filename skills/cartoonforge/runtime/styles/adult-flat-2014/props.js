/**
 * Adult Flat Comedy — PROPS: the shared drawing vocabulary of this style's backgrounds.
 * Every set (street, desert, dusk, home, station) is built from these pieces.
 *
 * Genre traits of the backgrounds (from reference study):
 *   LINE      the same thin black line as the characters, slightly wobbly, often left OPEN
 *             (ground contour strokes, fold lines, partial arcs inside puffy shapes)
 *   COLOUR    flat fills; depth comes from AIRBRUSH shading — a soft fade that breaks into
 *             speckle at its edge (wall corners, ceilings, hill bases, pool rims)
 *   SKY       smooth gradient + long flat cloud bands in a darker tone of the sky colour
 *   GROUND    open contour strokes, little grass tufts, scattered pebbles and dots
 *   ALIEN     puffy candy trees with highlight arcs, pools with concentric rings, spires with
 *             eye-holes, pale crystal shards, blotchy planets, drifting particle trails
 *   EVERYDAY  framed pictures, curtains on a ring rod, a hanging cone lamp, plank floors
 *   SCI-FI    segmented pipes, hazard-stripe doors, light slots, vents, alien-glyph signs
 */
(function (global) {
  "use strict";
  const T = global.Toon;
  const AF = T.styles["adult-flat-2014"];
  let uid = 0;
  const nid = (p) => `af-${p}-${++uid}`;
  const f = (v) => (+v).toFixed(1);

  const props = {
    ink(theme, k = 1, extra = {}) {
      return { stroke: theme.line.color, "stroke-width": theme.line.width * k, "stroke-linejoin": "round", "stroke-linecap": "round", ...extra };
    },

    /** smooth hand-drawn path through points (Catmull-Rom), with a little seeded jitter */
    wob(pts, { seed = 1, j = 1.5, close = false } = {}) {
      const r = T.rng(seed);
      const q = pts.map(([x, y]) => [x + (r() - 0.5) * j * 2, y + (r() - 0.5) * j * 2]);
      const n = q.length;
      let d = `M${f(q[0][0])},${f(q[0][1])}`;
      for (let i = 0; i < (close ? n : n - 1); i++) {
        const p1 = q[i], p2 = q[(i + 1) % n];
        const a = close || i > 0 ? q[(i - 1 + n) % n] : p1;
        const b = close || i < n - 2 ? q[(i + 2) % n] : p2;
        d += ` C${f(p1[0] + (p2[0] - a[0]) / 6)},${f(p1[1] + (p2[1] - a[1]) / 6)} ${f(p2[0] - (b[0] - p1[0]) / 6)},${f(p2[1] - (b[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
      }
      return d + (close ? " Z" : "");
    },

    /** organic closed blob */
    blob(cx, cy, rx, ry, { seed = 1, n = 9, irr = 0.25 } = {}) {
      const r = T.rng(seed), pts = [];
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, k = 1 - irr + r() * irr * 2; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
      return props.wob(pts, { j: 0, close: true });
    },

    rectD: (x, y, w, h) => `M${x},${y} h${w} v${h} h${-w} Z`,
    ellD: (cx, cy, rx, ry) => `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0 Z`,

    /** rolling hill top from x0 to x1 around y, closed down to `bottom` */
    hillD(x0, x1, y, amp, { seed = 1, bumps = 3, bottom = 2200 } = {}) {
      const r = T.rng(seed), pts = [], n = bumps * 4;
      const ph = r() * 6;
      for (let i = 0; i <= n; i++) {
        const x = x0 + ((x1 - x0) * i) / n;
        pts.push([x, y - amp * (0.5 + 0.5 * Math.sin((i / n) * Math.PI * bumps + ph)) - r() * amp * 0.15]);
      }
      return props.wob(pts, { seed, j: 0 }) + ` L${x1},${bottom} L${x0},${bottom} Z`;
    },

    // ---------- airbrush ------------------------------------------------------------------
    airFilter(defs) {
      if (defs.__afAir) return defs.__afAir;
      const fid = nid("air");
      defs.__afAir = fid;
      const fl = T.el("filter", { id: fid, x: "-2%", y: "-2%", width: "104%", height: "104%", "color-interpolation-filters": "sRGB" }, defs);
      T.el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.9", numOctaves: "2", seed: "11", result: "n" }, fl);
      T.el("feColorMatrix", { in: "n", type: "matrix", values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 -0.6", result: "na" }, fl);
      // dense where the gradient is strong, breaking into isolated specks as it fades
      T.el("feComposite", { in: "SourceAlpha", in2: "na", operator: "arithmetic", k1: "0", k2: "1.7", k3: "1", k4: "-1.05", result: "m" }, fl);
      const ct = T.el("feComponentTransfer", { in: "m", result: "m2" }, fl);
      T.el("feFuncA", { type: "discrete", tableValues: "0 0 0.7 1 1" }, ct);
      T.el("feColorMatrix", { in: "SourceGraphic", type: "matrix", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 80 0", result: "solid" }, fl);
      T.el("feComposite", { in: "solid", in2: "m2", operator: "in" }, fl);
      return fid;
    },
    grad(defs, color, stops, dir = {}) {
      const gid = nid("g");
      const gr = dir.radial
        ? T.el("radialGradient", { id: gid, cx: dir.cx ?? "50%", cy: dir.cy ?? "50%", r: dir.r ?? "50%" }, defs)
        : T.el("linearGradient", { id: gid, x1: dir.x1 ?? 0, y1: dir.y1 ?? 0, x2: dir.x2 ?? 0, y2: dir.y2 ?? 1 }, defs);
      for (const [o, a] of stops) T.el("stop", { offset: `${o}%`, "stop-color": color, "stop-opacity": a }, gr);
      return `url(#${gid})`;
    },
    /** airbrush shade over path d: stops [[offset%, opacity]…], dir {x1,y1,x2,y2} or {radial:true} */
    shade(g, defs, d, color, stops, dir) {
      return T.el("path", { d, fill: props.grad(defs, color, stops, dir), filter: `url(#${props.airFilter(defs)})` }, g);
    },
    /** vertical sky gradient rectangle */
    sky(g, defs, { x = -60, y = -60, w, h, stops }) {
      const gid = nid("sky");
      const gr = T.el("linearGradient", { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      for (const [o, c] of stops) T.el("stop", { offset: `${o}%`, "stop-color": c }, gr);
      return T.el("rect", { x, y, width: w, height: h, fill: `url(#${gid})` }, g);
    },

    // ---------- sky & space ---------------------------------------------------------------
    /** long flat cloud bands; returns drifters for update */
    cloudBands(g, { x0 = -200, x1 = 1280, y0, y1, n = 10, color, seed = 1, opacity = 1, wMin = 260, wMax = 780, hMin = 24, hMax = 64 }) {
      const r = T.rng(seed), out = [];
      for (let i = 0; i < n; i++) {
        const w = wMin + r() * (wMax - wMin), h = hMin + r() * (hMax - hMin);
        const x = x0 + r() * (x1 - x0), y = y0 + ((i + r() * 0.8) / n) * (y1 - y0);
        const node = T.el("path", { d: props.blob(0, 0, w / 2, h / 2, { seed: seed * 31 + i, n: 16, irr: 0.32 }), fill: color, opacity }, g);
        out.push({ node, x, y, sp: 3 + r() * 6 });
      }
      return {
        update(t) { for (const c of out) c.node.setAttribute("transform", `translate(${f(c.x + t * c.sp)},${f(c.y)})`); },
      };
    },

    planet(g, defs, theme, { cx, cy, r, fill, blot, seed = 1, outline = 0.5, streaky = false }) {
      const p = T.el("g", { transform: `translate(${cx},${cy})` }, g);
      T.el("circle", { r, fill, ...(outline ? props.ink(theme, outline) : {}) }, p);
      const cid = nid("pl");
      T.el("circle", { r: r - 2 }, T.el("clipPath", { id: cid }, defs));
      const inner = T.el("g", { "clip-path": `url(#${cid})` }, p);
      const rs = T.rng(seed);
      for (let k = 0; k < (streaky ? 26 : 16); k++) {
        const a = rs() * Math.PI * 2, d = Math.sqrt(rs()) * r * 0.95;
        const bx = Math.cos(a) * d, by = Math.sin(a) * d * 0.85, rr = r * (0.05 + rs() * 0.13);
        T.el("path", { d: props.blob(bx, by, rr * (streaky ? 2.6 : 1.5), rr * (streaky ? 0.55 : 0.8), { seed: seed * 7 + k, n: 10, irr: 0.35 }), fill: blot, opacity: 0.9 }, inner);
      }
      T.el("path", { d: `M${r * 0.3},${-r} A${r},${r} 0 0 1 ${r * 0.3},${r} A${r * 0.82},${r} 0 0 0 ${r * 0.3},${-r} Z`, fill: "#000", opacity: 0.1 }, inner);
      return p;
    },

    ringed(g, theme, { x, y, r, rot = -18, body, band, ring, ringHi }) {
      const s = T.el("g", { transform: `translate(${x},${y}) rotate(${rot})` }, g);
      const back = `M${-r * 1.95},0 A${r * 1.95},${r * 0.42} 0 0 1 ${r * 1.95},0`;
      T.el("path", { d: back, fill: "none", stroke: ring, "stroke-width": r * 0.2 }, s);
      T.el("path", { d: back, fill: "none", stroke: ringHi, "stroke-width": r * 0.07 }, s);
      T.el("circle", { r, fill: body, ...props.ink(theme, 0.7) }, s);
      for (const [yy, w] of [[-0.45, 1.3], [-0.08, 1.8], [0.32, 1.5]]) T.el("path", { d: `M${-w * r / 2},${yy * r} q${w * r / 4},${-r * 0.13} ${w * r / 2},0 t${w * r / 2},0`, fill: "none", stroke: band, "stroke-width": r * 0.14, "stroke-linecap": "round" }, s);
      const front = `M${-r * 1.95},0 A${r * 1.95},${r * 0.42} 0 0 0 ${r * 1.95},0`;
      T.el("path", { d: front, fill: "none", stroke: ring, "stroke-width": r * 0.2, "stroke-linecap": "round" }, s);
      T.el("path", { d: front, fill: "none", stroke: ringHi, "stroke-width": r * 0.07, "stroke-linecap": "round" }, s);
      return s;
    },

    /** a diagonal stream of tiny particles (bubbles / spores) */
    trail(g, { x0, y0, x1, y1, n = 160, seed = 1, colors, spread = 90, rMin = 2, rMax = 9 }) {
      const r = T.rng(seed), out = [];
      for (let i = 0; i < n; i++) {
        const k = r(), sp = spread * (0.3 + k) * (r() - 0.5) * 2;
        const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny);
        const x = x0 + (x1 - x0) * k + (nx / nl) * sp, y = y0 + (y1 - y0) * k + (ny / nl) * sp;
        const c = colors[Math.floor(r() * colors.length)];
        out.push({ node: T.el("circle", { cx: f(x), cy: f(y), r: f(rMin + r() * r() * (rMax - rMin)), fill: c, stroke: "#4b7f6a", "stroke-width": r() < 0.4 ? 1.2 : 0, opacity: f(0.55 + r() * 0.45) }, g), x, y, ph: r() * 6 });
      }
      return { update(t) { for (const p of out) p.node.setAttribute("transform", `translate(${f(Math.sin(t * 0.7 + p.ph) * 4 - t * 2)},${f(Math.cos(t * 0.6 + p.ph) * 3 + t * 1.2)})`); } };
    },

    // ---------- ground ----------------------------------------------------------------------
    /** open contour strokes across a ground area, thinner and shorter toward the horizon */
    contours(g, theme, { x0 = -40, x1 = 1120, y0, y1, n = 20, seed = 1, color }) {
      const r = T.rng(seed);
      for (let i = 0; i < n; i++) {
        const k = r(), y = y0 + k * (y1 - y0), x = x0 + r() * (x1 - x0), len = (60 + r() * 320) * (0.5 + k);
        const pts = [0, 1, 2, 3].map((j) => [x + (len * j) / 3, y + Math.sin(j * 1.7 + i) * 5 * (0.5 + k)]);
        T.el("path", { d: props.wob(pts, { seed: seed + i, j: 1 }), fill: "none", ...props.ink(theme, 0.38 + k * 0.32), ...(color ? { stroke: color } : {}) }, g);
      }
    },

    /** grass tuft: 3–4 blades, ink under a lighter colour (reads as outlined blades) */
    tuft(g, theme, x, y, s, color, seed = 1) {
      const r = T.rng(seed), t = T.el("g", { transform: `translate(${f(x)},${f(y)}) scale(${f(s)})` }, g);
      const n = 3 + Math.floor(r() * 2);
      let d = "";
      for (let i = 0; i < n; i++) {
        const bx = (i - (n - 1) / 2) * 7, ang = (i - (n - 1) / 2) * 0.35 + (r() - 0.5) * 0.2, len = 20 + r() * 16;
        d += `M${f(bx)},0 Q${f(bx + Math.sin(ang) * len * 0.3)},${f(-len * 0.6)} ${f(bx + Math.sin(ang) * len)},${f(-len)} `;
      }
      T.el("path", { d, fill: "none", stroke: theme.line.color, "stroke-width": 7, "stroke-linecap": "round" }, t);
      T.el("path", { d, fill: "none", stroke: color, "stroke-width": 3.2, "stroke-linecap": "round" }, t);
      return t;
    },
    tufts(g, theme, { x0 = 0, x1 = 1080, y0, y1, n = 12, color, seed = 1, sMin = 0.6, sMax = 1.2 }) {
      const r = T.rng(seed);
      for (let i = 0; i < n; i++) { const k = r(); props.tuft(g, theme, x0 + r() * (x1 - x0), y0 + k * (y1 - y0), sMin + k * (sMax - sMin), color, seed * 13 + i); }
    },
    pebbles(g, theme, { x0 = 0, x1 = 1080, y0, y1, n = 20, colors, seed = 1 }) {
      const r = T.rng(seed);
      for (let i = 0; i < n; i++) {
        const k = r(), x = x0 + r() * (x1 - x0), y = y0 + k * (y1 - y0), s = (2 + r() * 6) * (0.5 + k);
        const outlined = r() < 0.55;
        T.el("ellipse", { cx: f(x), cy: f(y), rx: f(s * 1.3), ry: f(s * 0.8), fill: colors[i % colors.length], ...(outlined ? props.ink(theme, 0.4) : {}) }, g);
      }
    },

    // ---------- alien flora & rocks -------------------------------------------------------------
    /** puffy candy tree: thin forked trunk, merged puffs, highlight arcs, airbrush underside */
    puffTree(g, defs, theme, { x, y, s = 1, crown, shadeC, hi, trunk, seed = 1, flip = false }) {
      const r = T.rng(seed), lw = theme.line.width;
      const t = T.el("g", { transform: `translate(${x},${y}) scale(${flip ? -s : s},${s})` }, g);
      const td = "M0,0 C-4,-70 6,-120 0,-175 M1,-150 C-26,-180 -52,-196 -74,-236 M2,-160 C28,-186 50,-204 64,-242";
      T.el("path", { d: td, fill: "none", stroke: theme.line.color, "stroke-width": 24 + lw * 2, "stroke-linecap": "round" }, t);
      T.el("path", { d: td, fill: "none", stroke: trunk, "stroke-width": 22, "stroke-linecap": "round" }, t);
      const base = [[-96, -262, 62], [-40, -310, 80], [42, -312, 76], [104, -262, 64], [58, -238, 66], [-24, -238, 70], [-108, -228, 46]];
      const puffs = base.map(([px, py, pr]) => [px + (r() - 0.5) * 18, py + (r() - 0.5) * 16, pr * (0.88 + r() * 0.24)]);
      for (const [px, py, pr] of puffs) T.el("circle", { cx: f(px), cy: f(py), r: f(pr + lw * 0.9), fill: theme.line.color }, t);
      for (const [px, py, pr] of puffs) T.el("circle", { cx: f(px), cy: f(py), r: f(pr), fill: crown }, t);
      const cid = nid("tree");
      const cp = T.el("clipPath", { id: cid }, defs);
      for (const [px, py, pr] of puffs) T.el("circle", { cx: f(px), cy: f(py), r: f(pr) }, cp);
      const sh = T.el("g", { "clip-path": `url(#${cid})` }, t);
      props.shade(sh, defs, props.rectD(-200, -400, 400, 240), shadeC, [[0, 0], [55, 0.15], [100, 0.95]]);
      // inner partial outlines: the lumpy overlap of puffs
      puffs.forEach(([px, py, pr], i) => {
        if (i % 2) return;
        const a0 = 0.6 + r() * 0.6, a1 = a0 + 1.2;
        T.el("path", { d: `M${f(px + Math.cos(a0) * pr)},${f(py + Math.sin(a0) * pr)} A${f(pr)},${f(pr)} 0 0 1 ${f(px + Math.cos(a1) * pr)},${f(py + Math.sin(a1) * pr)}`, fill: "none", ...props.ink(theme, 0.55) }, t);
      });
      // highlight arcs top-left of each puff
      for (const [px, py, pr] of puffs) {
        const rr = pr * 0.62, a0 = 3.5, a1 = 4.5;
        T.el("path", { d: `M${f(px + Math.cos(a0) * rr)},${f(py + Math.sin(a0) * rr)} A${f(rr)},${f(rr)} 0 0 1 ${f(px + Math.cos(a1) * rr)},${f(py + Math.sin(a1) * rr)}`, fill: "none", stroke: hi, "stroke-width": 7, "stroke-linecap": "round" }, t);
      }
      return t;
    },

    /** colour pool: airbrushed rim, wobbly outline, concentric broken rings (ripple in update) */
    pool(g, defs, theme, { cx, cy, rx, ry, fill, ring, rim, seed = 1 }) {
      props.shade(g, defs, props.ellD(cx, cy, rx * 1.3, ry * 1.9), rim, [[50, 0], [68, 0.95], [100, 0]], { radial: true });
      T.el("path", { d: props.blob(cx, cy, rx, ry, { seed, n: 12, irr: 0.06 }), fill, ...props.ink(theme, 0.6) }, g);
      const rings = [0.82, 0.62, 0.42, 0.22].map((k, i) => T.el("ellipse", { cx, cy: cy + ry * 0.06 * i, rx: f(rx * k), ry: f(ry * k * 0.8), fill: "none", stroke: ring, "stroke-width": 3, "stroke-dasharray": `${f(rx * k * 1.6)} ${f(rx * 0.2)}` }, g));
      return { update(t) { rings.forEach((n, i) => n.setAttribute("stroke-dashoffset", f(t * (14 + i * 5)))); } };
    },

    /** tapered rounded spire, with a shade band, ridge marks and an eye or hole near the top */
    spire(g, theme, { x, base, h, w, fill, shadeC, eye, hole = "#7a3a2a", seed = 1 }) {
      const r = T.rng(seed), s = T.el("g", {}, g);
      const top = base - h, lean = (r() - 0.5) * w * 0.4;
      const outline = props.wob([[x - w / 2, base], [x - w * 0.42 + lean * 0.5, base - h * 0.5], [x - w * 0.36 + lean, top + w * 0.3], [x + lean, top - w * 0.08], [x + w * 0.36 + lean, top + w * 0.3], [x + w * 0.42 + lean * 0.5, base - h * 0.5], [x + w / 2, base]], { seed, j: 1 });
      T.el("path", { d: outline + " Z", fill, ...props.ink(theme, 0.7) }, s);
      T.el("path", { d: props.wob([[x + w * 0.16, base], [x + w * 0.16 + lean * 0.5, base - h * 0.5], [x + w * 0.14 + lean, top + w * 0.36], [x + w * 0.34 + lean, top + w * 0.32], [x + w * 0.4 + lean * 0.5, base - h * 0.5], [x + w * 0.48, base]], { seed: seed + 1, j: 0 }) + " Z", fill: shadeC }, s);
      for (let k = 1; k < 4; k++) { const yy = base - h * (0.2 + k * 0.17); T.el("path", { d: `M${f(x - w * 0.3 + lean * (1 - (yy - top) / h))},${f(yy)} q${f(w * 0.15)},${f(5)} ${f(w * 0.3)},0`, fill: "none", ...props.ink(theme, 0.4) }, s); }
      const ey = top + w * 0.55;
      if (eye) {
        T.el("ellipse", { cx: f(x + lean * 0.9), cy: f(ey), rx: f(w * 0.2), ry: f(w * 0.28), fill: eye, ...props.ink(theme, 0.55) }, s);
        T.el("ellipse", { cx: f(x + lean * 0.9), cy: f(ey), rx: f(w * 0.05), ry: f(w * 0.17), fill: theme.line.color }, s);
      } else T.el("ellipse", { cx: f(x + lean * 0.9), cy: f(ey), rx: f(w * 0.14), ry: f(w * 0.2), fill: hole, ...props.ink(theme, 0.5) }, s);
      return s;
    },

    /** pale faceted crystal shard */
    crystal(g, theme, { x, y, s = 60, rot = 0, light = "#e3f4fb", mid = "#a9d8ef", dark = "#7fb7da" }) {
      const c = T.el("g", { transform: `translate(${f(x)},${f(y)}) rotate(${f(rot)}) scale(${f(s)})` }, g);
      const sw = theme.line.width * 0.55 / s;
      T.el("path", { d: "M0,0 L-0.26,-0.55 L0,-1 L0.02,-0.42 Z", fill: light }, c);
      T.el("path", { d: "M0,0 L0.02,-0.42 L0,-1 L0.24,-0.52 Z", fill: mid }, c);
      T.el("path", { d: "M0,0 L0.24,-0.52 L0.3,-0.28 Z", fill: dark }, c);
      T.el("path", { d: "M0,0 L-0.26,-0.55 L0,-1 L0.24,-0.52 L0.3,-0.28 Z", fill: "none", stroke: theme.line.color, "stroke-width": sw, "stroke-linejoin": "round" }, c);
      T.el("path", { d: "M-0.12,-0.5 L-0.02,-0.82", stroke: "#fff", "stroke-width": sw * 1.4, "stroke-linecap": "round", opacity: 0.8 }, c);
      return c;
    },
    crystals(g, theme, { x, y, n = 3, s = 70, seed = 1, ...colors }) {
      const r = T.rng(seed);
      for (let i = 0; i < n; i++) props.crystal(g, theme, { x: x + (i - (n - 1) / 2) * s * 0.4 + (r() - 0.5) * 12, y: y + r() * 6, s: s * (0.55 + r() * 0.6), rot: (i - (n - 1) / 2) * 22 + (r() - 0.5) * 14, ...colors });
    },

    /** low faceted boulder */
    rock(g, theme, { x, y, rx, ry, fill, facet, seed = 1 }) {
      const s = T.el("g", {}, g);
      T.el("path", { d: props.blob(x, y, rx, ry, { seed, n: 7, irr: 0.18 }), fill, ...props.ink(theme, 0.8) }, s);
      T.el("path", { d: `M${f(x - rx * 0.5)},${f(y - ry * 0.55)} L${f(x - rx * 0.05)},${f(y - ry * 0.85)} L${f(x + rx * 0.2)},${f(y - ry * 0.2)} L${f(x - rx * 0.35)},${f(y - ry * 0.05)} Z`, fill: facet, ...props.ink(theme, 0.45) }, s);
      return s;
    },

    // ---------- everyday interior ---------------------------------------------------------------
    /** framed picture with a tiny generic painting: "flowers" | "boat" | "hills" */
    picture(g, theme, { x, y, w, h, frame = "#a77c4f", art = "hills", seed = 1 }) {
      const p = T.el("g", { transform: `translate(${x},${y})` }, g);
      const b = Math.min(w, h) * 0.11;
      T.el("rect", { x: 0, y: 0, width: w, height: h, rx: 3, fill: frame, ...props.ink(theme, 0.7) }, p);
      T.el("rect", { x: b * 0.45, y: b * 0.45, width: w - b * 0.9, height: h - b * 0.9, fill: "none", ...props.ink(theme, 0.35) }, p);
      const ix = b, iy = b, iw = w - 2 * b, ih = h - 2 * b;
      const a = T.el("g", { transform: `translate(${ix},${iy})` }, p);
      if (art === "flowers") {
        T.el("rect", { width: iw, height: ih, fill: "#cfe0c8" }, a);
        T.el("path", { d: `M${iw * 0.35},${ih} L${iw * 0.4},${ih * 0.62} L${iw * 0.6},${ih * 0.62} L${iw * 0.65},${ih} Z`, fill: "#7fa3b8", ...props.ink(theme, 0.4) }, a);
        const r = T.rng(seed);
        for (let i = 0; i < 6; i++) {
          const fx = iw * (0.25 + r() * 0.5), fy = ih * (0.18 + r() * 0.32);
          T.el("path", { d: `M${iw / 2},${ih * 0.62} L${f(fx)},${f(fy)}`, stroke: "#5c8a3a", "stroke-width": 2 }, a);
          T.el("circle", { cx: f(fx), cy: f(fy), r: f(iw * 0.08), fill: "#f2c43a", ...props.ink(theme, 0.3) }, a);
          T.el("circle", { cx: f(fx), cy: f(fy), r: f(iw * 0.03), fill: "#8a5a2a" }, a);
        }
      } else if (art === "boat") {
        T.el("rect", { width: iw, height: ih * 0.6, fill: "#cde5ea" }, a);
        T.el("rect", { y: ih * 0.6, width: iw, height: ih * 0.4, fill: "#5f9fb0" }, a);
        T.el("path", { d: `M${iw * 0.25},${ih * 0.62} L${iw * 0.75},${ih * 0.62} L${iw * 0.66},${ih * 0.72} L${iw * 0.32},${ih * 0.72} Z`, fill: "#8a5a3a", ...props.ink(theme, 0.35) }, a);
        T.el("path", { d: `M${iw * 0.5},${ih * 0.6} L${iw * 0.5},${ih * 0.15} L${iw * 0.72},${ih * 0.55} Z`, fill: "#f4ecd6", ...props.ink(theme, 0.35) }, a);
      } else {
        T.el("rect", { width: iw, height: ih, fill: "#f1e3b8" }, a);
        T.el("circle", { cx: iw * 0.72, cy: ih * 0.3, r: iw * 0.1, fill: "#f2a24a" }, a);
        T.el("path", { d: `M0,${ih * 0.7} Q${iw * 0.3},${ih * 0.45} ${iw * 0.6},${ih * 0.65} T${iw},${ih * 0.6} L${iw},${ih} L0,${ih} Z`, fill: "#8fb36a" }, a);
      }
      T.el("rect", { x: ix, y: iy, width: iw, height: ih, fill: "none", ...props.ink(theme, 0.45) }, p);
      return p;
    },

    /** curtain panel with fold lines and a wavy hem */
    curtain(g, defs, theme, { x, top, w, h, color, shadeC, seed = 1, side = 1 }) {
      const c = T.el("g", {}, g);
      const r = T.rng(seed), hem = [];
      for (let i = 0; i <= 6; i++) hem.push([x + w - (w * i) / 6, top + h + (i % 2 ? 10 : -4) + r() * 6]);
      const d = props.wob([[x, top], [x + w, top], [x + w + 4 * side, top + h * 0.5], ...hem, [x - 4 * side, top + h * 0.5]], { seed, j: 1, close: true });
      T.el("path", { d, fill: color, ...props.ink(theme, 0.7) }, c);
      props.shade(c, defs, d, shadeC, [[0, side > 0 ? 0 : 0.8], [100, side > 0 ? 0.8 : 0]], { x1: 0, y1: 0, x2: 1, y2: 0 });
      for (let k = 1; k < 4; k++) { const fx = x + (w * k) / 4; T.el("path", { d: props.wob([[fx, top + 8], [fx + 5, top + h * 0.4], [fx - 3, top + h * 0.75], [fx + 2, top + h - 6]], { seed: seed + k, j: 1.5 }), fill: "none", ...props.ink(theme, 0.5) }, c); }
      return c;
    },
    rod(g, theme, { x0, x1, y, rings = [], color = "#d9dde0" }) {
      T.el("path", { d: `M${x0},${y} L${x1},${y}`, stroke: theme.line.color, "stroke-width": 15, "stroke-linecap": "round" }, g);
      T.el("path", { d: `M${x0},${y} L${x1},${y}`, stroke: color, "stroke-width": 9, "stroke-linecap": "round" }, g);
      for (const rx of rings) T.el("ellipse", { cx: rx, cy: y + 2, rx: 5, ry: 13, fill: "none", ...props.ink(theme, 0.6) }, g);
      for (const fx of [x0, x1]) T.el("circle", { cx: fx, cy: y, r: 14, fill: color, ...props.ink(theme, 0.7) }, g);
    },
    /** hanging cone lamp; returns its group (swing it in update) */
    hangLamp(g, theme, { x, y0, len, w, color, inner = "#fff6d8" }) {
      const l = T.el("g", { transform: `translate(${x},${y0})` }, g);
      T.el("path", { d: `M0,0 L0,${len}`, ...props.ink(theme, 0.6) }, l);
      T.el("path", { d: `M-8,${len - 6} h16 v12 h-16 Z`, fill: "#bfb59a", ...props.ink(theme, 0.5) }, l);
      const hh = w * 0.38;
      T.el("path", { d: `M-10,${len + 6} L${-w / 2},${len + hh} L${w / 2},${len + hh} L10,${len + 6} Z`, fill: color, ...props.ink(theme, 0.7) }, l);
      T.el("ellipse", { cx: 0, cy: len + hh, rx: w / 2, ry: w * 0.07, fill: inner, ...props.ink(theme, 0.6) }, l);
      T.el("path", { d: `M-4,${len + 14} L${-w * 0.36},${len + hh - 6}`, stroke: "#fff", "stroke-width": 5, "stroke-linecap": "round", opacity: 0.55 }, l);
      return l;
    },

    // ---------- sci-fi ---------------------------------------------------------------------------
    /** segmented pipe along path d (outline, body, ring bands, highlight) */
    pipe(g, theme, d, w, { fill = "#9aa6b6", band = "#5f6b7c", hi = "#e9eef5", step } = {}) {
      const lw = theme.line.width, p = T.el("g", {}, g);
      T.el("path", { d, fill: "none", stroke: theme.line.color, "stroke-width": w + lw * 1.6, "stroke-linecap": "butt" }, p);
      T.el("path", { d, fill: "none", stroke: fill, "stroke-width": w, "stroke-linecap": "butt" }, p);
      T.el("path", { d, fill: "none", stroke: band, "stroke-width": w, "stroke-dasharray": `${f(lw * 1.1)} ${f(step || w * 0.75)}`, "stroke-linecap": "butt" }, p);
      T.el("path", { d, fill: "none", stroke: hi, "stroke-width": w * 0.16, transform: `translate(0,${f(-w * 0.22)})`, opacity: 0.7 }, p);
      return p;
    },
    /** door panel with yellow/black hazard stripes and grime */
    hazard(g, defs, theme, { x, y, w, h, yellow = "#f0b13a", black = "#2c2b31", r = 16 }) {
      const pid = nid("haz");
      const pat = T.el("pattern", { id: pid, width: 90, height: 90, patternUnits: "userSpaceOnUse", patternTransform: "rotate(-40)" }, defs);
      T.el("rect", { width: 90, height: 90, fill: yellow }, pat);
      T.el("rect", { width: 42, height: 90, fill: black }, pat);
      const d = `M${x + r},${y} h${w - 2 * r} q${r},0 ${r},${r} v${h - 2 * r} q0,${r} ${-r},${r} h${-(w - 2 * r)} q${-r},0 ${-r},${-r} v${-(h - 2 * r)} q0,${-r} ${r},${-r} Z`;
      T.el("path", { d, fill: `url(#${pid})`, ...props.ink(theme, 0.8) }, g);
      props.shade(g, defs, d, "#4a3a20", [[0, 0.55], [30, 0], [75, 0], [100, 0.6]]);
      return d;
    },
    /** dark vertical slot with light dashes; returns nodes to flicker */
    lightSlot(g, theme, { x, y, w, h, n = 7, color = "#e8eef8", glow = "#ff7fb0" }) {
      T.el("rect", { x, y, width: w, height: h, rx: w / 2, fill: "#2e3440", ...props.ink(theme, 0.7) }, g);
      const out = [];
      for (let i = 0; i < n; i++) out.push(T.el("rect", { x: x + w * 0.25, y: y + w * 0.6 + (i * (h - w * 1.2)) / n, width: w * 0.5, height: 4, rx: 2, fill: i % 3 === 1 ? glow : color }, g));
      return out;
    },
    vent(g, theme, { x, y, w, h, n = 8, fill = "#8d95a1" }) {
      T.el("rect", { x, y, width: w, height: h, rx: 8, fill, ...props.ink(theme, 0.7) }, g);
      for (let i = 1; i <= n; i++) T.el("path", { d: `M${x + 8},${y + (i * h) / (n + 1)} l${w - 16},${-3}`, ...props.ink(theme, 0.55) }, g);
    },
    /** made-up alien lettering (never real text) */
    glyphs(g, theme, { x, y, n = 6, size = 26, color, seed = 1, width = 3 }) {
      const r = T.rng(seed);
      let d = "";
      for (let i = 0; i < n; i++) {
        const gx = x + i * size * 0.85, s = size;
        const kind = Math.floor(r() * 6);
        if (kind === 0) d += `M${gx},${y} l0,${-s} M${gx},${y - s / 2} l${s * 0.5},0 `;
        else if (kind === 1) d += `M${gx},${y - s} a${s / 3},${s / 3} 0 1,0 0,${s * 0.66} l${s * 0.5},${s * 0.34} `;
        else if (kind === 2) d += `M${gx},${y} l${s * 0.3},${-s} l${s * 0.3},${s} M${gx + s * 0.12},${y - s * 0.4} l${s * 0.36},0 `;
        else if (kind === 3) d += `M${gx},${y - s} l${s * 0.6},0 l${-s * 0.6},${s} l${s * 0.6},0 `;
        else if (kind === 4) d += `M${gx + s * 0.3},${y} l0,${-s} M${gx},${y - s * 0.7} q${s * 0.3},${-s * 0.4} ${s * 0.6},0 `;
        else d += `M${gx},${y - s * 0.3} a${s * 0.3},${s * 0.3} 0 1,1 ${s * 0.6},0 a${s * 0.3},${s * 0.3} 0 1,1 ${-s * 0.6},0 `;
      }
      T.el("path", { d, fill: "none", stroke: theme.line.color, "stroke-width": width + 3, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
      T.el("path", { d, fill: "none", stroke: color, "stroke-width": width, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    },
    /** skew a wall-mounted group into one-point perspective toward vanishing point (vx, vy) */
    wallSkew(cx, cy, vx, vy) {
      const s = (vy - cy) / (vx - cx);
      return `translate(${f(cx)},${f(cy)}) matrix(1,${s.toFixed(3)},0,1,0,0) translate(${f(-cx)},${f(-cy)})`;
    },
  };

  AF.props = props;
})(window);

/* ---- added: urban wear (alley) ---- */
(function (global) {
  "use strict";
  const T = global.Toon, X = T.styles["adult-flat-2014"].props;
  /** plaster crack: a branching open line */
  X.crack = (g, theme, { x, y, len = 120, ang = 1.2, seed = 1 }) => {
    const r = T.rng(seed);
    let d = `M${x},${y}`, px = x, py = y;
    for (let i = 0; i < 5; i++) { const a = ang + (r() - 0.5) * 0.9, l = len / 5; px += Math.cos(a) * l; py += Math.sin(a) * l; d += ` L${px.toFixed(1)},${py.toFixed(1)}`; if (r() < 0.5) d += ` M${px.toFixed(1)},${py.toFixed(1)} l${((r() - 0.5) * 40).toFixed(1)},${(18 + r() * 20).toFixed(1)} M${px.toFixed(1)},${py.toFixed(1)}`; }
    T.el("path", { d, fill: "none", ...X.ink(theme, 0.45) }, g);
  };
  /** broken plaster patch showing bricks underneath */
  X.brickPatch = (g, defs, theme, { cx, cy, rx, ry, brick = "#8a6a55", mortar = "#5a4436", seed = 1 }) => {
    const d = X.blob(cx, cy, rx, ry, { seed, n: 11, irr: 0.35 });
    T.el("path", { d, fill: brick, ...X.ink(theme, 0.7) }, g);
    const id = `af-bp-${seed}-${cx | 0}`;
    T.el("path", { d }, T.el("clipPath", { id }, defs));
    const b = T.el("g", { "clip-path": `url(#${id})` }, g);
    for (let y = cy - ry, row = 0; y < cy + ry; y += 26, row++) {
      T.el("path", { d: `M${cx - rx},${y} L${cx + rx},${y}`, stroke: mortar, "stroke-width": 3 }, b);
      for (let x = cx - rx + (row % 2) * 30; x < cx + rx; x += 60) T.el("path", { d: `M${x},${y} l0,26`, stroke: mortar, "stroke-width": 3 }, b);
    }
  };
  /** brick marks drawn sparsely on a facade (the genre suggests bricks, never fills them all) */
  X.brickMarks = (g, theme, { x0, x1, y0, y1, n = 10, seed = 1, color }) => {
    const r = T.rng(seed);
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0 - 60), y = y0 + r() * (y1 - y0);
      T.el("path", { d: `M${x},${y} l60,0 m-30,0 l0,14 m-30,0 l60,0 m-60,0 l0,-14`, fill: "none", ...X.ink(theme, 0.38), ...(color ? { stroke: color } : {}) }, g);
    }
  };
  /** crushed can on its side */
  X.can = (g, theme, { x, y, s = 1, color = "#d9dde2" }) => {
    const c = T.el("g", { transform: `translate(${x},${y}) scale(${s})` }, g);
    T.el("path", { d: "M-22,-10 L14,-12 L20,-4 L16,8 L-20,10 Z", fill: color, ...X.ink(theme, 0.5) }, c);
    T.el("ellipse", { cx: -22, cy: 0, rx: 5, ry: 10, fill: "#a7adb5", ...X.ink(theme, 0.4) }, c);
  };
})(window);
