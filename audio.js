/* PERJUANGAN — audio.js v4
   Fix: same MP3 file does NOT restart when switching screens.
*/
window.PJ = window.PJ || {};
PJ.Audio = (function () {
  const STORAGE_KEY = "pj_audio_muted_v4";
  const BGM_VOLUME = 0.38;
  const SFX_VOLUME = 0.55;
  const TRACKS = {
    // Same file on purpose: switching screens must NOT restart music.
    // To use different tracks later, set unique paths AND keep the src-key check in playBgm.
    entrance: "bg-entrance.mp3",
    map: "bg-entrance.mp3",
    learn: "bg-entrance.mp3",
  };

  let muted = false;
  let unlocked = false;
  let desiredName = "entrance";
  let currentSrcKey = null; // resolved track path currently loaded
  let bgm = null;
  let uiBound = false;
  let sfxCtx = null;
  let sfxGain = null;

  function readMuted() {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch (e) { return false; }
  }
  function writeMuted(v) {
    try { localStorage.setItem(STORAGE_KEY, v ? "1" : "0"); } catch (e) {}
  }

  function trackKey(name) {
    return TRACKS[name] || TRACKS.entrance;
  }

  function ensureBgm() {
    if (bgm) return bgm;
    bgm = new Audio();
    bgm.loop = true;
    bgm.preload = "auto";
    bgm.volume = muted ? 0 : BGM_VOLUME;
    bgm.addEventListener("error", function () {
      console.warn("[PJ.Audio] MP3 load error — pastikan bg-entrance.mp3 / bg-map.mp3 di root.");
    });
    return bgm;
  }

  function ensureSfx() {
    if (sfxCtx) return sfxCtx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      sfxCtx = new AC();
      sfxGain = sfxCtx.createGain();
      sfxGain.gain.value = SFX_VOLUME;
      sfxGain.connect(sfxCtx.destination);
    } catch (e) { sfxCtx = null; }
    return sfxCtx;
  }

  function resumeSfx() {
    const c = ensureSfx();
    if (c && c.state === "suspended") return c.resume().catch(function () {});
    return Promise.resolve();
  }

  /** Play ambient without restarting if the same file is already playing. */
  function playBgm(name) {
    desiredName = name || desiredName;
    if (!unlocked || muted) return;

    const key = trackKey(desiredName);
    const el = ensureBgm();

    // Same file already loaded — just ensure playing, do NOT reset currentTime
    if (currentSrcKey === key) {
      el.volume = BGM_VOLUME;
      if (el.paused) {
        const p = el.play();
        if (p && p.catch) p.catch(function () {});
      }
      return;
    }

    // Different file — switch track
    currentSrcKey = key;
    el.src = key;
    el.load();
    el.volume = BGM_VOLUME;
    const p = el.play();
    if (p && p.catch) p.catch(function () {});
  }

  function stopBgm() {
    if (!bgm) return;
    try {
      bgm.pause();
      // do not zero currentTime on mute — optional; keep position for unmute continuity
    } catch (e) {}
  }

  function playAmbient(name) {
    desiredName = name;
    if (!unlocked) return;
    playBgm(name);
  }

  function tone(freq, dur, type, peak) {
    if (muted || !unlocked) return;
    const c = ensureSfx();
    if (!c || !sfxGain) return;
    resumeSfx();
    try {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      g.gain.value = 0.0001;
      osc.connect(g);
      g.connect(sfxGain);
      const t = c.currentTime;
      g.gain.linearRampToValueAtTime(peak == null ? 0.3 : peak, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.06, dur));
      osc.start(t);
      osc.stop(t + dur + 0.05);
    } catch (e) {}
  }

  function playSfx(name) {
    if (muted || !unlocked) return;
    if (name === "click") tone(660, 0.07, "sine", 0.28);
    else if (name === "open") {
      tone(392, 0.1, "triangle", 0.3);
      setTimeout(function () { tone(523, 0.1, "sine", 0.25); }, 50);
    } else if (name === "success" || name === "complete") {
      tone(523, 0.1, "sine", 0.32);
      setTimeout(function () { tone(659, 0.12, "sine", 0.28); }, 80);
      setTimeout(function () { tone(784, 0.16, "triangle", 0.24); }, 160);
    } else if (name === "whoosh") tone(300, 0.14, "triangle", 0.22);
    else tone(520, 0.07, "sine", 0.25);
  }

  function unlock() {
    unlocked = true;
    ensureBgm();
    ensureSfx();
    resumeSfx();
    if (!muted) playBgm(desiredName || "entrance");
    return Promise.resolve(true);
  }

  function setMuted(v) {
    muted = !!v;
    writeMuted(muted);
    if (bgm) bgm.volume = muted ? 0 : BGM_VOLUME;
    if (muted) stopBgm();
    else if (unlocked) playBgm(desiredName || "entrance");
    syncMuteUI();
  }

  function toggleMute() {
    unlock().then(function () {
      setMuted(!muted);
      if (!muted) playSfx("click");
    });
  }

  function isMuted() { return muted; }

  function syncMuteUI() {
    document.querySelectorAll("[data-audio-mute]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", muted ? "true" : "false");
      btn.classList.toggle("is-muted", muted);
      btn.title = muted ? "Unmute" : "Mute";
    });
  }

  function bindUI() {
    if (uiBound) return;
    uiBound = true;
    function first() { unlock(); }
    document.addEventListener("pointerdown", first, { once: true, passive: true });
    document.addEventListener("keydown", first, { once: true });
    document.addEventListener("click", function (e) {
      if (!e.target.closest("[data-audio-mute]")) return;
      e.preventDefault();
      toggleMute();
    });
  }

  function init() {
    muted = readMuted();
    bindUI();
    syncMuteUI();
    desiredName = "entrance";
    try {
      const el = ensureBgm();
      el.src = TRACKS.entrance;
      currentSrcKey = TRACKS.entrance;
      el.load();
    } catch (e) {}
    console.log("[PJ.Audio] v4 ready (no restart on same track)");
  }

  return {
    init: init,
    unlock: unlock,
    playAmbient: playAmbient,
    playSfx: playSfx,
    setMuted: setMuted,
    toggleMute: toggleMute,
    isMuted: isMuted,
    stopAmbient: stopBgm,
  };
})();
