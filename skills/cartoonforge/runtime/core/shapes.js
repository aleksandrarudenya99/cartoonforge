/**
 * shapes.js — shared path builders for scenery and effects. All return an SVG path `d` string.
 * Styles use these instead of re-inventing curls, stars and clouds.
 */
(function (global) {
  "use strict";
  const T = global.Toon;
  const f = (n) => n.toFixed(1);

  const shapes = {
    /** Archimedean curl (ornaments, vines, ukiyo-e wave tips). */
    spiral(cx, cy, r, turns = 1.6, dir = 1, a0 = 0) {
      let d = "";
      const steps = Math.ceil(turns * 24);
      for (let i = 0; i <= steps; i++) {
        const k = i / steps, a = a0 + dir * k * turns * 2 * Math.PI, rr = r * (1 - k * 0.85);
        d += `${i ? "L" : "M"}${f(cx + Math.cos(a) * rr)},${f(cy + Math.sin(a) * rr)} `;
      }
      return d;
    },

    /** n-point star / starburst. inner = inner radius ratio. */
    star(cx, cy, r, points = 4, inner = 0.25, rot = 0) {
      let d = "";
      for (let k = 0; k < points * 2; k++) {
        const a = rot + (k * Math.PI) / points, rr = k % 2 ? r * inner : r;
        d += `${k ? "L" : "M"}${f(cx + Math.cos(a) * rr)},${f(cy + Math.sin(a) * rr)} `;
      }
      return d + "Z";
    },

    /** Tapered brush stroke, pointed at both ends, `w` = half-width at the middle. */
    brush(x0, y0, x1, y1, w) {
      const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, nx = (-dy / len) * w, ny = (dx / len) * w;
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      return `M${f(x0)},${f(y0)} Q${f(mx + nx)},${f(my + ny)} ${f(x1)},${f(y1)} Q${f(mx - nx)},${f(my - ny)} ${f(x0)},${f(y0)} Z`;
    },

    /** Puffy cloud of `bumps` arcs between x0..x1 on baseline y. */
    cloud(x0, x1, y, h = 60, bumps = 4) {
      const w = (x1 - x0) / bumps;
      let d = `M${f(x0)},${f(y)}`;
      for (let i = 0; i < bumps; i++) {
        const hh = h * (i === 0 || i === bumps - 1 ? 0.7 : 1);
        d += ` C${f(x0 + i * w)},${f(y - hh)} ${f(x0 + (i + 1) * w)},${f(y - hh)} ${f(x0 + (i + 1) * w)},${f(y)}`;
      }
      return d + " Z";
    },

    /** Ridge line of hills / mountains / torn paper from x0 to x1, seeded. Closed down to `bottom`. */
    ridge(x0, x1, y, h, { seed = 1, peaks = 5, bottom = y + 1000, sharp = false, jag = 0 } = {}) {
      const r = T.rng(seed);
      const step = (x1 - x0) / peaks;
      let d = `M${f(x0)},${f(bottom)} L${f(x0)},${f(y)}`;
      for (let i = 1; i <= peaks; i++) {
        const x = x0 + i * step, py = y + (r() - 0.5) * h * 0.4, top = y - h * (0.4 + r() * 0.6);
        d += sharp ? ` L${f(x - step / 2)},${f(top)} L${f(x)},${f(py)}` : ` Q${f(x - step / 2)},${f(top)} ${f(x)},${f(py)}`;
        if (jag) for (let k = 0; k < 3; k++) d += ` l${f((r() - 0.5) * jag)},${f((r() - 0.5) * jag)}`;
      }
      return d + ` L${f(x1)},${f(bottom)} Z`;
    },

    /** Ukiyo-e wave crest: a swelling body with curled claw tips. */
    wave(x, y, w, h, dir = 1) {
      const e = x + dir * w;
      let d = `M${f(x)},${f(y)} C${f(x + dir * w * 0.2)},${f(y - h)} ${f(x + dir * w * 0.75)},${f(y - h * 1.1)} ${f(e)},${f(y - h * 0.55)}`;
      d += ` C${f(e - dir * w * 0.1)},${f(y - h * 0.2)} ${f(e - dir * w * 0.25)},${f(y - h * 0.45)} ${f(e - dir * w * 0.3)},${f(y - h * 0.3)}`;
      d += ` C${f(x + dir * w * 0.55)},${f(y - h * 0.2)} ${f(x + dir * w * 0.4)},${f(y + h * 0.1)} ${f(x)},${f(y)} Z`;
      return d;
    },

    /** Regular polygon. */
    poly(cx, cy, r, n = 6, rot = 0) {
      let d = "";
      for (let k = 0; k < n; k++) {
        const a = rot + (k * 2 * Math.PI) / n;
        d += `${k ? "L" : "M"}${f(cx + Math.cos(a) * r)},${f(cy + Math.sin(a) * r)} `;
      }
      return d + "Z";
    },
  };

  T.shapes = shapes;
})(window);
