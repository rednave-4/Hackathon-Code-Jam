window.PJ = window.PJ || {};
PJ.UIFx = (function () {
  function burstFromEvent(e, opts) {
    opts = opts || {};
    const duration = opts.duration != null ? opts.duration : 420;
    const overlay = document.getElementById("fxOverlay");
    if (!overlay) { if (opts.onDone) opts.onDone(); return; }
    const x = (e && e.clientX != null) ? e.clientX : window.innerWidth * 0.5;
    const y = (e && e.clientY != null) ? e.clientY : window.innerHeight * 0.55;
    overlay.innerHTML = "";
    overlay.classList.add("is-active");
    const flash = document.createElement("div");
    flash.className = "fx-flash"; flash.style.left = x+"px"; flash.style.top = y+"px";
    overlay.appendChild(flash);
    const ring = document.createElement("div");
    ring.className = "fx-ring"; ring.style.left = x+"px"; ring.style.top = y+"px";
    overlay.appendChild(ring);
    const count = opts.count || 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "fx-spark";
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 55 + Math.random() * 110;
      p.style.left = x+"px"; p.style.top = y+"px";
      p.style.setProperty("--dx", (Math.cos(angle)*dist).toFixed(1)+"px");
      p.style.setProperty("--dy", (Math.sin(angle)*dist).toFixed(1)+"px");
      p.style.animationDuration = (0.26 + Math.random()*0.2).toFixed(2)+"s";
      const sz = 2 + Math.random()*3;
      p.style.width = sz+"px"; p.style.height = sz+"px";
      overlay.appendChild(p);
    }
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
  return { init: function(){}, burstFromEvent: burstFromEvent, playModeEnter: playModeEnter };
})();
