/* ==========================================================================
   PERJUANGAN — main.js
   Orchestrates the screen flow: Entrance 1 (flag splash) -> Entrance 2
   (credits) -> Main Map. Handles the flag cloth instance lifecycle and a
   hidden dev-mode toggle (Ctrl+Shift+D) for testing the unlock chain.
   ========================================================================== */

(function () {
  window.PJ = window.PJ || {};
  PJ.devMode = false;

  const screens = {
    entrance1: document.getElementById("entrance1"),
    entrance2: document.getElementById("entrance2"),
    mainMap: document.getElementById("mainMap"),
  };

  let flagInstance = null;
  let advancedFromE1 = false;
  let mapInitialized = false;

  function goTo(name) {
    Object.entries(screens).forEach(([key, el]) => {
      if (key === name) {
        el.hidden = false;
        requestAnimationFrame(() => el.classList.add("is-active"));
      } else {
        el.classList.remove("is-active");
      }
    });
  }

  // ---------- Entrance 1 ----------
  function initEntrance1() {
    const canvas = document.getElementById("flagCanvas");
    flagInstance = PJ.FlagCloth(canvas);

    const bg = screens.entrance1;
    const flagWrap = document.getElementById("flagWrap");
    const textBlock = document.getElementById("e1Text");
    const hint = document.getElementById("e1Hint");

    // Motion timing per spec
    requestAnimationFrame(() => bg.classList.add("bg-in")); // 0.0s
    setTimeout(() => {
      flagWrap.classList.add("is-in");
      flagInstance.start();
    }, 300); // 0.3s — flag appears, cloth already running
    setTimeout(() => {
      textBlock.classList.add("is-in");
    }, 1000); // ~1.0s — title reveal
    setTimeout(() => {
      hint.classList.add("is-in");
    }, 1600);

    const advance = (e) => {
      if (advancedFromE1) return;
      if (e && e.type === "keydown" && e.key !== " " && e.key !== "Enter" && e.key !== "Spacebar")
        return;
      if (e) e.preventDefault();
      advancedFromE1 = true;
      leaveEntrance1();
    };

    document.addEventListener("keydown", advance);
    screens.entrance1.addEventListener("click", advance);

    // stash for potential cleanup
    screens.entrance1._advanceHandler = advance;
  }

  function leaveEntrance1() {
    screens.entrance1.classList.add("is-leaving");
    setTimeout(() => {
      if (flagInstance) flagInstance.stop();
      document.removeEventListener("keydown", screens.entrance1._advanceHandler);
      screens.entrance1.removeEventListener("click", screens.entrance1._advanceHandler);
      screens.entrance1.hidden = true;
      goTo("entrance2");
    }, 700); // soft fade/blur, not a hard cut
  }

  // ---------- Entrance 2 ----------
  function initEntrance2() {
    const ctaBtn = document.getElementById("ctaEnterMap");
    ctaBtn.addEventListener("click", () => {
      screens.entrance2.classList.add("is-leaving");
      setTimeout(() => {
        screens.entrance2.hidden = true;
        goTo("mainMap");
        if (!mapInitialized) {
          PJ.MapController.init();
          mapInitialized = true;
        }
      }, 650); // zoom-out / camera pull
    });
  }

  // ---------- Hidden dev toggle ----------
  function initDevToggle() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
        PJ.devMode = !PJ.devMode;
        const badge = document.getElementById("devBadge");
        if (badge) badge.hidden = !PJ.devMode;
        console.log(`[PERJUANGAN] dev mode ${PJ.devMode ? "ON" : "OFF"}`);
        // re-render panel if one is open, to show/hide the dev button
        const evt = new CustomEvent("pj:devmodechange");
        document.dispatchEvent(evt);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initEntrance1();
    initEntrance2();
    initDevToggle();
    goTo("entrance1");
  });
})();
