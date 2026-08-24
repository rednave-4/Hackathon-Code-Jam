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
    const root = $("entranceScroll");
    const hero = $("cinemaHero");
    const credits = $("cinemaCredits");
    const hint = $("e1Hint");
    const flagWrap = $("flagWrap");
    const textBlock = $("e1Text");
    const fill = $("cinemaProgressFill");
    const cta = $("ctaContinue");
    const embers = $("cinemaEmbers");

    if (!root) {
      console.warn("[PERJUANGAN] entranceScroll missing");
      return;
    }

    // No document scroll — fixed overlay
    document.documentElement.classList.remove("is-cinema-entrance");
    document.body.classList.remove("is-cinema-entrance");
    root.classList.remove("is-done");
    root.style.display = "";

    try {
      flagInstance = PJ.FlagCloth($("flagCanvas"));
    } catch (err) {
      console.warn("[PERJUANGAN] flag failed:", err);
    }

    // Embers
    if (embers && !embers.childElementCount) {
      for (let i = 0; i < 14; i++) {
        const s = document.createElement("span");
        s.style.left = Math.random() * 100 + "%";
        s.style.setProperty("--dx", (Math.random() * 40 - 20).toFixed(1) + "px");
        s.style.animationDuration = 10 + Math.random() * 12 + "s";
        s.style.animationDelay = -Math.random() * 14 + "s";
        s.style.width = s.style.height = 2 + Math.random() * 2.5 + "px";
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

    let progress = 0; // 0..1
    let target = 0;
    let revealedCredits = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function smoothstep(e0, e1, v) {
      const x = clamp((v - e0) / (e1 - e0), 0, 1);
      return x * x * (3 - 2 * x);
    }

    function paint(p) {
      // Phase A: hero full → fades (0 → 0.55)
      // Phase B: credits in (0.4 → 0.85)
      const heroOut = smoothstep(0.22, 0.58, p);
      const credIn = smoothstep(0.4, 0.72, p);
      const hintDim = smoothstep(0.08, 0.35, p);

      if (hero) {
        hero.style.opacity = String(1 - heroOut);
        hero.style.transform =
          "translateY(" + (heroOut * -70).toFixed(1) + "px) scale(" + (1 - heroOut * 0.1).toFixed(3) + ")";
      }
      if (credits) {
        credits.style.opacity = String(credIn);
        credits.style.transform =
          "translateY(" + ((1 - credIn) * 36).toFixed(1) + "px)";
        if (credIn > 0.45) {
          credits.classList.add("is-interactive");
          revealedCredits = true;
        } else {
          credits.classList.remove("is-interactive");
        }
      }
      if (hint) {
        // Hint text changes near the end
        hint.style.opacity = String(0.75 * (1 - smoothstep(0.75, 0.92, p)) * (1 - hintDim * 0.35) + 0.25 * credIn);
      }
      if (fill) fill.style.width = (p * 100).toFixed(1) + "%";
    }

    function tick() {
      if (cinemaDone) return;
      if (reduceMotion.matches) progress = target;
      else progress = lerp(progress, target, 0.14);
      if (Math.abs(progress - target) < 0.001) progress = target;
      paint(progress);
      cinemaRaf = requestAnimationFrame(tick);
    }
    if (cinemaRaf) cancelAnimationFrame(cinemaRaf);
    cinemaRaf = requestAnimationFrame(tick);

    function nudge(delta) {
      target = clamp(target + delta, 0, 1);
    }

    function onWheel(e) {
      if (cinemaDone) return;
      e.preventDefault();
      const dy = e.deltaY;
      nudge(dy > 0 ? 0.065 : -0.05);
    }

    let touchY = null;
    function onTouchStart(e) {
      if (cinemaDone) return;
      touchY = e.touches[0].clientY;
    }
    function onTouchMove(e) {
      if (cinemaDone || touchY == null) return;
      const y = e.touches[0].clientY;
      const dy = touchY - y;
      touchY = y;
      if (Math.abs(dy) > 2) {
        e.preventDefault();
        nudge(dy > 0 ? 0.04 : -0.03);
      }
    }
    function onTouchEnd() { touchY = null; }

    function advanceStep(e) {
      if (cinemaDone) return;
      const t = e && e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.closest(".lang-search"))) return;
      if (e && e.preventDefault) e.preventDefault();

      if (progress < 0.7 && target < 0.7) {
        // Jump to credits
        target = 0.88;
        revealedCredits = true;
        return;
      }
      // Already on credits → dashboard
      window.__pjGoMode(e);
    }

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd);
    document.addEventListener("keydown", (e) => {
      if (cinemaDone) return;
      if (e.key === " " || e.key === "Enter") advanceStep(e);
      if (e.key === "ArrowDown") { e.preventDefault(); nudge(0.08); }
      if (e.key === "ArrowUp") { e.preventDefault(); nudge(-0.06); }
    });
    root.addEventListener("click", (e) => {
      if (cinemaDone) return;
      if (e.target.closest("#ctaContinue, button, a, input, .lang-search")) return;
      advanceStep(e);
    });

    if (cta) {
      cta.onclick = null;
      cta.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.__pjGoMode(e);
      });
    }

    paint(0);
    console.log("[PERJUANGAN] cinematic entrance ready — wheel / space / click");
  }

  function finishCinemaEntrance() {
    if (cinemaDone) return;
    cinemaDone = true;
    if (cinemaRaf) {
      cancelAnimationFrame(cinemaRaf);
      cinemaRaf = null;
    }
    document.documentElement.classList.remove("is-cinema-entrance");
    document.body.classList.remove("is-cinema-entrance");
    const scrollRoot = $("entranceScroll");
    if (scrollRoot) {
      scrollRoot.classList.add("is-done");
      scrollRoot.style.display = "none";
    }
    if (flagInstance) {
      try { flagInstance.stop(); } catch (e) {}
    }
    window.scrollTo(0, 0);
  }

nline onclick) ---------- */
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
