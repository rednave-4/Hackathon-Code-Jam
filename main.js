/**
 * PERJUANGAN v2.0 — Peta Perjuangan
 * Entrance flow + Mission Map shell
 * Hooks: startMission(stageId), markMissionComplete(stageId)
 */
(() => {
  'use strict';

  // ========== MISSION DATA ==========
  const MISSIONS = [
    {
      id: 1,
      title: 'Sumpah Pemuda',
      short: 'Sumpah',
      date: '28 Oktober 1928',
      blurb: 'Kongres Pemuda II di Batavia. Tiga sumpah yang menyatukan bahasa, bangsa, dan tanah air — fondasi semangat persatuan Indonesia.',
      icon: '✊',
      x: 0.18, y: 0.38
    },
    {
      id: 2,
      title: 'Rengasdengklok',
      short: 'Rengasdengklok',
      date: '16 Agustus 1945',
      blurb: 'Operasi malam yang membawa Soekarno dan Hatta ke Rengasdengklok. Desakan pemuda agar proklamasi segera dibacakan.',
      icon: '🌙',
      x: 0.36, y: 0.58
    },
    {
      id: 3,
      title: 'Proklamasi',
      short: 'Proklamasi',
      date: '17 Agustus 1945',
      blurb: 'Di Jalan Pegangsaan Timur 56, teks proklamasi dibacakan. Hari lahirnya Republik Indonesia yang merdeka.',
      icon: '📜',
      x: 0.52, y: 0.36
    },
    {
      id: 4,
      title: 'Surabaya',
      short: 'Surabaya',
      date: '10 November 1945',
      blurb: 'Pertempuran heroik mempertahankan kota. Semangat Arek-arek Suroboyo yang menginspirasi perlawanan di seluruh nusantara.',
      icon: '🔥',
      x: 0.68, y: 0.62
    },
    {
      id: 5,
      title: 'Agresi & Gerilya',
      short: 'Agresi',
      date: '1947 – 1948',
      blurb: 'Dua agresi militer Belanda dan perang gerilya di pedalaman. Strategi yang memaksa dunia mengakui kedaulatan Indonesia.',
      icon: '⚔',
      x: 0.84, y: 0.42
    }
  ];

  const STORAGE_KEY = 'perjuangan_v2_progress';

  // ========== STATE ==========
  let progress = loadProgress();
  let currentScreen = 'entrance-1';
  let selectedMissionId = null;

  // ========== DOM ==========
  const $ = (s) => document.querySelector(s);
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
    } catch { return []; }
  }
  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
  function getMissionState(id) {
    if (progress.includes(id)) return 'completed';
    if (id === 1 || progress.includes(id - 1)) return 'available';
    return 'locked';
  }
  function updateProgressUI() {
    $('#progress-text').textContent = progress.length + ' / 5 Misi';
  }

  // ========== PUBLIC HOOKS ==========
  window.startMission = function (stageId) {
    console.log('[PERJUANGAN] startMission →', stageId);
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
      requestAnimationFrame(() => {
        initMap();
      });
    }
    currentScreen = name;
  }

  function advanceFromFlag() {
    if (currentScreen !== 'entrance-1') return;
    screens.e1.style.transition = 'opacity 0.8s ease, filter 0.8s ease';
    screens.e1.style.filter = 'blur(8px)';
    screens.e1.style.opacity = '0';
    setTimeout(() => {
      FlagSim.stop();
      showScreen('entrance-2');
    }, 850);
  }

  // ========== FLAG CLOTH (smooth Canvas 2D) ==========
  const FlagSim = (() => {
    let ctx, W, H, cols, rows, particles, springs;
    let running = false;
    let raf = null;
    let time = 0;
    const SEG_X = 20;
    const SEG_Y = 12;
    const DAMPING = 0.968;
    const WIND = 0.016;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = flagCanvas.clientWidth || window.innerWidth;
      H = flagCanvas.clientHeight || window.innerHeight;
      flagCanvas.width = Math.floor(W * dpr);
      flagCanvas.height = Math.floor(H * dpr);
      ctx = flagCanvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildMesh();
    }

    function buildMesh() {
      cols = SEG_X;
      rows = SEG_Y;
      const flagW = Math.min(W * 0.52, 440);
      const flagH = flagW * 0.62;
      const originX = (W - flagW) * 0.5;
      const originY = (H - flagH) * 0.38;

      particles = [];
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const px = originX + (x / cols) * flagW;
          const py = originY + (y / rows) * flagH;
          particles.push({
            x: px, y: py,
            ox: px, oy: py,
            vx: 0, vy: 0,
            pinned: x === 0
          });
        }
      }

      springs = [];
      const restX = flagW / cols;
      const restY = flagH / rows;
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const i = y * (cols + 1) + x;
          if (x < cols) springs.push({ a: i, b: i + 1, rest: restX, k: 0.32 });
          if (y < rows) springs.push({ a: i, b: i + cols + 1, rest: restY, k: 0.32 });
        }
      }
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * (cols + 1) + x;
          const d = Math.hypot(restX, restY);
          springs.push({ a: i, b: i + cols + 2, rest: d, k: 0.07 });
          springs.push({ a: i + 1, b: i + cols + 1, rest: d, k: 0.07 });
        }
      }
    }

    function step() {
      time += 0.016;
      const wind = WIND + Math.sin(time * 0.65) * 0.005 + Math.sin(time * 1.7) * 0.0025;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.pinned) continue;
        const col = i % (cols + 1);
        const dist = col / cols;
        const wave = Math.sin(time * 1.35 + dist * 4.0 + (Math.floor(i / (cols + 1)) * 0.12)) * 0.85;
        const ripple = Math.sin(time * 2.9 + dist * 8.5) * 0.22;
        p.vx += (wind * (0.35 + dist * 1.15) + wave * 0.011 + ripple * 0.005) * (0.65 + dist);
        p.vy += 0.0007 + Math.sin(time * 0.85 + dist * 1.8) * 0.0012;
        p.vx += Math.sin(time * 0.32) * 0.0012 * dist;
      }

      for (const p of particles) {
        if (p.pinned) continue;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
      }

      for (let iter = 0; iter < 5; iter++) {
        for (const s of springs) {
          const a = particles[s.a];
          const b = particles[s.b];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const diff = (dist - s.rest) / dist;
          const ox = dx * diff * 0.5 * s.k;
          const oy = dy * diff * 0.5 * s.k;
          if (!a.pinned) { a.x += ox; a.y += oy; }
          if (!b.pinned) { b.x -= ox; b.y -= oy; }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // soft shadow
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      const last = particles.slice(-(cols + 1));
      last.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x + 6, p.y + 22);
        else ctx.lineTo(p.x + 6, p.y + 22);
      });
      ctx.lineTo(last[last.length - 1].x + 40, H);
      ctx.lineTo(last[0].x - 20, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // draw flag — seamless fills, no stroke
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * (cols + 1) + x;
          const p0 = particles[i];
          const p1 = particles[i + 1];
          const p2 = particles[i + cols + 1];
          const p3 = particles[i + cols + 2];

          const avgDy = ((p0.y - p0.oy) + (p1.y - p1.oy) + (p2.y - p2.oy) + (p3.y - p3.oy)) * 0.25;
          const fold = Math.max(-0.22, Math.min(0.22, avgDy * 0.035));

          const isRed = y < rows / 2;
          let r, g, b;
          if (isRed) {
            r = 200 + fold * 50;
            g = 16 + fold * 25;
            b = 46 + fold * 25;
          } else {
            r = 248 + fold * 12;
            g = 248 + fold * 12;
            b = 248 + fold * 12;
          }

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();
          ctx.fillStyle = 'rgb(' + (r|0) + ',' + (g|0) + ',' + (b|0) + ')';
          ctx.fill();
        }
      }

      // pole
      const top = particles[0];
      const bot = particles[rows * (cols + 1)];
      ctx.strokeStyle = '#9a8a55';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(top.x - 1, top.y - 14);
      ctx.lineTo(bot.x - 1, bot.y + 24);
      ctx.stroke();
      ctx.fillStyle = '#c9a227';
      ctx.beginPath();
      ctx.arc(top.x - 1, top.y - 16, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    function loop() {
      if (!running) return;
      step();
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

    window.addEventListener('resize', () => { if (running) resize(); });
    return { start, stop };
  })();

  // ========== MAP ==========
  let mapCtx, mapW, mapH;

  function resizeMap() {
    const stage = document.querySelector('.map-stage');
    if (!stage) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    mapW = stage.clientWidth;
    mapH = stage.clientHeight;
    if (mapW < 10 || mapH < 10) return;
    mapCanvas.width = Math.floor(mapW * dpr);
    mapCanvas.height = Math.floor(mapH * dpr);
    mapCtx = mapCanvas.getContext('2d');
    mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawMapBackground();
    drawMapRoutes();
  }

  function drawMapBackground() {
    if (!mapCtx || !mapW) return;
    mapCtx.clearRect(0, 0, mapW, mapH);

    const g = mapCtx.createRadialGradient(mapW * 0.5, mapH * 0.45, 0, mapW * 0.5, mapH * 0.5, Math.max(mapW, mapH) * 0.65);
    g.addColorStop(0, '#0e0e12');
    g.addColorStop(1, '#050506');
    mapCtx.fillStyle = g;
    mapCtx.fillRect(0, 0, mapW, mapH);

    mapCtx.strokeStyle = 'rgba(255,255,255,0.022)';
    mapCtx.lineWidth = 1;
    const step = 52;
    for (let x = 0; x < mapW; x += step) {
      mapCtx.beginPath(); mapCtx.moveTo(x, 0); mapCtx.lineTo(x, mapH); mapCtx.stroke();
    }
    for (let y = 0; y < mapH; y += step) {
      mapCtx.beginPath(); mapCtx.moveTo(0, y); mapCtx.lineTo(mapW, y); mapCtx.stroke();
    }

    mapCtx.save();
    mapCtx.translate(mapW * 0.5, mapH * 0.52);
    const sc = Math.min(mapW, mapH) * 0.00125;
    mapCtx.scale(sc, sc);

    mapCtx.fillStyle = 'rgba(48, 32, 36, 0.9)';
    mapCtx.strokeStyle = 'rgba(200, 16, 46, 0.22)';
    mapCtx.lineWidth = 2.2 / sc;

    island([[-340, -30], [-290, -95], [-200, -115], [-110, -65], [-70, 20], [-130, 95], [-230, 110], [-320, 55], [-360, -5]]);
    island([[-90, 75], [30, 55], [150, 68], [175, 95], [40, 112], [-70, 100]]);
    island([[-50, -130], [70, -160], [155, -105], [130, -15], [40, 15], [-60, -25]]);
    island([[170, -85], [215, -140], [255, -95], [230, -15], [275, 50], [220, 55], [185, 5], [210, -45]]);
    island([[310, -70], [400, -100], [450, -35], [425, 40], [335, 30], [295, -15]]);
    island([[180, 105], [210, 98], [215, 122], [185, 128]]);
    island([[260, -25], [280, -18], [275, 12], [255, 5]]);

    mapCtx.restore();

    const vig = mapCtx.createRadialGradient(mapW / 2, mapH / 2, mapH * 0.15, mapW / 2, mapH / 2, mapH * 0.8);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(0,0,0,0.6)');
    mapCtx.fillStyle = vig;
    mapCtx.fillRect(0, 0, mapW, mapH);
  }

  function island(pts) {
    mapCtx.beginPath();
    mapCtx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) mapCtx.lineTo(pts[i][0], pts[i][1]);
    mapCtx.closePath();
    mapCtx.fill();
    mapCtx.stroke();
  }

  function drawMapRoutes() {
    if (!mapCtx || !mapW) return;
    drawMapBackground();

    mapCtx.save();
    for (let i = 0; i < MISSIONS.length - 1; i++) {
      const a = MISSIONS[i];
      const b = MISSIONS[i + 1];
      const ax = a.x * mapW;
      const ay = a.y * mapH;
      const bx = b.x * mapW;
      const by = b.y * mapH;

      const solid = progress.includes(a.id);
      const greenish = progress.includes(a.id) && (progress.includes(b.id) || getMissionState(b.id) === 'available');

      mapCtx.beginPath();
      mapCtx.moveTo(ax, ay);
      const mx = (ax + bx) / 2;
      const my = (ay + by) / 2 - 28;
      mapCtx.quadraticCurveTo(mx, my, bx, by);

      if (solid) {
        mapCtx.strokeStyle = greenish ? 'rgba(46, 204, 113, 0.55)' : 'rgba(201, 162, 39, 0.5)';
        mapCtx.lineWidth = 2.4;
        mapCtx.setLineDash([]);
      } else {
        mapCtx.strokeStyle = 'rgba(255,255,255,0.11)';
        mapCtx.lineWidth = 1.5;
        mapCtx.setLineDash([5, 7]);
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
      el.className = 'mission-node ' + state;
      el.dataset.id = m.id;
      el.style.left = (m.x * 100) + '%';
      el.style.top = (m.y * 100) + '%';
      el.innerHTML = '<div class="node-ring"></div><div class="node-core">' + m.icon + '</div><div class="node-label">' + m.short + '</div>';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
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

  function initMap() {
    updateProgressUI();
    resizeMap();
    renderNodes();
  }

  // ========== EVENTS ==========
  function bindEvents() {
    const advance = () => advanceFromFlag();
    screens.e1.addEventListener('click', advance);
    window.addEventListener('keydown', (e) => {
      if (currentScreen === 'entrance-1' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        advance();
      }
    });

    $('#btn-enter-map').addEventListener('click', () => {
      screens.e2.style.transition = 'opacity 0.75s ease';
      screens.e2.style.opacity = '0';
      setTimeout(() => showScreen('map'), 800);
    });

    $('#panel-close').addEventListener('click', closeDetail);
    $('#btn-start-mission').addEventListener('click', () => {
      if (selectedMissionId && getMissionState(selectedMissionId) !== 'locked') {
        window.startMission(selectedMissionId);
      }
    });

    $('#btn-close-placeholder').addEventListener('click', () => {
      stagePlaceholder.classList.remove('open');
      stagePlaceholder.setAttribute('aria-hidden', 'true');
    });

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

    $('#dev-complete').addEventListener('click', () => {
      let target = selectedMissionId;
      if (!target || getMissionState(target) === 'completed') {
        target = MISSIONS.find(m => getMissionState(m.id) === 'available')?.id;
      }
      if (target) window.markMissionComplete(target);
    });

    window.addEventListener('resize', () => {
      if (currentScreen === 'map') resizeMap();
    });
  }

  // ========== BOOT ==========
  function boot() {
    FlagSim.start();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
