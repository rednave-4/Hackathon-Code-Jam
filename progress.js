/* ==========================================================================
   PERJUANGAN — progress.js
   Progress Manager v3 — Firestore + localStorage fallback
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.Progress = (function () {
  const LOCAL_KEY = "perjuangan_v3_progress";
  const DEVICE_KEY = "perjuangan_device_id";

  function emptyState() {
    return {
      version: 3,
      completed: [],
      learnRead: [],
      achievements: [],
      stats: {
        totalPlayTimeSec: 0,
        missionsCompleted: 0,
        lastPlayedAt: null,
        rank: "D",
      },
      language: "id",
      difficulty: "adaptive",
      updatedAt: null,
    };
  }

  let state = emptyState();
  let deviceId = null;
  let saveTimer = null;
  const listeners = [];

  function getDeviceId() {
    if (deviceId) return deviceId;
    try {
      deviceId = localStorage.getItem(DEVICE_KEY);
      if (!deviceId) {
        deviceId = "dev_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem(DEVICE_KEY, deviceId);
      }
    } catch (e) {
      deviceId = "temp_" + Date.now();
    }
    return deviceId;
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data && typeof data === "object") return data;
    } catch (e) {}
    return null;
  }

  function saveLocal(data) {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("[PERJUANGAN] Gagal simpan localStorage", e);
    }
  }

  async function loadRemote() {
    if (!PJ.Firebase || !PJ.Firebase.isReady()) return null;
    const db = PJ.Firebase.getDb();
    if (!db) return null;
    try {
      const snap = await db.collection("users").doc(getDeviceId()).get();
      if (snap.exists) return snap.data();
    } catch (e) {
      console.warn("[PERJUANGAN] Gagal baca Firestore:", e);
    }
    return null;
  }

  async function saveRemote(data) {
    if (!PJ.Firebase || !PJ.Firebase.isReady()) return false;
    const db = PJ.Firebase.getDb();
    if (!db) return false;
    try {
      await db.collection("users").doc(getDeviceId()).set(
        { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
      return true;
    } catch (e) {
      console.warn("[PERJUANGAN] Gagal tulis Firestore:", e);
      return false;
    }
  }

  function normalize(raw) {
    const base = emptyState();
    if (!raw || typeof raw !== "object") return base;
    if (Array.isArray(raw)) {
      base.completed = raw.filter((x) => typeof x === "string");
      return base;
    }
    if (raw.completed && Array.isArray(raw.completed)) {
      base.completed = raw.completed.filter((x) => typeof x === "string");
    }
    if (raw.learnRead && Array.isArray(raw.learnRead)) {
      base.learnRead = raw.learnRead.filter((x) => typeof x === "string");
    }
    if (raw.achievements && Array.isArray(raw.achievements)) {
      base.achievements = raw.achievements.filter((x) => typeof x === "string");
    }
    if (raw.stats && typeof raw.stats === "object") {
      base.stats = { ...base.stats, ...raw.stats };
    }
    if (typeof raw.language === "string") base.language = raw.language;
    if (typeof raw.difficulty === "string") base.difficulty = raw.difficulty;
    base.updatedAt = raw.updatedAt || null;
    base.version = 3;
    return base;
  }

  function mergeStates(local, remote) {
    if (!remote) return local;
    if (!local) return remote;
    const localCount = (local.completed || []).length;
    const remoteCount = (remote.completed || []).length;
    if (remoteCount > localCount) return normalize(remote);
    if (localCount > remoteCount) return normalize(local);
    return normalize(remote.updatedAt ? remote : local);
  }

  async function init() {
    const local = normalize(loadLocal());
    state = local;
    if (PJ.Firebase) {
      await PJ.Firebase.init();
      const remote = await loadRemote();
      if (remote) {
        state = mergeStates(local, normalize(remote));
        saveLocal(state);
        if (PJ.Firebase.isReady()) saveRemote(state);
      } else if (PJ.Firebase.isReady() && state.completed.length > 0) {
        saveRemote(state);
      }
    }
    notify();
    console.log("[PERJUANGAN] Progress siap. Completed:", state.completed.length);
    return state;
  }

  function getState() {
    return { ...state, completed: [...state.completed], learnRead: [...state.learnRead] };
  }

  function isCompleted(missionId) {
    return state.completed.includes(missionId);
  }

  function getCompletedSet() {
    return new Set(state.completed);
  }

  function markComplete(missionId) {
    if (!missionId || state.completed.includes(missionId)) return false;
    state.completed.push(missionId);
    state.stats.missionsCompleted = state.completed.length;
    state.stats.lastPlayedAt = new Date().toISOString();
    scheduleSave();
    notify();
    return true;
  }

  function markLearnRead(articleId) {
    if (!articleId || state.learnRead.includes(articleId)) return false;
    state.learnRead.push(articleId);
    scheduleSave();
    notify();
    return true;
  }

  function isLearnRead(articleId) {
    return state.learnRead.includes(articleId);
  }

  function getLearnReadSet() {
    return new Set(state.learnRead);
  }

  function unlockAchievement(id) {
    if (!id || state.achievements.includes(id)) return false;
    state.achievements.push(id);
    scheduleSave();
    notify();
    return true;
  }

  function setLanguage(lang) {
    if (typeof lang !== "string") return;
    state.language = lang;
    scheduleSave();
  }

  function setDifficulty(diff) {
    if (typeof diff !== "string") return;
    state.difficulty = diff;
    scheduleSave();
  }

    function reset() {
    try {
      localStorage.removeItem("perjuangan_figures_seen");
    } catch (e) {}
    state = emptyState();
    scheduleSave(true);
    notify();
  }
  
  function scheduleSave(immediate) {
    if (saveTimer) clearTimeout(saveTimer);
    const run = () => {
      saveLocal(state);
      if (PJ.Firebase && PJ.Firebase.isReady()) saveRemote(state);
    };
    if (immediate) run();
    else saveTimer = setTimeout(run, 400);
  }

  function onChange(fn) {
    if (typeof fn === "function") listeners.push(fn);
  }

  function notify() {
    const snapshot = getState();
    listeners.forEach((fn) => {
      try {
        fn(snapshot);
      } catch (e) {}
    });
  }

  function getCompletedArray() {
    return [...state.completed];
  }

  return {
    init,
    getState,
    isCompleted,
    getCompletedSet,
    markComplete,
    markLearnRead,
    isLearnRead,
    getLearnReadSet,
    unlockAchievement,
    setLanguage,
    setDifficulty,
    reset,
    onChange,
    getCompletedArray,
    getDeviceId,
  };
})();
