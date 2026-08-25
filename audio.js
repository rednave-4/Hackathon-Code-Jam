/* ==========================================================================
   PERJUANGAN — audio.js (v2 audible)
   Web Audio ambient + SFX. Tuned for laptop speakers (mid frequencies).
   ========================================================================== */
window.PJ = window.PJ || {};

PJ.Audio = (function () {
  const STORAGE_KEY = "pj_audio_muted_v2";
  const MASTER = 0.55;
  const AMBIENT_VOL = 0.4;
  const SFX_VOL = 0.7;

  let ctx = null;
  let masterGain = null;
  let ambientGain = null;
  let sfxGain = null;
  let muted = false;
  let unlocked = false;
  let ambientNodes = [];
  let ambientName = null;
  let desiredAmbient = "entrance";
  let uiBound = false;

  function readMuted() {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch (e) { return false; }
  }
  function writeMuted(v) {
    try { localStorage.setItem(STORAGE_KEY, v ? "1" : "0"); } catch (e) {}
  }

  function ensureCtx() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = muted ? 0 : MASTER;
      masterGain.connect(ctx.destination);
      ambientGain = ctx.createGain();
      ambientGain.gain.value = AMBIENT_VOL;
      ambientGain.connect(masterGain);
      sfxGain = ctx.createGain();
      sfxGain.gain.value = SFX_VOL;
      sfxGain.connect(masterGain);
    } catch (e) {
      console.warn("[PJ.Audio] context failed", e);
      ctx = null;
    }
    return ctx;
  }

  function resume() {
    const c = ensureCtx();
    if (!c) return Promise.resolve(false);
    if (c.state === "suspended") {
      return c.resume().then(function () { return true; }).catch(function () { return false; });
    }
    return Promise.resolve(true);
  }

  function unlock() {
    return resume().then(function (ok) {
      if (!ok) return false;
      unlocked = true;
      // Audible chirp so user knows audio works
      if (!muted) {
        try {
          const c = ctx;
          const o = c.createOscillator();
          const g = c.createGain();
          o.type = "sine";
          o.frequency.value = 880;
          g.gain.value = 0.0001;
          o.connect(g);
          g.connect(sfxGain);
          const t = c.currentTime;
          g.gain.linearRampToValueAtTime(0.25, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
          o.start(t);
          o.stop(t + 0.2);
        } catch (e) {}
      }
      // Start desired ambient after unlock
      if (!muted && desiredAmbient) {
        const name = desiredAmbient;
        ambientName = null;
        playAmbient(name);
      }
      return true;
    });
  }

  function stopAmbient() {
    ambientNodes.forEach(function (n) {
      try {
        if (n.gain && n.gain.gain && ctx) {
          n.gain.gain.cancelScheduledValues(ctx.currentTime);
          n.gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        }
        if (n.osc && n.osc.stop) n.osc.stop(ctx ? ctx.currentTime + 0.35 : 0);
      } catch (e) {
        try { if (n.osc && n.osc.disconnect) n.osc.disconnect(); } catch (e2) {}
      }
    });
    ambientNodes = [];
    ambientName = null;
  }

  /** Mid-range pad — audible on laptop speakers (not sub-bass). */
  function startPartial(freq, type, level, delay) {
    const c = ensureCtx();
    if (!c || !ambientGain) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    const filter = c.createBiquadFilter();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    filter.type = "lowpass";
    filter.frequency.value = 2400;
    filter.Q.value = 0.7;
    g.gain.value = 0.0001;
    osc.connect(filter);
    filter.connect(g);
    g.connect(ambientGain);
    const t = c.currentTime + (delay || 0);
    g.gain.linearRampToValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(level, t + 1.2);
    osc.start(t);
    ambientNodes.push({ osc: osc, gain: g, filter: filter });
  }

  function ambientEntrance() {
    stopAmbient();
    ambientName = "entrance";
    desiredAmbient = "entrance";
    if (muted || !ensureCtx()) return;
    // C3–G4 range — clearly audible
    startPartial(130.81, "sine", 0.28, 0);      // C3
    startPartial(196.0, "sine", 0.2, 0.15);     // G3
    startPartial(261.63, "triangle", 0.12, 0.3); // C4
    startPartial(329.63, "sine", 0.08, 0.45);    // E4 soft
  }

  function ambientMap() {
    stopAmbient();
    ambientName = "map";
    desiredAmbient = "map";
    if (muted || !ensureCtx()) return;
    startPartial(146.83, "sine", 0.24, 0);       // D3
    startPartial(220.0, "sine", 0.16, 0.1);      // A3
    startPartial(293.66, "triangle", 0.1, 0.25); // D4
  }

  function playAmbient(name) {
    desiredAmbient = name;
    if (!unlocked) return;
    if (name === ambientName && ambientNodes.length) return;
    if (name === "entrance") ambientEntrance();
    else if (name === "map" || name === "learn") ambientMap();
    else stopAmbient();
  }

  function tone(freq, dur, type, peak) {
    const c = ensureCtx();
    if (!c || !sfxGain || muted || !unlocked) return;
    try {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      g.gain.value = 0.0001;
      osc.connect(g);
      g.connect(sfxGain);
      const t = c.currentTime;
      const p = peak == null ? 0.4 : peak;
      g.gain.linearRampToValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(p, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.05, dur));
      osc.start(t);
      osc.stop(t + dur + 0.05);
    } catch (e) {
      console.warn("[PJ.Audio] sfx fail", e);
    }
  }

  function playSfx(name) {
    if (muted || !unlocked) return;
    resume();
    switch (name) {
      case "click":
        tone(660, 0.08, "sine", 0.35);
        break;
      case "open":
        tone(392, 0.1, "triangle", 0.35);
        setTimeout(function () { tone(523, 0.12, "sine", 0.3); }, 50);
        break;
      case "success":
      case "complete":
        tone(523, 0.1, "sine", 0.4);
        setTimeout(function () { tone(659, 0.12, "sine", 0.35); }, 80);
        setTimeout(function () { tone(784, 0.18, "triangle", 0.3); }, 160);
        break;
      case "whoosh":
        tone(300, 0.15, "triangle", 0.25);
        setTimeout(function () { tone(200, 0.2, "sine", 0.2); }, 40);
        break;
      case "achieve":
        tone(587, 0.1, "sine", 0.35);
        setTimeout(function () { tone(880, 0.2, "triangle", 0.3); }, 90);
        break;
      default:
        tone(520, 0.08, "sine", 0.3);
    }
  }

  function setMuted(v) {
    muted = !!v;
    writeMuted(muted);
    const c = ensureCtx();
    if (masterGain && c) {
      const t = c.currentTime;
      try {
        masterGain.gain.cancelScheduledValues(t);
        masterGain.gain.linearRampToValueAtTime(muted ? 0 : MASTER, t + 0.12);
      } catch (e) {
        masterGain.gain.value = muted ? 0 : MASTER;
      }
    }
    if (muted) stopAmbient();
    else if (unlocked && desiredAmbient) {
      ambientName = null;
      playAmbient(desiredAmbient);
    }
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
      btn.title = muted ? "Unmute (nyalakan suara)" : "Mute (matikan suara)";
      const label = btn.querySelector("[data-audio-mute-label]");
      if (label) label.textContent = muted ? "Unmute" : "Mute";
    });
  }

  function bindUI() {
    if (uiBound) return;
    uiBound = true;
    // Unlock on first real gesture
    function onFirstGesture() {
      unlock();
    }
    document.addEventListener("pointerdown", onFirstGesture, { once: true, passive: true });
    document.addEventListener("keydown", onFirstGesture, { once: true });
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-audio-mute]");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      toggleMute();
    });
  }

  function init() {
    muted = readMuted();
    ensureCtx();
    bindUI();
    syncMuteUI();
    desiredAmbient = "entrance";
    console.log("[PJ.Audio] v2 ready — muted:", muted, "ctx:", !!(window.AudioContext || window.webkitAudioContext));
  }

  return {
    init: init,
    unlock: unlock,
    playAmbient: playAmbient,
    playSfx: playSfx,
    setMuted: setMuted,
    toggleMute: toggleMute,
    isMuted: isMuted,
    stopAmbient: stopAmbient,
  };
})();
