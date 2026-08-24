/* ==========================================================================
   PERJUANGAN — main.js v2.2.2
   Simple, reliable screen flow. Inline onclick fallbacks on critical buttons.
   ========================================================================== */

(function () {
  window.PJ = window.PJ || {};
  PJ.devMode = false;

  const $ = (id) => document.getElementById(id);

  const screens = {
    entrance1: $("entrance1"),
    entrance2: $("entrance2"),
    modeSelect: $("modeSelect"),
    learnMode: $("learnMode"),
    mainMap: $("mainMap"),
  };

  let flagInstance = null;
  let advancedFromE1 = false;
  let mapInitialized = false;
  let learnInitialized = false;

  function hideAllScreens() {
    Object.values(screens).forEach((el) => {
      if (!el) return;
      el.classList.remove("is-active", "is-leaving");
      el.hidden = true;
      el.style.pointerEvents = "none";
    });
  }

  function goTo(name) {
    hideAllScreens();
    const el = screens[name];
    if (!el) return;
    el.hidden = false;
    el.style.pointerEvents = "auto";
    el.style.display = "flex";
    void el.offsetWidth;
    el.classList.add("is-active");
  }

  function applyI18nDOM() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && PJ.I18N) el.textContent = PJ.I18N.t(key);
    });
    if (PJ.I18N) {
      document.querySelectorAll(".lang-search-input").forEach((input) => {
        input.placeholder = PJ.I18N.t("lang_search_placeholder");
      });
    }
    if (window.__pjRefreshLangSearch) window.__pjRefreshLangSearch();
  }

  function setupLangSearch(rootEl) {
    if (!rootEl || !PJ.I18N) return null;
    const input = rootEl.querySelector(".lang-search-input");
    const list = rootEl.querySelector(".lang-search-list");
    const currentLabel = rootEl.querySelector(".lang-search-current");
    if (!input || !list) return null;

    function renderList(filter) {
      const q = (filter || "").trim().toLowerCase();
      const langs = PJ.I18N.getLanguages();
      list.innerHTML = "";
      let count = 0;
      langs.forEach((l) => {
        const hay = (l.name + " " + l.englishName + " " + l.code).toLowerCase();
        if (q && hay.indexOf(q) === -1) return;
        const item = document.createElement("div");
        item.className = "lang-opt" + (l.code === PJ.I18N.getLang() ? " active" : "");
        item.setAttribute("role", "option");
        item.dataset.code = l.code;
        item.innerHTML =
          '<span class="lang-opt-native">' +
          l.name +
          '</span><span class="lang-opt-en">' +
          l.englishName +
          "</span>";
        item.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          choose(l.code);
        });
        list.appendChild(item);
        count++;
      });
      if (count === 0) {
        const empty = document.createElement("div");
        empty.className = "lang-opt lang-opt-empty";
        empty.textContent = PJ.I18N.t("lang_no_match");
        list.appendChild(empty);
      }
    }

    function open() {
      rootEl.classList.add("open");
      rootEl.setAttribute("aria-expanded", "true");
      renderList(input.value);
    }
    function close() {
      rootEl.classList.remove("open");
      rootEl.setAttribute("aria-expanded", "false");
    }
    function choose(code) {
      PJ.I18N.setLang(code);
      input.value = "";
      close();
      input.blur();
      refreshCurrent();
    }
    function refreshCurrent() {
      const cur = PJ.I18N.getLanguageMeta(PJ.I18N.getLang());
      if (currentLabel && cur) currentLabel.textContent = cur.name;
    }

    input.addEventListener("focus", open);
    input.addEventListener("click", open);
    input.addEventListener("input", () => {
      renderList(input.value);
      if (!rootEl.classList.contains("open")) open();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
        input.blur();
      }
      if (e.key === "Enter") {
        const first = list.querySelector(".lang-opt:not(.lang-opt-empty)");
        if (first) choose(first.dataset.code);
        e.preventDefault();
      }
    });
    document.addEventListener("click", (e) => {
      if (!rootEl.contains(e.target)) close();
    });

    refreshCurrent();
    return refreshCurrent;
  }

  function bindLangButtons() {
    const refreshers = [
      setupLangSearch($("langSearchE2")),
      setupLangSearch($("langSearchMode")),
      setupLangSearch($("langSearchLearn")),
      setupLangSearch($("langSearchGame")),
    ].filter(Boolean);

    window.__pjRefreshLangSearch = function () {
      refreshers.forEach((fn) => fn());
    };

    document.addEventListener("pj:langchange", () => {
      applyI18nDOM();
      if (PJ.MapController && PJ.MapController.applyI18n) PJ.MapController.applyI18n();
      if (PJ.LearnController && PJ.LearnController.applyI18n) PJ.LearnController.applyI18n();
    });
  }

  /* ---------- Entrance 1 ---------- */
  function initEntrance1() {
    const bg = screens.entrance1;
    const flagWrap = $("flagWrap");
    const textBlock = $("e1Text");
    const hint = $("e1Hint");

    // Create flag instance early, but only start after screen is visible
    try {
      flagInstance = PJ.FlagCloth($("flagCanvas"));
    } catch (err) {
      console.warn("[PERJUANGAN] flag failed:", err);
    }

    requestAnimationFrame(() => {
      bg.classList.add("bg-in");
      if (flagInstance) {
        flagInstance.configure();
        flagInstance.start();
      }
    });
    setTimeout(() => {
      if (flagWrap) flagWrap.classList.add("is-in");
      if (flagInstance) flagInstance.configure();
    }, 180);
    setTimeout(() => {
      if (flagInstance) flagInstance.configure();
    }, 550);
    setTimeout(() => {
      if (textBlock) textBlock.classList.add("is-in");
    }, 900);
    setTimeout(() => {
      if (hint) hint.classList.add("is-in");
    }, 1500);

    const advance = (e) => {
      if (advancedFromE1) return;
      if (e && e.type === "keydown") {
        if (e.key !== " " && e.key !== "Enter" && e.code !== "Space") return;
        e.preventDefault();
      }
      advancedFromE1 = true;
      if (flagInstance) flagInstance.stop();
      goTo("entrance2");
      applyI18nDOM();
      console.log("[PERJUANGAN] → entrance2");
    };

    // Click anywhere on entrance1 section
    screens.entrance1.addEventListener("click", advance);
    document.addEventListener("keydown", advance);
  }

  /* ---------- Global navigation (also used by inline onclick) ---------- */
  window.__pjGoMode = function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    goTo("modeSelect");
    applyI18nDOM();
    console.log("[PERJUANGAN] → mode select");
  };

  window.__pjGoLearn = function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    goTo("learnMode");
    if (!learnInitialized) {
      if (PJ.LearnController) PJ.LearnController.init();
      learnInitialized = true;
    } else if (PJ.LearnController && PJ.LearnController.applyI18n) {
      PJ.LearnController.applyI18n();
    }
    applyI18nDOM();
    console.log("[PERJUANGAN] → learn");
  };

  window.__pjGoGame = function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    goTo("mainMap");
    if (!mapInitialized) {
      if (PJ.MapController) PJ.MapController.init();
      mapInitialized = true;
    } else if (PJ.MapController && PJ.MapController.applyI18n) {
      PJ.MapController.applyI18n();
    }
    applyI18nDOM();
    console.log("[PERJUANGAN] → game");
  };

  function initButtons() {
    const cta = $("ctaContinue");
    if (cta) {
      cta.onclick = window.__pjGoMode;
    }
    const learnBtn = $("btnModeLearn");
    if (learnBtn) learnBtn.onclick = window.__pjGoLearn;
    const gameBtn = $("btnModeGame");
    if (gameBtn) gameBtn.onclick = window.__pjGoGame;

    const learnBack = $("learnBackBtn");
    if (learnBack) {
      learnBack.onclick = (e) => {
        e.preventDefault();
        goTo("modeSelect");
        applyI18nDOM();
      };
    }
    const gameBack = $("gameBackBtn");
    if (gameBack) {
      gameBack.onclick = (e) => {
        e.preventDefault();
        goTo("modeSelect");
        applyI18nDOM();
      };
    }
  }

  function initDevToggle() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
        PJ.devMode = !PJ.devMode;
        const badge = $("devBadge");
        if (badge) badge.hidden = !PJ.devMode;
        document.dispatchEvent(new CustomEvent("pj:devmodechange"));
      }
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    if (PJ.Progress && typeof PJ.Progress.init === "function") {
      try {
        await PJ.Progress.init();
      } catch (err) {
        console.warn("[PERJUANGAN] Progress init error:", err);
      }
    }

    applyI18nDOM();
    bindLangButtons();
    initButtons();
    initDevToggle();
    if (PJ.Achievements && typeof PJ.Achievements.init === "function") {
      PJ.Achievements.init();
    }
    if (PJ.Difficulty && typeof PJ.Difficulty.init === "function") {
      PJ.Difficulty.init();
    }
    if (PJ.AIGuide && typeof PJ.AIGuide.init === "function") {
      PJ.AIGuide.init();
    }
    goTo("entrance1");
    initEntrance1();
  });
})();
