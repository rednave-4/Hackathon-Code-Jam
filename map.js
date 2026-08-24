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

  function tField(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    const lang = (PJ.I18N && PJ.I18N.getLang()) || "id";
    if (obj[lang]) return obj[lang];
    if (lang !== "id" && obj.en) return obj.en;
    return obj.id || obj.en || "";
  }

  let selectedId = null;

  // ---------- progress helpers (delegates to PJ.Progress) ----------
  function getProgressSet() {
    if (PJ.Progress && typeof PJ.Progress.getCompletedSet === "function") {
      return PJ.Progress.getCompletedSet();
    }
    try {
      const raw = localStorage.getItem(PJ.STORAGE_KEY || "perjuangan_v2_progress");
      if (!raw) return new Set();
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return new Set(data);
      if (data && Array.isArray(data.completed)) return new Set(data.completed);
    } catch (e) {}
    return new Set();
  }

  function resetProgress() {
    if (PJ.Progress && typeof PJ.Progress.reset === "function") {
      PJ.Progress.reset();
    }
    render();
    closePanel();
  }

  // ---------- state helpers ----------
  function stateOf(mission, index) {
    const progress = getProgressSet();
    if (progress.has(mission.id)) return "completed";
    if (index === 0) return "available";
    if (PJ.Difficulty && typeof PJ.Difficulty.isUnlocked === "function") {
      return PJ.Difficulty.isUnlocked(index, progress) ? "available" : "locked";
    }
    const prev = missions[index - 1];
    return progress.has(prev.id) ? "available" : "locked";
  }

  function completedCount() {
    const progress = getProgressSet();
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
    els.routeNext = document.getElementById("routeNext");
    els.routeProgress = document.getElementById("routeProgress");
    els.nodesLayer = document.getElementById("nodesLayer");
    els.panel = document.getElementById("detailPanel");
    els.panelClose = document.getElementById("panelClose");
    els.progressLabel = document.getElementById("progressLabel");
    els.progressFill = document.getElementById("progressFill");
    els.resetBtn = document.getElementById("resetBtn");
    els.mapWrap = document.getElementById("mapWrap");
    els.embersLayer = document.getElementById("embersLayer");
  }

  // ---------- ambient embers (purely decorative, spawned once) ----------
  function spawnEmbers() {
    if (!els.embersLayer || els.embersLayer.children.length > 0) return;
    const COUNT = 14;
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement("span");
      el.className = "ember";
      el.style.left = Math.random() * 100 + "%";
      el.style.setProperty("--ember-size", 2 + Math.random() * 2.5 + "px");
      el.style.setProperty("--ember-duration", 10 + Math.random() * 10 + "s");
      el.style.setProperty("--ember-delay", -Math.random() * 20 + "s");
      el.style.setProperty("--ember-drift", (Math.random() * 8 - 4).toFixed(1) + "vw");
      els.embersLayer.appendChild(el);
    }
  }

  // ---------- render ----------
  function render() {
    // header progress
    const total = missions.length;
    const done = completedCount();
    els.progressLabel.textContent = `${done} / ${total} ${PJ.I18N ? PJ.I18N.t("progress_misi") : "MISI"}`;
    if (els.progressFill) {
      els.progressFill.style.width = `${Math.round((done / total) * 100)}%`;
    }

    // route paths
    const points = missions.map((m) => ({ x: m.x, y: m.y }));
    const fullPath = buildSmoothPath(points);
    els.routeBase.setAttribute("d", fullPath);

    // "progress" route only spans completed contiguous segments
    const progress = getProgressSet();
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

    // highlight the single next segment leading to the currently available
    // mission, so it's obvious at a glance where to go next
    if (els.routeNext) {
      const nextIdx = lastCompletedIdx + 1;
      if (lastCompletedIdx >= 0 && nextIdx < missions.length) {
        const segment = [points[lastCompletedIdx], points[nextIdx]];
        els.routeNext.setAttribute("d", buildSmoothPath(segment));
        els.routeNext.style.opacity = 1;
      } else {
        els.routeNext.style.opacity = 0;
      }
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
        `${tField(mission.title)}, ${tField(mission.date)}. Status: ${labelForState(state)}`
      );
      btn.setAttribute("aria-pressed", selectedId === mission.id ? "true" : "false");
      btn.innerHTML = `
        <span class="node__ring">
          <span class="node__shadow"></span>
          <span class="node__orbit"></span>
          <span class="node__icon">${iconSvg(mission.icon)}</span>
          <span class="node__order">${String(mission.order).padStart(2, "0")}</span>
        </span>
        <span class="node__label">${tField(mission.title)}</span>
      `;
      btn.addEventListener("click", () => selectMission(mission.id));
      els.nodesLayer.appendChild(btn);
    });

    if (selectedId) renderPanel(selectedId);
  }

  function labelForState(state) {
    if (state === "completed") return PJ.I18N ? PJ.I18N.t("status_completed") : "Selesai";
    if (state === "available") return PJ.I18N ? PJ.I18N.t("status_available") : "Tersedia";
    return PJ.I18N ? PJ.I18N.t("status_locked") : "Terkunci";
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
      <h2 class="panel__title">${tField(mission.title)}</h2>
      <div class="panel__subtitle">${tField(mission.subtitle)}</div>
      <div class="panel__date">${tField(mission.date)}</div>
      <p class="panel__blurb">${tField(mission.blurb)}</p>
      ${
        !locked
          ? `<p class="panel__diff-hint">${
              PJ.Difficulty && PJ.Difficulty.hintFor
                ? PJ.Difficulty.hintFor(mission.id)
                : ""
            }</p>`
          : ""
      }
      <button class="btn btn--primary panel__cta" id="startBtn" ${locked ? "disabled" : ""}>
        ${locked ? (PJ.I18N ? PJ.I18N.t("terkunci") : "TERKUNCI") : (PJ.I18N ? PJ.I18N.t("mulai_misi") : "MULAI MISI")}
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
      title: PJ.I18N ? PJ.I18N.t("reset_title") : "Ulangi Perjuangan?",
      body: PJ.I18N ? PJ.I18N.t("reset_body") : "Seluruh progres misi akan dihapus.",
      confirmLabel: PJ.I18N ? PJ.I18N.t("ya_reset") : "YA, RESET",
      cancelLabel: PJ.I18N ? PJ.I18N.t("batal") : "BATAL",
      onConfirm: resetProgress,
    });
  }

  // ---------- init ----------
  function init() {
    cacheEls();
    spawnEmbers();
    els.resetBtn.addEventListener("click", confirmReset);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePanel();
    });
    document.addEventListener("pj:devmodechange", () => {
      if (selectedId) renderPanel(selectedId);
    });
    if (PJ.Progress && typeof PJ.Progress.onChange === "function") {
      PJ.Progress.onChange(() => {
        render();
        if (selectedId) renderPanel(selectedId);
      });
    }
    render();
  }

  // ---------- public hooks (stage integration) ----------
  const EXTERNAL_STAGES = {
    "proklamasi": "last_typing.html",
    "surabaya": "suara_perlawanan.html",
    "agresi-gerilya": "Dutch_Aggression.html",
  };

  window.startMission = function (stageId) {
    const mission = missions.find((m) => m.id === stageId);

    if (PJ.Difficulty && typeof PJ.Difficulty.recordAttempt === "function") {
      PJ.Difficulty.recordAttempt(stageId);
    }
    try {
      sessionStorage.setItem("pj_difficulty", PJ.Difficulty ? PJ.Difficulty.effective() : "normal");
      sessionStorage.setItem("pj_diff_mode", PJ.Difficulty ? PJ.Difficulty.getMode() : "normal");
    } catch (e) {}

    if (EXTERNAL_STAGES[stageId]) {
      let url = EXTERNAL_STAGES[stageId];
      if (PJ.Difficulty && typeof PJ.Difficulty.appendQuery === "function") {
        url = PJ.Difficulty.appendQuery(url);
      }
      console.log(`[PERJUANGAN] startMission("${stageId}") → ${url}`);
      try {
        sessionStorage.setItem("pj_last_mission", stageId);
      } catch (e) {}
      window.location.href = url;
      return;
    }

    if (PJ.Stages && PJ.Stages[stageId] && typeof PJ.Stages[stageId].open === "function") {
      PJ.Stages[stageId].open({
        onComplete: () => window.markMissionComplete(stageId),
        difficulty: PJ.Difficulty ? PJ.Difficulty.effective() : "normal",
      });
      console.log(`[PERJUANGAN] startMission("${stageId}") — launching registered stage.`);
      return;
    }

    PJ.Modal.info({
      title: mission ? tField(mission.title) : (PJ.I18N ? PJ.I18N.t("coming_title") : "Misi"),
      body: PJ.I18N ? PJ.I18N.t("coming_body") : "Gameplay tahap ini sedang disiapkan.",
      note: PJ.I18N ? PJ.I18N.t("coming_note") : "Stage gameplay coming soon",
    });
    console.log(`[PERJUANGAN] startMission("${stageId}") — stub only.`);
  };

  window.markMissionComplete = function (stageId) {
    const mission = missions.find((m) => m.id === stageId);
    if (!mission) {
      console.warn(`[PERJUANGAN] markMissionComplete: unknown stageId "${stageId}"`);
      return;
    }
    if (PJ.Progress && typeof PJ.Progress.markComplete === "function") {
      PJ.Progress.markComplete(stageId);
    }
    if (PJ.Difficulty && typeof PJ.Difficulty.clearAttempt === "function") {
      PJ.Difficulty.clearAttempt(stageId);
    }
    if (PJ.Achievements && typeof PJ.Achievements.evaluate === "function") {
      PJ.Achievements.evaluate();
    }
    render();
    if (selectedId === stageId) renderPanel(stageId);
    console.log(`[PERJUANGAN] markMissionComplete("${stageId}")`);
  };

  function applyI18n() {
    render();
    const ver = document.getElementById("gameBrandVersion");
    if (ver && PJ.I18N) ver.textContent = PJ.I18N.t("brand_version_game");
    const rb = document.getElementById("resetBtn");
    if (rb && PJ.I18N) rb.textContent = PJ.I18N.t("reset_progress");
    const bb = document.getElementById("gameBackBtn");
    if (bb && PJ.I18N) bb.textContent = PJ.I18N.t("back_modes");
  }

  return { init, resetProgress, applyI18n, render };
})();
