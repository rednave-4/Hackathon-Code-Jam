/* ==========================================================================
   PERJUANGAN — flag.js
   Cloth Red-White flag (matches entrance reference look).
   Official ratio 3:2 · pinned at pole · free edge waves · solemn wind.
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.FlagCloth = function (canvas) {
  const ctx = canvas.getContext("2d", { alpha: true });

  let dpr = 1;
  let cols = 14;
  let rows = 10;
  let W = 360;
  let H = 240;
  let viewW = 480;
  let viewH = 360;
  let running = false;
  let rafId = null;
  let startTime = 0;

  const RED = { r: 200, g: 16, b: 46 };
  const WHITE = { r: 245, g: 241, b: 232 };

  function configure() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parent = canvas.parentElement;

    if (parent) {
      parent.style.removeProperty("width");
      parent.style.removeProperty("height");
    }

    let pw = 0;
    let ph = 0;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      pw = rect.width;
      ph = rect.height;
    }
    if (pw < 40 || ph < 40) {
      pw = Math.min(window.innerWidth * 0.7, 520);
      ph = pw * 0.75;
    }

    viewW = pw;
    viewH = ph;

    canvas.width = Math.max(1, Math.round(pw * dpr));
    canvas.height = Math.max(1, Math.round(ph * dpr));
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fabric size: fill most of the box, keep 3:2
    const maxW = Math.min(pw * 0.82, ph * 0.82 * 1.5, 480);
    W = Math.max(160, maxW);
    H = W * (2 / 3);

    cols = window.innerWidth < 720 ? 12 : 14;
    rows = 10;
  }

  function shade(base, factor) {
    const f = Math.max(-1, Math.min(1, factor));
    const mix = f >= 0 ? 255 : 0;
    const amt = Math.abs(f) * (f >= 0 ? 0.22 : 0.3);
    return (
      "rgb(" +
      Math.round(base.r + (mix - base.r) * amt) +
      "," +
      Math.round(base.g + (mix - base.g) * amt) +
      "," +
      Math.round(base.b + (mix - base.b) * amt) +
      ")"
    );
  }

  function render(now) {
    if (!running) return;
    const t = ((now || performance.now()) - startTime) / 1000;

    ctx.clearRect(0, 0, viewW, viewH);

    // Centered like the reference shot
    const anchorX = (viewW - W) * 0.5 + 8;
    const anchorY = (viewH - H) * 0.42;
    const sway = Math.sin(t * 0.5) * 3;

    ctx.save();
    ctx.translate(anchorX + sway * 0.1, anchorY);

    // Shadow
    ctx.save();
    ctx.translate(10, H * 0.15);
    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.beginPath();
    ctx.ellipse(W * 0.45, H * 0.5, W * 0.38, H * 0.14, 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Wave — medium solemn wind
    const amp1 = H * 0.048;
    const amp2 = H * 0.022;
    const colOffset = [];
    const colScale = [];
    for (let i = 0; i <= cols; i++) {
      const dist = i / cols;
      const phase1 = i * 0.5 - t * 1.65;
      const phase2 = i * 1.1 - t * 2.4 + 1.0;
      colOffset[i] = (Math.sin(phase1) * amp1 + Math.sin(phase2) * amp2) * dist;
      colScale[i] = 1 - 0.035 * dist * (1 - Math.cos(phase1)) * 0.5;
    }

    const verts = [];
    for (let j = 0; j <= rows; j++) {
      const row = [];
      for (let i = 0; i <= cols; i++) {
        row.push({
          x: (i / cols) * W * colScale[i],
          y: (j / rows) * H + colOffset[i],
        });
      }
      verts.push(row);
    }

    const half = rows / 2;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const p0 = verts[j][i];
        const p1 = verts[j][i + 1];
        const p2 = verts[j + 1][i + 1];
        const p3 = verts[j + 1][i];
        const base = j < half ? RED : WHITE;
        const slope =
          (colOffset[Math.min(i + 1, cols)] - colOffset[i]) / (amp1 + amp2 + 0.001);
        ctx.fillStyle = shade(base, -slope * 0.75);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Pole + finial (gold)
    ctx.fillStyle = "#9a7a3a";
    ctx.fillRect(-5, -H * 0.08, 5, H * 1.16);
    ctx.fillStyle = "#e8c468";
    ctx.beginPath();
    ctx.arc(-2.5, -H * 0.08, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    rafId = requestAnimationFrame(render);
  }

  function start() {
    if (running) return;
    running = true;
    startTime = performance.now();
    configure();
    requestAnimationFrame(() => {
      configure();
      requestAnimationFrame(() => configure());
    });
    setTimeout(() => configure(), 200);
    setTimeout(() => configure(), 600);
    rafId = requestAnimationFrame(render);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  configure();
  window.addEventListener("resize", configure);

  return { start, stop, configure };
};
