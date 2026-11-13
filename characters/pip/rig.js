/**
 * Pip — the cartoonforge mascot. An original ink-blob character with a curly sprout.
 *
 * A rig is: build the parts once, then pose(p) every frame.
 * Local coordinates: feet on y = 0, up is negative y. ~640 px tall at scale 1.
 * Skin (colours, line width) comes from the style pack, so the same rig can be
 * drawn in any style.
 *
 * pose(p) fields (all optional):
 *   x, y        ground position in the parent
 *   scale       overall size
 *   squash      >0 stretch, <0 squash (volume preserving)
 *   lean        degrees
 *   stepL/stepR foot offsets {x, y} from rest
 *   handL/handR hand offsets {x, y} from rest
 *   bendL/bendR arm curve amount (rubber hose)
 *   look        pupils shift, -1..1
 *   blink       0 open … 1 closed
 *   mouth       0 smile … 1 open "ooh"
 *   sprout      sprout wiggle angle (deg)
 */
(function (global) {
  "use strict";
  const T = global.Toon;

  const REST = {
    hipL: [-48, -175], hipR: [48, -175],
    footL: [-62, -12], footR: [62, -12],
    shoulderL: [-112, -300], shoulderR: [112, -300],
    handL: [-190, -170], handR: [190, -170],
  };

  function build(parent, skin) {
    const { el } = T;
    const ink = skin.ink, white = skin.white, lw = skin.lineWidth || 10;
    const root = el("g", {}, parent);

    const limb = { fill: "none", stroke: ink, "stroke-width": 24, "stroke-linecap": "round" };
    const legL = el("path", limb, root);
    const legR = el("path", limb, root);
    const shoe = (g) => {
      const s = el("g", {}, g);
      el("ellipse", { cx: 18, cy: -6, rx: 62, ry: 32, fill: ink }, s);
      el("ellipse", { cx: 34, cy: -20, rx: 18, ry: 8, fill: white, opacity: 0.85 }, s);
      return s;
    };
    const shoeL = shoe(root);
    const shoeR = shoe(root);

    const body = el("g", {}, root);
    el("ellipse", { cx: 0, cy: -265, rx: 128, ry: 148, fill: ink }, body);
    // bow tie
    el("path", { d: "M0,-388 L-46,-412 L-46,-364 Z M0,-388 L46,-412 L46,-364 Z", fill: white, stroke: ink, "stroke-width": lw * 0.6, "stroke-linejoin": "round" }, body);
    el("circle", { cx: 0, cy: -388, r: 11, fill: ink }, body);

    const head = el("g", {}, root);
    const sprout = el("path", { d: "M0,-620 C-10,-680 50,-700 52,-660 C54,-630 18,-628 22,-652", fill: "none", stroke: ink, "stroke-width": 14, "stroke-linecap": "round" }, head);
    el("circle", { cx: 0, cy: -500, r: 140, fill: ink }, head);
    el("path", { d: "M-112,-470 C-118,-560 -40,-590 0,-548 C40,-590 118,-560 112,-470 C108,-395 50,-372 0,-372 C-50,-372 -108,-395 -112,-470 Z", fill: white }, head);

    const eye = (cx) => {
      const g = el("g", {}, head);
      el("ellipse", { cx, cy: -500, rx: 24, ry: 46, fill: ink }, g);
      const glint = el("path", { d: "", fill: white }, g); // pie-cut eye
      return { g, glint, cx };
    };
    const eyeL = eye(-38);
    const eyeR = eye(38);
    el("ellipse", { cx: 0, cy: -440, rx: 30, ry: 20, fill: ink }, head); // nose
    const mouth = el("path", { fill: ink, stroke: ink, "stroke-width": lw * 0.8, "stroke-linecap": "round", "stroke-linejoin": "round" }, head);

    const armStyle = { fill: "none", stroke: ink, "stroke-width": 20, "stroke-linecap": "round" };
    const armL = el("path", armStyle, root);
    const armR = el("path", armStyle, root);
    const glove = () => {
      const g = el("g", {}, root);
      el("circle", { cx: 0, cy: 0, r: 38, fill: white, stroke: ink, "stroke-width": lw * 0.8 }, g);
      el("path", { d: "M-14,-16 L-14,8 M2,-20 L2,8 M18,-16 L18,8", stroke: ink, "stroke-width": lw * 0.5, "stroke-linecap": "round" }, g);
      return g;
    };
    const gloveL = glove();
    const gloveR = glove();

    function pose(p = {}) {
      const sc = p.scale ?? 1;
      const { sx, sy } = T.squash(p.squash ?? 0);
      T.set(root, { transform: `translate(${(p.x ?? 0).toFixed(1)},${(p.y ?? 0).toFixed(1)}) rotate(${(p.lean ?? 0).toFixed(2)}) scale(${(sc * sx).toFixed(4)},${(sc * sy).toFixed(4)})` });

      const sL = p.stepL || { x: 0, y: 0 }, sR = p.stepR || { x: 0, y: 0 };
      const fL = [REST.footL[0] + sL.x, REST.footL[1] + sL.y];
      const fR = [REST.footR[0] + sR.x, REST.footR[1] + sR.y];
      legL.setAttribute("d", T.hose(...REST.hipL, ...fL, 18));
      legR.setAttribute("d", T.hose(...REST.hipR, ...fR, -18));
      shoeL.setAttribute("transform", `translate(${fL[0] - 30},${fL[1] + 12}) scale(-1,1)`);
      shoeR.setAttribute("transform", `translate(${fR[0] + 30},${fR[1] + 12})`);

      const hL = p.handL || { x: 0, y: 0 }, hR = p.handR || { x: 0, y: 0 };
      const aL = [REST.handL[0] + hL.x, REST.handL[1] + hL.y];
      const aR = [REST.handR[0] + hR.x, REST.handR[1] + hR.y];
      armL.setAttribute("d", T.hose(...REST.shoulderL, ...aL, p.bendL ?? 40));
      armR.setAttribute("d", T.hose(...REST.shoulderR, ...aR, p.bendR ?? -40));
      gloveL.setAttribute("transform", `translate(${aL[0]},${aL[1]})`);
      gloveR.setAttribute("transform", `translate(${aR[0]},${aR[1]})`);

      const look = (p.look ?? 0) * 8;
      const blink = T.clamp(p.blink ?? 0);
      for (const e of [eyeL, eyeR]) {
        e.g.setAttribute("transform", `translate(${e.cx},-500) scale(1,${(1 - 0.92 * blink).toFixed(3)}) translate(${-e.cx},500)`);
        // pie-cut highlight: a white wedge cut from the upper part of the pupil
        const x = e.cx + look, y = -518;
        e.glint.setAttribute("d", `M${x},${y} L${x - 13},${y - 22} A14,14 0 0 1 ${x + 8},${y - 24} Z`);
      }

      const m = T.clamp(p.mouth ?? 0);
      const w = 52 - m * 18, d = 22 + m * 46;
      mouth.setAttribute("d", `M${-w},-410 Q0,${(-410 + d).toFixed(1)} ${w},-410 Q0,${(-410 + d * 0.35).toFixed(1)} ${-w},-410 Z`);

      sprout.setAttribute("transform", `rotate(${(p.sprout ?? 0).toFixed(2)} 0 -630)`);
    }

    pose({});
    return { root, pose };
  }

  global.Toon.characters = global.Toon.characters || {};
  global.Toon.characters.pip = { build, REST };
})(window);
