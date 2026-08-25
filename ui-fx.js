/* PERJUANGAN — ui-fx.js
   Atmosphere stars + transition burst (Lanjutkan → mode).
*/
window.PJ = window.PJ || {};
PJ.UIFx = (function () {
  function spawnStars(container, count) {
    if (!container || container.childElementCount) return;
    const n = count || 36;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "atm-star";
      const size = 1 + Math.random() * 2.2;
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = (Math.random() * 5).toFixed(2) + "s";
      s.style.animationDuration = (2.8 + Math.random() * 4).toFixed(2) + "s";
      s.style.opacity = (0.25 + Math.random() * 0.65).toFixed(2);
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  function initAtmosphere() {
    spawnStars(document.getElementById("e1Stars"), 42);
    spawnStars(document.getElementById("e2Stars"), 28);
  }

  /** Burst of gold sparks from a point, then callback */
  function burstFromEvent(e, opts) {
    opts = opts || {};
    const duration = opts.duration || 720;
    const overlay = document.getElementById("fxOverlay");
    if (!overlay) {
      if (opts.onDone) opts.onDone();
      return;
    }

    const x = e && e.clientX != null ? e.clientX : window.innerWidth / 2;
    const y = e && e.clientY != null ? e.clientY : window.innerHeight / 2;

    overlay.innerHTML = "";
    overlay.classList.add("is-active");

    // central flash
    const flash = document.createElement("div");
    flash.className = "fx-flash";
    flash.style.left = x + "px";
    flash.style.top = y + "px";
    overlay.appendChild(flash);

    // ring
    const ring = document.createElement("div");
    ring.className = "fx-ring";
    ring.style.left = x + "px";
    ring.style.top = y + "px";
    overlay.appendChild(ring);

    const count = opts.count || 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "fx-spark";
      const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.4);
      const dist = 80 + Math.random() * 140;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.setProperty("--dx", dx.toFixed(1) + "px");
      p.style.setProperty("--dy", dy.toFixed(1) + "px");
      p.style.animationDuration = (0.45 + Math.random() * 0.35).toFixed(2) + "s";
      p.style.animationDelay = (Math.random() * 0.08).toFixed(2) + "s";
      const sz = 2 + Math.random() * 3.5;
      p.style.width = sz + "px";
      p.style.height = sz + "px";
      overlay.appendChild(p);
    }

    // veil
    const veil = document.createElement("div");
    veil.className = "fx-veil";
    overlay.appendChild(veil);

    window.setTimeout(function () {
      overlay.classList.remove("is-active");
      overlay.innerHTML = "";
      if (opts.onDone) opts.onDone();
    }, duration);
  }

  function playModeEnter() {
    const root = document.getElementById("modeSelect");
    if (!root) return;
    root.classList.remove("mode-enter");
    void root.offsetWidth;
    root.classList.add("mode-enter");
  }

  function init() {
    initAtmosphere();
  }

  return {
    init: init,
    burstFromEvent: burstFromEvent,
    playModeEnter: playModeEnter,
    initAtmosphere: initAtmosphere,
  };
})();
