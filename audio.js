/* PERJUANGAN — audio.js v3 flat paths (root MP3) */
window.PJ = window.PJ || {};
PJ.Audio = (function () {
  const STORAGE_KEY = "pj_audio_muted_v3";
  const BGM_VOLUME = 0.38;
  const SFX_VOLUME = 0.55;
  const TRACKS = {
    entrance: "bg-entrance.mp3",
    map: "bg-map.mp3",
    learn: "bg-map.mp3",
  };
  let muted = false, unlocked = false, currentName = null, desiredName = "entrance";
  let bgm = null, uiBound = false, sfxCtx = null, sfxGain = null;

  function readMuted() {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch (e) { return false; }
  }
  function writeMuted(v) {
    try { localStorage.setItem(STORAGE_KEY, v ? "1" : "0"); } catch (e) {}
  }
  function ensureBgm() {
    if (bgm) return bgm;
    bgm = new Audio();
    bgm.loop = true;
    bgm.preload = "auto";
    bgm.volume = muted ? 0 : BGM_VOLUME;
    bgm.addEventListener("error", function () {
      console.warn("[PJ.Audio] Gagal load MP3. Pastikan bg-entrance.mp3 & bg-map.mp3 di root project.");
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
  function playBgm(name) {
    desiredName = name || desiredName;
    if (!unlocked || muted) return;
    const src = TRACKS[desiredName] || TRACKS.entrance;
    const el = ensureBgm();
    const need = currentName !== desiredName;
    if (need) {
      currentName = desiredName;
      el.src = src;
      el.load();
    }
    el.volume = BGM_VOLUME;
    const p = el.play();
    if (p && p.catch) p.catch(function () {});
  }
  function stopBgm() {
    if (!bgm) return;
    try { bgm.pause(); bgm.currentTime = 0; } catch (e) {}
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
      osc.connect(g); g.connect(sfxGain);
      const t = c.currentTime;
      g.gain.linearRampToValueAtTime(peak == null ? 0.3 : peak, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.06, dur));
      osc.start(t); osc.stop(t + dur + 0.05);
    } catch (e) {}
  }
  function playSfx(name) {
    if (muted || !unlocked) return;
    if (name === "click") tone(660, 0.07, "sine", 0.28);
    else if (name === "open") { tone(392, 0.1, "triangle", 0.3); setTimeout(function () { tone(523, 0.1, "sine", 0.25); }, 50); }
    else if (name === "success" || name === "complete") {
      tone(523, 0.1, "sine", 0.32);
      setTimeout(function () { tone(659, 0.12, "sine", 0.28); }, 80);
      setTimeout(function () { tone(784, 0.16, "triangle", 0.24); }, 160);
    } else if (name === "whoosh") tone(300, 0.14, "triangle", 0.22);
    else tone(520, 0.07, "sine", 0.25);
  }
  function unlock() {
    unlocked = true;
    ensureBgm(); ensureSfx(); resumeSfx();
    if (!muted) playBgm(desiredName || "entrance");
    return Promise.resolve(true);
  }
  function setMuted(v) {
    muted = !!v; writeMuted(muted);
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
    try { const el = ensureBgm(); el.src = TRACKS.entrance; el.load(); } catch (e) {}
    console.log("[PJ.Audio] flat MP3 ready");
  }
  return { init: init, unlock: unlock, playAmbient: playAmbient, playSfx: playSfx,
    setMuted: setMuted, toggleMute: toggleMute, isMuted: isMuted, stopAmbient: stopBgm };
})();
