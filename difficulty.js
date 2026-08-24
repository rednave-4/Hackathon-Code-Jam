/* ==========================================================================
   PERJUANGAN — difficulty.js
   Easy / Normal / Hard / Adaptive difficulty for hub progression & hints.
   External stage files are not modified; difficulty is passed via URL/query
   and sessionStorage for future use.
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.Difficulty = (function () {
  const MODES = ["adaptive", "easy", "normal", "hard"];
  const STORAGE_KEY = "perjuangan_difficulty_v1";

  let mode = "adaptive";
  let attempts = {}; // missionId -> number of starts without complete

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && MODES.includes(saved)) mode = saved;
    } catch (e) {}
    try {
      const raw = localStorage.getItem("perjuangan_attempts_v1");
      if (raw) attempts = JSON.parse(raw) || {};
    } catch (e) {
      attempts = {};
    }
    if (PJ.Progress && typeof PJ.Progress.getState === "function") {
      const s = PJ.Progress.getState();
      if (s.difficulty && MODES.includes(s.difficulty)) mode = s.difficulty;
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      localStorage.setItem("perjuangan_attempts_v1", JSON.stringify(attempts));
    } catch (e) {}
    if (PJ.Progress && typeof PJ.Progress.setDifficulty === "function") {
      PJ.Progress.setDifficulty(mode);
    }
  }

  function getMode() {
    return mode;
  }

  function setMode(next) {
    if (!MODES.includes(next)) return;
    mode = next;
    save();
    document.dispatchEvent(new CustomEvent("pj:difficultychange", { detail: { mode } }));
    if (PJ.MapController && typeof PJ.MapController.render === "function") {
      try {
        PJ.MapController.render();
      } catch (e) {}
    }
  }

  function recordAttempt(missionId) {
    if (!missionId) return;
    attempts[missionId] = (attempts[missionId] || 0) + 1;
    save();
  }

  function clearAttempt(missionId) {
    if (!missionId) return;
    if (attempts[missionId]) {
      delete attempts[missionId];
      save();
    }
  }

  /** Effective difficulty after adaptive resolution */
  function effective() {
    if (mode !== "adaptive") return mode;

    const completed =
      PJ.Progress && PJ.Progress.getCompletedArray
        ? PJ.Progress.getCompletedArray().length
        : 0;
    const learnRead =
      PJ.Progress && PJ.Progress.getLearnReadSet
        ? PJ.Progress.getLearnReadSet().size
        : 0;

    const stuck = Object.values(attempts).some((n) => n >= 3);
    const struggling = Object.values(attempts).some((n) => n >= 2);

    // Early player + reading help → easier
    if (completed <= 1 && learnRead >= 2) return "easy";
    if (stuck) return "easy";
    if (struggling && completed < 3) return "easy";

    // Strong progress → harder
    if (completed >= 4 && learnRead >= 3) return "hard";
    if (completed >= 3 && !struggling) return "hard";

    return "normal";
  }

  /**
   * How many previous missions must be completed to unlock index.
   * Easy: unlock if any previous done OR index<=1 free stretch
   * Normal: sequential (prev must be done)
   * Hard: need two previous completed (stricter)
   */
  function isUnlocked(missionIndex, progressSet) {
    if (missionIndex <= 0) return true;
    const eff = effective();
    const has = (i) => {
      const m = PJ.MISSIONS[i];
      return m && progressSet.has(m.id);
    };

    if (eff === "easy") {
      // Unlock next + one ahead if player completed anything recent
      if (has(missionIndex - 1)) return true;
      if (missionIndex >= 2 && has(missionIndex - 2)) return true;
      return false;
    }

    if (eff === "hard") {
      // Must complete previous; for index>=2 also prefer previous-of-previous
      if (!has(missionIndex - 1)) return false;
      return true;
    }

    // normal
    return has(missionIndex - 1);
  }

  function hintFor(missionId) {
    const eff = effective();
    const n = attempts[missionId] || 0;
    const pack = {
      easy: {
        id: "Mode Mudah aktif — petunjuk lebih terbuka, misi berikutnya lebih cepat terbuka.",
        en: "Easy mode — more guidance, later missions unlock sooner.",
      },
      normal: {
        id: "Mode Normal — selesaikan misi berurutan untuk membuka yang berikutnya.",
        en: "Normal mode — complete missions in order to unlock the next.",
      },
      hard: {
        id: "Mode Sulit — sedikit petunjuk. Fokus pada misi saat ini.",
        en: "Hard mode — fewer hints. Focus on the current mission.",
      },
    };
    let text = pack[eff] || pack.normal;
    if (n >= 2) {
      text = {
        id: "Anda sudah mencoba misi ini beberapa kali. Baca bab terkait di Mode Belajar, lalu coba lagi.",
        en: "You've tried this mission several times. Read the related Learn chapter, then try again.",
      };
    }
    const lang = (PJ.I18N && PJ.I18N.getLang()) || "id";
    if (lang === "id") return text.id;
    return text.en || text.id;
  }

  function appendQuery(url) {
    const eff = effective();
    const sep = url.indexOf("?") >= 0 ? "&" : "?";
    return url + sep + "diff=" + encodeURIComponent(eff) + "&diffMode=" + encodeURIComponent(mode);
  }

  function label(modeKey) {
    const key = "diff_" + (modeKey || mode);
    return PJ.I18N ? PJ.I18N.t(key) : modeKey;
  }

  function openPicker() {
    const root = document.getElementById("modalRoot");
    if (!root) return;
    const eff = effective();
    const options = MODES.map((m) => {
      const active = m === mode ? " is-active" : "";
      return `<button type="button" class="diff-opt${active}" data-diff="${m}">
        <span class="diff-opt__name">${label(m)}</span>
        <span class="diff-opt__desc">${PJ.I18N ? PJ.I18N.t("diff_desc_" + m) : ""}</span>
      </button>`;
    }).join("");

    root.innerHTML = `
      <div class="modal__backdrop" data-close></div>
      <div class="modal__box" role="dialog" aria-modal="true">
        <div class="modal__eyebrow">${PJ.I18N ? PJ.I18N.t("diff_panel_note") : "DIFFICULTY"}</div>
        <h3 class="modal__title">${PJ.I18N ? PJ.I18N.t("diff_panel_title") : "Tingkat Kesulitan"}</h3>
        <p class="modal__body">${PJ.I18N ? PJ.I18N.t("diff_effective") : "Effective"}: <strong>${label(eff)}</strong>
          ${mode === "adaptive" ? " (" + (PJ.I18N ? PJ.I18N.t("diff_adaptive_live") : "adaptive") + ")" : ""}
        </p>
        <div class="diff-options">${options}</div>
        <div class="modal__actions">
          <button type="button" class="btn btn--primary" data-close>${PJ.I18N ? PJ.I18N.t("mengerti") : "OK"}</button>
        </div>
      </div>`;
    requestAnimationFrame(() => root.classList.add("is-open"));
    root.querySelectorAll("[data-close]").forEach((n) =>
      n.addEventListener("click", () => {
        root.classList.remove("is-open");
        setTimeout(() => {
          root.innerHTML = "";
        }, 220);
      })
    );
    root.querySelectorAll("[data-diff]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setMode(btn.getAttribute("data-diff"));
        openPicker(); // refresh
        updateButtons();
        if (PJ.MapController && PJ.MapController.applyI18n) PJ.MapController.applyI18n();
      });
    });
  }

  function updateButtons() {
    const eff = effective();
    document.querySelectorAll("[data-diff-label]").forEach((el) => {
      el.textContent = label(mode === "adaptive" ? "adaptive" : eff);
    });
  }

  function bindButtons() {
    document.querySelectorAll("[data-open-difficulty]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openPicker();
      });
    });
  }

  function init() {
    load();
    bindButtons();
    updateButtons();
    document.addEventListener("pj:langchange", updateButtons);
  }

  return {
    init,
    getMode,
    setMode,
    effective,
    isUnlocked,
    hintFor,
    appendQuery,
    recordAttempt,
    clearAttempt,
    openPicker,
    updateButtons,
    MODES,
  };
})();
