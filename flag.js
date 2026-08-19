/* ==========================================================================
   PERJUANGAN — flag.js
   Cloth-like Indonesian flag animation on a Canvas 2D mesh grid.
   Approach: per-column sine displacement scaled by distance-from-pole,
   plus a slight horizontal foreshortening per column to fake depth, plus
   per-quad fold shading derived from local slope, plus a soft blurred
   shadow and a tiny whole-flag sway. Loops indefinitely at ~60fps.
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.FlagCloth = function (canvas, opts) {
  opts = opts || {};
  const ctx = canvas.getContext("2d");

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let cols, rows;
  let W, H; // flag logical size (css px)
  let running = true;
  let rafId = null;
  let startTime = performance.now();

  // Colors (warm, not pure white — matches the design token system)
  const RED = { r: 200, g: 16, b: 46 }; // #C8102E
  const WHITE = { r: 245, g: 241, b: 232 }; // #F5F1E8

  function isMobile() {
    return window.innerWidth < 720;
  }

  function configure() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Flag sizing: keep a classic 3:2 ratio, scaled to fit within the panel
    const maxW = Math.min(rect.width * 0.62, 560);
    W = maxW;
    H = maxW * (2 / 3);

    cols = isMobile() ? 10 : 16;
    rows = isMobile() ? 6 : 10;
  }

  function shade(base, factor) {
    // factor in roughly [-1, 1]; positive = lighter (crest), negative = darker (trough)
    const f = Math.max(-1, Math.min(1, factor));
    const mix = f >= 0 ? 255 : 0;
    const amt = Math.abs(f) * (f >= 0 ? 0.28 : 0.35);
    const r = Math.round(base.r + (mix - base.r) * amt);
    const g = Math.round(base.g + (mix - base.g) * amt);
    const b = Math.round(base.b + (mix - base.b) * amt);
    return `rgb(${r},${g},${b})`;
  }

  function render(now) {
    if (!running) return;
    const t = (now - startTime) / 1000;

    const rect = canvas.parentElement.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Anchor: pole is pinned at this point, flag hangs/extends to the right
    const anchorX = rect.width / 2 - W / 2;

    // Whole-flag sway (1–3 degrees) around the pole line
    const swayDeg = 1.6 * Math.sin(t * 0.22);
    const swayRad = (swayDeg * Math.PI) / 180;

    ctx.save();
    ctx.translate(anchorX, rect.height / 2);
    ctx.rotate(swayRad);
    ctx.translate(0, -H / 2);

    // --- Soft shadow behind the flag ---
    ctx.save();
    ctx.filter = "blur(18px)";
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(W * 0.42, H * 0.55, W * 0.46, H * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- Precompute per-column y-offset + x-foreshorten ---
    const colOffset = new Array(cols + 1);
    const colScale = new Array(cols + 1);
    const freq1 = 0.55,
      speed1 = 1.9,
      amp1 = 0.11 * H;
    const freq2 = 1.35,
      speed2 = 3.1,
      amp2 = 0.045 * H;

    for (let i = 0; i <= cols; i++) {
      const distFactor = Math.pow(i / cols, 1.4); // 0 at pole, 1 at free edge
      const phase1 = i * freq1 - t * speed1;
      const phase2 = i * freq2 - t * speed2 + 1.2;
      const w1 = Math.sin(phase1) * amp1;
      const w2 = Math.sin(phase2) * amp2;
      colOffset[i] = (w1 + w2) * distFactor;
      colScale[i] = 1 - 0.06 * distFactor * (1 - Math.cos(phase1)) * 0.5;
    }

    // --- Build vertex grid ---
    const verts = [];
    for (let j = 0; j <= rows; j++) {
      const row = [];
      for (let i = 0; i <= cols; i++) {
        const baseX = (i / cols) * W * colScale[i];
        const baseY = (j / rows) * H;
        row.push({ x: baseX, y: baseY + colOffset[i] });
      }
      verts.push(row);
    }

    // --- Draw quads with fold shading ---
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const p0 = verts[j][i];
        const p1 = verts[j][i + 1];
        const p2 = verts[j + 1][i + 1];
        const p3 = verts[j + 1][i];

        const isRed = j < rows / 2;
        const base = isRed ? RED : WHITE;

        // Local slope from neighboring column offsets → fake fold lighting.
        // Normalized against the wave amplitudes so shading stays a soft
        // gradient rather than clipping to full light/dark on every quad.
        const slope = (colOffset[Math.min(i + 1, cols)] - colOffset[i]) / (amp1 + amp2);
        const fill = shade(base, -slope * 0.8);

        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
      }
    }

    // --- Pole ---
    ctx.fillStyle = "#8a6a2f";
    ctx.fillRect(-6, -H * 0.12, 6, H * 1.24);
    ctx.fillStyle = "#e8c468";
    ctx.beginPath();
    ctx.arc(-3, -H * 0.12, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    rafId = requestAnimationFrame(render);
  }

  function start() {
    running = true;
    startTime = performance.now();
    rafId = requestAnimationFrame(render);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  configure();
  window.addEventListener("resize", configure);

  return { start, stop, configure };
};
