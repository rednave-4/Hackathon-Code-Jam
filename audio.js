window.PJ = window.PJ || {};
PJ.Audio = (function () {
  const KEY = "pj_audio_muted_v6";
  const VOL = 0.4;
  const SRC = "bg-entrance.mp3";
  let muted = false, unlocked = false, bgm = null, uiBound = false, srcKey = null;
  let sfxCtx = null, sfxGain = null;
  function readMuted(){ try { return localStorage.getItem(KEY)==="1"; } catch(e){ return false; } }
  function writeMuted(v){ try { localStorage.setItem(KEY, v?"1":"0"); } catch(e){} }
  function ensureBgm(){
    if (bgm) return bgm;
    bgm = new Audio(); bgm.loop = true; bgm.preload = "auto";
    bgm.volume = muted ? 0 : VOL;
    bgm.addEventListener("error", function(){ console.warn("[PJ.Audio] missing bg-entrance.mp3"); });
    return bgm;
  }
  function ensureSfx(){
    if (sfxCtx) return sfxCtx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      sfxCtx = new AC();
      sfxGain = sfxCtx.createGain(); sfxGain.gain.value = 0.55;
      sfxGain.connect(sfxCtx.destination);
    } catch(e){ sfxCtx = null; }
    return sfxCtx;
  }
  function playBgm(){
    if (!unlocked || muted) return;
    const el = ensureBgm();
    if (srcKey !== SRC) { srcKey = SRC; el.src = SRC; el.load(); }
    el.volume = VOL;
    if (el.paused) { const p = el.play(); if (p && p.catch) p.catch(function(){}); }
  }
  function stopBgm(){ if (bgm) try { bgm.pause(); } catch(e){} }
  function playAmbient(){ if (unlocked) playBgm(); }
  function tone(f,d,type,peak){
    if (muted||!unlocked) return;
    const c = ensureSfx(); if (!c||!sfxGain) return;
    if (c.state==="suspended") c.resume().catch(function(){});
    try {
      const o=c.createOscillator(), g=c.createGain();
      o.type=type||"sine"; o.frequency.value=f; g.gain.value=0.0001;
      o.connect(g); g.connect(sfxGain);
      const t=c.currentTime;
      g.gain.linearRampToValueAtTime(peak||0.3, t+0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t+Math.max(0.05,d));
      o.start(t); o.stop(t+d+0.04);
    } catch(e){}
  }
  function playSfx(n){
    if (muted||!unlocked) return;
    if (n==="click") tone(700,0.06,"sine",0.28);
    else if (n==="open"){ tone(420,0.08,"triangle",0.3); setTimeout(function(){tone(560,0.08,"sine",0.24);},40); }
    else if (n==="whoosh") tone(280,0.11,"triangle",0.2);
    else if (n==="success"||n==="complete"){ tone(523,0.08,"sine",0.3); setTimeout(function(){tone(659,0.1,"sine",0.26);},60); }
    else tone(520,0.06,"sine",0.22);
  }
  function unlock(){
    unlocked=true; ensureBgm(); ensureSfx();
    if (sfxCtx&&sfxCtx.state==="suspended") sfxCtx.resume().catch(function(){});
    if (!muted) playBgm();
    return Promise.resolve(true);
  }
  function setMuted(v){
    muted=!!v; writeMuted(muted);
    if (bgm) bgm.volume = muted?0:VOL;
    if (muted) stopBgm(); else if (unlocked) playBgm();
    sync();
  }
  function toggleMute(){ unlock().then(function(){ setMuted(!muted); if(!muted) playSfx("click"); }); }
  function sync(){
    document.querySelectorAll("[data-audio-mute]").forEach(function(btn){
      btn.classList.toggle("is-muted", muted);
      btn.setAttribute("aria-pressed", muted?"true":"false");
      btn.title = muted ? "Nyalakan suara" : "Matikan suara";
    });
  }
  function bind(){
    if (uiBound) return; uiBound=true;
    function first(){ unlock(); }
    document.addEventListener("pointerdown", first, {once:true, passive:true});
    document.addEventListener("keydown", first, {once:true});
    document.addEventListener("click", function(e){
      if (!e.target.closest("[data-audio-mute]")) return;
      e.preventDefault(); e.stopPropagation(); toggleMute();
    });
  }
  function init(){
    muted=readMuted(); bind(); sync();
    try { const el=ensureBgm(); el.src=SRC; srcKey=SRC; el.load(); } catch(e){}
    console.log("[PJ.Audio] v6 ready");
  }
  return {init:init,unlock:unlock,playAmbient:playAmbient,playSfx:playSfx,setMuted:setMuted,toggleMute:toggleMute,isMuted:function(){return muted;},stopAmbient:stopBgm};
})();
