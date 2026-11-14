/**
 * Character kit: builds a character from a SPEC (who: hair, outfit, colours, props — from the user)
 * drawn with a style's RULES (how: proportions, head shape, eyes, nose, mouth, hands, limbs, line).
 * The same spec in two styles must look like the same person drawn by two different studios.
 *
 *   const nova = Toon.characters.kit.build(parentG, spec, style.parts.character.rules, { theme, defs });
 *   nova.pose({ x, y, scale, lean, squash, stepL, stepR, handL, handR, bendL, bendR, look, blink, mouth, headTilt });
 *
 * Local coordinates: feet on y = 0, up is negative. Pose fields are compatible with the reference rig.
 *
 * RULES (style.parts.character.rules):
 *   proportions { headR, headShape, torsoH, torsoW, hipW, legLen, limbW, neckLen, neckW, handR, footL, scale }
 *     headShape: round | wideOval | tallOval | bean
 *   line   { width, color }          width 0 = no outlines
 *   eyes   { type, size, gap, pupilSize, y }   type: bigRound | pie | anime | dot | bead
 *   brows  { type, width }           type: none | line | thick
 *   nose   { type }                  type: none | bump | dot | triangle | hook
 *   mouth  { type, width }           type: line | wide | small
 *   hands  { type, fingers }         type: mitten | glove | ball
 *   limbs  { type }                  type: tube | hose
 *   hair   { scale }                 how big / simplified hair is drawn
 *   jitter { amount }                optional per-drawing line wobble handled by the style's fx
 */
