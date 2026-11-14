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
    if (R.shadow) el("ellipse", { cx: 0, cy: R.shadow.dy ?? 16, rx: R.shadow.rx ?? 110, ry: R.shadow.ry ?? 16, fill: R.shadow.color ?? "#000", opacity: R.shadow.opacity ?? 0.16 }, root); // contact shadow

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
    // fold lines (a few strokes, as in TV comedy): sleeve-less torso creases + waist
    if (R.folds) {
      const th = { fill: "none", stroke: LC, "stroke-width": Math.max(1.5, LW * 0.55), "stroke-linecap": "round" };
      el("path", { ...th, d: `M${-tw * 0.4},${shY + P.torsoH * 0.55} q${tw * 0.08},${-12} ${tw * 0.14},${-4}` }, gTorso);
      el("path", { ...th, d: `M${tw * 0.33},${shY + P.torsoH * 0.7} q${-tw * 0.06},${-10} ${-tw * 0.12},${-2}` }, gTorso);
      el("path", { ...th, d: `M${-tw * 0.06},${hipY - 30} q${tw * 0.04},${8} ${tw * 0.1},${2}` }, gTorso);
    }
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
    const earX = P.headR * (P.headShape === "wideOval" ? 1.12 : 1.0);
    for (const s of [-1, 1]) {
      el("ellipse", { ...stroke, cx: s * earX, cy: P.headR * 0.12, rx: P.headR * 0.17, ry: P.headR * 0.23, fill: spec.skin }, head);
      if (R.ears === "c") el("path", { d: `M${f(s * earX + s * 2)},${f(P.headR * 0.02)} Q${f(s * (earX + P.headR * 0.1))},${f(P.headR * 0.12)} ${f(s * earX)},${f(P.headR * 0.24)}`, fill: "none", stroke: LC, "stroke-width": Math.max(2, LW * 0.7), "stroke-linecap": "round" }, head);
    }
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
    const extras = drawExtras(face, R);

    function pose(p = {}) {
      if (p.emotion) p = withEmotion(p);
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
      eyes.update(look, blink, p.lidRest, p);
      brows.update(p.browUp ?? 0, look, p);
      drawMouth(mouth, R, m, p);
      extras.update(p);
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
    if (R.hands.type === "fingers") {
      // long thin separate fingers (3 + thumb), drawn as rounded capsules from a small palm
      const n = (R.hands.fingers || 4) - 1, L = r * 1.35;
      for (let k = 0; k < n; k++) {
        const a = ((k - (n - 1) / 2) * 16 * Math.PI) / 180;
        const x1 = Math.sin(a) * L, y1 = r * 0.4 + Math.cos(a) * L;
        el("path", { d: `M${f(Math.sin(a) * r * 0.3)},${f(r * 0.4)} L${f(x1)},${f(y1)}`, stroke: R.line.color, "stroke-width": r * 0.46 + (R.line.width || 0) * 2, "stroke-linecap": "round" }, g);
        el("path", { d: `M${f(Math.sin(a) * r * 0.3)},${f(r * 0.4)} L${f(x1)},${f(y1)}`, stroke: spec.skin, "stroke-width": r * 0.46, "stroke-linecap": "round" }, g);
      }
      el("path", { d: `M${f(r * 0.4)},${f(r * 0.1)} L${f(r * 1.2)},${f(r * 0.55)}`, stroke: R.line.color, "stroke-width": r * 0.5 + (R.line.width || 0) * 2, "stroke-linecap": "round" }, g);
      el("path", { d: `M${f(r * 0.4)},${f(r * 0.1)} L${f(r * 1.2)},${f(r * 0.55)}`, stroke: spec.skin, "stroke-width": r * 0.5, "stroke-linecap": "round" }, g);
      el("ellipse", { ...stroke, cx: 0, cy: r * 0.15, rx: r * 0.62, ry: r * 0.55, fill: spec.skin }, g);
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
    const sizes = E.sizes || [1, 1];
    const sides = [-1, 1].map((s, idx) => {
      const g = el("g", {}, face);
      const cx = s * E.gap, size = E.size * sizes[idx];
      let pupil;
      if (E.type === "bigRound") {
        el("circle", { ...stroke, "stroke-width": E.lineWidth || stroke["stroke-width"], cx, cy: y, r: size, fill: "#ffffff" }, g);
        if (E.pupil === "speck") {
          // tiny irregular speck, not a perfect dot
          const ps = E.pupilSize;
          pupil = el("path", { d: `M${-ps},${-ps * 0.3} L${-ps * 0.2},${-ps} L${ps * 0.9},${-ps * 0.5} L${ps * 0.6},${ps * 0.8} L${-ps * 0.5},${ps * 0.9} Z`, fill: R.line.color }, g);
        } else pupil = el("circle", { r: E.pupilSize * (s < 0 ? 1 : 0.85), fill: R.line.color }, g);
      } else if (E.type === "anime") {
        el("ellipse", { ...stroke, cx, cy: y, rx: size * 0.8, ry: size, fill: "#fff" }, g);
        pupil = el("g", {}, g);
        el("ellipse", { rx: size * 0.55, ry: size * 0.78, fill: spec.eyes || "#4a6bd1" }, pupil);
        el("ellipse", { rx: size * 0.28, ry: size * 0.42, fill: R.line.color }, pupil);
        el("circle", { cx: -size * 0.18, cy: -size * 0.32, r: size * 0.18, fill: "#fff" }, pupil);
        el("path", { d: `M${cx - size * 0.9},${y - size * 0.85} Q${cx},${y - size * 1.25} ${cx + size * 0.9},${y - size * 0.85}`, fill: "none", stroke: R.line.color, "stroke-width": 5, "stroke-linecap": "round" }, g);
      } else if (E.type === "dot" || E.type === "bead") {
        pupil = el("ellipse", { rx: E.pupilSize, ry: E.pupilSize * (E.type === "bead" ? 1.4 : 1), fill: R.line.color }, g);
      } else { // pie-cut
        pupil = el("g", {}, g);
        el("ellipse", { rx: size * 0.55, ry: size, fill: R.line.color }, pupil);
        el("path", { d: `M0,${-size * 0.35} L${-size * 0.3},${-size * 0.85} A${size * 0.3},${size * 0.3} 0 0 1 ${size * 0.2},${-size * 0.88} Z`, fill: "#fff" }, pupil);
      }
      // eyelid: a skin-coloured cap that slides down (blink) + its lid line; "tired" rests partly closed
      const clipId = `eyeclip-${Math.random().toString(36).slice(2, 8)}`;
      const cp = el("clipPath", { id: clipId }, g);
      el("circle", { cx, cy: y, r: size + 1 }, cp);
      const lid = el("path", { fill: spec.skin, "clip-path": `url(#${clipId})` }, g);
      const lidLine = el("path", { fill: "none", stroke: R.line.color, "stroke-width": Math.max(2, (E.lineWidth || R.line.width) * 0.9), "stroke-linecap": "round", "clip-path": `url(#${clipId})` }, g);
      const low = el("path", { fill: spec.skin, "clip-path": `url(#${clipId})` }, g); // lower lid: squint / happy eyes
      const lowLine = el("path", { fill: "none", stroke: R.line.color, "stroke-width": Math.max(2, (E.lineWidth || R.line.width) * 0.9), "stroke-linecap": "round", "clip-path": `url(#${clipId})` }, g);
      if (E.bags) el("path", { d: `M${cx - size * 0.7},${y + size * 1.12} Q${cx},${y + size * 1.32} ${cx + size * 0.55},${y + size * 1.1}`, fill: "none", stroke: R.line.color, "stroke-width": Math.max(1.5, R.line.width * 0.55), "stroke-linecap": "round" }, g);
      return { g, pupil, lid, lidLine, low, lowLine, cx, s, size };
    });
    return {
      /** x: { squint 0..1 (lower lid up), pupil (scale), lidAngle (-1 sad … +1 angry), lookY } */
      update(look, blink, lidRest = E.lidRest || 0, x = {}) {
        for (const sd of sides) {
          const { pupil, lid, lidLine, low, lowLine, cx, s, size } = sd;
          const diverge = (E.diverge || 0) * s * size; // pupils drifting apart = the dazed look
          const px = cx + look * size * 0.45 + diverge, py = y + (E.type === "bigRound" ? size * 0.05 : 0) + (x.lookY || 0) * size * 0.35;
          const ps = x.pupil ?? 1;
          if (pupil.tagName === "circle" || pupil.tagName === "ellipse") {
            if (sd.r0 == null) sd.r0 = [+pupil.getAttribute("r") || 0, +pupil.getAttribute("rx") || 0, +pupil.getAttribute("ry") || 0];
            pupil.setAttribute("cx", f(px)); pupil.setAttribute("cy", f(py));
            if (sd.r0[0]) pupil.setAttribute("r", f(sd.r0[0] * ps)); else { pupil.setAttribute("rx", f(sd.r0[1] * ps)); pupil.setAttribute("ry", f(sd.r0[2] * ps)); }
          } else pupil.setAttribute("transform", `translate(${f(px)},${f(py)}) scale(${ps.toFixed(3)})`);
          // upper lid: a skin cap whose edge can tilt (angry: inner end down, sad: inner end up)
          const close = Math.max(blink, lidRest), ang = x.lidAngle || 0;
          const ly = y - size + close * (size * 2 + 4) - 2, tilt = ang * size * 0.5;
          const xIn = cx - s * (size + 3), xOut = cx + s * (size + 3), yIn = ly + tilt, yOut = ly - tilt;
          if (close > 0.02 || Math.abs(ang) > 0.05) {
            lid.setAttribute("d", `M${f(xOut)},${f(y - size - 6)} L${f(xIn)},${f(y - size - 6)} L${f(xIn)},${f(yIn)} L${f(xOut)},${f(yOut)} Z`);
            lidLine.setAttribute("d", `M${f(xOut)},${f(yOut)} Q${f(cx)},${f(ly + (blink > 0.9 ? 6 : -4))} ${f(xIn)},${f(yIn)}`);
          } else { lid.setAttribute("d", ""); lidLine.setAttribute("d", ""); }
          // lower lid: rises in an upward arc (happy / squinting)
          const sq = x.squint || 0;
          if (sq > 0.02 && blink < 0.9) {
            const ty = y + size + 2 - sq * size * 1.05;
            const arc = `M${f(cx - size - 3)},${f(ty + 6)} Q${f(cx)},${f(ty - 12)} ${f(cx + size + 3)},${f(ty + 6)}`;
            low.setAttribute("d", `${arc} L${f(cx + size + 3)},${f(y + size + 6)} L${f(cx - size - 3)},${f(y + size + 6)} Z`);
            lowLine.setAttribute("d", arc);
          } else { low.setAttribute("d", ""); lowLine.setAttribute("d", ""); }
        }
      },
    };
  }

  function drawBrows(face, R) {
    const B = R.brows, E = R.eyes, r = R.proportions.headR, el = T.el;
    if (B.type === "none") return { update() {} };
    const y = E.y * r - E.size * 1.35;
    const sizes = E.sizes || [1, 1];
    const br = [-1, 1].map(() => el("path", { fill: "none", stroke: R.line.color, "stroke-width": B.type === "thick" ? B.width * 2 : B.width, "stroke-linecap": "round" }, face));
    return {
      /** m: raise (browUp); x.browAngle: +1 angry (inner ends down) … -1 sad (inner ends up); x.browTilt: raise the right brow only (skeptical) */
      update(m, look, x = {}) {
        const a = x.browAngle || 0, tl = x.browTilt || 0;
        br.forEach((b, i) => {
          const s = i ? 1 : -1, cx = s * E.gap, sz = E.size * sizes[i];
          const lift = m * 16 + (i ? tl * 16 : -tl * 4);
          const inner = cx - s * sz * 0.75, outer = cx + s * sz * 0.85;
          if (B.type === "worried") {
            // thin, high on the forehead, inner end raised at rest
            const yy = E.y * r - sz * 1.55 - lift;
            const yIn = yy - 10 - m * 8 + a * 26, yOut = yy + 4 - a * 6;
            b.setAttribute("d", `M${f(inner)},${f(yIn)} Q${f(cx)},${f((yIn + yOut) / 2 - 10 + Math.abs(a) * 4)} ${f(outer)},${f(yOut)}`);
          } else {
            const yIn = y - lift + a * 16, yOut = y - lift - a * 6;
            b.setAttribute("d", `M${f(outer)},${f(yOut)} Q${f(cx)},${f(y - 10 - lift)} ${f(inner)},${f(yIn)}`);
          }
        });
      },
    };
  }

  function drawNose(face, R, spec, stroke) {
    const N = R.nose.type, r = R.proportions.headR, el = T.el, y = R.eyes.y * r + R.eyes.size * 1.05;
    if (N === "bump") el("path", { d: `M${-6},${y - 6} Q${18},${y + 2} ${-4},${y + 16}`, fill: "none", stroke: R.line.color, "stroke-width": Math.max(2.5, R.line.width * 0.8), "stroke-linecap": "round" }, face);
    else if (N === "c") el("path", { d: `M8,${y - 4} C-12,${y - 2} -12,${y + 18} 8,${y + 18}`, fill: "none", stroke: R.line.color, "stroke-width": Math.max(2.5, R.line.width * 0.85), "stroke-linecap": "round" }, face);
    else if (N === "dot") el("ellipse", { cx: 0, cy: y + 4, rx: 8, ry: 6, fill: R.line.color, opacity: 0.85 }, face);
    else if (N === "triangle") el("path", { d: `M0,${y - 10} L10,${y + 10} L-6,${y + 10} Z`, fill: "rgba(0,0,0,0.15)" }, face);
    else if (N === "hook") el("path", { ...stroke, d: `M-2,${y - 18} Q22,${y + 8} 2,${y + 16}`, fill: spec.skin }, face);
  }

  function drawMouth(node, R, m, x = {}) {
    const M = R.mouth, r = R.proportions.headR, y = R.eyes.y * r + R.eyes.size * 1.05 + 46, w = (M.width || 46) / 2;
    if (M.type === "toothy") {
      // closed: short, slightly sulky line. open: dark mouth, top row of teeth, tongue
      const g = node.__parts || (node.__parts = (() => {
        const p = node.parentNode;
        const teeth = T.el("path", { fill: "#f3efd9", stroke: R.line.color, "stroke-width": Math.max(1.5, R.line.width * 0.5) }, p);
        const tongue = T.el("path", { fill: "#c95a63" }, p);
        return { teeth, tongue };
      })());
      // x: smile -1 (frown) … +1 (grin), grit (clenched teeth), wavy (nervous/confused squiggle), smirk (one corner up)
      const sm = x.smile || 0, grit = x.grit || 0, wavy = x.wavy || 0, smirk = x.smirk || 0;
      const TEETH = "#f3efd9";
      g.teeth.setAttribute("fill", TEETH);
      if (m < 0.05 && grit > 0.3) {
        // clenched teeth: a lens of teeth with vertical gaps
        const gw = w * (0.5 + grit * 0.4 + Math.max(0, sm) * 0.25), gh = 9 + grit * 9, cy0 = y + 2, cY = cy0 - sm * 10;
        node.setAttribute("d", `M${f(-gw)},${f(cY - smirk * 10)} Q0,${f(cy0 - gh * 1.4 + sm * 6)} ${f(gw)},${f(cY)} Q0,${f(cy0 + gh * 1.4 + sm * 6)} ${f(-gw)},${f(cY - smirk * 10)} Z`);
        node.setAttribute("fill", TEETH);
        let d = `M${f(-gw * 0.85)},${f(cy0 + sm * 2)} L${f(gw * 0.85)},${f(cy0 + sm * 2)} `;
        for (let k = -2; k <= 2; k++) d += `M${f((k * gw) / 3)},${f(cy0 - gh * 0.6)} L${f((k * gw) / 3)},${f(cy0 + gh * 0.6)} `;
        g.teeth.setAttribute("d", d); g.teeth.setAttribute("fill", "none");
        g.tongue.setAttribute("d", "");
      } else if (m < 0.05) {
        g.teeth.setAttribute("d", ""); g.tongue.setAttribute("d", "");
        node.setAttribute("fill", "none");
        if (wavy > 0.3) {
          const a = w * 0.32;
          node.setAttribute("d", `M${f(-a * 1.5)},${f(y + 2)} q${f(a / 2)},${f(-7 * wavy)} ${f(a)},0 t${f(a)},0 t${f(a)},0`);
        } else {
          // closed: short sulky line at rest; corners lift with smile, drop with frown
          const ww = w * (0.45 + Math.abs(sm) * 0.3);
          node.setAttribute("d", `M${f(-ww)},${f(y + 4 - sm * 14 - smirk * 14)} Q0,${f(y - 4 + sm * 18 + smirk * 4)} ${f(ww)},${f(y + 6 - sm * 14)}`);
        }
      } else {
        const wO = w * (0.55 + m * 0.5 + Math.max(0, sm) * 0.2), open = m * r * 0.55;
        const cY = y - sm * 12, lY = cY - smirk * 12;
        const topC = sm >= 0 ? y - 8 + sm * 6 : y - 8 + sm * 18; // grin: flatter top edge; frown: arched top
        const ob = y + open * (sm >= 0 ? 1 + sm * 0.25 : 1 + sm * 0.35);
        node.setAttribute("d", `M${f(-wO)},${f(lY)} Q0,${f(topC)} ${f(wO)},${f(cY)} Q${f(wO * 0.9)},${f(ob)} 0,${f(ob)} Q${f(-wO * 0.9)},${f(ob)} ${f(-wO)},${f(lY)} Z`);
        node.setAttribute("fill", "#6b1f2c");
        const th = Math.min(open * 0.3, 14), ty = (cY + topC) / 2 - 1;
        let d = "";
        for (let k = -2; k <= 2; k++) { const x0 = (k * wO) / 3; d += `M${f(x0 - wO / 7)},${f(ty)} L${f(x0 + wO / 7)},${f(ty)} L${f(x0 + wO / 8)},${f(ty + th)} L${f(x0 - wO / 8)},${f(ty + th)} Z `; }
        if (grit > 0.3) for (let k = -2; k <= 2; k++) { const x0 = (k * wO) / 3.4; d += `M${f(x0 - wO / 8)},${f(ob - 2)} L${f(x0 + wO / 8)},${f(ob - 2)} L${f(x0 + wO / 9)},${f(ob - 2 - th)} L${f(x0 - wO / 9)},${f(ob - 2 - th)} Z `; }
        g.teeth.setAttribute("d", d);
        g.tongue.setAttribute("d", grit > 0.3 ? "" : `M${f(-wO * 0.5)},${f(ob - open * 0.08)} Q0,${f(y + open * 0.45)} ${f(wO * 0.5)},${f(ob - open * 0.08)} Z`);
      }
      return;
    }
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
    const sizes = E.sizes || [1, 1];
    const rrOf = (i) => (E.type === "bigRound" ? E.size * sizes[i] + 4 : E.size * 1.3); // big eyes: the rim IS the eye outline
    const rr = rrOf(1);
    for (const [i, s] of [-1, 1].entries()) el("circle", { cx: s * E.gap, cy: y, r: rrOf(i), fill: "none", stroke: c, "stroke-width": Math.max(4.5, R.line.width * 1.4) }, face);
    el("path", { d: `M${-E.gap + rrOf(0)},${y - 4} Q0,${y - 12} ${E.gap - rr},${y - 4}`, fill: "none", stroke: c, "stroke-width": Math.max(4, R.line.width) }, face);
  }

  /** blush, tears, sweat — drawn on the face, driven by pose fields of the same name (0..1) */
  function drawExtras(face, R) {
    const el = T.el, r = R.proportions.headR, E = R.eyes, ey = E.y * r, LC = R.line.color, lw = Math.max(2, R.line.width * 0.7);
    const blush = [-1, 1].map((s) => el("ellipse", { cx: s * (E.gap + 6), cy: ey + E.size * 1.5, rx: E.size * 0.75, ry: E.size * 0.32, fill: "#ef7f86", opacity: 0 }, face));
    const tears = [-1, 1].map(() => el("path", { fill: "#a9dcf5", stroke: LC, "stroke-width": lw, "stroke-linejoin": "round" }, face));
    const drops = [-1, 1].map(() => el("ellipse", { rx: 5, ry: 7, fill: "#a9dcf5", stroke: LC, "stroke-width": lw * 0.8 }, face));
    const sweat = el("path", { fill: "#cfeeff", stroke: LC, "stroke-width": lw }, face);
    return {
      update(p) {
        const b = p.blush || 0, tr = p.tears || 0, sw = p.sweat || 0, t = p.t || 0;
        blush.forEach((n) => n.setAttribute("opacity", (b * 0.75).toFixed(2)));
        [-1, 1].forEach((s, i) => {
          if (tr < 0.05) { tears[i].setAttribute("d", ""); drops[i].setAttribute("opacity", "0"); return; }
          // a stream from the lower eye down the cheek, widening, with a drop falling off the end
          const x0 = s * (E.gap + E.size * 0.2), y0 = ey + E.size * 0.85, len = r * 0.9 * tr, wv = Math.sin(t * 9 + i) * 3;
          tears[i].setAttribute("d", `M${f(x0 - 5)},${f(y0)} Q${f(x0 - 8 + wv)},${f(y0 + len * 0.5)} ${f(x0 - 4 + s * 6)},${f(y0 + len)} L${f(x0 + 8 + s * 6)},${f(y0 + len)} Q${f(x0 + 8 + wv)},${f(y0 + len * 0.5)} ${f(x0 + 5)},${f(y0)} Z`);
          const k = (t * 1.6 + i * 0.5) % 1;
          drops[i].setAttribute("cx", f(x0 + 2 + s * 6)); drops[i].setAttribute("cy", f(y0 + len + 8 + k * 60)); drops[i].setAttribute("opacity", (tr * (1 - k)).toFixed(2));
        });
        if (sw < 0.05) sweat.setAttribute("d", "");
        else { const sx = r * 0.82, sy = ey - E.size * 1.2 + ((t * 0.5) % 1) * 24 * sw, sz = 9 + sw * 6; sweat.setAttribute("d", `M${f(sx)},${f(sy - sz * 1.6)} Q${f(sx + sz)},${f(sy)} ${f(sx)},${f(sy + sz * 0.6)} Q${f(sx - sz)},${f(sy)} ${f(sx)},${f(sy - sz * 1.6)} Z`); }
      },
    };
  }

  /**
   * EMOTIONS — face + body presets. pose({ emotion: "angry", …live acting… }) merges them.
   * Face fields: smile, grit, wavy, smirk, squint, pupil, lidRest, lidAngle, browUp, browAngle,
   * browTilt, blush, tears, sweat, mouthMin (the mouth never closes below this while it lasts).
   * Body fields: lean, headTilt, squash, handL, handR, bendL, bendR, look, lookY.
   */
  const EMOTIONS = {
    neutral: {},
    happy: { smile: 0.8, squint: 0.35, browUp: 0.3, headTilt: -4 },
    laugh: { smile: 1, mouthMin: 0.8, squint: 0.85, browUp: 0.5, headTilt: -8, lean: -3, handL: { x: 70, y: -90 }, handR: { x: -70, y: -90 } },
    excited: { smile: 1, mouthMin: 0.7, browUp: 0.9, pupil: 1.25, handL: { x: -40, y: -330 }, handR: { x: 40, y: -330 }, squash: -0.03 },
    dreamy: { smile: 0.55, lidRest: 0.42, blush: 0.9, browAngle: -0.5, browUp: 0.3, headTilt: 9, lookY: -0.6, handL: { x: 120, y: -170 }, handR: { x: -120, y: -170 } },
    smug: { smirk: 1, smile: 0.35, lidRest: 0.45, browTilt: 0.6, headTilt: -6, handL: { x: 60, y: -40 }, handR: { x: -60, y: -40 } },
    bored: { lidRest: 0.55, smile: -0.2, browUp: -0.3, headTilt: 7, lean: 2, look: -0.3 },
    sad: { smile: -0.8, browAngle: -1, browUp: 0.3, lidRest: 0.2, lookY: 0.6, headTilt: 6, squash: 0.02 },
    crying: { smile: -1, mouthMin: 0.5, browAngle: -1, browUp: 0.5, squint: 0.5, lidRest: 0.2, tears: 1, headTilt: 5, squash: 0.03 },
    surprised: { mouthMin: 0.55, browUp: 1, pupil: 0.7 },
    shocked: { mouthMin: 1, smile: -0.3, browUp: 1.3, pupil: 0.45, lean: -4, handL: { x: -90, y: -210 }, handR: { x: 90, y: -210 }, bendL: 80, bendR: -80 },
    scared: { smile: -0.6, mouthMin: 0.45, browAngle: -1, browUp: 0.8, pupil: 0.5, sweat: 1, lean: -6, squash: 0.04, handL: { x: 90, y: -190 }, handR: { x: -90, y: -190 } },
    nervous: { grit: 0.8, smile: 0.3, browAngle: -0.8, pupil: 0.7, sweat: 1, headTilt: 4 },
    embarrassed: { smile: 0.3, wavy: 0.7, blush: 1, browAngle: -0.6, look: -1, lookY: 0.4, sweat: 0.5, headTilt: 8, handL: { x: 60, y: -130 }, handR: { x: -60, y: -130 } },
    confused: { wavy: 1, browTilt: 1, look: 0.5, lookY: -0.3, headTilt: 10, handR: { x: 30, y: -150 }, bendR: -70, handL: { x: 20, y: -40 } },
    skeptical: { smile: -0.25, browTilt: 1, lidRest: 0.35, squint: 0.3, look: -0.7, headTilt: -5 },
    disgusted: { smile: -0.6, grit: 0.7, squint: 0.55, browAngle: 0.6, browTilt: 0.5, lean: -5, headTilt: -8 },
    angry: { smile: -0.5, grit: 0.9, browAngle: 1, lidRest: 0.22, lidAngle: 1, squint: 0.2, lean: 3, handL: { x: 10, y: 10 }, handR: { x: -10, y: 10 } },
    hysterical: { mouthMin: 1, smile: -0.5, browAngle: -0.8, browUp: 1.2, pupil: 0.4, sweat: 1, lean: -3, squash: -0.04, handL: { x: 30, y: -330 }, handR: { x: -30, y: -330 } },
    deadpan: { lidRest: 0.3, smile: -0.1 },
    furious: { mouthMin: 1, smile: -0.4, grit: 0.6, browAngle: 1.2, lidRest: 0.18, lidAngle: 1, pupil: 0.6, lean: 5, squash: -0.03, handL: { x: -60, y: -300 }, handR: { x: 60, y: -300 } },
  };
  const isXY = (v) => v && typeof v === "object" && "x" in v;
  /** blend two emotions (k: 0 → a, 1 → b), numbers and {x,y} offsets */
  function blendEmotion(a, b, k) {
    const A = typeof a === "string" ? EMOTIONS[a] || {} : a || {}, B = typeof b === "string" ? EMOTIONS[b] || {} : b || {};
    const out = {};
    for (const key of new Set([...Object.keys(A), ...Object.keys(B)])) {
      const va = A[key], vb = B[key];
      if (isXY(va) || isXY(vb)) { const pa = va || { x: 0, y: 0 }, pb = vb || { x: 0, y: 0 }; out[key] = { x: pa.x + (pb.x - pa.x) * k, y: pa.y + (pb.y - pa.y) * k }; }
      else out[key] = (va || 0) + ((vb || 0) - (va || 0)) * k;
    }
    return out;
  }
  /** merge an emotion preset into live pose fields: offsets add, the mouth keeps its minimum */
  function withEmotion(p) {
    const E = typeof p.emotion === "string" ? EMOTIONS[p.emotion] || {} : p.emotion;
    const out = { ...p };
    for (const [k, v] of Object.entries(E)) {
      if (k === "mouthMin") continue;
      if (isXY(v)) { const live = p[k] || { x: 0, y: 0 }; out[k] = { x: v.x + live.x * 0.4, y: v.y + live.y * 0.4 }; }
      else if (["lean", "headTilt", "squash", "browUp", "look", "lookY"].includes(k)) out[k] = v + (p[k] || 0);
      else if (p[k] == null) out[k] = v;
    }
    if (E.mouthMin) out.mouth = Math.max(p.mouth || 0, E.mouthMin * (p.talking ? 0.7 : 1));
    if (E.lidRest != null) out.lidRest = Math.max(E.lidRest, p.lidRest || 0);
    return out;
  }

  T.characters = T.characters || {};
  T.characters.kit = { build, DEFAULT_RULES, EMOTIONS, blendEmotion, withEmotion };
})(window);
