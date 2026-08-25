/* ==========================================================================
   PERJUANGAN — achievements.js
   Achievement definitions, checks, toast, and panel UI.
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.Achievements = (function () {
  const DEFS = [
    {
      id: "first_step",
      icon: "①",
      title: { id: "Langkah Pertama", en: "First Step" },
      desc: {
        id: "Selesaikan misi pertama di peta perjuangan.",
        en: "Complete your first mission on the struggle map.",
      },
      test: (s) => (s.completed || []).length >= 1,
    },
    {
      id: "unity_voice",
      icon: "⚑",
      title: { id: "Suara Persatuan", en: "Voice of Unity" },
      desc: {
        id: "Selesaikan misi Sumpah Pemuda.",
        en: "Complete the Youth Pledge mission.",
      },
      test: (s) => (s.completed || []).includes("sumpah-pemuda"),
    },
    {
      id: "night_resolve",
      icon: "☾",
      title: { id: "Tekad Malam", en: "Night Resolve" },
      desc: {
        id: "Selesaikan misi Rengasdengklok.",
        en: "Complete the Rengasdengklok mission.",
      },
      test: (s) => (s.completed || []).includes("rengasdengklok"),
    },
    {
      id: "proclaimer",
      icon: "📜",
      title: { id: "Pembaca Proklamasi", en: "Proclaimer" },
      desc: {
        id: "Selesaikan misi Proklamasi.",
        en: "Complete the Proclamation mission.",
      },
      test: (s) => (s.completed || []).includes("proklamasi"),
    },
    {
      id: "hero_city",
      icon: "⚔",
      title: { id: "Kota Pahlawan", en: "City of Heroes" },
      desc: {
        id: "Selesaikan misi Pertempuran Surabaya.",
        en: "Complete the Battle of Surabaya mission.",
      },
      test: (s) => (s.completed || []).includes("surabaya"),
    },
    {
      id: "guerrilla",
      icon: "⛰",
      title: { id: "Jiwa Gerilya", en: "Guerrilla Spirit" },
      desc: {
        id: "Selesaikan misi Agresi & Gerilya.",
        en: "Complete the Aggression & Guerrilla mission.",
      },
      test: (s) => (s.completed || []).includes("agresi-gerilya"),
    },
    {
      id: "full_map",
      icon: "★",
      title: { id: "Peta Lengkap", en: "Full Map" },
      desc: {
        id: "Selesaikan semua misi di peta.",
        en: "Complete every mission on the map.",
      },
      test: (s) => (s.completed || []).length >= 5,
    },
    {
      id: "first_reader",
      icon: "📖",
      title: { id: "Pembaca Awal", en: "First Reader" },
      desc: {
        id: "Tandai satu bab Mode Belajar sebagai sudah dibaca.",
        en: "Mark one Learn Mode chapter as read.",
      },
      test: (s) => (s.learnRead || []).length >= 1,
    },
    {
      id: "scholar",
      icon: "🎓",
      title: { id: "Cendekiawan", en: "Scholar" },
      desc: {
        id: "Baca semua bab di Mode Belajar.",
        en: "Read every chapter in Learn Mode.",
      },
      test: (s) => (s.learnRead || []).length >= 5,
    },
        {
      id: "all_figures",
      icon: "👥",
      title: { id: "Mengenal Seluruh Tokoh", en: "Know Every Figure" },
      desc: {
        id: "Kenali tokoh di kelima kartu Mode Belajar hingga semua bercentang.",
        en: "Meet the figures on all five Learn Mode cards until every card is checked.",
      },
      test: () => {
        try {
          const raw = localStorage.getItem("perjuangan_figures_seen");
          const data = raw ? JSON.parse(raw) : {};
          const chapters = PJ.FIGURE_CHAPTERS || [];
          if (!chapters.length) return false;
          return chapters.every((ch) => {
            const seen = data[ch.id] || [];
            return (ch.figures || []).length > 0 &&
              ch.figures.every((f) => seen.indexOf(f.id) !== -1);
          });
        } catch (e) {
          return false;
        }
      },
    },
    {
      id: "polyglot",
      icon: "🌐",
      title: { id: "Poliglot", en: "Polyglot" },
      desc: {
        id: "Ganti bahasa antarmuka setidaknya sekali.",
        en: "Change the interface language at least once.",
      },
      test: (s) => !!s._langChanged,
    },
  ];

  let langChanged = false;
  let toastTimer = null;

  function tField(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    const lang = (PJ.I18N && PJ.I18N.getLang()) || "id";
    if (obj[lang]) return obj[lang];
    if (lang !== "id" && obj.en) return obj.en;
    return obj.id || obj.en || "";
  }

  function getState() {
    const s = PJ.Progress && PJ.Progress.getState ? PJ.Progress.getState() : { completed: [], learnRead: [], achievements: [] };
    s._langChanged = langChanged || (s.language && s.language !== "id");
    return s;
  }

  function isUnlocked(id) {
    const s = getState();
    return (s.achievements || []).includes(id);
  }

  function evaluate() {
    if (!PJ.Progress || typeof PJ.Progress.unlockAchievement !== "function") return [];
    const s = getState();
    const newly = [];
    DEFS.forEach((def) => {
      if ((s.achievements || []).includes(def.id)) return;
      try {
        if (def.test(s)) {
          const ok = PJ.Progress.unlockAchievement(def.id);
          if (ok) newly.push(def);
        }
      } catch (e) {}
    });
    if (newly.length) showToast(newly[0]);
    updateBadge();
    return newly;
  }

  function showToast(def) {
    let el = document.getElementById("achToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "achToast";
      el.className = "ach-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.innerHTML = `
      <div class="ach-toast__icon">${def.icon}</div>
      <div class="ach-toast__body">
        <div class="ach-toast__label">${PJ.I18N ? PJ.I18N.t("ach_unlocked") : "Achievement unlocked"}</div>
        <div class="ach-toast__title">${tField(def.title)}</div>
      </div>
    `;
    el.classList.add("is-show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-show"), 3200);
  }

  function openPanel() {
    const total = DEFS.length;
    const unlocked = DEFS.filter((d) => isUnlocked(d.id)).length;
    const cards = DEFS.map((d) => {
      const on = isUnlocked(d.id);
      return `
        <div class="ach-card ${on ? "is-unlocked" : "is-locked"}">
          <div class="ach-card__icon">${on ? d.icon : "•"}</div>
          <div class="ach-card__meta">
            <div class="ach-card__title">${tField(d.title)}</div>
            <div class="ach-card__desc">${tField(d.desc)}</div>
          </div>
          <div class="ach-card__status">${on ? "✓" : "—"}</div>
        </div>
      `;
    }).join("");

    const html = `
      <div class="modal__eyebrow">${PJ.I18N ? PJ.I18N.t("ach_panel_note") : "ACHIEVEMENTS"}</div>
      <h3 class="modal__title">${PJ.I18N ? PJ.I18N.t("ach_panel_title") : "Pencapaian"}</h3>
      <p class="modal__body ach-panel__count">${unlocked} / ${total}</p>
      <div class="ach-grid">${cards}</div>
      <div class="modal__actions">
        <button type="button" class="btn btn--primary" data-close>${PJ.I18N ? PJ.I18N.t("mengerti") : "OK"}</button>
      </div>
    `;
    if (PJ.Modal && typeof PJ.Modal.open === "function") {
      // Prefer custom open if available via info path
    }
    const root = document.getElementById("modalRoot");
    if (!root) return;
    root.innerHTML = `<div class="modal__backdrop" data-close></div><div class="modal__box modal__box--wide" role="dialog" aria-modal="true">${html}</div>`;
    requestAnimationFrame(() => root.classList.add("is-open"));
    root.querySelectorAll("[data-close]").forEach((n) =>
      n.addEventListener("click", () => {
        root.classList.remove("is-open");
        setTimeout(() => {
          root.innerHTML = "";
        }, 220);
      })
    );
  }

  function updateBadge() {
    const n = DEFS.filter((d) => isUnlocked(d.id)).length;
    document.querySelectorAll("[data-ach-count]").forEach((el) => {
      el.textContent = String(n);
    });
  }

  function markLangChanged() {
    langChanged = true;
    evaluate();
  }

  function bindButtons() {
    document.querySelectorAll("[data-open-achievements]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openPanel();
      });
    });
  }

  function init() {
    bindButtons();
    updateBadge();
    if (PJ.Progress && typeof PJ.Progress.onChange === "function") {
      PJ.Progress.onChange(() => {
        evaluate();
        updateBadge();
      });
    }
    document.addEventListener("pj:langchange", () => {
      markLangChanged();
    });
    // Initial evaluate for already-earned progress
    setTimeout(evaluate, 200);
  }

  return {
    init,
    evaluate,
    openPanel,
    DEFS,
    isUnlocked,
    updateBadge,
  };
})();
