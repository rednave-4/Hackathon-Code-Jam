/* ==========================================================================
   PERJUANGAN — main.js v2.2.2
   Simple, reliable screen flow. Inline onclick fallbacks on critical buttons.
   ========================================================================== */

(function () {
  window.PJ = window.PJ || {};
  PJ.devMode = false;

  const $ = (id) => document.getElementById(id);

  const screens = {
    modeSelect: $("modeSelect"),
    learnMode: $("learnMode"),
    mainMap: $("mainMap"),
  };

  let flagInstance = null;
  let mapInitialized = false;
  let learnInitialized = false;
  let entranceDone = false;

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

  /* ---------- Scroll-linked transition, Entrance 1 → Entrance 2 ----------
     Purely reactive: reads element position on scroll (passive listener,
     rAF-throttled) and writes inline transform/opacity. Never calls
     preventDefault, never touches scrollTop — the browser's native scroll
     stays in full control, so this can't reintroduce the old hijack bug. */
  function bindEntranceScrollFX(entrance1, entrance2, flagWrap, textBlock, creditsBlock) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return null;

    function clamp(v, a, b) {
      return Math.max(a, Math.min(b, v));
    }
    function smoothstep(e0, e1, v) {
      const x = clamp((v - e0) / (e1 - e0), 0, 1);
      return x * x * (3 - 2 * x);
    }

    const space = entrance1 && entrance1.querySelector(".e1-space");
    const glowA = entrance1 && entrance1.querySelector(".e1-glow--a");
    const glowB = entrance1 && entrance1.querySelector(".e1-glow--b");
    const floor = entrance1 && entrance1.querySelector(".e1-floor");
    const rays = entrance1 && entrance1.querySelector(".e1-rays");
    const hint = $("e1Hint");
    const stageInner = entrance1 && entrance1.querySelector(".e1-stage-inner");
    const e2Veil = entrance2 && entrance2.querySelector(".e2-fade-veil");
    const e2Lang = entrance2 && entrance2.querySelector(".lang-search");
    const creditKids = creditsBlock
      ? Array.prototype.slice.call(creditsBlock.children)
      : [];

    let ticking = false;

    function update() {
      ticking = false;
      if (entranceDone) return;
      const vh = window.innerHeight || 1;

      /* ---- Entrance 1 leave ---- */
      if (entrance1) {
        const r1 = entrance1.getBoundingClientRect();
        const pOut = smoothstep(0, vh * 0.9, -r1.top);

        if (flagWrap) {
          flagWrap.style.transform =
            "translate3d(0," +
            (-pOut * 120).toFixed(1) +
            "px,0) scale(" +
            (1 - pOut * 0.18).toFixed(3) +
            ") rotateX(" +
            (pOut * 12).toFixed(2) +
            "deg)";
          flagWrap.style.opacity = String(1 - pOut * 0.95);
          flagWrap.style.filter = pOut > 0.05 ? "blur(" + (pOut * 8).toFixed(1) + "px)" : "";
        }
        if (textBlock) {
          textBlock.style.transform =
            "translate3d(0," + (-pOut * 80).toFixed(1) + "px,0)";
          textBlock.style.opacity = String(1 - pOut);
        }
        if (hint) {
          hint.style.opacity = String(Math.max(0, 0.85 - pOut * 1.4));
          hint.style.transform = "translateY(" + (pOut * 24).toFixed(1) + "px)";
        }
        if (stageInner) {
          stageInner.style.transform =
            "translate3d(0," + (-pOut * 36).toFixed(1) + "px,0)";
        }
        if (space) space.style.opacity = String(1 - pOut * 0.85);
        if (glowA) {
          glowA.style.transform =
            "translate(-50%, -50%) scale(" + (1 + pOut * 0.35).toFixed(3) + ")";
          glowA.style.opacity = String(1 - pOut * 0.7);
        }
        if (glowB) {
          glowB.style.opacity = String(0.85 - pOut * 0.75);
        }
        if (floor) floor.style.opacity = String(Math.max(0, 1 - pOut * 1.1));
        if (rays) rays.style.opacity = String(1 - pOut * 0.9);
      }

      /* ---- Entrance 2 fade-in ---- */
      if (entrance2) {
        const r2 = entrance2.getBoundingClientRect();
        // Longer, softer arrival curve for a clear fade-in
        const pIn = smoothstep(vh * 0.98, vh * 0.22, r2.top);

        entrance2.style.setProperty("--e2-in", pIn.toFixed(3));
        entrance2.classList.toggle("is-fading-in", pIn > 0.02 && pIn < 0.98);
        entrance2.classList.toggle("is-in-view", pIn >= 0.55);

        // Full-panel veil: black → transparent
        if (e2Veil) {
          e2Veil.style.opacity = String(1 - pIn);
        }

        // Language picker fades slightly after content starts
        if (e2Lang) {
          const langP = clamp((pIn - 0.25) / 0.55, 0, 1);
          e2Lang.style.opacity = String(langP);
          e2Lang.style.transform =
            "translateY(" + ((1 - langP) * 16).toFixed(1) + "px)";
        }

        if (creditsBlock) {
          creditsBlock.style.opacity = String(pIn);
          creditsBlock.style.transform =
            "translate3d(0," +
            ((1 - pIn) * 56).toFixed(1) +
            "px,0) scale(" +
            (0.94 + pIn * 0.06).toFixed(3) +
            ")";
          creditsBlock.style.filter =
            pIn < 0.97 ? "blur(" + ((1 - pIn) * 7).toFixed(1) + "px)" : "none";

          // Stagger children for layered fade-in
          creditKids.forEach(function (kid, i) {
            const delay = 0.08 + i * 0.1;
            const local = clamp((pIn - delay) / Math.max(0.001, 1 - delay), 0, 1);
            const eased = local * local * (3 - 2 * local);
            kid.style.opacity = String(eased);
            kid.style.transform =
              "translate3d(0," + ((1 - eased) * 26).toFixed(1) + "px,0)";
          });
        }
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return function cleanup() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }

  /* ---------- Entrance — real stacked scroll (no sticky/3D hijack) ---------- */
  function initEntrance() {
    const wrap = $("entranceWrap");
    const entrance1 = $("entrance1");
    const entrance2 = $("entrance2");
    const flagWrap = $("flagWrap");
    const textBlock = $("e1Text");
    const creditsBlock = $("creditsBlock");
    const cta = $("ctaContinue");

    if (!wrap) {
      console.warn("[PERJUANGAN] entranceWrap missing");
      return;
    }

    entranceDone = false;
    document.documentElement.classList.add("is-entrance");
    document.body.classList.add("is-entrance");
    wrap.hidden = false;

    try {
      flagInstance = PJ.FlagCloth($("flagCanvas"));
    } catch (err) {
      console.warn("[PERJUANGAN] flag failed:", err);
    }

    // One-time load fade for the whole flag panel (decoupled from scroll —
    // this just softens the very first paint).
    requestAnimationFrame(() => {
      if (flagInstance) {
        flagInstance.configure();
        flagInstance.start();
      }
      if (entrance1) entrance1.classList.add("is-in");
    });
    setTimeout(() => flagInstance && flagInstance.configure(), 250);
    setTimeout(() => flagInstance && flagInstance.configure(), 700);

    // Pause the flag canvas when it's fully offscreen, purely for
    // performance — this never touches opacity/transform, that's the
    // scroll-linked function's job below.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target === entrance1 && flagInstance) {
              if (entry.isIntersecting) flagInstance.start();
              else flagInstance.stop();
            }
          });
        },
        { threshold: 0.05 }
      );
      if (entrance1) io.observe(entrance1);
      initEntrance._io = io;
    }

    // Scroll-linked Entrance 1 → Entrance 2 transition.
    initEntrance._scrollFxCleanup = bindEntranceScrollFX(
      entrance1, entrance2, flagWrap, textBlock, creditsBlock
    );

    if (cta) {
      cta.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.__pjGoMode(e);
      });
    }

    window.scrollTo(0, 0);
    console.log("[PERJUANGAN] entrance ready — normal page scroll, Entrance 2 sits below Entrance 1");
  }

  function finishEntrance() {
    if (entranceDone) return;
    entranceDone = true;
    document.documentElement.classList.remove("is-entrance");
    document.body.classList.remove("is-entrance");
    const wrap = $("entranceWrap");
    if (wrap) wrap.hidden = true;
    if (flagInstance) {
      try { flagInstance.stop(); } catch (e) {}
    }
    if (initEntrance._io) {
      try { initEntrance._io.disconnect(); } catch (e) {}
    }
    if (typeof initEntrance._scrollFxCleanup === "function") {
      try { initEntrance._scrollFxCleanup(); } catch (e) {}
    }
    window.scrollTo(0, 0);
  }



  /* ---------- Global navigation (also used by inline onclick) ---------- */
  window.__pjGoMode = function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    finishEntrance();
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
    const learnBtn = $("btnModeLearn");
    if (learnBtn) learnBtn.onclick = window.__pjGoLearn;
    const gameBtn = $("btnModeGame");
    if (gameBtn) gameBtn.onclick = window.__pjGoGame;
    // NOTE: ctaContinue ("Lanjutkan") is intentionally NOT bound here.
    // It's bound once, cleanly, inside initEntrance(). Binding it here
    // too used to make every click fire window.__pjGoMode multiple times.

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
    // Entrance owns the top of the page as real, scrollable content —
    // Entrance 1 then Entrance 2 stacked below it — before the app shell
    // (mode select → learn/game) takes over as a fixed-viewport SPA.
    initEntrance();
    applyI18nDOM();
  });
})();
