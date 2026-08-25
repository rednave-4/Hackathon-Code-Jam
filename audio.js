/* ==========================================================================
   PERJUANGAN — audio.js
   Backsound + SFX + mute. Safe: never throws into app flow.
   Uses Web Audio API (no external files required) so demo always works offline.
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.Audio = (function () {
  const STORAGE_KEY = "pj_audio_muted";
  const MASTER = 0.35;
  const AMBIENT_GAIN = 0.22;
  const SFX_GAIN = 0.45;

  let ctx = null;
  let masterGain = null;
  let ambientGain = null;
  let sfxGain = null;
  let muted = false;
  let unlocked = false;
  let ambientNodes = [];
  let ambientName = null;
  let uiBound = false;

  function readMuted() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function writeMuted(v) {
    try {
      localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch (e) {}
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
      ambientGain.gain.value = AMBIENT_GAIN;
      ambientGain.connect(masterGain);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = SFX_GAIN;
      sfxGain.connect(masterGain);
    } catch (e) {
      console.warn("[PJ.Audio] context failed", e);
      ctx = null;
    }
    return ctx;
  }

  function resume() {
    const c = ensureCtx();
    if (!c) return Promise.resolve();
    if (c.state === "suspended") {
      return c.resume().catch(function () {});
    }
    return Promise.resolve();
  }

  function unlock() {
    if (unlocked) return resume();
    unlocked = true;
    return resume().then(function () {
      // silent tick — some browsers need a buffer start after gesture
      try {
        const c = ensureCtx();
        if (!c || !sfxGain) return;
        const o = c.createOscillator();
        const g = c.createGain();
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(sfxGain);
        o.start();
        o.stop(c.currentTime + 0.03);
      } catch (e) {}
    });
  }

  function stopAmbient() {
    ambientNodes.forEach(function (n) {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch (e) {}
    });
    ambientNodes = [];
    ambientName = null;
  }

  function startDrone(freq, type, gainVal, detune) {
    const c = ensureCtx();
    if (!c || !ambientGain) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    const filter = c.createBiquadFilter();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    if (detune) osc.detune.value = detune;
    filter.type = "lowpass";
    filter.frequency.value = 600;
    g.gain.value = 0;
    osc.connect(filter);
    filter.connect(g);
    g.connect(ambientGain);
    const now = c.currentTime;
    g.gain.linearRampToValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 1.8);
    osc.start(now);
    ambientNodes.push(osc, g, filter);
  }

  /** Cinematic low pad — entrance */
  function ambientEntrance() {
    stopAmbient();
    ambientName = "entrance";
    if (muted || !ensureCtx()) return;
    startDrone(55, "sine", 0.35, 0);
    startDrone(82.5, "sine", 0.18, 6);
    startDrone(110, "triangle", 0.08, -4);
  }

  /** Slightly brighter pad — map / learn */
  function ambientMap() {
    stopAmbient();
    ambientName = "map";
    if (muted || !ensureCtx()) return;
    startDrone(49, "sine", 0.28, 0);
    startDrone(73.5, "sine", 0.14, 3);
    startDrone(98, "triangle", 0.06, -2);
  }

  function playAmbient(name) {
    if (!unlocked && !muted) {
      // wait until unlock; remember desired bed
      ambientName = name;
      return;
    }
    if (name === ambientName && ambientNodes.length) return;
    if (name === "entrance") ambientEntrance();
    else if (name === "map" || name === "learn") ambientMap();
    else stopAmbient();
  }

  function tone(freq, dur, type, peak) {
    const c = ensureCtx();
    if (!c || !sfxGain || muted) return;
    try {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      g.gain.value = 0;
      osc.connect(g);
      g.connect(sfxGain);
      const t = c.currentTime;
      const p = peak == null ? 0.35 : peak;
      g.gain.linearRampToValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(p, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch (e) {
      console.warn("[PJ.Audio] sfx", e);
    }
  }

  function playSfx(name) {
    if (muted || !unlocked) return;
    resume();
    switch (name) {
      case "click":
        tone(520, 0.07, "sine", 0.2);
        break;
      case "open":
        tone(220, 0.12, "triangle", 0.22);
        setTimeout(function () { tone(330, 0.14, "sine", 0.18); }, 40);
        break;
      case "success":
      case "complete":
        tone(392, 0.12, "sine", 0.28);
        setTimeout(function () { tone(523, 0.16, "sine", 0.26); }, 90);
        setTimeout(function () { tone(659, 0.22, "triangle", 0.2); }, 180);
        break;
      case "whoosh":
        tone(180, 0.2, "sawtooth", 0.08);
        setTimeout(function () { tone(120, 0.25, "sine", 0.12); }, 50);
        break;
      case "achieve":
        tone(523, 0.1, "sine", 0.25);
        setTimeout(function () { tone(784, 0.2, "triangle", 0.22); }, 100);
        break;
      default:
        tone(440, 0.08, "sine", 0.15);
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
        masterGain.gain.linearRampToValueAtTime(muted ? 0 : MASTER, t + 0.15);
      } catch (e) {
        masterGain.gain.value = muted ? 0 : MASTER;
      }
    }
    if (muted) {
      stopAmbient();
    } else if (unlocked && ambientName) {
      const keep = ambientName;
      ambientName = null;
      playAmbient(keep);
    }
    syncMuteUI();
  }

  function toggleMute() {
    unlock();
    setMuted(!muted);
    playSfx("click");
  }

  function isMuted() {
    return muted;
  }

  function syncMuteUI() {
    document.querySelectorAll("[data-audio-mute]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", muted ? "true" : "false");
      btn.classList.toggle("is-muted", muted);
      const label = btn.querySelector("[data-audio-mute-label]");
      if (label) {
        label.textContent = muted ? "Unmute" : "Mute";
      }
      btn.title = muted ? "Unmute" : "Mute";
    });
  }

  function bindUI() {
    if (uiBound) return;
    uiBound = true;
    document.addEventListener(
      "pointerdown",
      function once() {
        unlock().then(function () {
          if (!muted && ambientName) {
            const keep = ambientName;
            ambientName = null;
            playAmbient(keep);
          } else if (!muted && !ambientName) {
            playAmbient("entrance");
          }
        });
      },
      { once: true, passive: true }
    );
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-audio-mute]");
      if (btn) {
        e.preventDefault();
        toggleMute();
      }
    });
  }

  function init() {
    muted = readMuted();
    ensureCtx();
    bindUI();
    syncMuteUI();
    // Prefer starting entrance bed after unlock; mark intent now
    ambientName = "entrance";
    console.log("[PJ.Audio] ready — muted:", muted);
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
