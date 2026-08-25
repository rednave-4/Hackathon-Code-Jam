/* ==========================================================================
   PERJUANGAN — learn.js
   Mode Belajar: chapters, timeline, figures, glossary.
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.LearnController = (function () {
  const missions = PJ.MISSIONS;
  let selectedId = null;
  let activeTab = "chapters";

  function getReadSet() {
    if (PJ.Progress && typeof PJ.Progress.getLearnReadSet === "function") {
      return PJ.Progress.getLearnReadSet();
    }
    try {
      const raw = localStorage.getItem(PJ.LEARN_STORAGE_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? new Set(arr) : new Set();
    } catch (e) {
      return new Set();
    }
  }

  function isRead(id) {
    return getReadSet().has(id);
  }

  function markRead(id) {
    if (PJ.Progress && typeof PJ.Progress.markLearnRead === "function") {
      PJ.Progress.markLearnRead(id);
    } else {
      try {
        const set = getReadSet();
        set.add(id);
        localStorage.setItem(PJ.LEARN_STORAGE_KEY, JSON.stringify(Array.from(set)));
      } catch (e) {}
    }
    renderList();
    renderTimeline();
    if (selectedId === id) renderArticle(id);
    if (PJ.Achievements && typeof PJ.Achievements.evaluate === "function") {
      PJ.Achievements.evaluate();
    }
  }

  function resetRead() {
    try {
      localStorage.removeItem(PJ.LEARN_STORAGE_KEY);
      localStorage.removeItem("perjuangan_figures_seen");
    } catch (e) {}
    if (PJ.Progress && typeof PJ.Progress.reset === "function") {
      PJ.Progress.reset();
    }
    renderList();
    renderTimeline();
    if (els && els.figures) renderFigures();
    if (selectedId) renderArticle(selectedId);
  }

  function contentLang() {
    const lang = (PJ.I18N && PJ.I18N.getLang()) || "id";
    if (lang === "id" || lang === "en") return lang;
    return "en";
  }

  function tField(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    const lang = contentLang();
    return obj[lang] || obj.en || obj.id || "";
  }

  function articleFor(id) {
    const pack = PJ.LEARN_ARTICLES[id];
    if (!pack) return null;
    const lang = contentLang();
    return pack[lang] || pack.en || pack.id || null;
  }

  let els = {};

  function cache() {
    els.figures = document.getElementById("learnFigures");
    els.figureViewer = document.getElementById("figureViewer");
    els.figureViewerImg = document.getElementById("figureViewerImg");
    els.figureViewerFallback = document.getElementById("figureViewerFallback");
    els.figureViewerName = document.getElementById("figureViewerName");
    els.figureViewerRole = document.getElementById("figureViewerRole");
    els.figureViewerBio = document.getElementById("figureViewerBio");
    els.figureViewerMore = document.getElementById("figureViewerMore");
    els.list = document.getElementById("learnList");
    els.timeline = document.getElementById("learnTimeline");
    els.glossary = document.getElementById("learnGlossary");
    els.glossaryList = document.getElementById("glossaryList");
    els.glossarySearch = document.getElementById("glossarySearch");
    els.article = document.getElementById("learnArticle");
    els.progressLabel = document.getElementById("learnProgressLabel");
    els.progressFill = document.getElementById("learnProgressFill");
  }

  function renderProgress() {
    const total = missions.length;
    const readSet = getReadSet();
    const done = missions.filter((m) => readSet.has(m.id)).length;
    if (els.progressLabel) {
      els.progressLabel.textContent = `${done} / ${total} ${PJ.I18N.t("progress_bab")}`;
    }
    if (els.progressFill) {
      els.progressFill.style.width = `${Math.round((done / total) * 100)}%`;
    }
  }

  function setTab(tab) {
    activeTab = tab;
    document.querySelectorAll(".learn-tab").forEach((btn) => {
      const on = btn.dataset.tab === tab;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (els.list) els.list.hidden = tab !== "chapters";
    if (els.timeline) els.timeline.hidden = tab !== "timeline";
    if (els.figures) els.figures.hidden = tab !== "figures";
    if (els.glossary) els.glossary.hidden = tab !== "glossary";
    if (tab === "timeline") renderTimeline();
    if (tab === "figures") renderFigures();
    if (tab === "glossary") renderGlossary();

    const panel = document.getElementById("learnArticleWrap");
    if (panel) {
      panel.classList.remove("is-open");
      panel.hidden = true;
    }
    selectedId = null;
    closeFigureViewer();
  }

  function renderList() {
    if (!els.list) return;
    els.list.innerHTML = "";
    missions.forEach((m) => {
      const read = isRead(m.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "learn-item" + (read ? " is-read" : "") + (selectedId === m.id ? " is-active" : "");
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

  function renderTimeline() {
    if (!els.timeline) return;
    const nodes = PJ.TIMELINE || missions.map((m, i) => ({ id: m.id, year: 1928 + i * 4 }));
    els.timeline.innerHTML = "";

    const track = document.createElement("div");
    track.className = "timeline-track";
    track.innerHTML = '<div class="timeline-line" aria-hidden="true"></div>';

    nodes.forEach((node, index) => {
      const m = missions.find((x) => x.id === node.id);
      if (!m) return;
      const read = isRead(m.id);
      const item = document.createElement("button");
      item.type = "button";
      item.className =
        "timeline-node" +
        (read ? " is-read" : "") +
        (selectedId === m.id ? " is-active" : "") +
        (index % 2 === 1 ? " timeline-node--alt" : "");
      item.innerHTML = `
        <span class="timeline-node__dot" aria-hidden="true"></span>
        <span class="timeline-node__card">
          <span class="timeline-node__year">${node.year}</span>
          <span class="timeline-node__title">${tField(m.title)}</span>
          <span class="timeline-node__date">${tField(m.date)}</span>
          <span class="timeline-node__blurb">${tField(m.blurb)}</span>
        </span>
      `;
      item.addEventListener("click", () => openArticle(m.id));
      track.appendChild(item);
    });

    els.timeline.appendChild(track);
  }

  function chapterList() {
    return PJ.FIGURE_CHAPTERS || [];
  }

    const FIGURES_SEEN_KEY = "perjuangan_figures_seen";

  function loadFigureSeen() {
    try {
      const raw = localStorage.getItem(FIGURES_SEEN_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function markFigureSeen(chapterId, figureId) {
    const data = loadFigureSeen();
    if (!data[chapterId]) data[chapterId] = [];
    if (data[chapterId].indexOf(figureId) === -1) data[chapterId].push(figureId);
    try {
      localStorage.setItem(FIGURES_SEEN_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function isChapterComplete(chapterId) {
    const ch = chapterList().find((c) => c.id === chapterId);
    if (!ch || !ch.figures || !ch.figures.length) return false;
    const seen = loadFigureSeen()[chapterId] || [];
    return ch.figures.every((f) => seen.indexOf(f.id) !== -1);
  }

    function renderFigures() {
    if (!els.figures) return;
    const chapters = chapterList();
    els.figures.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "figures-grid";
    chapters.forEach((ch) => {
      const done = isChapterComplete(ch.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "figure-card" + (done ? " is-read" : "");
      const initial = tField(ch.title).charAt(0);
      btn.innerHTML =
        (done ? '<span class="figure-card__check">✓</span>' : "") +
        '<span class="figure-card__photo">' +
          '<img src="' + ch.photo + '" alt="' + tField(ch.title) + '" onerror="this.style.display=\'none\'; this.nextElementSibling.hidden=false;" />' +
          '<span class="figure-card__fallback" hidden>' + initial + '</span>' +
        '</span>' +
        '<span class="figure-card__name">' + tField(ch.title) + '</span>' +
        '<span class="figure-card__role">' + tField(ch.subtitle) + '</span>';
      btn.addEventListener("click", () => openChapter(ch.id));
      grid.appendChild(btn);
    });
    els.figures.appendChild(grid);
  }

  let chapterIndex = 0;
  let figureIndex = 0;
  let figureDetail = false;
  let figureViewerBound = false;

  function currentFigures() {
    const ch = chapterList()[chapterIndex];
    return (ch && ch.figures) || [];
  }

  function openChapter(id) {
    const list = chapterList();
    const idx = list.findIndex((x) => x.id === id);
    chapterIndex = idx < 0 ? 0 : idx;
    figureIndex = 0;
    figureDetail = false;
    bindFigureViewer();
    showFigureViewer();
  }

  function showFigureViewer() {
    const figures = currentFigures();
    const f = figures[figureIndex];
    if (!f || !els.figureViewer) return;

    const name = tField(f.name);
    if (els.figureViewerImg) {
      els.figureViewerImg.style.display = "";
      els.figureViewerImg.src = f.photo;
      els.figureViewerImg.alt = name;
      els.figureViewerImg.onerror = function () {
        this.style.display = "none";
        if (els.figureViewerFallback) {
          els.figureViewerFallback.hidden = false;
          els.figureViewerFallback.textContent = name.charAt(0);
        }
      };
    }
    if (els.figureViewerFallback) {
      els.figureViewerFallback.hidden = true;
      els.figureViewerFallback.textContent = name.charAt(0);
    }
    if (els.figureViewerName) els.figureViewerName.textContent = name;
    if (els.figureViewerRole) els.figureViewerRole.textContent = tField(f.role);
    if (els.figureViewerBio) {
      els.figureViewerBio.textContent = tField(f.bio);
      els.figureViewerBio.hidden = !figureDetail;
    }
    if (els.figureViewerMore) els.figureViewerMore.hidden = figureDetail;

    els.figureViewer.classList.toggle("is-detail", figureDetail);
        const ch = chapterList()[chapterIndex];
    if (ch && f) markFigureSeen(ch.id, f.id);
        if (ch && isChapterComplete(ch.id)) {
      renderFigures();
      if (PJ.Achievements && typeof PJ.Achievements.evaluate === "function") {
        PJ.Achievements.evaluate();
      }
    }
    els.figureViewer.hidden = false;
    requestAnimationFrame(() => els.figureViewer.classList.add("is-open"));
  }

  function closeFigureViewer() {
    if (!els.figureViewer) return;
    figureDetail = false;
    els.figureViewer.classList.remove("is-open", "is-detail");
    els.figureViewer.hidden = true;
  }

  function figureStep(dir) {
    const figures = currentFigures();
    if (!figures.length) return;
    figureIndex = (figureIndex + dir + figures.length) % figures.length;
    figureDetail = false;
    showFigureViewer();
  }

  function bindFigureViewer() {
    if (figureViewerBound) return;
    figureViewerBound = true;

    const closeBtn = document.getElementById("figureViewerClose");
    const backdrop = document.getElementById("figureViewerBackdrop");
    const prev = document.getElementById("figurePrev");
    const next = document.getElementById("figureNext");
    const more = document.getElementById("figureViewerMore");

    if (closeBtn) closeBtn.addEventListener("click", closeFigureViewer);
    if (backdrop) backdrop.addEventListener("click", closeFigureViewer);
    if (prev) prev.addEventListener("click", () => figureStep(-1));
    if (next) next.addEventListener("click", () => figureStep(1));
    if (more) more.addEventListener("click", () => {
      figureDetail = true;
      showFigureViewer();
    });

    document.addEventListener("keydown", (e) => {
      if (!els.figureViewer || els.figureViewer.hidden) return;
      if (e.key === "Escape") closeFigureViewer();
      if (e.key === "ArrowLeft") figureStep(-1);
      if (e.key === "ArrowRight") figureStep(1);
    });
  }

  function renderGlossary(filter) {
    if (!els.glossaryList) return;
    const q = (filter || "").trim().toLowerCase();
    const terms = PJ.GLOSSARY || [];
    els.glossaryList.innerHTML = "";
    let count = 0;
    terms.forEach((entry) => {
      const term = tField(entry.term);
      const def = tField(entry.def);
      const hay = (term + " " + def).toLowerCase();
      if (q && hay.indexOf(q) === -1) return;
      const card = document.createElement("div");
      card.className = "glossary-card";
      card.innerHTML = `
        <div class="glossary-card__term">${term}</div>
        <div class="glossary-card__def">${def}</div>
      `;
      els.glossaryList.appendChild(card);
      count++;
    });
    if (count === 0) {
      const empty = document.createElement("div");
      empty.className = "glossary-empty";
      empty.textContent = PJ.I18N.t("glossary_empty");
      els.glossaryList.appendChild(empty);
    }
  }

  function openArticle(id) {
    selectedId = id;
    renderList();
    renderTimeline();
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
    renderTimeline();
  }

  function renderArticle(id) {
    const m = missions.find((x) => x.id === id);
    const art = articleFor(id);
    if (!m || !art || !els.article) return;

    const read = isRead(id);
    const idx = missions.findIndex((x) => x.id === id);

    const sectionsHtml = (art.sections || [])
      .map(
        (s) => `
      <section class="learn-sec">
        <h3>${s.h}</h3>
        <p>${s.p}</p>
      </section>`
      )
      .join("");

    const uiLang = (PJ.I18N && PJ.I18N.getLang()) || "id";
    const cLang = contentLang();
    const fallbackNote =
      uiLang !== cLang
        ? `<p class="learn-lang-note">${PJ.I18N.t("learn_content_fallback")}</p>`
        : "";

    els.article.innerHTML = `
      <button type="button" class="panel__close" id="learnCloseBtn" aria-label="Close">&times;</button>
      <div class="panel__eyebrow">BAB ${String(m.order).padStart(2, "0")}</div>
      <h2 class="panel__title">${tField(m.title)}</h2>
      <div class="panel__date">${tField(m.date)}</div>
      ${fallbackNote}
      <p class="learn-lead">${art.lead || ""}</p>
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
    const tabMap = {
      tabChapters: "learn_tab_chapters",
      tabTimeline: "learn_tab_timeline",
      tabFigures: "learn_tab_figures",
      tabGlossary: "learn_tab_glossary",
    };
    Object.keys(tabMap).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = PJ.I18N.t(tabMap[id]);
    });
    if (els.glossarySearch) {
      els.glossarySearch.placeholder = PJ.I18N.t("glossary_search");
    }
    renderList();
    if (activeTab === "timeline") renderTimeline();
    if (activeTab === "glossary") renderGlossary(els.glossarySearch ? els.glossarySearch.value : "");
    if (activeTab === "figures") renderFigures();
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
    document.querySelectorAll(".learn-tab").forEach((btn) => {
      btn.addEventListener("click", () => setTab(btn.dataset.tab));
    });
    if (els.glossarySearch) {
      els.glossarySearch.addEventListener("input", () => {
        renderGlossary(els.glossarySearch.value);
      });
    }
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