/* ==========================================================================
   PERJUANGAN — learn.js
   Mode Belajar: full articles per mission, read progress in localStorage.
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.LearnController = (function () {
  const missions = PJ.MISSIONS;
  let readSet = loadRead();
  let selectedId = null;

  function loadRead() {
    try {
      const raw = localStorage.getItem(PJ.LEARN_STORAGE_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? new Set(arr) : new Set();
    } catch (e) {
      return new Set();
    }
  }

  function saveRead() {
    try {
      localStorage.setItem(PJ.LEARN_STORAGE_KEY, JSON.stringify(Array.from(readSet)));
    } catch (e) {}
  }

  function isRead(id) {
    return readSet.has(id);
  }

  function markRead(id) {
    readSet.add(id);
    saveRead();
    renderList();
    if (selectedId === id) renderArticle(id);
  }

  function resetRead() {
    readSet = new Set();
    saveRead();
    renderList();
    if (selectedId) renderArticle(selectedId);
  }

  function tField(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    const lang = PJ.I18N.getLang();
    return obj[lang] || obj.id || "";
  }

  function articleFor(id) {
    const pack = PJ.LEARN_ARTICLES[id];
    if (!pack) return null;
    const lang = PJ.I18N.getLang();
    return pack[lang] || pack.id;
  }

  let els = {};

  function cache() {
    els.list = document.getElementById("learnList");
    els.article = document.getElementById("learnArticle");
    els.progressLabel = document.getElementById("learnProgressLabel");
    els.progressFill = document.getElementById("learnProgressFill");
  }

  function renderProgress() {
    const total = missions.length;
    const done = missions.filter((m) => readSet.has(m.id)).length;
    if (els.progressLabel) {
      els.progressLabel.textContent = `${done} / ${total} ${PJ.I18N.t("progress_bab")}`;
    }
    if (els.progressFill) {
      els.progressFill.style.width = `${Math.round((done / total) * 100)}%`;
    }
  }

  function renderList() {
    if (!els.list) return;
    els.list.innerHTML = "";
    missions.forEach((m, index) => {
      const read = isRead(m.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "learn-item" + (read ? " is-read" : "") + (selectedId === m.id ? " is-active" : "");
      btn.innerHTML = `
        <span class="learn-item__order">${String(m.order).padStart(2, "0")}</span>
        <span class="learn-item__body">
          <span class="learn-item__title">${tField(m.title)}</span>
          <span class="learn-item__date">${tField(m.date)}</span>
        </span>
        <span class="learn-item__status">${read ? "✓" : ""}</span>
      `;
      btn.addEventListener("click", () => openArticle(m.id));
      els.list.appendChild(btn);
    });
    renderProgress();
  }

  function openArticle(id) {
    selectedId = id;
    renderList();
    renderArticle(id);
    const panel = document.getElementById("learnArticleWrap");
    if (panel) {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add("is-open"));
    }
  }

  function closeArticle() {
    selectedId = null;
    const panel = document.getElementById("learnArticleWrap");
    if (panel) {
      panel.classList.remove("is-open");
      setTimeout(() => {
        if (!panel.classList.contains("is-open")) panel.hidden = true;
      }, 320);
    }
    renderList();
  }

  function renderArticle(id) {
    const m = missions.find((x) => x.id === id);
    const art = articleFor(id);
    if (!m || !art || !els.article) return;

    const read = isRead(id);
    const idx = missions.findIndex((x) => x.id === id);

    let sectionsHtml = art.sections
      .map(
        (s) => `
      <section class="learn-sec">
        <h3>${s.h}</h3>
        <p>${s.p}</p>
      </section>`
      )
      .join("");

    els.article.innerHTML = `
      <button type="button" class="panel__close" id="learnCloseBtn" aria-label="Close">&times;</button>
      <div class="panel__eyebrow">BAB ${String(m.order).padStart(2, "0")}</div>
      <h2 class="panel__title">${tField(m.title)}</h2>
      <div class="panel__date">${tField(m.date)}</div>
      <p class="learn-lead">${art.lead}</p>
      ${sectionsHtml}
      <div class="learn-actions">
        <button type="button" class="btn btn--ghost" id="learnPrevBtn" ${idx <= 0 ? "disabled" : ""}>${PJ.I18N.t("learn_prev")}</button>
        <button type="button" class="btn btn--primary" id="learnMarkBtn">
          ${read ? "✓ " + PJ.I18N.t("selesai") : PJ.I18N.t("learn_mark_read")}
        </button>
        <button type="button" class="btn btn--ghost" id="learnNextBtn" ${idx >= missions.length - 1 ? "disabled" : ""}>${PJ.I18N.t("learn_next")}</button>
      </div>
    `;

    document.getElementById("learnCloseBtn").addEventListener("click", closeArticle);
    document.getElementById("learnMarkBtn").addEventListener("click", () => markRead(id));
    const prev = document.getElementById("learnPrevBtn");
    const next = document.getElementById("learnNextBtn");
    if (prev && idx > 0) prev.addEventListener("click", () => openArticle(missions[idx - 1].id));
    if (next && idx < missions.length - 1) next.addEventListener("click", () => openArticle(missions[idx + 1].id));
  }

  function applyI18n() {
    renderList();
    if (selectedId) renderArticle(selectedId);
    const ver = document.getElementById("learnBrandVersion");
    if (ver) ver.textContent = PJ.I18N.t("brand_version_learn");
    const resetBtn = document.getElementById("learnResetBtn");
    if (resetBtn) resetBtn.textContent = PJ.I18N.t("reset_progress");
    const backBtn = document.getElementById("learnBackBtn");
    if (backBtn) backBtn.textContent = PJ.I18N.t("back_modes");
  }

  function init() {
    cache();
    const resetBtn = document.getElementById("learnResetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        PJ.Modal.confirm({
          title: PJ.I18N.t("reset_title"),
          body: PJ.I18N.t("reset_body"),
          confirmLabel: PJ.I18N.t("ya_reset"),
          cancelLabel: PJ.I18N.t("batal"),
          onConfirm: resetRead,
        });
      });
    }
    document.addEventListener("pj:langchange", applyI18n);
    applyI18n();
  }

  return { init, applyI18n, closeArticle };
})();
