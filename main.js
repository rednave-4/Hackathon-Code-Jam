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
  let cinemaDone = false;
  let cinemaRaf = null;

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
    const scroller = $("entranceScroll");
    const world = $("cinemaWorld");
    const panelFlag = $("panelFlag");
    const panelTeam = $("panelTeam");
    const fill = $("cinemaProgressFill");
    const hint = $("e1Hint");
    const cta = $("ctaContinue");
    const flagWrap = $("flagWrap");
    const textBlock = $("e1Text");
    const embers = $("cinemaEmbers");

    if (!scroller) {
      console.warn("[PERJUANGAN] entranceScroll missing");
      return;
    }

    cinemaDone = false;
    document.documentElement.classList.add("is-c3d");
    document.body.classList.add("is-c3d");
    scroller.classList.remove("is-done");
    scroller.style.display = "";

    try {
      flagInstance = PJ.FlagCloth($("flagCanvas"));
    } catch (err) {
      console.warn("[PERJUANGAN] flag failed:", err);
    }

    if (embers && !embers.childElementCount) {
      for (let i = 0; i < 16; i++) {
        const s = document.createElement("span");
        s.style.left = Math.random() * 100 + "%";
        s.style.setProperty("--dx", (Math.random() * 50 - 25).toFixed(1) + "px");
        s.style.animationDuration = 9 + Math.random() * 12 + "s";
        s.style.animationDelay = -Math.random() * 12 + "s";
        const sz = 2 + Math.random() * 2.5;
        s.style.width = s.style.height = sz + "px";
        embers.appendChild(s);
      }
    }

    requestAnimationFrame(() => {
      if (flagInstance) {
        flagInstance.configure();
        flagInstance.start();
      }
      if (flagWrap) flagWrap.classList.add("is-in");
      if (textBlock) textBlock.classList.add("is-in");
      if (hint) hint.classList.add("is-in");
    });
    setTimeout(() => flagInstance && flagInstance.configure(), 250);
    setTimeout(() => flagInstance && flagInstance.configure(), 700);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let smooth = 0;

    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function smoothstep(e0, e1, v) {
      const x = clamp((v - e0) / (e1 - e0), 0, 1);
      return x * x * (3 - 2 * x);
    }
    function maxScroll() {
      return Math.max(1, scroller.offsetHeight - window.innerHeight);
    }
    function progress01() {
      const top = scroller.getBoundingClientRect().top;
      return clamp(-top / maxScroll(), 0, 1);
    }

    function paint(p) {
      // Camera gently advances
      const camZ = p * 200;
      const camY = p * -24;
      if (world) {
        world.style.transform =
          "translate3d(0," + camY.toFixed(1) + "px," + camZ.toFixed(1) + "px)";
      }

      // FLAG exits earlier & clearer (0.12 → 0.48)
      const flagOut = smoothstep(0.12, 0.48, p);
      if (panelFlag) {
        panelFlag.style.opacity = String(1 - flagOut);
        panelFlag.style.transform =
          "translate3d(0," + (flagOut * -90).toFixed(1) + "px," + (-flagOut * 240).toFixed(1) +
          "px) scale(" + (1 - flagOut * 0.28).toFixed(3) + ")";
        panelFlag.style.filter = flagOut > 0.05 ? "blur(" + (flagOut * 7).toFixed(2) + "px)" : "none";
      }

      // TEAM enters earlier (0.28 → 0.58) so it is never "missing"
      const teamIn = smoothstep(0.28, 0.58, p);
      if (panelTeam) {
        panelTeam.style.opacity = String(teamIn);
        panelTeam.style.transform =
          "translate3d(0," + ((1 - teamIn) * 50).toFixed(1) + "px," +
          (-280 + teamIn * 280).toFixed(1) + "px) scale(" + (0.9 + teamIn * 0.1).toFixed(3) + ")";
        panelTeam.style.filter = teamIn < 0.92 ? "blur(" + ((1 - teamIn) * 6).toFixed(2) + "px)" : "none";
        if (teamIn > 0.35) panelTeam.classList.add("is-live");
        else panelTeam.classList.remove("is-live");
      }

      if (fill) fill.style.width = (p * 100).toFixed(1) + "%";
      if (hint) {
        const hide = smoothstep(0.55, 0.75, p);
        hint.style.opacity = String(0.65 * (1 - hide));
      }
    }

    function tick() {
      if (cinemaDone) return;
      const target = progress01();
      if (reduceMotion.matches) smooth = target;
      else smooth = lerp(smooth, target, 0.18);
      if (Math.abs(smooth - target) < 0.001) smooth = target;
      paint(smooth);
      cinemaRaf = requestAnimationFrame(tick);
    }
    if (cinemaRaf) cancelAnimationFrame(cinemaRaf);
    cinemaRaf = requestAnimationFrame(tick);

    function jumpToTeam() {
      const y = scroller.offsetTop + maxScroll() * 0.75;
      window.scrollTo({ top: y, behavior: reduceMotion.matches ? "auto" : "smooth" });
    }

    function advance(e) {
      if (cinemaDone) return;
      const t = e && e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.closest(".lang-search"))) return;
      if (e && e.preventDefault) e.preventDefault();
      const p = progress01();
      // If team not clearly visible yet → jump there
      if (p < 0.5) {
        jumpToTeam();
        return;
      }
      window.__pjGoMode(e);
    }

    document.addEventListener("keydown", (e) => {
      if (cinemaDone) return;
      if (e.key === " " || e.key === "Enter") advance(e);
    });
    scroller.addEventListener("click", (e) => {
      if (cinemaDone) return;
      if (e.target.closest("#ctaContinue, button, a, input, .lang-search")) return;
      advance(e);
    });

    if (cta) {
      cta.onclick = null;
      cta.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.__pjGoMode(e);
      });
    }

    window.scrollTo(0, scroller.offsetTop || 0);
    paint(0);
    console.log("[PERJUANGAN] 3D entrance ready — scroll flag → team");
  }

  function finishCinemaEntrance() {
    if (cinemaDone) return;
    cinemaDone = true;
    if (cinemaRaf) {
      cancelAnimationFrame(cinemaRaf);
      cinemaRaf = null;
    }
    document.documentElement.classList.remove("is-c3d");
    document.body.classList.remove("is-c3d");
    const scroller = $("entranceScroll");
    if (scroller) {
      scroller.classList.add("is-done");
      scroller.style.display = "none";
    }
    if (flagInstance) {
      try { flagInstance.stop(); } catch (e) {}
    }
    window.scrollTo(0, 0);
  }


  /* ---------- Global navigation (also used by inline onclick) ---------- */
  window.__pjGoMode = function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    finishCinemaEntrance();
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
      cta.addEventListener("click", window.__pjGoMode);
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
    // Cinematic entrance owns the first screen via body scroll
    const eScroll = $("entranceScroll");
    if (eScroll) {
      eScroll.hidden = false;
      initEntrance1();
    } else {
      goTo("entrance1");
      initEntrance1();
    }
    applyI18nDOM();
  });
})();
