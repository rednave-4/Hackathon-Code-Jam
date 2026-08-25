/* ==========================================================================
   PERJUANGAN — i18n.js
   Indonesia / English. Default = browser language. Persisted in localStorage.
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.I18N = (function () {
  const STORAGE_KEY = "perjuangan_lang_v1";

  const STR = {
    id: {
      // Entrance 1
      e1_eyebrow: "Sebuah Perjalanan Mengingat",
      e1_title: "SEMANGAT PERJUANGAN",
      e1_accent: "Bangsa Indonesia",
      e1_hint: "Tekan spasi atau klik untuk melanjutkan",

      // Entrance 2
      e2_eyebrow: "Road to Merdeka",
      e2_heading: "Dibuat untuk Hackathon",
      e2_maker: "— MEATLOVER TEAM —",
      e2_cta: "Lanjutkan",

      // Mode select
      mode_title: "Pilih Mode",
      mode_sub: "Bagaimana kamu ingin menempuh perjalanan ini?",
      mode_learn_title: "Mode Belajar",
      mode_learn_desc: "Pelajari sejarah kemerdekaan secara mendalam melalui artikel lengkap setiap babak perjuangan.",
      mode_learn_cta: "Mulai Belajar",
      mode_game_title: "Mode Game",
      mode_game_desc: "Jelajahi peta perjuangan, selesaikan misi, dan rasakan garis besar sejarah lewat pengalaman interaktif.",
      mode_game_cta: "Masuk ke Peta",

      // Shared header / UI
      brand_version_learn: "Mode Belajar",
      brand_version_game: "Mode Game · Peta Perjuangan",
      progress_misi: "MISI",
      progress_bab: "BAB",
      reset_progress: "Reset Progres",
      back_modes: "Ganti Mode",
      lang_label: "EN",

      // Panel / map
      mulai_misi: "MULAI MISI",
      terkunci: "TERKUNCI",
      tersedia: "Tersedia",
      selesai: "Selesai",
      status_locked: "Terkunci",
      status_available: "Tersedia",
      status_completed: "Selesai",
      ulangi_misi: "Ulangi Misi",

      // Learn mode
      learn_read: "Baca materi",
      learn_mark_read: "Tandai sudah dibaca",
      learn_next: "Bab berikutnya",
      learn_prev: "Bab sebelumnya",
      learn_done_all: "Semua bab telah dibaca",
      learn_scroll_hint: "Gulir untuk membaca",

      // Modal generic
      mengerti: "MENGERTI",
      batal: "BATAL",
      ya_reset: "YA, RESET",
      reset_title: "Ulangi Perjuangan?",
      reset_body: "Seluruh progres akan dihapus dan tidak dapat dikembalikan.",
      coming_title: "Misi",
      coming_body: "Gameplay tahap ini sedang disiapkan dan akan hadir segera. Nantikan pembaruan berikutnya, Pejuang.",
      coming_note: "Stage gameplay coming soon",

      // Stage Sumpah
      stage_hint: "Ketuk setiap suara daerah hingga semua tersambung ke pusat tekad.",
      stage_progress: "SUARA",
      stage_complete_eyebrow: "Satu!",
      stage_complete_title: "Satu Nusa · Satu Bangsa · Satu Bahasa",
      stage_complete_body: "Dari penjuru yang berbeda, satu tekad yang sama. Ikrar yang menjadi fondasi persatuan menuju kemerdekaan.",
      stage_continue: "Lanjutkan",
    },

    en: {
      e1_eyebrow: "A Journey of Remembrance",
      e1_title: "SPIRIT OF STRUGGLE",
      e1_accent: "The Indonesian Nation",
      e1_hint: "Press space or click to continue",

      e2_eyebrow: "Road to Merdeka",
      e2_heading: "Made for the Hackathon",
      e2_maker: "— MEATLOVER TEAM —",
      e2_cta: "Continue",

      mode_title: "Choose a Mode",
      mode_sub: "How do you want to take this journey?",
      mode_learn_title: "Learn Mode",
      mode_learn_desc: "Explore the history of independence in depth through full articles for each chapter of the struggle.",
      mode_learn_cta: "Start Learning",
      mode_game_title: "Game Mode",
      mode_game_desc: "Explore the struggle map, complete missions, and grasp the broad outline of history through interactive play.",
      mode_game_cta: "Enter the Map",

      brand_version_learn: "Learn Mode",
      brand_version_game: "Game Mode · Struggle Map",
      progress_misi: "MISSIONS",
      progress_bab: "CHAPTERS",
      reset_progress: "Reset Progress",
      back_modes: "Change Mode",
      lang_label: "ID",

      mulai_misi: "START MISSION",
      terkunci: "LOCKED",
      tersedia: "Available",
      selesai: "Completed",
      status_locked: "Locked",
      status_available: "Available",
      status_completed: "Completed",
      ulangi_misi: "Replay Mission",

      learn_read: "Read material",
      learn_mark_read: "Mark as read",
      learn_next: "Next chapter",
      learn_prev: "Previous chapter",
      learn_done_all: "All chapters have been read",
      learn_scroll_hint: "Scroll to read",

      mengerti: "GOT IT",
      batal: "CANCEL",
      ya_reset: "YES, RESET",
      reset_title: "Reset the Struggle?",
      reset_body: "All progress will be erased and cannot be recovered.",
      coming_title: "Mission",
      coming_body: "This stage's gameplay is being prepared and will arrive soon. Stay tuned, Fighter.",
      coming_note: "Stage gameplay coming soon",

      stage_hint: "Tap each regional voice until all are connected to the central will.",
      stage_progress: "VOICES",
      stage_complete_eyebrow: "One!",
      stage_complete_title: "One Homeland · One Nation · One Language",
      stage_complete_body: "From different corners, one shared resolve. The pledge that became the foundation of unity toward independence.",
      stage_continue: "Continue",
    },
  };

  let lang = "id";

  function detectBrowser() {
    const nav = (navigator.language || navigator.userLanguage || "id").toLowerCase();
    return nav.startsWith("en") ? "en" : "id";
  }

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "id" || saved === "en") return saved;
    } catch (e) {}
    return detectBrowser();
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function init() {
    lang = load();
    document.documentElement.lang = lang === "en" ? "en" : "id";
  }

  function t(key) {
    const pack = STR[lang] || STR.id;
    return pack[key] != null ? pack[key] : (STR.id[key] || key);
  }

  function getLang() {
    return lang;
  }

  function setLang(next) {
    if (next !== "id" && next !== "en") return;
    lang = next;
    save();
    document.documentElement.lang = lang === "en" ? "en" : "id";
    document.dispatchEvent(new CustomEvent("pj:langchange", { detail: { lang } }));
  }

  function toggle() {
    setLang(lang === "id" ? "en" : "id");
  }

  init();

  return { t, getLang, setLang, toggle, STR };
})();
