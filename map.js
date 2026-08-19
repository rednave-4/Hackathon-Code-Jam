/* ==========================================================================
   PERJUANGAN — map.js
   Builds the campaign mission map: smooth SVG route through node points,
   node state (locked / available / completed), detail panel, localStorage
   progress, reset-with-confirm, and the public hooks for future stages:
     window.startMission(stageId)
     window.markMissionComplete(stageId)
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.MapController = (function () {
  const missions = PJ.MISSIONS;
  let progress = loadProgress(); // Set of completed ids
  let selectedId = null;

  // ---------- persistence ----------
  function loadProgress() {
    try {
      const raw = localStorage.getItem(PJ.STORAGE_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return new Set();
      return new Set(arr);
    } catch (e) {
      console.warn("PERJUANGAN: gagal membaca progres, mulai baru.", e);
      return new Set();
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(PJ.STORAGE_KEY, JSON.stringify(Array.from(progress)));
    } catch (e) {
      console.warn("PERJUANGAN: gagal menyimpan progres.", e);
    }
  }

  function resetProgress() {
    progress = new Set();
    saveProgress();
    render();
    closePanel();
  }

  // ---------- state helpers ----------
  function stateOf(mission, index) {
    if (progress.has(mission.id)) return "completed";
    if (index === 0) return "available";
    const prev = missions[index - 1];
    return progress.has(prev.id) ? "available" : "locked";
  }

  function completedCount() {
    return missions.filter((m) => progress.has(m.id)).length;
  }

  // ---------- smooth path (Catmull-Rom -> cubic bezier) ----------
  function buildSmoothPath(points) {
    if (points.length < 2) return "";
    const d = [`M ${points[0].x} ${points[0].y}`];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
    }
    return d.join(" ");
  }

  // ---------- icons (minimal inline line icons, abstract & respectful) ----------
  const ICONS = {
    unity:
      '<path d="M7 17c0-3 2-5 5-5s5 2 5 5" /><circle cx="12" cy="8" r="3" /><path d="M4 19c1-2 2-3 3-3" /><path d="M20 19c-1-2-2-3-3-3" />',
    "night-op":
      '<path d="M16 5a6 6 0 1 0 3 11 7 7 0 0 1-3-11z" /><path d="M4 18h9" /><path d="M4 15h5" />',
    manuscript:
      '<rect x="6" y="4" width="12" height="16" rx="1" /><path d="M9 8h6M9 11h6M9 14h3" />',
    battle:
      '<path d="M12 3c1 3-1 4-1 6 2 0 3 1 3 3 0 3-2 5-2 5s-2-2-2-5c0-2 1-3 3-3-1-2-2-3-1-6z" /><path d="M7 20h10" />',
    guerrilla:
      '<path d="M4 18l6-11 2 4 2-3 6 10" /><path d="M4 18h16" />',
  };

  function iconSvg(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${
      ICONS[name] || ICONS.unity
    }</svg>`;
  }

  // ---------- DOM refs ----------
  let els = {};

  function cacheEls() {
    els.svg = document.getElementById("routeSvg");
    els.routeBase = document.getElementById("routeBase");
    els.routeProgress = document.getElementById("routeProgress");
    els.nodesLayer = document.getElementById("nodesLayer");
    els.panel = document.getElementById("detailPanel");
    els.panelClose = document.getElementById("panelClose");
    els.progressLabel = document.getElementById("progressLabel");
    els.resetBtn = document.getElementById("resetBtn");
    els.mapWrap = document.getElementById("mapWrap");
  }

  // ---------- render ----------
  function render() {
    // header progress
    els.progressLabel.textContent = `${completedCount()} / ${missions.length} MISI`;

    // route paths
    const points = missions.map((m) => ({ x: m.x, y: m.y }));
    const fullPath = buildSmoothPath(points);
    els.routeBase.setAttribute("d", fullPath);

    // "progress" route only spans completed contiguous segments
    let lastCompletedIdx = -1;
    for (let i = 0; i < missions.length; i++) {
      if (progress.has(missions[i].id)) lastCompletedIdx = i;
      else break;
    }
    if (lastCompletedIdx > 0) {
      const donePts = points.slice(0, lastCompletedIdx + 1);
      els.routeProgress.setAttribute("d", buildSmoothPath(donePts));
      els.routeProgress.style.opacity = 1;
    } else {
      els.routeProgress.style.opacity = 0;
    }

    // nodes
    els.nodesLayer.innerHTML = "";
    missions.forEach((mission, index) => {
      const state = stateOf(mission, index);
      const btn = document.createElement("button");
      btn.className = `node node--${state}`;
      btn.style.left = mission.x + "%";
      btn.style.top = mission.y + "%";
      btn.setAttribute("data-id", mission.id);
      btn.setAttribute(
        "aria-label",
        `${mission.title}, ${mission.date}. Status: ${labelForState(state)}`
      );
      btn.setAttribute("aria-pressed", selectedId === mission.id ? "true" : "false");
      btn.innerHTML = `
        <span class="node__ring"></span>
        <span class="node__icon">${iconSvg(mission.icon)}</span>
        <span class="node__order">${String(mission.order).padStart(2, "0")}</span>
        <span class="node__label">${mission.title}</span>
      `;
      btn.addEventListener("click", () => selectMission(mission.id));
      els.nodesLayer.appendChild(btn);
    });

    if (selectedId) renderPanel(selectedId);
  }

  function labelForState(state) {
    if (state === "completed") return "Selesai";
    if (state === "available") return "Tersedia";
    return "Terkunci";
  }

  // ---------- panel ----------
  function selectMission(id) {
    selectedId = id;
    els.panel.hidden = false;
    render(); // rebuilds nodes (aria-pressed) and the panel (selectedId is now set)
    requestAnimationFrame(() => els.panel.classList.add("is-open"));
  }

  function closePanel() {
    selectedId = null;
    els.panel.classList.remove("is-open");
    setTimeout(() => {
      if (!els.panel.classList.contains("is-open")) els.panel.hidden = true;
    }, 320);
    document.querySelectorAll(".node").forEach((n) => n.setAttribute("aria-pressed", "false"));
  }

  function renderPanel(id) {
    const index = missions.findIndex((m) => m.id === id);
    const mission = missions[index];
    const state = stateOf(mission, index);
    const locked = state === "locked";

    els.panel.innerHTML = `
      <button class="panel__close" id="panelClose" aria-label="Tutup">&times;</button>
      <div class="panel__eyebrow">MISI ${String(mission.order).padStart(2, "0")} · ${labelForState(
      state
    )}</div>
      <div class="panel__icon">${iconSvg(mission.icon)}</div>
      <h2 class="panel__title">${mission.title}</h2>
      <div class="panel__subtitle">${mission.subtitle}</div>
      <div class="panel__date">${mission.date}</div>
      <p class="panel__blurb">${mission.blurb}</p>
      <button class="btn btn--primary panel__cta" id="startBtn" ${locked ? "disabled" : ""}>
        ${locked ? "TERKUNCI" : "MULAI MISI"}
      </button>
      ${
        !locked && state !== "completed"
          ? '<button class="btn btn--ghost panel__dev" id="devCompleteBtn">Tandai selesai (dev)</button>'
          : ""
      }
    `;

    document.getElementById("panelClose").addEventListener("click", closePanel);
    const startBtn = document.getElementById("startBtn");
    if (!locked) {
      startBtn.addEventListener("click", () => window.startMission(mission.id));
    }
    const devBtn = document.getElementById("devCompleteBtn");
    if (devBtn && PJ.devMode) {
      devBtn.hidden = false;
    } else if (devBtn) {
      devBtn.hidden = true;
    }
    if (devBtn) {
      devBtn.addEventListener("click", () => window.markMissionComplete(mission.id));
    }
  }

  // ---------- reset confirm modal ----------
  function confirmReset() {
    PJ.Modal.confirm({
      title: "Ulangi Perjuangan?",
      body: "Seluruh progres misi akan dihapus dan tidak dapat dikembalikan.",
      confirmLabel: "YA, RESET",
      cancelLabel: "BATAL",
      onConfirm: resetProgress,
    });
  }

  // ---------- init ----------
  function init() {
    cacheEls();
    els.resetBtn.addEventListener("click", confirmReset);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePanel();
    });
    document.addEventListener("pj:devmodechange", () => {
      if (selectedId) renderPanel(selectedId);
    });
    render();
  }

  // ---------- public hooks (future stage integration) ----------
  window.startMission = function (stageId) {
    const mission = missions.find((m) => m.id === stageId);
    PJ.Modal.info({
      title: mission ? mission.title : "Misi",
      body:
        "Gameplay tahap ini sedang disiapkan dan akan hadir segera. Nantikan pembaruan berikutnya, Pejuang.",
      note: "Stage gameplay coming soon",
    });
    // Hook for future stage implementations. Example:
    // window.markMissionComplete(stageId) should be called by the actual
    // stage code upon successful completion of that stage's gameplay.
    console.log(`[PERJUANGAN] startMission("${stageId}") — stub only.`);
  };

  window.markMissionComplete = function (stageId) {
    const mission = missions.find((m) => m.id === stageId);
    if (!mission) {
      console.warn(`[PERJUANGAN] markMissionComplete: unknown stageId "${stageId}"`);
      return;
    }
    progress.add(stageId);
    saveProgress();
    render();
    if (selectedId === stageId) renderPanel(stageId);
    console.log(`[PERJUANGAN] markMissionComplete("${stageId}")`);
  };

  return { init, resetProgress };
})();
