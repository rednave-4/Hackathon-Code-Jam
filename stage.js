/* ==========================================================================
   PERJUANGAN — stages/sumpah-pemuda/stage.js
   "Satukan Suara" — cinematic node-linking ritual.

   Six regional voices (orbs) must be brought into the central will.
   Presentation is deliberately solemn and restrained: parchment, gold,
   deep red, ink-like light threads. No toy colours or bounce-heavy motion.

   Mechanic stays accessible (single tap / click / Enter) so it works on
   touch and keyboard without historical knowledge required.
   ========================================================================== */

window.PJ = window.PJ || {};
PJ.Stages = PJ.Stages || {};

PJ.Stages["sumpah-pemuda"] = (function () {
  const ORB_COUNT = 6;
  const GOLD = "#eac873";
  const GOLD_DIM = "#c9a227";
  const PARCH = "#f3eee1";

  // Restrained palette + short regional labels (not cartoon colours)
  const ORBS_DEF = [
    { label: "Sumatera", hue: "#8b2e2e" },
    { label: "Jawa",     hue: "#a67c2a" },
    { label: "Kalimantan", hue: "#3d5a4c" },
    { label: "Sulawesi", hue: "#4a5c6e" },
    { label: "Nusa",     hue: "#6b4a3a" },
    { label: "Papua",    hue: "#5a3d5c" },
  ];

  let overlay, canvas, ctx, playArea, orbsLayer, progressEl, closeBtn, completePanel;
  let W = 0, H = 0, dpr = 1;
  let orbs = [];
  let center = { x: 0, y: 0, r: 34 };
  let particles = [];
  let threads = []; // animated connection threads
  let active = false;
  let completed = false;
  let rafId = null;
  let closeTimer = null;
  let onCompleteCb = null;
  let initialized = false;
  let startTime = 0;

  function qs(id) { return document.getElementById(id); }

  function ensureDom() {
    if (initialized) return;
    overlay = qs("stageOverlay");
    canvas = qs("stageCanvas");
    ctx = canvas.getContext("2d");
    playArea = qs("stagePlayArea");
    orbsLayer = qs("stageOrbsLayer");
    progressEl = qs("stageProgress");
    closeBtn = qs("stageCloseBtn");
    completePanel = qs("stageCompletePanel");
    const completeBtn = qs("stageCompleteBtn");

    closeBtn.addEventListener("pointerup", (e) => { e.preventDefault(); close(false); });
    closeBtn.addEventListener("click", (e) => e.preventDefault());
    if (completeBtn) {
      completeBtn.addEventListener("pointerup", (e) => { e.preventDefault(); close(true); });
      completeBtn.addEventListener("click", (e) => e.preventDefault());
    }

    window.addEventListener("resize", () => { if (active) configure(); });
    document.addEventListener("keydown", (e) => {
      if (active && e.key === "Escape") close(false);
    });

    initialized = true;
  }

  function configure() {
    const rect = playArea.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width;
    H = rect.height;
    if (W === 0 || H === 0) return;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layoutOrbs();
    if (orbsLayer.children.length === 0) buildOrbButtons();
    positionOrbButtons();
  }

  function layoutOrbs() {
    center = {
      x: W / 2,
      y: H / 2,
      r: Math.max(28, Math.min(W, H) * 0.055),
    };
    const radiusX = W * 0.32;
    const radiusY = H * 0.30;
    orbs.forEach((orb, i) => {
      const angle = (i / ORB_COUNT) * Math.PI * 2 - Math.PI / 2;
      orb.x = center.x + Math.cos(angle) * radiusX;
      orb.y = center.y + Math.sin(angle) * radiusY;
    });
  }

  function positionOrbButtons() {
    orbs.forEach((orb) => {
      if (!orb.el) return;
      orb.el.style.left = orb.x + "px";
      orb.el.style.top = orb.y + "px";
    });
  }

  function buildOrbButtons() {
    orbsLayer.innerHTML = "";
    orbs.forEach((orb) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "orb orb--solemn";
      btn.style.setProperty("--orb-color", orb.hue);
      btn.setAttribute("aria-label", `${orb.label}, belum tersambung`);
      btn.innerHTML = `
        <span class="orb__ring"></span>
        <span class="orb__core"></span>
        <span class="orb__label">${orb.label}</span>
      `;
      // pointerup is the primary path; click as fallback
      btn.addEventListener("pointerup", (e) => {
        e.preventDefault();
        e.stopPropagation();
        connectOrb(orb);
      });
      btn.addEventListener("click", (e) => e.preventDefault());
      orb.el = btn;
      orbsLayer.appendChild(btn);
    });
  }

  function resetState() {
    orbs = ORBS_DEF.map((def, i) => ({
      id: i,
      label: def.label,
      hue: def.hue,
      connected: false,
      x: 0, y: 0,
      el: null,
      connectT: 0,
    }));
    completed = false;
    particles = [];
    threads = [];
    buildOrbButtons();
  }

  function connectedCount() {
    return orbs.reduce((n, o) => n + (o.connected ? 1 : 0), 0);
  }

  function updateProgressLabel() {
    if (progressEl) {
      progressEl.textContent = `${connectedCount()} / ${ORB_COUNT} SUARA`;
    }
  }

  function connectOrb(orb) {
    if (!active || completed || orb.connected) return;
    orb.connected = true;
    orb.connectT = performance.now();
    orb.el.classList.add("orb--connected");
    orb.el.disabled = true;
    orb.el.setAttribute("aria-label", `${orb.label}, tersambung`);
    spawnDust(orb.x, orb.y, orb.hue);
    spawnDust(center.x, center.y, GOLD);
    threads.push({
      from: { x: orb.x, y: orb.y },
      to: { x: center.x, y: center.y },
      t: 0,
      color: orb.hue,
    });
    updateProgressLabel();

    if (connectedCount() === ORB_COUNT) {
      completed = true;
      setTimeout(triggerCompletion, 700);
    } else {
      const next = orbs.find((o) => !o.connected);
      if (next && next.el) next.el.focus({ preventScroll: true });
    }
  }

  function spawnDust(x, y, color) {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.8;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        life: 1,
        color: color || GOLD,
        size: 1.2 + Math.random() * 1.8,
      });
    }
  }

  function triggerCompletion() {
    if (!completePanel) return;
    // final burst from center
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2.5;
      particles.push({
        x: center.x, y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.2,
        color: GOLD,
        size: 1.5 + Math.random() * 2,
      });
    }
    completePanel.hidden = false;
    requestAnimationFrame(() => {
      completePanel.classList.add("is-in");
      const btn = qs("stageCompleteBtn");
      if (btn) btn.focus({ preventScroll: true });
    });
  }

  function drawThread(from, to, progress, color) {
    const t = Math.min(1, progress);
    const mx = from.x + (to.x - from.x) * t;
    const my = from.y + (to.y - from.y) * t;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.85;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    // slight curve for organic feel
    const cx = (from.x + to.x) / 2 + (to.y - from.y) * 0.08;
    const cy = (from.y + to.y) / 2 - (to.x - from.x) * 0.08;
    ctx.quadraticCurveTo(cx, cy, mx, my);
    ctx.stroke();
    ctx.restore();
  }

  function render(now) {
    if (!active) return;
    const t = (now - startTime) / 1000;
    ctx.clearRect(0, 0, W, H);

    // subtle radial atmosphere
    const atm = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, Math.max(W, H) * 0.55);
    atm.addColorStop(0, "rgba(201,162,39,0.04)");
    atm.addColorStop(0.5, "rgba(0,0,0,0)");
    atm.addColorStop(1, "rgba(0,0,0,0.25)");
    ctx.fillStyle = atm;
    ctx.fillRect(0, 0, W, H);

    // center glow (slow pulse)
    const pulse = 1 + Math.sin(t * 1.1) * 0.06;
    const glowR = center.r * 4.2 * pulse;
    const grad = ctx.createRadialGradient(center.x, center.y, 2, center.x, center.y, glowR);
    grad.addColorStop(0, "rgba(234,200,115,0.28)");
    grad.addColorStop(0.45, "rgba(201,162,39,0.08)");
    grad.addColorStop(1, "rgba(234,200,115,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(center.x, center.y, glowR, 0, Math.PI * 2);
    ctx.fill();

    // connection threads
    threads.forEach((th) => {
      th.t = Math.min(1, th.t + 0.035);
      drawThread(th.from, th.to, th.t, th.color);
    });
    // completed threads stay fully drawn in gold
    orbs.forEach((o) => {
      if (o.connected) {
        const age = (now - o.connectT) / 1000;
        const alpha = Math.min(1, age * 2);
        ctx.save();
        ctx.globalAlpha = 0.55 * alpha;
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.shadowColor = GOLD;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(o.x, o.y);
        const cx = (o.x + center.x) / 2 + (center.y - o.y) * 0.08;
        const cy = (o.y + center.y) / 2 - (center.x - o.x) * 0.08;
        ctx.quadraticCurveTo(cx, cy, center.x, center.y);
        ctx.stroke();
        ctx.restore();
      }
    });

    // center node — layered, solemn
    ctx.save();
    const pr = center.r + Math.sin(t * 1.2) * 2.2;
    // outer ring
    ctx.strokeStyle = "rgba(201,162,39,0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(center.x, center.y, pr + 14, 0, Math.PI * 2);
    ctx.stroke();
    // main disc
    ctx.fillStyle = "#16120e";
    ctx.strokeStyle = GOLD_DIM;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(center.x, center.y, pr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // inner mark
    ctx.strokeStyle = "rgba(234,200,115,0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(center.x, center.y, pr * 0.45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // dust particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.015; // slight gravity
      p.life -= 0.018;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    rafId = requestAnimationFrame(render);
  }

  function open(opts) {
    ensureDom();
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    onCompleteCb = (opts && opts.onComplete) || function () {};
    resetState();
    startTime = performance.now();

    // update topbar copy for solemn tone
    const hint = overlay.querySelector(".stage-overlay__hint");
    if (hint) {
      hint.textContent = "Ketuk setiap suara daerah hingga semua tersambung ke pusat tekad.";
    }
    const eyebrow = overlay.querySelector(".stage-overlay__heading .eyebrow");
    if (eyebrow) eyebrow.textContent = "Sumpah Pemuda · Satukan Suara";

    // completion panel copy
    const title = completePanel.querySelector(".stage-complete__title");
    const body = completePanel.querySelector(".stage-complete__body");
    if (title) title.textContent = "Satu Nusa · Satu Bangsa · Satu Bahasa";
    if (body) {
      body.textContent =
        "Dari penjuru yang berbeda, satu tekad yang sama. Ikrar yang menjadi fondasi persatuan menuju kemerdekaan.";
    }

    overlay.hidden = false;
    completePanel.hidden = true;
    completePanel.classList.remove("is-in");
    active = true;

    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
      configure();
      updateProgressLabel();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(render);
      if (orbs[0] && orbs[0].el) orbs[0].el.focus({ preventScroll: true });
    });
  }

  function close(didComplete) {
    active = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    overlay.classList.remove("is-open");
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (!active) overlay.hidden = true;
      closeTimer = null;
    }, 320);
    if (didComplete && typeof onCompleteCb === "function") {
      onCompleteCb();
    }
  }

  return { open, close };
})();