(function (global) {
  "use strict";
  const T = global.Toon;
  const f = (n) => (+n).toFixed(1);

  const DEFAULT_RULES = {
    proportions: { headR: 110, headShape: "round", torsoH: 250, torsoW: 190, hipW: 150, legLen: 300, limbW: 26, neckLen: 26, neckW: 40, handR: 26, footL: 70, scale: 1 },
    line: { width: 6, color: "#1d1d1d" },
    eyes: { type: "pie", size: 26, gap: 30, pupilSize: 10, y: -0.05 },
    brows: { type: "line", width: 5 },
    nose: { type: "dot" },
    mouth: { type: "small", width: 46 },
    hands: { type: "mitten", fingers: 4 },
    limbs: { type: "tube" },
    hair: { scale: 1 },
  };

  function merge(a, b) {
    const o = { ...a };
    for (const k in b || {}) o[k] = b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) ? { ...a[k], ...b[k] } : b[k];
    return o;
  }

  function build(parent, spec, rulesIn, { theme } = {}) {
    const R = merge(DEFAULT_RULES, rulesIn || {});
    const P = R.proportions, LW = R.line.width, LC = R.line.color;
    const O = spec.outfit || {};
    const el = T.el;
    const stroke = LW ? { stroke: LC, "stroke-width": LW, "stroke-linejoin": "round", "stroke-linecap": "round" } : {};
    const root = el("g", { "data-character": spec.name || "character" }, parent);

    // ---- skeleton (rest pose)
    const hipY = -P.legLen, shY = hipY - P.torsoH, neckTop = shY - P.neckLen;
    const headCY = neckTop - P.headR * 0.82;
    const SH = { L: [-P.torsoW / 2 + P.limbW * 0.4, shY + P.limbW * 0.6], R: [P.torsoW / 2 - P.limbW * 0.4, shY + P.limbW * 0.6] };
    const HIP = { L: [-P.hipW / 4, hipY], R: [P.hipW / 4, hipY] };
    const armLen = P.torsoH * 1.05;
    const REST = { handL: [SH.L[0] - 40, SH.L[1] + armLen * 0.92], handR: [SH.R[0] + 40, SH.R[1] + armLen * 0.92], footL: [-P.hipW / 4 - 8, 0], footR: [P.hipW / 4 + 8, 0] };

    // ---- layers inside the character, back to front
    const gBackpack = el("g", {}, root);
    const gHairBack = el("g", {}, root);
    const gLegs = el("g", {}, root);
    const gTorso = el("g", {}, root);
    const gArmBack = el("g", {}, root);
    const gHead = el("g", {}, root);
    const gArmFront = el("g", {}, root);

    // backpack (behind the body)
    if (spec.backpack) {
      el("rect", { ...stroke, x: -P.torsoW * 0.42, y: shY + 10, width: P.torsoW * 0.84, height: P.torsoH * 0.78, rx: 30, fill: spec.backpack }, gBackpack);
      el("rect", { ...stroke, x: -P.torsoW * 0.3, y: shY + P.torsoH * 0.45, width: P.torsoW * 0.6, height: P.torsoH * 0.26, rx: 16, fill: spec.backpack, opacity: 0.9 }, gBackpack);
    }

    // legs: outlined tubes (outline stroke under a fill stroke)
    const legOut = ["L", "R"].map(() => el("path", { fill: "none", stroke: LC, "stroke-width": P.limbW + LW * 2, "stroke-linecap": "round" }, gLegs));
    const legIn = ["L", "R"].map(() => el("path", { fill: "none", stroke: O.pants || "#334", "stroke-width": P.limbW, "stroke-linecap": "round" }, gLegs));
    const shoes = ["L", "R"].map((s) => {
      const g = el("g", {}, gLegs);
      const dir = s === "L" ? -1 : 1, fl = P.footL, fh = Math.max(P.limbW * 1.5, 30);
      // sneaker: heel at the ankle, rounded toe pointing outward, thick sole, two lace marks
      el("path", { ...stroke, d: `M${-fl * 0.35 * dir},2 L${-fl * 0.38 * dir},${-fh * 0.75} Q${-fl * 0.2 * dir},${-fh * 1.05} ${fl * 0.15 * dir},${-fh * 0.85} Q${fl * 0.85 * dir},${-fh * 0.6} ${fl * 0.85 * dir},${-fh * 0.05} L${fl * 0.85 * dir},2 Z`, fill: O.shoes || "#eee" }, g);
      el("path", { ...stroke, d: `M${-fl * 0.4 * dir},2 L${fl * 0.88 * dir},2 L${fl * 0.86 * dir},${fh * 0.28} L${-fl * 0.4 * dir},${fh * 0.28} Z`, fill: O.accent || "#f33" }, g);
      el("path", { d: `M${fl * 0.05 * dir},${-fh * 0.75} l${fl * 0.18 * dir},${fh * 0.1} M${fl * 0.22 * dir},${-fh * 0.62} l${fl * 0.16 * dir},${fh * 0.1}`, stroke: LC, "stroke-width": Math.max(2, LW * 0.6), "stroke-linecap": "round" }, g);
      return g;
    });

    // torso: hips/pants, open jacket over a shirt, chest patch, zip
    const tw = P.torsoW, hw = P.hipW;
    el("path", { ...stroke, d: `M${-hw / 2},${hipY - 24} L${hw / 2},${hipY - 24} L${hw / 2 - 6},${hipY + P.limbW * 0.6} L${-hw / 2 + 6},${hipY + P.limbW * 0.6} Z`, fill: O.pants || "#334" }, gTorso);
    const jacket = `M${-tw / 2},${shY + 20} Q${-tw / 2},${shY} ${-tw / 2 + 30},${shY} L${tw / 2 - 30},${shY} Q${tw / 2},${shY} ${tw / 2},${shY + 20} L${hw / 2 + 8},${hipY + 4} Q0,${hipY + 18} ${-hw / 2 - 8},${hipY + 4} Z`;
    el("path", { ...stroke, d: jacket, fill: O.jacket || "#e84" }, gTorso);
    el("path", { ...stroke, d: `M${-tw * 0.14},${shY + 4} L${tw * 0.14},${shY + 4} L${tw * 0.1},${hipY + 6} L${-tw * 0.1},${hipY + 6} Z`, fill: O.shirt || "#fff" }, gTorso);
    if (O.patch !== false) el("circle", { ...stroke, cx: -tw * 0.3, cy: shY + P.torsoH * 0.32, r: P.torsoW * 0.075, fill: O.accent || "#fd3" }, gTorso);
    el("path", { d: `M${tw * 0.14},${shY + 10} L${tw * 0.1},${hipY}`, stroke: LC, "stroke-width": Math.max(2, LW * 0.6), "stroke-dasharray": "6 6" }, gTorso);
    // pockets
    for (const s of [-1, 1]) el("path", { d: `M${s * tw * 0.22},${hipY - 60} l${s * 40},0`, stroke: LC, "stroke-width": Math.max(2, LW * 0.7), "stroke-linecap": "round" }, gTorso);
    // backpack straps over the shoulders
    if (spec.backpack) for (const s of [-1, 1]) el("path", { d: `M${s * tw * 0.3},${shY + 2} Q${s * tw * 0.36},${shY + P.torsoH * 0.4} ${s * tw * 0.32},${shY + P.torsoH * 0.62}`, fill: "none", stroke: LC, "stroke-width": P.limbW * 0.45 + LW, "stroke-linecap": "round" }, gTorso), el("path", { d: `M${s * tw * 0.3},${shY + 2} Q${s * tw * 0.36},${shY + P.torsoH * 0.4} ${s * tw * 0.32},${shY + P.torsoH * 0.62}`, fill: "none", stroke: spec.backpack, "stroke-width": P.limbW * 0.45, "stroke-linecap": "round" }, gTorso);

    // scarf: wrap + hanging tail that swings
    let scarfTail = null;
    if (O.scarf) {
      el("path", { ...stroke, d: `M${-P.neckW * 1.15},${shY - 12} Q0,${shY + 26} ${P.neckW * 1.15},${shY - 12} Q${P.neckW * 1.2},${shY + 14} 0,${shY + 30} Q${-P.neckW * 1.2},${shY + 14} ${-P.neckW * 1.15},${shY - 12} Z`, fill: O.scarf }, gTorso);
      scarfTail = el("path", { ...stroke, fill: O.scarf }, gTorso);
    }

    // arms (sleeve tubes) and hands
    const mkArm = (layer) => ({
      out: el("path", { fill: "none", stroke: LC, "stroke-width": P.limbW * 0.95 + LW * 2, "stroke-linecap": "round" }, layer),
      inn: el("path", { fill: "none", stroke: O.jacket || "#e84", "stroke-width": P.limbW * 0.95, "stroke-linecap": "round" }, layer),
      cuff: el("circle", { ...stroke, r: P.limbW * 0.55, fill: O.shirt || "#fff" }, layer),
      hand: el("g", {}, layer),
    });
    const arms = { L: mkArm(gArmBack), R: mkArm(gArmFront) };
    for (const s of ["L", "R"]) drawHand(arms[s].hand, R, spec, stroke);
    // prop in the right hand
    let propLight = null;
    if (spec.prop === "gadget") {
      const pg = el("g", { transform: `translate(${P.handR * 0.4},${-P.handR * 1.1})` }, arms.R.hand);
      el("rect", { ...stroke, x: -18, y: -46, width: 40, height: 56, rx: 8, fill: O.gadget || "#9aa4ad" }, pg);
      el("path", { d: "M12,-46 L22,-80", stroke: LC, "stroke-width": Math.max(3, LW), "stroke-linecap": "round" }, pg);
      propLight = el("circle", { ...stroke, cx: 22, cy: -84, r: 7, fill: O.accent || "#fd3" }, pg);
      el("rect", { x: -10, y: -36, width: 24, height: 16, rx: 3, fill: "#2fd3c6", stroke: LC, "stroke-width": Math.max(2, LW * 0.6) }, pg);
    }

    // neck + head
    el("rect", { ...stroke, x: -P.neckW / 2, y: neckTop - 6, width: P.neckW, height: P.neckLen + 22, rx: 8, fill: spec.skin }, gHead);
    const head = el("g", {}, gHead);
    const headD = headPath(P.headShape, P.headR);
    // hair behind the head (bun / long)
    const H = spec.hair || {}, hs = (R.hair.scale || 1) * P.headR;
    if (H.type === "bun") {
      el("circle", { ...stroke, cx: hs * 0.15, cy: -hs * 1.05, r: hs * 0.42, fill: H.color }, head);
      el("path", { d: `M${hs * -0.1},${-hs * 1.2} q${hs * 0.25},${-hs * 0.2} ${hs * 0.45},0`, fill: "none", stroke: LC, "stroke-width": Math.max(2, LW * 0.6) }, head);
    }
    el("ellipse", { ...stroke, cx: -P.headR * (P.headShape === "wideOval" ? 1.12 : 1.0), cy: P.headR * 0.05, rx: P.headR * 0.16, ry: P.headR * 0.22, fill: spec.skin }, head);
    el("ellipse", { ...stroke, cx: P.headR * (P.headShape === "wideOval" ? 1.12 : 1.0), cy: P.headR * 0.05, rx: P.headR * 0.16, ry: P.headR * 0.22, fill: spec.skin }, head);
    el("path", { ...stroke, d: headD, fill: spec.skin }, head);
    // front hair: messy cap with bangs
    if (H.color) el("path", { ...stroke, d: hairFront(P.headShape, P.headR, H.type), fill: H.color }, head);
    if (H.strands) for (let k = 0; k < H.strands; k++) el("path", { d: `M${-hs * 0.5 + k * hs * 0.35},${-hs * 0.95} q${hs * 0.1},${-hs * 0.18} ${hs * 0.22},${-hs * 0.08}`, fill: "none", stroke: H.color, "stroke-width": Math.max(3, LW), "stroke-linecap": "round" }, head);
    // face
    const face = el("g", {}, head);
    const eyes = drawEyes(face, R, spec, stroke);
    const brows = drawBrows(face, R);
    drawNose(face, R, spec, stroke);
    const mouth = el("path", { fill: "#5a1f2a", stroke: LC, "stroke-width": Math.max(2.5, LW * 0.8), "stroke-linejoin": "round", "stroke-linecap": "round" }, face);
    if (spec.glasses) drawGlasses(face, R, spec);
    if (spec.freckles) for (const s of [-1, 1]) for (let k = 0; k < 3; k++) el("circle", { cx: s * (R.eyes.gap + k * 9), cy: P.headR * 0.18 + (k % 2) * 7, r: 2.4, fill: "#b9734f", opacity: 0.8 }, face);

    function pose(p = {}) {
      const sc = (p.scale ?? 1) * (P.scale || 1);
      const { sx, sy } = T.squash(p.squash ?? 0);
      root.setAttribute("transform", `translate(${f(p.x ?? 0)},${f(p.y ?? 0)}) rotate(${f(p.lean ?? 0)}) scale(${(sc * sx).toFixed(4)},${(sc * sy).toFixed(4)})`);

      // legs
      for (const [i, s] of ["L", "R"].entries()) {
        const st = p[`step${s}`] || { x: 0, y: 0 };
        const foot = [REST[`foot${s}`][0] + st.x, REST[`foot${s}`][1] + st.y - P.limbW * 0.4];
        const hip = HIP[s];
        const bend = (s === "L" ? -1 : 1) * 10 + st.x * 0.25;
        const d = limbPath(hip, foot, bend);
        legOut[i].setAttribute("d", d);
        legIn[i].setAttribute("d", d);
        shoes[i].setAttribute("transform", `translate(${f(foot[0])},${f(foot[1] + P.limbW * 0.4)})`);
      }
      // arms: clamp the hand to arm length, bend at the elbow
      for (const s of ["L", "R"]) {
        const off = p[`hand${s}`] || { x: 0, y: 0 };
        let hx = REST[`hand${s}`][0] + off.x, hy = REST[`hand${s}`][1] + off.y;
        const [sx0, sy0] = SH[s];
        const dx = hx - sx0, dy = hy - sy0, dist = Math.hypot(dx, dy);
        if (dist > armLen) { hx = sx0 + (dx / dist) * armLen; hy = sy0 + (dy / dist) * armLen; }
        const slack = Math.max(0, armLen - Math.min(dist, armLen));
        const bend = (p[`bend${s}`] ?? (s === "L" ? 40 : -40)) * 0.35 + (s === "L" ? 1 : -1) * slack * 0.5;
        const d = limbPath([sx0, sy0], [hx, hy], bend);
        const A = arms[s];
        A.out.setAttribute("d", d);
        A.inn.setAttribute("d", d);
        A.cuff.setAttribute("cx", f(hx - (dx / (dist || 1)) * P.handR * 0.7));
        A.cuff.setAttribute("cy", f(hy - (dy / (dist || 1)) * P.handR * 0.7));
        const ang = (Math.atan2(hy - sy0, hx - sx0) * 180) / Math.PI - 90;
        A.hand.setAttribute("transform", `translate(${f(hx)},${f(hy)}) rotate(${f(ang)})${s === "L" ? " scale(-1,1)" : ""}`);
      }
      // head
      const tilt = p.headTilt ?? (p.lean ?? 0) * -0.4;
      head.setAttribute("transform", `translate(0,${f(headCY + (p.headBob ?? 0))}) rotate(${f(tilt)})`);
      const look = (p.look ?? 0), blink = T.clamp(p.blink ?? 0), m = T.clamp(p.mouth ?? 0);
      eyes.update(look, blink);
      brows.update(p.browUp ?? 0, look);
      drawMouth(mouth, R, m);
      if (scarfTail) {
        const sw = Math.sin((p.t ?? 0) * 5) * 10 + (p.lean ?? 0) * 2;
        scarfTail.setAttribute("d", `M${P.neckW * 0.4},${shY + 16} Q${P.neckW + sw},${shY + 80} ${P.neckW * 0.9 + sw * 1.6},${shY + 150} L${P.neckW * 0.2 + sw * 1.6},${shY + 140} Q${P.neckW * 0.2 + sw},${shY + 80} ${-P.neckW * 0.1},${shY + 22} Z`);
      }
      if (propLight) propLight.setAttribute("opacity", Math.floor((p.t ?? 0) * 3) % 2 ? "1" : "0.35");
    }

    pose({});
    return { root, pose, rules: R, spec };
  }

  // ------------------------------------------------------------------ parts
  function limbPath([x0, y0], [x1, y1], bend) {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
    return `M${f(x0)},${f(y0)} Q${f(mx + (-dy / len) * bend)},${f(my + (dx / len) * bend)} ${f(x1)},${f(y1)}`;
  }

  function headPath(shape, r) {
    switch (shape) {
      case "wideOval": return `M${-r * 1.08},0 C${-r * 1.08},${-r * 1.02} ${r * 1.08},${-r * 1.02} ${r * 1.08},0 C${r * 1.08},${r * 0.86} ${r * 0.5},${r * 1.0} 0,${r * 1.0} C${-r * 0.5},${r * 1.0} ${-r * 1.08},${r * 0.86} ${-r * 1.08},0 Z`;
      case "tallOval": return `M${-r * 0.82},0 C${-r * 0.82},${-r * 1.25} ${r * 0.82},${-r * 1.25} ${r * 0.82},0 C${r * 0.82},${r * 0.95} ${r * 0.3},${r * 1.15} 0,${r * 1.15} C${-r * 0.3},${r * 1.15} ${-r * 0.82},${r * 0.95} ${-r * 0.82},0 Z`;
      case "bean": return `M${-r},${-r * 0.1} C${-r * 1.05},${-r * 1.1} ${r * 1.05},${-r * 1.15} ${r},${-r * 0.15} C${r * 0.95},${r * 0.7} ${r * 0.4},${r * 1.05} ${-r * 0.1},${r * 1.0} C${-r * 0.7},${r * 0.95} ${-r * 0.95},${r * 0.6} ${-r},${-r * 0.1} Z`;
      default: return `M${-r},0 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z`;
    }
  }

  function hairFront(shape, r, type) {
    const w = shape === "wideOval" ? 1.1 : shape === "tallOval" ? 0.85 : 1.02;
    // cap over the top of the head with an uneven fringe
    return `M${-r * w},${-r * 0.05} C${-r * w * 1.02},${-r * 1.15} ${r * w * 1.02},${-r * 1.15} ${r * w},${-r * 0.05}
      L${r * w * 0.8},${-r * 0.42} L${r * w * 0.55},${-r * 0.3} L${r * w * 0.35},${-r * 0.5} L${r * w * 0.05},${-r * 0.36}
      L${-r * w * 0.2},${-r * 0.55} L${-r * w * 0.45},${-r * 0.34} L${-r * w * 0.7},${-r * 0.48} Z`;
  }

  function drawHand(g, R, spec, stroke) {
    const r = R.proportions.handR, el = T.el;
    if (R.hands.type === "ball") { el("circle", { ...stroke, r, fill: spec.skin }, g); return; }
    if (R.hands.type === "glove") {
      el("circle", { ...stroke, r: r * 1.15, fill: "#f7f3e8" }, g);
      el("path", { d: `M${-r * 0.4},${-r * 0.5} L${-r * 0.4},${r * 0.3} M0,${-r * 0.6} L0,${r * 0.3} M${r * 0.4},${-r * 0.5} L${r * 0.4},${r * 0.3}`, stroke: R.line.color, "stroke-width": 3 }, g);
      return;
    }
    // mitten with 3 fingers + thumb (4 total)
    const n = (R.hands.fingers || 4) - 1;
    for (let k = 0; k < n; k++) el("ellipse", { ...stroke, cx: (k - (n - 1) / 2) * r * 0.55, cy: r * 0.95, rx: r * 0.3, ry: r * 0.5, fill: spec.skin }, g);
    el("ellipse", { ...stroke, cx: r * 0.95, cy: r * 0.1, rx: r * 0.42, ry: r * 0.26, fill: spec.skin, transform: `rotate(-35 ${r * 0.95} ${r * 0.1})` }, g);
    el("circle", { ...stroke, r: r * 0.85, fill: spec.skin }, g);
  }

  function drawEyes(face, R, spec, stroke) {
    const E = R.eyes, r = R.proportions.headR, el = T.el, y = E.y * r;
    const sides = [-1, 1].map((s) => {
      const g = el("g", {}, face);
      const cx = s * E.gap;
      let pupil, extra;
      if (E.type === "bigRound") {
        el("circle", { ...stroke, cx, cy: y, r: E.size, fill: "#ffffff" }, g);
        pupil = el("circle", { r: E.pupilSize * (s < 0 ? 1 : 0.85), fill: R.line.color }, g); // slightly uneven pupils
      } else if (E.type === "anime") {
        el("ellipse", { ...stroke, cx, cy: y, rx: E.size * 0.8, ry: E.size, fill: "#fff" }, g);
        pupil = el("g", {}, g);
        el("ellipse", { rx: E.size * 0.55, ry: E.size * 0.78, fill: spec.eyes || "#4a6bd1" }, pupil);
        el("ellipse", { rx: E.size * 0.28, ry: E.size * 0.42, fill: R.line.color }, pupil);
        el("circle", { cx: -E.size * 0.18, cy: -E.size * 0.32, r: E.size * 0.18, fill: "#fff" }, pupil);
        extra = el("path", { d: `M${cx - E.size * 0.9},${y - E.size * 0.85} Q${cx},${y - E.size * 1.25} ${cx + E.size * 0.9},${y - E.size * 0.85}`, fill: "none", stroke: R.line.color, "stroke-width": 5, "stroke-linecap": "round" }, g);
      } else if (E.type === "dot" || E.type === "bead") {
        pupil = el("ellipse", { rx: E.pupilSize, ry: E.pupilSize * (E.type === "bead" ? 1.4 : 1), fill: R.line.color }, g);
      } else { // pie-cut
        pupil = el("g", {}, g);
        el("ellipse", { rx: E.size * 0.55, ry: E.size, fill: R.line.color }, pupil);
        el("path", { d: `M0,${-E.size * 0.35} L${-E.size * 0.3},${-E.size * 0.85} A${E.size * 0.3},${E.size * 0.3} 0 0 1 ${E.size * 0.2},${-E.size * 0.88} Z`, fill: "#fff" }, pupil);
      }
      const lid = el("ellipse", { cx, cy: y, rx: E.size * 1.08, ry: 0, fill: spec.skin, stroke: R.line.color, "stroke-width": R.line.width ? Math.max(2, R.line.width * 0.8) : 0 }, g);
      return { g, pupil, lid, cx, s };
    });
    return {
      update(look, blink) {
        for (const { pupil, lid, cx, s } of sides) {
          const px = cx + look * E.size * 0.45, py = y + (E.type === "bigRound" ? E.size * 0.1 : 0);
          if (pupil.tagName === "circle" || pupil.tagName === "ellipse") { pupil.setAttribute("cx", f(px)); pupil.setAttribute("cy", f(py)); }
          else pupil.setAttribute("transform", `translate(${f(px)},${f(py)})`);
          lid.setAttribute("ry", f(blink * E.size * 1.08));
          lid.setAttribute("cy", f(y - E.size * 1.08 + blink * E.size * 1.08));
        }
      },
    };
  }

  function drawBrows(face, R) {
    const B = R.brows, E = R.eyes, r = R.proportions.headR, el = T.el;
    if (B.type === "none") return { update() {} };
    const y = E.y * r - E.size * 1.35;
    const br = [-1, 1].map(() => el("path", { fill: "none", stroke: R.line.color, "stroke-width": B.type === "thick" ? B.width * 2 : B.width, "stroke-linecap": "round" }, face));
    return {
      update(m, look) {
        br.forEach((b, i) => {
          const s = i ? 1 : -1, cx = s * E.gap, lift = m * 16;
          b.setAttribute("d", `M${f(cx - E.size * 0.8)},${f(y - lift + s * 2)} Q${f(cx)},${f(y - 10 - lift)} ${f(cx + E.size * 0.8)},${f(y - lift - s * 2)}`);
        });
      },
    };
  }

  function drawNose(face, R, spec, stroke) {
    const N = R.nose.type, r = R.proportions.headR, el = T.el, y = R.eyes.y * r + R.eyes.size * 1.05;
    if (N === "bump") el("path", { d: `M${-6},${y - 6} Q${18},${y + 2} ${-4},${y + 16}`, fill: "none", stroke: R.line.color, "stroke-width": Math.max(2.5, R.line.width * 0.8), "stroke-linecap": "round" }, face);
    else if (N === "dot") el("ellipse", { cx: 0, cy: y + 4, rx: 8, ry: 6, fill: R.line.color, opacity: 0.85 }, face);
    else if (N === "triangle") el("path", { d: `M0,${y - 10} L10,${y + 10} L-6,${y + 10} Z`, fill: "rgba(0,0,0,0.15)" }, face);
    else if (N === "hook") el("path", { ...stroke, d: `M-2,${y - 18} Q22,${y + 8} 2,${y + 16}`, fill: spec.skin }, face);
  }

  function drawMouth(node, R, m) {
    const M = R.mouth, r = R.proportions.headR, y = R.eyes.y * r + R.eyes.size * 1.05 + 46, w = (M.width || 46) / 2;
    if (M.type === "wide") {
      const open = m * r * 0.5;
      node.setAttribute("d", m < 0.05
        ? `M${-w},${y} Q0,${y + 14} ${w},${y - 4}`
        : `M${-w},${y} Q0,${y + 10} ${w},${y - 4} Q${w * 0.6},${y + open} 0,${y + open * 1.05} Q${-w * 0.7},${y + open} ${-w},${y} Z`);
      node.setAttribute("fill", m < 0.05 ? "none" : "#5a1f2a");
    } else if (M.type === "line") {
      node.setAttribute("d", `M${-w * 0.7},${y} L${w * 0.7},${y + m * 6}`);
      node.setAttribute("fill", "none");
    } else {
      const open = m * 22;
      node.setAttribute("d", `M${-w * 0.6},${y} Q0,${y + 10 + open} ${w * 0.6},${y} ${m > 0.05 ? `Q0,${y + 4} ${-w * 0.6},${y} Z` : ""}`);
      node.setAttribute("fill", m > 0.05 ? "#5a1f2a" : "none");
    }
  }

  function drawGlasses(face, R, spec) {
    const E = R.eyes, r = R.proportions.headR, el = T.el, y = E.y * r, c = spec.glasses.color || R.line.color;
    const rr = E.type === "bigRound" ? E.size * 1.18 : E.size * 1.3;
    for (const s of [-1, 1]) el("circle", { cx: s * E.gap, cy: y, r: rr, fill: "rgba(255,255,255,0.12)", stroke: c, "stroke-width": Math.max(4, R.line.width * 1.1) }, face);
    el("path", { d: `M${-E.gap + rr},${y - 4} Q0,${y - 14} ${E.gap - rr},${y - 4}`, fill: "none", stroke: c, "stroke-width": Math.max(4, R.line.width) }, face);
  }

  T.characters = T.characters || {};
  T.characters.kit = { build, DEFAULT_RULES };
})(window);
