/**
 * PERJUANGAN v2.0 — Peta Perjuangan
 * Entrance flow + Mission Map shell
 * Clean hooks: startMission(stageId), markMissionComplete(stageId)
 */

(() => {
  'use strict';

  // ========== MISSION DATA ==========
  const MISSIONS = [
    {
      id: 1,
      title: 'Sumpah Pemuda',
      date: '28 Oktober 1928',
      blurb: 'Kongres Pemuda II di Batavia. Tiga sumpah yang menyatukan bahasa, bangsa, dan tanah air — fondasi semangat persatuan Indonesia.',
      icon: '✊',
      x: 0.22, y: 0.42 // relative positions on map
    },
    {
      id: 2,
      title: 'Rengasdengklok',
      date: '16 Agustus 1945',
      blurb: 'Operasi malam yang membawa Soekarno dan Hatta ke Rengasdengklok. Desakan pemuda agar proklamasi segera dibacakan.',
      icon: '🌙',
      x: 0.38, y: 0.55
    },
    {
      id: 3,
      title: 'Proklamasi',
      date: '17 Agustus 1945',
      blurb: 'Di Jalan Pegangsaan Timur 56, teks proklamasi dibacakan. Hari lahirnya Republik Indonesia yang merdeka.',
      icon: '📜',
      x: 0.52, y: 0.38
    },
    {
      id: 4,
      title: 'Surabaya',
      date: '10 November 1945',
      blurb: 'Pertempuran heroik mempertahankan kota. Semangat Arek-arek Suroboyo yang menginspirasi perlawanan di seluruh nusantara.',
      icon: '🔥',
      x: 0.68, y: 0.58
    },
    {
      id: 5,
      title: 'Agresi & Gerilya',
      date: '1947 – 1948',
      blurb: 'Dua agresi militer Belanda dan perang gerilya di pedalaman. Strategi yang memaksa dunia mengakui kedaulatan Indonesia.',
      icon: '⚔',
      x: 0.82, y: 0.45
    }
  ];

  const STORAGE_KEY = 'perjuangan_v2_progress';

  // ========== STATE ==========
  let progress = loadProgress(); // array of completed mission ids
  let currentScreen = 'entrance-1';
  let selectedMissionId = null;

  // ========== DOM ==========
  const $ = (sel) => document.querySelector(sel);
  const screens = {
    e1: $('#entrance-1'),
    e2: $('#entrance-2'),
    map: $('#main-map')
  };
  const flagCanvas = $('#flag-canvas');
  const mapCanvas = $('#map-canvas');
  const nodesContainer = $('#nodes-container');
  const detailPanel = $('#detail-panel');
  const stagePlaceholder = $('#stage-placeholder');

  // ========== PROGRESS ==========
  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter(n => n >= 1 && n <= 5) : [];
    } catch {
      return [];
    }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function getMissionState(id) {
    if (progress.includes(id)) return 'completed';
    // First incomplete is available; previous must be completed (or id===1)
    const prev = id - 1;
    if (id === 1 || progress.includes(prev)) return 'available';
    return 'locked';
  }

  function updateProgressUI() {
    const count = progress.length;
    $('#progress-text').textContent = `${count} / 5 Misi`;
  }

  // ========== PUBLIC HOOKS (for future stages) ==========
  window.startMission = function (stageId) {
    console.log('[PERJUANGAN] startMission called →', stageId);
    // Stub: show elegant placeholder
    stagePlaceholder.classList.add('open');
    stagePlaceholder.setAttribute('aria-hidden', 'false');
  };

  window.markMissionComplete = function (stageId) {
    stageId = Number(stageId);
    if (!progress.includes(stageId)) {
      progress.push(stageId);
      progress.sort((a, b) => a - b);
      saveProgress();
      updateProgressUI();
      renderNodes();
      drawMapRoutes();
      if (selectedMissionId === stageId) openDetail(stageId);
    }
  };

  // ========== SCREEN TRANSITIONS ==========
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    if (name === 'entrance-1') screens.e1.classList.add('active');
    if (name === 'entrance-2') screens.e2.classList.add('active');
    if (name === 'map') {
      screens.map.classList.add('active');
      initMap();
    }
    currentScreen = name;
  }

  // Entrance 1 → 2
  function advanceFromFlag() {
    if (currentScreen !== 'entrance-1') return;
    screens.e1.style.transition = 'opacity 0.85s ease, filter 0.85s ease';
    screens.e1.style.filter = 'blur(6px)';
    screens.e1.style.opacity = '0';
    setTimeout(() => {
      showScreen('entrance-2');
      // stop heavy flag sim after leave (optional keep running lightly)
    }, 900);
  }

  // ========== FLAG CLOTH (Canvas 2D mesh) ==========
  const FlagSim = (() => {
    let ctx, W, H, cols, rows, particles, springs;
    let running = false;
    let raf = null;
    let time = 0;
    const SEG_X = 18; // columns
    const SEG_Y = 11; // rows
    const DAMPING = 0.965;
    const WIND_BASE = 0.018;
    const GRAVITY = 0.0008;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = flagCanvas.clientWidth;
      H = flagCanvas.clientHeight;
      flagCanvas.width = W * dpr;
      flagCanvas.height = H * dpr;
      ctx = flagCanvas.getContext('2d');
      ctx.scale(dpr, dpr);
      buildMesh();
    }

    function buildMesh() {
      cols = SEG_X;
      rows = SEG_Y;
      // Flag size relative to viewport
      const flagW = Math.min(W * 0.55, 420);
      const flagH = flagW * (2 / 3); // classic proportion approx
      const originX = (W - flagW) * 0.5;
      const originY = (H - flagH) * 0.42;

      particles = [];
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const px = originX + (x / cols) * flagW;
          const py = originY + (y / rows) * flagH;
          particles.push({
            x: px, y: py,
            ox: px, oy: py, // original for rest length
            vx: 0, vy: 0,
            pinned: x === 0 // pole side
          });
        }
      }

      springs = [];
      const restX = flagW / cols;
      const restY = flagH / rows;
      // structural
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const i = y * (cols + 1) + x;
          if (x < cols) springs.push({ a: i, b: i + 1, rest: restX, k: 0.28 });
          if (y < rows) springs.push({ a: i, b: i + cols + 1, rest: restY, k: 0.28 });
        }
      }
      // shear (optional light)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * (cols + 1) + x;
          springs.push({ a: i, b: i + cols + 2, rest: Math.hypot(restX, restY), k: 0.08 });
          springs.push({ a: i + 1, b: i + cols + 1, rest: Math.hypot(restX, restY), k: 0.08 });
        }
      }
    }

    function step(dt) {
      time += dt;
      // wind + noise
      const wind = WIND_BASE + Math.sin(time * 0.7) * 0.006 + Math.sin(time * 1.9) * 0.003;

      // apply forces
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.pinned) continue;
        const distFromPole = (i % (cols + 1)) / cols;
        // primary wave
        const wave = Math.sin(time * 1.4 + distFromPole * 4.2 + (Math.floor(i / (cols + 1)) * 0.15)) * 0.9;
        const ripple = Math.sin(time * 3.1 + distFromPole * 9) * 0.25;
        p.vx += (wind * (0.4 + distFromPole * 1.1) + wave * 0.012 + ripple * 0.006) * (0.7 + distFromPole);
        p.vy += GRAVITY + Math.sin(time * 0.9 + distFromPole * 2) * 0.0015;
        // slight whole-flag sway
        p.vx += Math.sin(time * 0.35) * 0.0015 * distFromPole;
      }

      // integrate
      for (const p of particles) {
        if (p.pinned) continue;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
      }

      // constraints (multiple iterations for stability)
      for (let iter = 0; iter < 4; iter++) {
        for (const s of springs) {
          const a = particles[s.a];
          const b = particles[s.b];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const diff = (dist - s.rest) / dist;
          const offx = dx * diff * 0.5 * s.k;
          const offy = dy * diff * 0.5 * s.k;
          if (!a.pinned) { a.x += offx; a.y += offy; }
          if (!b.pinned) { b.x -= offx; b.y -= offy; }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // soft shadow under flag
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      const lastRow = particles.slice(- (cols + 1));
      for (let i = 0; i < lastRow.length; i++) {
        const p = lastRow[i];
        if (i === 0) ctx.moveTo(p.x + 8, p.y + 18);
        else ctx.lineTo(p.x + 8, p.y + 18);
      }
      ctx.lineTo(lastRow[lastRow.length - 1].x + 30, H);
      ctx.lineTo(lastRow[0].x - 10, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // draw flag as textured quads (red / white)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * (cols + 1) + x;
          const p0 = particles[i];
          const p1 = particles[i + 1];
          const p2 = particles[i + cols + 1];
          const p3 = particles[i + cols + 2];

          // fold shading: darker in troughs
          const avgY = (p0.y + p1.y + p2.y + p3.y) * 0.25;
          const baseY = (p0.oy + p1.oy + p2.oy + p3.oy) * 0.25;
          const fold = Math.max(-0.25, Math.min(0.25, (avgY - baseY) * 0.04));

          const isRed = y < rows / 2;
          let r, g, b;
          if (isRed) {
            r = 200 + fold * 40; g = 16 + fold * 20; b = 46 + fold * 20;
          } else {
            r = 245 + fold * 15; g = 245 + fold * 15; b = 245 + fold * 15;
          }

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();
          ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
          ctx.fill();
        }
      }

      // pole
      const poleTop = particles[0];
      const poleBot = particles[rows * (cols + 1)];
      ctx.strokeStyle = '#8a7a4a';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(poleTop.x - 2, poleTop.y - 12);
      ctx.lineTo(poleBot.x - 2, poleBot.y + 20);
      ctx.stroke();
      // finial
      ctx.fillStyle = '#c9a227';
      ctx.beginPath();
      ctx.arc(poleTop.x - 2, poleTop.y - 14, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    function loop(t) {
      if (!running) return;
      step(0.016);
      draw();
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      resize();
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    }

    window.addEventListener('resize', () => {
      if (running) resize();
    });

    return { start, stop, resize };
  })();

  // ========== MAP CANVAS (Indonesia silhouette + routes) ==========
  let mapCtx, mapW, mapH;

  function resizeMap() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    mapW = mapCanvas.clientWidth;
    mapH = mapCanvas.clientHeight;
    mapCanvas.width = mapW * dpr;
    mapCanvas.height = mapH * dpr;
    mapCtx = mapCanvas.getContext('2d');
    mapCtx.scale(dpr, dpr);
    drawMapBackground();
    drawMapRoutes();
  }

  function drawMapBackground() {
    if (!mapCtx) return;
    mapCtx.clearRect(0, 0, mapW, mapH);

    // dark base
    const grad = mapCtx.createRadialGradient(mapW * 0.5, mapH * 0.45, 0, mapW * 0.5, mapH * 0.5, mapW * 0.7);
    grad.addColorStop(0, '#0c0c10');
    grad.addColorStop(1, '#050506');
    mapCtx.fillStyle = grad;
    mapCtx.fillRect(0, 0, mapW, mapH);

    // subtle grid
    mapCtx.strokeStyle = 'rgba(255,255,255,0.025)';
    mapCtx.lineWidth = 1;
    const step = 48;
    for (let x = 0; x < mapW; x += step) {
      mapCtx.beginPath(); mapCtx.moveTo(x, 0); mapCtx.lineTo(x, mapH); mapCtx.stroke();
    }
    for (let y = 0; y < mapH; y += step) {
      mapCtx.beginPath(); mapCtx.moveTo(0, y); mapCtx.lineTo(mapW, y); mapCtx.stroke();
    }

    // stylized Indonesia archipelago (abstracted paths)
    mapCtx.save();
    mapCtx.translate(mapW * 0.5, mapH * 0.52);
    const scale = Math.min(mapW, mapH) * 0.00115;
    mapCtx.scale(scale, scale);

    mapCtx.fillStyle = 'rgba(40, 28, 32, 0.85)';
    mapCtx.strokeStyle = 'rgba(200, 16, 46, 0.18)';
    mapCtx.lineWidth = 2 / scale;

    // Approximate major islands as rounded blobs / paths
    // Sumatra
    pathIsland([
      [-320, -40], [-280, -90], [-200, -110], [-120, -70],
      [-90, 10], [-140, 80], [-220, 100], [-300, 60], [-340, 0]
    ]);
    // Java
    pathIsland([
      [-80, 70], [20, 55], [140, 65], [160, 90], [40, 105], [-60, 95]
    ]);
    // Kalimantan
    pathIsland([
      [-40, -120], [60, -150], [140, -100], [120, -20], [40, 10], [-50, -30]
    ]);
    // Sulawesi
    pathIsland([
      [160, -80], [200, -130], [240, -90], [220, -20], [260, 40],
      [210, 50], [180, 0], [200, -40]
    ]);
    // Papua-ish
    pathIsland([
      [300, -60], [380, -90], [420, -40], [400, 30], [320, 20], [290, -20]
    ]);
    // Bali / Nusa small
    pathIsland([[170, 100], [195, 95], [200, 115], [175, 120]]);
    // Maluku dots
    pathIsland([[250, -20], [265, -15], [260, 5], [245, 0]]);

    mapCtx.restore();

    // soft fog / vignette overlay
    const vig = mapCtx.createRadialGradient(mapW / 2, mapH / 2, mapH * 0.2, mapW / 2, mapH / 2, mapH * 0.75);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(0,0,0,0.55)');
    mapCtx.fillStyle = vig;
    mapCtx.fillRect(0, 0, mapW, mapH);
  }

  function pathIsland(pts) {
    mapCtx.beginPath();
    mapCtx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      mapCtx.lineTo(pts[i][0], pts[i][1]);
    }
    mapCtx.closePath();
    mapCtx.fill();
    mapCtx.stroke();
  }

  function drawMapRoutes() {
    if (!mapCtx) return;
    // redraw background first then routes + nodes are HTML
    drawMapBackground();

    mapCtx.save();
    for (let i = 0; i < MISSIONS.length - 1; i++) {
      const a = MISSIONS[i];
      const b = MISSIONS[i + 1];
      const ax = a.x * mapW;
      const ay = a.y * mapH;
      const bx = b.x * mapW;
      const by = b.y * mapH;

      const completedLink = progress.includes(a.id) && (progress.includes(b.id) || getMissionState(b.id) === 'available');
      const solid = progress.includes(a.id);

      mapCtx.beginPath();
      mapCtx.moveTo(ax, ay);
      // slight curve
      const mx = (ax + bx) / 2;
      const my = (ay + by) / 2 - 30;
      mapCtx.quadraticCurveTo(mx, my, bx, by);

      if (solid) {
        mapCtx.strokeStyle = completedLink ? 'rgba(46, 204, 113, 0.55)' : 'rgba(201, 162, 39, 0.5)';
        mapCtx.lineWidth = 2.5;
        mapCtx.setLineDash([]);
      } else {
        mapCtx.strokeStyle = 'rgba(255,255,255,0.12)';
        mapCtx.lineWidth = 1.5;
        mapCtx.setLineDash([6, 8]);
      }
      mapCtx.stroke();
      mapCtx.setLineDash([]);
    }
    mapCtx.restore();
  }

  // ========== NODES ==========
  function renderNodes() {
    nodesContainer.innerHTML = '';
    MISSIONS.forEach(m => {
      const state = getMissionState(m.id);
      const el = document.createElement('div');
      el.className = `mission-node ${state}`;
      el.dataset.id = m.id;
      el.style.left = (m.x * 100) + '%';
      el.style.top = (m.y * 100) + '%';
      el.innerHTML = `
        <div class="node-ring"></div>
        <div class="node-core">${m.icon}</div>
        <div class="node-label">${m.title.split(' ')[0]}</div>
      `;
      el.addEventListener('click', () => {
        if (state === 'locked') return;
        openDetail(m.id);
      });
      nodesContainer.appendChild(el);
    });
  }

  function openDetail(id) {
    const m = MISSIONS.find(x => x.id === id);
    if (!m) return;
    selectedMissionId = id;
    const state = getMissionState(id);

    $('#panel-icon').textContent = m.icon;
    $('#panel-title').textContent = m.title;
    $('#panel-date').textContent = m.date;
    $('#panel-blurb').textContent = m.blurb;

    const statusEl = $('#panel-status');
    statusEl.textContent = state === 'completed' ? 'SELESAI' : state === 'available' ? 'TERSEDIA' : 'TERKUNCI';
    statusEl.className = 'panel-status ' + state;

    const btn = $('#btn-start-mission');
    btn.disabled = state === 'locked';
    btn.textContent = state === 'completed' ? 'MAIN ULANG' : 'MULAI MISI';

    detailPanel.classList.add('open');
    detailPanel.setAttribute('aria-hidden', 'false');
  }

  function closeDetail() {
    detailPanel.classList.remove('open');
    detailPanel.setAttribute('aria-hidden', 'true');
    selectedMissionId = null;
  }

  // ========== MAP INIT ==========
  function initMap() {
    updateProgressUI();
    resizeMap();
    renderNodes();
    window.addEventListener('resize', () => {
      resizeMap();
      // nodes are % based so ok
    });
  }

  // ========== EVENT BINDINGS ==========
  function bindEvents() {
    // Entrance 1 advance
    const advance = () => advanceFromFlag();
    screens.e1.addEventListener('click', advance);
    window.addEventListener('keydown', (e) => {
      if (currentScreen === 'entrance-1' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        advance();
      }
    });

    // Entrance 2 → Map
    $('#btn-enter-map').addEventListener('click', () => {
      screens.e2.style.transition = 'opacity 0.8s ease';
      screens.e2.style.opacity = '0';
      setTimeout(() => showScreen('map'), 850);
    });

    // Panel
    $('#panel-close').addEventListener('click', closeDetail);
    $('#btn-start-mission').addEventListener('click', () => {
      if (selectedMissionId && getMissionState(selectedMissionId) !== 'locked') {
        window.startMission(selectedMissionId);
      }
    });

    // Placeholder close
    $('#btn-close-placeholder').addEventListener('click', () => {
      stagePlaceholder.classList.remove('open');
      stagePlaceholder.setAttribute('aria-hidden', 'true');
    });

    // Reset
    $('#btn-reset').addEventListener('click', () => {
      if (confirm('Reset semua progress misi?')) {
        progress = [];
        saveProgress();
        updateProgressUI();
        renderNodes();
        drawMapRoutes();
        closeDetail();
      }
    });

    // Dev complete current
    $('#dev-complete').addEventListener('click', () => {
      // complete the first available or selected
      let target = selectedMissionId;
      if (!target || getMissionState(target) === 'completed') {
        target = MISSIONS.find(m => getMissionState(m.id) === 'available')?.id;
      }
      if (target) window.markMissionComplete(target);
    });
  }

  // ========== BOOT ==========
  function boot() {
    FlagSim.start();
    bindEvents();
    // subtle entrance delay for flag
    requestAnimationFrame(() => {
      // already animating
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
