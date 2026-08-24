/* ==========================================================================
   PERJUANGAN — stage-rengasdengklok.js
   "Malam ke Rengasdengklok" — 2D stealth escort (harder, larger map).
   ========================================================================== */

window.PJ = window.PJ || {};
PJ.Stages = PJ.Stages || {};

PJ.Stages["rengasdengklok"] = (function () {
  const GOLD = "#eac873";
  const RED = "#c8102e";
  const PARCH = "#f3eee1";
  const INK = "#0a0908";

  let overlay, canvas, ctx, playArea, progressEl, closeBtn, completePanel;
  let headingEl, hintEl, orbsLayer;
  let W = 0, H = 0, dpr = 1;
  let active = false;
  let completed = false;
  let rafId = null;
  let onCompleteCb = null;
  let initialized = false;

  const WORLD = { w: 2200, h: 1400 };
  let player = { x: 140, y: 700, r: 13, speed: 2.35 };
  let leaders = { x: 100, y: 700, r: 16 };
  let goal = { x: 2050, y: 680, r: 40 };
  let patrols = [];
  let bushes = [];
  let keys = Object.create(null);
  let touchId = null;
  let touchVec = { x: 0, y: 0 };
  let lives = 3;
  let alertTimer = 0;
  let spottedFlash = 0;
  let cam = { x: 0, y: 0 };
  let startSafe = 80;
  let particles = [];

  function qs(id) {
    return document.getElementById(id);
  }

  function bindChrome() {
    // Always re-bind so shared overlay buttons target THIS stage
    closeBtn = qs("stageCloseBtn");
    completePanel = qs("stageCompletePanel");
    const completeBtn = qs("stageCompleteBtn");
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        close(false);
      };
    }
    if (completeBtn) {
      completeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        close(true);
      };
    }
  }

  function ensureDom() {
    if (initialized) {
      bindChrome();
      return;
    }
    overlay = qs("stageOverlay");
    canvas = qs("stageCanvas");
    ctx = canvas.getContext("2d");
    playArea = qs("stagePlayArea");
    progressEl = qs("stageProgress");
    orbsLayer = qs("stageOrbsLayer");
    headingEl = overlay && overlay.querySelector(".stage-overlay__heading .eyebrow");
    hintEl = overlay && overlay.querySelector(".stage-overlay__hint");

    bindChrome();

    window.addEventListener("resize", () => {
      if (active) configure();
    });
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    initialized = true;
  }

  function onKeyDown(e) {
    if (!active) return;
    if (e.key === "Escape") {
      close(false);
      return;
    }
    keys[e.key.toLowerCase()] = true;
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  }
  function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
  }

  function onPointerDown(e) {
    if (!active || completed) return;
    touchId = e.pointerId;
    canvas.setPointerCapture(e.pointerId);
    updateTouchVec(e);
  }
  function onPointerMove(e) {
    if (touchId !== e.pointerId) return;
    updateTouchVec(e);
  }
  function onPointerUp(e) {
    if (touchId !== e.pointerId) return;
    touchId = null;
    touchVec.x = 0;
    touchVec.y = 0;
  }
  function updateTouchVec(e) {
    const rect = canvas.getBoundingClientRect();
    const sx = (player.x - cam.x) * (rect.width / W);
    const sy = (player.y - cam.y) * (rect.height / H);
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let dx = mx - sx;
    let dy = my - sy;
    const len = Math.hypot(dx, dy) || 1;
    if (len < 16) {
      touchVec.x = 0;
      touchVec.y = 0;
      return;
    }
    touchVec.x = dx / len;
    touchVec.y = dy / len;
  }

  function configure() {
    const rect = playArea.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resetWorld() {
    player = { x: 150, y: WORLD.h * 0.5, r: 13, speed: 2.35 };
    leaders = { x: 110, y: WORLD.h * 0.5, r: 16 };
    goal = { x: WORLD.w - 150, y: WORLD.h * 0.48, r: 42 };
    lives = 3;
    alertTimer = 0;
    spottedFlash = 0;
    startSafe = 70;
    particles = [];
    completed = false;
    if (completePanel) {
      completePanel.hidden = true;
      completePanel.classList.remove("is-in");
    }

    bushes = [
      { x: 280, y: 320, r: 42 },
      { x: 420, y: 980, r: 48 },
      { x: 640, y: 240, r: 40 },
      { x: 780, y: 1100, r: 50 },
      { x: 980, y: 520, r: 38 },
      { x: 1200, y: 300, r: 44 },
      { x: 1350, y: 900, r: 46 },
      { x: 1580, y: 480, r: 40 },
      { x: 1750, y: 1050, r: 48 },
      { x: 520, y: 600, r: 36 },
      { x: 1100, y: 720, r: 34 },
      { x: 1480, y: 200, r: 42 },
    ];

    // More patrols, faster, wider vision
    patrols = [
      mkPatrol([{ x: 360, y: 160 }, { x: 360, y: 1200 }], 1.45, 155, 0.72),
      mkPatrol([{ x: 580, y: 1280 }, { x: 580, y: 140 }], 1.35, 160, 0.7),
      mkPatrol([{ x: 820, y: 200 }, { x: 980, y: 700 }, { x: 820, y: 1180 }, { x: 680, y: 700 }], 1.5, 150, 0.75),
      mkPatrol([{ x: 1100, y: 120 }, { x: 1100, y: 1280 }], 1.4, 165, 0.68),
      mkPatrol([{ x: 1350, y: 1100 }, { x: 1550, y: 500 }, { x: 1350, y: 200 }, { x: 1180, y: 500 }], 1.55, 145, 0.78),
      mkPatrol([{ x: 1680, y: 180 }, { x: 1680, y: 1220 }], 1.3, 158, 0.7),
      mkPatrol([{ x: 1900, y: 1000 }, { x: 1900, y: 250 }], 1.4, 150, 0.72),
      mkPatrol([{ x: 480, y: 450 }, { x: 720, y: 450 }, { x: 720, y: 850 }, { x: 480, y: 850 }], 1.25, 140, 0.8),
      mkPatrol([{ x: 1450, y: 650 }, { x: 1750, y: 650 }], 1.6, 135, 0.75),
    ];

    updateProgressUI();
  }

  function mkPatrol(path, speed, vision, fov) {
    const p = {
      path,
      idx: 0,
      t: 0,
      speed,
      angle: 0,
      vision,
      fov,
      x: path[0].x,
      y: path[0].y,
    };
    return p;
  }

  function updateProgressUI() {
    if (progressEl) progressEl.textContent = lives + " / 3";
  }

  function inBush(x, y) {
    return bushes.some((b) => Math.hypot(x - b.x, y - b.y) < b.r * 0.82);
  }

  function moveEntity(ent, vx, vy, speed) {
    const len = Math.hypot(vx, vy) || 1;
    let nx = ent.x + (vx / len) * speed;
    let ny = ent.y + (vy / len) * speed;
    nx = Math.max(30, Math.min(WORLD.w - 30, nx));
    ny = Math.max(30, Math.min(WORLD.h - 30, ny));
    ent.x = nx;
    ent.y = ny;
  }

  function updatePatrol(p) {
    const a = p.path[p.idx];
    const b = p.path[(p.idx + 1) % p.path.length];
    const dist = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    p.t += p.speed / dist;
    if (p.t >= 1) {
      p.t = 0;
      p.idx = (p.idx + 1) % p.path.length;
    }
    const a2 = p.path[p.idx];
    const b2 = p.path[(p.idx + 1) % p.path.length];
    p.x = a2.x + (b2.x - a2.x) * p.t;
    p.y = a2.y + (b2.y - a2.y) * p.t;
    p.angle = Math.atan2(b2.y - a2.y, b2.x - a2.x);
  }

  function canSee(patrol, tx, ty) {
    if (inBush(tx, ty)) return false;
    const dx = tx - patrol.x;
    const dy = ty - patrol.y;
    const dist = Math.hypot(dx, dy);
    if (dist > patrol.vision) return false;
    const ang = Math.atan2(dy, dx);
    let diff = ang - patrol.angle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return Math.abs(diff) < patrol.fov;
  }

  function onSpotted() {
    if (startSafe > 0 || alertTimer > 0 || completed) return;
    lives -= 1;
    alertTimer = 85;
    spottedFlash = 40;
    updateProgressUI();
    player.x = Math.max(80, player.x - 100);
    leaders.x = player.x - 40;
    leaders.y = player.y;
    for (let i = 0; i < 16; i++) {
      particles.push({
        x: player.x,
        y: player.y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 28 + Math.random() * 18,
        color: RED,
      });
    }
    if (lives <= 0) {
      setTimeout(() => {
        if (active && !completed) resetWorld();
      }, 550);
    }
  }

  function update() {
    if (!active || completed) return;
    if (startSafe > 0) startSafe--;
    if (alertTimer > 0) alertTimer--;
    if (spottedFlash > 0) spottedFlash--;

    let vx = 0, vy = 0;
    if (keys["w"] || keys["arrowup"]) vy -= 1;
    if (keys["s"] || keys["arrowdown"]) vy += 1;
    if (keys["a"] || keys["arrowleft"]) vx -= 1;
    if (keys["d"] || keys["arrowright"]) vx += 1;
    if (touchId !== null) {
      vx += touchVec.x;
      vy += touchVec.y;
    }
    if (vx || vy) moveEntity(player, vx, vy, player.speed);

    leaders.x += (player.x - 36 - leaders.x) * 0.09;
    leaders.y += (player.y - leaders.y) * 0.09;

    patrols.forEach(updatePatrol);

    if (startSafe <= 0 && alertTimer <= 0) {
      for (const p of patrols) {
        if (canSee(p, player.x, player.y) || canSee(p, leaders.x, leaders.y)) {
          onSpotted();
          break;
        }
      }
    }

    if (Math.hypot(player.x - goal.x, player.y - goal.y) < goal.r + player.r + 28) {
      win();
    }

    particles = particles.filter((pt) => {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 1;
      pt.vx *= 0.94;
      pt.vy *= 0.94;
      return pt.life > 0;
    });

    cam.x = player.x - W * 0.38;
    cam.y = player.y - H * 0.5;
    cam.x = Math.max(0, Math.min(WORLD.w - W, cam.x));
    cam.y = Math.max(0, Math.min(WORLD.h - H, cam.y));
  }

  function win() {
    if (completed) return;
    completed = true;
    bindChrome();
    if (completePanel) {
      const isEn = PJ.I18N && PJ.I18N.getLang() === "en";
      if (headingEl) headingEl.textContent = "Rengasdengklok";
      const title = completePanel.querySelector(".stage-complete__title");
      const body = completePanel.querySelector(".stage-complete__body");
      const eyebrow = completePanel.querySelector(".eyebrow");
      if (eyebrow) eyebrow.textContent = isEn ? "Safe" : "Aman";
      if (title)
        title.textContent = isEn
          ? "Soekarno & Hatta have arrived"
          : "Soekarno & Hatta tiba dengan selamat";
      if (body)
        body.textContent = isEn
          ? "Under pressure from the youth, the proclamation could no longer be delayed."
          : "Di bawah desakan golongan muda, proklamasi tak lagi bisa ditunda.";
      completePanel.hidden = false;
      // CRITICAL: panel CSS defaults to opacity 0 until .is-in
      completePanel.classList.add("is-in");
    }
    // Backup: mark progress even if user never clicks Lanjutkan
    try {
      if (typeof window.markMissionComplete === "function") {
        window.markMissionComplete("rengasdengklok");
      }
    } catch (e) {}
    for (let i = 0; i < 36; i++) {
      particles.push({
        x: goal.x,
        y: goal.y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 40 + Math.random() * 25,
        color: GOLD,
      });
    }
  }

  function drawVisionCone(p) {
    ctx.save();
    ctx.translate(p.x - cam.x, p.y - cam.y);
    ctx.rotate(p.angle);
    const grd = ctx.createRadialGradient(0, 0, 8, 0, 0, p.vision);
    grd.addColorStop(0, "rgba(200, 16, 46, 0.28)");
    grd.addColorStop(1, "rgba(200, 16, 46, 0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, p.vision, -p.fov, p.fov);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function render() {
    if (!ctx || !active) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0c0f0a";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(201, 162, 39, 0.05)";
    ctx.lineWidth = 1;
    const grid = 100;
    const ox = -((cam.x % grid) + grid) % grid;
    const oy = -((cam.y % grid) + grid) % grid;
    for (let x = ox; x < W; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = oy; y < H; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // faint route
    ctx.strokeStyle = "rgba(234, 200, 115, 0.1)";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(140 - cam.x, WORLD.h * 0.5 - cam.y);
    ctx.lineTo(goal.x - cam.x, goal.y - cam.y);
    ctx.stroke();

    bushes.forEach((b) => {
      const sx = b.x - cam.x, sy = b.y - cam.y;
      ctx.beginPath();
      ctx.arc(sx, sy, b.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(22, 38, 20, 0.9)";
      ctx.fill();
      ctx.strokeStyle = "rgba(90, 140, 80, 0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(50, 90, 45, 0.55)";
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + 0.3;
        ctx.beginPath();
        ctx.arc(sx + Math.cos(a) * b.r * 0.4, sy + Math.sin(a) * b.r * 0.4, b.r * 0.32, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // goal
    {
      const gx = goal.x - cam.x, gy = goal.y - cam.y;
      ctx.beginPath();
      ctx.arc(gx, gy, goal.r + 10, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(234, 200, 115, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#2a2218";
      ctx.fillRect(gx - 22, gy - 16, 44, 32);
      ctx.fillStyle = RED;
      ctx.beginPath();
      ctx.moveTo(gx - 28, gy - 16);
      ctx.lineTo(gx, gy - 36);
      ctx.lineTo(gx + 28, gy - 16);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = GOLD;
      ctx.font = "11px Special Elite, monospace";
      ctx.textAlign = "center";
      ctx.fillText("RENGASDENGKLOK", gx, gy + 52);
    }

    patrols.forEach(drawVisionCone);
    patrols.forEach((p) => {
      const sx = p.x - cam.x, sy = p.y - cam.y;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(p.angle);
      ctx.fillStyle = "#3d5a73";
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5a84a6";
      ctx.beginPath();
      ctx.arc(8, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // leaders
    {
      const lx = leaders.x - cam.x, ly = leaders.y - cam.y;
      ctx.beginPath();
      ctx.arc(lx, ly, leaders.r, 0, Math.PI * 2);
      ctx.fillStyle = PARCH;
      ctx.fill();
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("S+H", lx, ly);
    }

    // player
    {
      const px = player.x - cam.x, py = player.y - cam.y;
      const hidden = inBush(player.x, player.y);
      ctx.beginPath();
      ctx.arc(px, py, player.r, 0, Math.PI * 2);
      ctx.fillStyle = hidden ? "rgba(200, 16, 46, 0.5)" : RED;
      ctx.fill();
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (hidden) {
        ctx.fillStyle = "rgba(234, 200, 115, 0.85)";
        ctx.font = "9px Special Elite, monospace";
        ctx.textAlign = "center";
        ctx.fillText("SEMBUNYI", px, py - player.r - 10);
      }
    }

    particles.forEach((pt) => {
      ctx.globalAlpha = Math.max(0, pt.life / 50);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x - cam.x, pt.y - cam.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    if (spottedFlash > 0) {
      ctx.fillStyle = `rgba(200, 16, 46, ${0.25 * (spottedFlash / 40)})`;
      ctx.fillRect(0, 0, W, H);
    }

    const isId = !(PJ.I18N && PJ.I18N.getLang() === "en");
    ctx.fillStyle = "rgba(243, 238, 225, 0.45)";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(
      isId ? "WASD / panah / seret · 9 PATROLI · peta 2× lebih luas" : "WASD / arrows / drag · 9 PATROLS · 2× map",
      16,
      H - 18
    );

    if (startSafe > 0) {
      ctx.fillStyle = "rgba(234, 200, 115, 0.9)";
      ctx.font = "13px Special Elite, monospace";
      ctx.textAlign = "center";
      ctx.fillText(isId ? "Berangkat diam-diam…" : "Move out quietly…", W / 2, 28);
    }
  }

  function loop() {
    if (!active) return;
    update();
    render();
    rafId = requestAnimationFrame(loop);
  }

  function open(opts) {
    ensureDom();
    bindChrome();
    onCompleteCb = (opts && opts.onComplete) || function () {};
    completed = false;
    if (orbsLayer) orbsLayer.innerHTML = "";
    if (completePanel) completePanel.hidden = true;

    const isId = !(PJ.I18N && PJ.I18N.getLang() === "en");
    if (headingEl) headingEl.textContent = "Rengasdengklok · 16 Agustus 1945";
    if (hintEl)
      hintEl.textContent = isId
        ? "Kawal Soekarno & Hatta. Hindari patroli. Semak melindungi. Peta lebih luas — lebih sulit."
        : "Escort Soekarno & Hatta. Avoid patrols. Bushes hide you. Larger map — harder.";

    overlay.hidden = false;
    overlay.classList.add("is-open");
    active = true;
    configure();
    resetWorld();
    keys = Object.create(null);
    touchId = null;
    touchVec = { x: 0, y: 0 };

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  function close(didComplete) {
    active = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (overlay) {
      overlay.classList.remove("is-open");
      overlay.hidden = true;
    }
    if (completePanel) {
      completePanel.hidden = true;
      completePanel.classList.remove("is-in");
    }
    if (didComplete && typeof onCompleteCb === "function") {
      onCompleteCb();
      console.log("[PERJUANGAN] rengasdengklok complete → unlock next");
    }
  }

  return { open, close };
})();
