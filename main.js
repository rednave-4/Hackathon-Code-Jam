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
    const scrollRoot = $("entranceScroll");
    const sticky = scrollRoot && scrollRoot.querySelector(".cinema-entrance__sticky");
    const hero = $("cinemaHero");
    const credits = $("cinemaCredits");
    const hint = $("e1Hint");
    const flagWrap = $("flagWrap");
    const textBlock = $("e1Text");

    document.body.classList.add("is-cinema-entrance");

    try {
      flagInstance = PJ.FlagCloth($("flagCanvas"));
    } catch (err) {
      console.warn("[PERJUANGAN] flag failed:", err);
    }

    requestAnimationFrame(() => {
      if (sticky) sticky.classList.add("bg-in");
      if (flagInstance) {
        flagInstance.configure();
        flagInstance.start();
      }
      if (flagWrap) flagWrap.classList.add("is-in");
      if (textBlock) textBlock.classList.add("is-in");
      if (hint) hint.classList.add("is-in");
    });
    setTimeout(() => { if (flagInstance) flagInstance.configure(); }, 200);
    setTimeout(() => { if (flagInstance) flagInstance.configure(); }, 600);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let smooth = 0;
    let target = 0;
    let rafPending = false;

    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function smoothstep(e0, e1, v) {
      const x = clamp((v - e0) / (e1 - e0), 0, 1);
      return x * x * (3 - 2 * x);
    }

    function getDist() {
      if (!scrollRoot) return 0;
      const max = Math.max(1, scrollRoot.offsetHeight - window.innerHeight);
      return clamp(-scrollRoot.getBoundingClientRect().top, 0, max);
    }

    function tick() {
      rafPending = false;
      if (cinemaDone) return;
      target = getDist();
      if (reduceMotion.matches) smooth = target;
      else smooth = lerp(smooth, target, 0.16);
      if (Math.abs(smooth - target) < 0.5) smooth = target;

      const max = Math.max(1, (scrollRoot ? scrollRoot.offsetHeight : 1400) - window.innerHeight);
      const p = clamp(smooth / max, 0, 1);

      // Phase 0-0.45: hero holds, then fades up
      const heroExit = smoothstep(0.28, 0.62, p);
      // Phase 0.45-1: credits fade in
      const creditsIn = smoothstep(0.48, 0.78, p);
      const hintFade = smoothstep(0.08, 0.35, p);

      const root = document.documentElement;
      root.style.setProperty("--cin-hero-opacity", String(1 - heroExit));
      root.style.setProperty("--cin-hero-y", (heroExit * -80).toFixed(1) + "px");
      root.style.setProperty("--cin-hero-scale", String(1 - heroExit * 0.12));
      root.style.setProperty("--cin-credits-opacity", String(creditsIn));
      root.style.setProperty("--cin-credits-y", ((1 - creditsIn) * 48).toFixed(1) + "px");
      root.style.setProperty("--cin-hint-opacity", String(0.75 * (1 - hintFade)));
      root.style.setProperty("--cin-hint-y", (hintFade * 24).toFixed(1) + "px");

      if (credits) {
        if (creditsIn > 0.85) credits.classList.add("is-interactive");
        else credits.classList.remove("is-interactive");
      }

      if (Math.abs(smooth - target) > 0.5) {
        if (!rafPending) {
          rafPending = true;
          cinemaRaf = requestAnimationFrame(tick);
        }
      }
    }

    function requestTick() {
      if (rafPending || cinemaDone) return;
      rafPending = true;
      cinemaRaf = requestAnimationFrame(tick);
    }

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", () => {
      if (flagInstance) flagInstance.configure();
      requestTick();
    });
    requestTick();

    // Optional: Space still jumps toward credits
    document.addEventListener("keydown", (e) => {
      if (cinemaDone) return;
      if (e.key === " " || e.key === "Enter") {
        if (!scrollRoot) return;
        const max = Math.max(1, scrollRoot.offsetHeight - window.innerHeight);
        if (getDist() < max * 0.7) {
          e.preventDefault();
          window.scrollTo({ top: max * 0.85, behavior: reduceMotion.matches ? "auto" : "smooth" });
        }
      }
    });

    console.log("[PERJUANGAN] cinematic entrance ready — scroll to continue");
  }

  function finishCinemaEntrance() {
    if (cinemaDone) return;
    cinemaDone = true;
    document.body.classList.remove("is-cinema-entrance");
    const scrollRoot = $("entranceScroll");
    if (scrollRoot) {
      scrollRoot.classList.add("is-done");
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
