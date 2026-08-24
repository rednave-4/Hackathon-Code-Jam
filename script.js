/* PERJUANGAN — Cinematic scroll engine + flag + i18n */

(function () {
  "use strict";

  /* ---------- i18n ---------- */
  const STR = {
    id: {
      hero_title: "MERDEKA",
      intro_p: "Sebuah perjalanan mengingat satu tanah air, satu bangsa, dan satu bahasa — dari ikrar pemuda hingga pengakuan kedaulatan.",
      tag1: "Sumpah Pemuda",
      tag2: "Proklamasi 1945",
      tag3: "Hari Pahlawan",
      panel1_h2: "Proklamasi adalah titik lahir.",
      panel1_p: "Pada 17 Agustus 1945 di Pegangsaan Timur 56, Soekarno dan Hatta menyatakan kemerdekaan. Naskah singkat itu membuka jalan panjang mempertahankan Republik.",
      fact1: "Proklamasi dibacakan",
      fact2: "Republik lahir",
      panel2_h2: "Kemerdekaan harus dipertahankan.",
      panel2_p: "Dari Surabaya hingga gerilya di pelosok, rakyat dan tentara menjawab agresi dengan keteguhan. Diplomasi dan senjata berjalan beriringan hingga 1949.",
      notes_btn: "Buka catatan perjuangan",
      notes_title: "Garis waktu singkat",
      n1: "Sumpah Pemuda: satu tanah air, satu bangsa, satu bahasa.",
      n2: "Rengasdengklok: desakan golongan muda.",
      n3: "Proklamasi kemerdekaan.",
      n4: "Pertempuran Surabaya · Hari Pahlawan.",
      n5: "Agresi Belanda & perang gerilya hingga pengakuan kedaulatan.",
      mengerti: "Mengerti",
    },
    en: {
      hero_title: "MERDEKA",
      intro_p: "A journey of remembrance — one homeland, one nation, one language — from the youth pledge to the recognition of sovereignty.",
      tag1: "Youth Pledge",
      tag2: "1945 Proclamation",
      tag3: "Heroes' Day",
      panel1_h2: "The proclamation was the birth.",
      panel1_p: "On 17 August 1945 at Pegangsaan Timur 56, Soekarno and Hatta declared independence. That short text opened a long road to defend the Republic.",
      fact1: "Proclamation read",
      fact2: "Republic born",
      panel2_h2: "Independence had to be defended.",
      panel2_p: "From Surabaya to guerrilla war in the hinterland, the people and army met aggression with resolve. Diplomacy and arms ran together until 1949.",
      notes_btn: "Open struggle notes",
      notes_title: "Brief timeline",
      n1: "Youth Pledge: one homeland, one nation, one language.",
      n2: "Rengasdengklok: pressure from the young group.",
      n3: "Proclamation of independence.",
      n4: "Battle of Surabaya · Heroes' Day.",
      n5: "Dutch aggression & guerrilla war until sovereignty was recognized.",
      mengerti: "Got it",
    },
  };

  let lang = "id";

  function t(key) {
    return (STR[lang] && STR[lang][key]) || (STR.en && STR.en[key]) || key;
  }

  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    const label = document.getElementById("langLabel");
    if (label) label.textContent = lang.toUpperCase();
    buildSightCards();
  }

  /* ---------- Mission cards data ---------- */
  const MISSIONS = [
    {
      kicker: { id: "1928", en: "1928" },
      title: { id: "Sumpah Pemuda", en: "Youth Pledge" },
      desc: {
        id: "Ikrar satu tanah air, satu bangsa, satu bahasa Indonesia.",
        en: "The pledge of one homeland, one nation, one Indonesian language.",
      },
      icon: "①",
    },
    {
      kicker: { id: "16 Agu 1945", en: "16 Aug 1945" },
      title: { id: "Rengasdengklok", en: "Rengasdengklok" },
      desc: {
        id: "Golongan muda mendesak proklamasi tanpa penundaan.",
        en: "Young activists pressed for an immediate proclamation.",
      },
      icon: "☾",
    },
    {
      kicker: { id: "17 Agu 1945", en: "17 Aug 1945" },
      title: { id: "Proklamasi", en: "Proclamation" },
      desc: {
        id: "Soekarno–Hatta membacakan naskah di Pegangsaan Timur 56.",
        en: "Soekarno–Hatta read the text at Pegangsaan Timur 56.",
      },
      icon: "📜",
    },
    {
      kicker: { id: "10 Nov 1945", en: "10 Nov 1945" },
      title: { id: "Pertempuran Surabaya", en: "Battle of Surabaya" },
      desc: {
        id: "Perlawanan rakyat yang dikenang sebagai Hari Pahlawan.",
        en: "Popular resistance remembered as Heroes' Day.",
      },
      icon: "⚔",
    },
    {
      kicker: { id: "1947–1949", en: "1947–1949" },
      title: { id: "Agresi & Gerilya", en: "Aggression & Guerrilla" },
      desc: {
        id: "Mempertahankan kedaulatan hingga pengakuan internasional.",
        en: "Defending sovereignty until international recognition.",
      },
      icon: "⛰",
    },
  ];

  /* ---------- Flag cloth (simplified from PERJUANGAN) ---------- */
  function FlagCloth(canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let dpr = 1;
    let cols = 14;
    let rows = 10;
    let W = 360;
    let H = 240;
    let viewW = 480;
    let viewH = 360;
    let running = false;
    let rafId = null;
    let startTime = 0;
    const RED = { r: 200, g: 16, b: 46 };
    const WHITE = { r: 245, g: 241, b: 232 };

    function configure() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      let pw = 0;
      let ph = 0;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        pw = rect.width;
        ph = rect.height;
      }
      if (pw < 40 || ph < 40) {
        pw = Math.min(window.innerWidth * 0.5, 420);
        ph = pw * 0.72;
      }
      viewW = pw;
      viewH = ph;
      canvas.width = Math.max(1, Math.round(pw * dpr));
      canvas.height = Math.max(1, Math.round(ph * dpr));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const maxW = Math.min(pw * 0.88, ph * 0.88 * 1.5, 400);
      W = Math.max(140, maxW);
      H = W * (2 / 3);
      cols = window.innerWidth < 720 ? 11 : 14;
      rows = 10;
    }

    function shade(base, factor) {
      const f = Math.max(-1, Math.min(1, factor));
      const mix = f >= 0 ? 255 : 0;
      const amt = Math.abs(f) * (f >= 0 ? 0.22 : 0.3);
      return (
        "rgb(" +
        Math.round(base.r + (mix - base.r) * amt) +
        "," +
        Math.round(base.g + (mix - base.g) * amt) +
        "," +
        Math.round(base.b + (mix - base.b) * amt) +
        ")"
      );
    }

    function render(now) {
      if (!running) return;
      const t = ((now || performance.now()) - startTime) / 1000;
      ctx.clearRect(0, 0, viewW, viewH);
      const anchorX = (viewW - W) * 0.5 + 6;
      const anchorY = (viewH - H) * 0.4;
      const sway = Math.sin(t * 0.5) * 3;
      ctx.save();
      ctx.translate(anchorX + sway * 0.1, anchorY);
      ctx.save();
      ctx.translate(8, H * 0.12);
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath();
      ctx.ellipse(W * 0.45, H * 0.5, W * 0.36, H * 0.12, 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      const amp1 = H * 0.048;
      const amp2 = H * 0.022;
      const colOffset = [];
      const colScale = [];
      for (let i = 0; i <= cols; i++) {
        const dist = i / cols;
        const phase1 = i * 0.5 - t * 1.65;
        const phase2 = i * 1.1 - t * 2.4 + 1.0;
        colOffset[i] = (Math.sin(phase1) * amp1 + Math.sin(phase2) * amp2) * dist;
        colScale[i] = 1 - 0.035 * dist * (1 - Math.cos(phase1)) * 0.5;
      }
      const verts = [];
      for (let j = 0; j <= rows; j++) {
        const row = [];
        for (let i = 0; i <= cols; i++) {
          row.push({
            x: (i / cols) * W * colScale[i],
            y: (j / rows) * H + colOffset[i],
          });
        }
        verts.push(row);
      }
      const half = rows / 2;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const p0 = verts[j][i];
          const p1 = verts[j][i + 1];
          const p2 = verts[j + 1][i + 1];
          const p3 = verts[j + 1][i];
          const base = j < half ? RED : WHITE;
          const slope =
            (colOffset[Math.min(i + 1, cols)] - colOffset[i]) / (amp1 + amp2 + 0.001);
          ctx.fillStyle = shade(base, -slope * 0.75);
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.fillStyle = "#9a7a3a";
      ctx.fillRect(-5, -H * 0.08, 5, H * 1.16);
      ctx.fillStyle = "#e8c468";
      ctx.beginPath();
      ctx.arc(-2.5, -H * 0.08, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      rafId = requestAnimationFrame(render);
    }

    function start() {
      if (running) return;
      running = true;
      startTime = performance.now();
      configure();
      rafId = requestAnimationFrame(render);
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }
    configure();
    window.addEventListener("resize", configure);
    return { start, stop, configure };
  }

  /* ---------- Scroll engine ---------- */
  const section = document.querySelector(".cinema-scroll");
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sightsTrack = document.getElementById("sightsTrack");
  const sightsControls = document.querySelector(".sights-controls");
  const sightPrev = document.querySelector(".sight-prev");
  const sightNext = document.querySelector(".sight-next");

  let targetMouseX = 0;
  let targetMouseY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetScroll = 0;
  let smoothScroll = 0;
  let initialized = false;
  let rafPending = false;
  let sightCards = [];
  let originalSightCount = MISSIONS.length;
  let activeSight = originalSightCount;

  function clamp(v, min = 0, max = 1) {
    return Math.min(max, Math.max(min, v));
  }
  function smoothstep(e0, e1, v) {
    const x = clamp((v - e0) / (e1 - e0));
    return x * x * (3 - 2 * x);
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function segmentInOut(s, a, b, c, d) {
    const enter = smoothstep(a, b, s);
    const exit = smoothstep(c, d, s);
    return { enter, exit, active: enter * (1 - exit) };
  }
  function getScrollDistance() {
    return clamp(
      -section.getBoundingClientRect().top,
      0,
      section.offsetHeight - window.innerHeight
    );
  }

  function field(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.en || obj.id || "";
  }

  function buildSightCards() {
    if (!sightsTrack) return;
    const originals = MISSIONS.map((m, i) => {
      const article = document.createElement("article");
      article.className = "sight-card";
      article.tabIndex = 0;
      article.setAttribute("role", "button");
      article.setAttribute(
        "aria-label",
        "Open " + field(m.title) + " card"
      );
      article.innerHTML =
        '<span class="sight-kicker">' +
        field(m.kicker) +
        '</span><span class="sight-pin" aria-hidden="true">' +
        m.icon +
        "</span><h3>" +
        field(m.title) +
        "</h3><p>" +
        field(m.desc) +
        "</p>";
      return article;
    });

    sightsTrack.replaceChildren();
    for (let setIndex = 0; setIndex < 3; setIndex++) {
      originals.forEach((card, cardIndex) => {
        const clone = card.cloneNode(true);
        clone.dataset.sightIndex = String(setIndex * originalSightCount + cardIndex);
        sightsTrack.appendChild(clone);
      });
    }
    sightCards = Array.from(sightsTrack.querySelectorAll(".sight-card"));
    activeSight = originalSightCount;
    sightCards.forEach((card) => {
      card.addEventListener("click", () => selectSightCard(card));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectSightCard(card);
        }
      });
    });
    sightsTrack.addEventListener("transitionend", normalizeSightSlider);
    updateSightSlider();
  }

  function updateSightSlider() {
    if (!sightCards.length) return;
    const cardWidth = sightCards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(sightsTrack).columnGap || "0") || 0;
    root.style.setProperty("--sights-shift", `${-(cardWidth + gap) * activeSight}px`);
    sightCards.forEach((c) => {
      c.classList.toggle("is-active", Number(c.dataset.sightIndex) === activeSight);
    });
  }

  function moveSightSlider(dir) {
    activeSight += dir;
    updateSightSlider();
  }

  function selectSightCard(card) {
    const i = Number(card.dataset.sightIndex);
    if (Number.isFinite(i)) {
      activeSight = i;
      updateSightSlider();
    }
  }

  function jumpSightSlider(i) {
    sightsTrack.classList.add("is-jumping");
    activeSight = i;
    updateSightSlider();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        sightsTrack.classList.remove("is-jumping");
      });
    });
  }

  function normalizeSightSlider() {
    if (activeSight >= originalSightCount * 2) {
      jumpSightSlider(activeSight - originalSightCount);
    } else if (activeSight < originalSightCount) {
      jumpSightSlider(activeSight + originalSightCount);
    }
  }

  function update() {
    rafPending = false;
    targetScroll = getScrollDistance();
    if (!initialized || reduceMotion.matches) {
      smoothScroll = targetScroll;
      initialized = true;
    } else {
      smoothScroll = lerp(smoothScroll, targetScroll, 0.14);
    }
    if (Math.abs(smoothScroll - targetScroll) < 0.08) smoothScroll = targetScroll;

    mouseX = lerp(mouseX, targetMouseX, 0.12);
    mouseY = lerp(mouseY, targetMouseY, 0.12);

    const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
    const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
    const progress = clamp(smoothScroll / 2700);
    const introExit = smoothstep(90, 650, smoothScroll);
    const sightsEnterRaw = smoothstep(2760, 3560, smoothScroll);
    const sightsEnter = Math.pow(sightsEnterRaw, 1.55);
    const sightsControlsEnter = smoothstep(3360, 3660, smoothScroll);
    const blurActive = clamp(frame2.active + frame3.active);
    const panel2Opacity = frame2.active * (1 - frame2.exit);
    const panel3Opacity = frame3.active * (1 - frame3.exit);
    const backScale = 1 + progress * 0.12 + frame2.enter * 0.08 + frame3.enter * 0.06;
    const sharedHeroY = progress * -60;

    const sightsScreenTop =
      Math.min(220, Math.max(112, window.innerHeight * 0.19)) - 50;
    const sightsParentTop =
      window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale;

    const mx = reduceMotion.matches ? 0 : mouseX;
    const my = reduceMotion.matches ? 0 : mouseY;

    root.style.setProperty("--mx", mx.toFixed(4));
    root.style.setProperty("--my", my.toFixed(4));
    root.style.setProperty("--back-opacity", String(1 - frame2.active * 0.08));
    root.style.setProperty("--back-x", `${mx * -10}px`);
    root.style.setProperty("--back-y", `${my * -4}px`);
    root.style.setProperty("--back-scale", String(backScale));
    root.style.setProperty("--blur-px", `${blurActive * 10}px`);
    root.style.setProperty("--back-brightness", String(1 - blurActive * 0.2));
    root.style.setProperty("--shade-opacity", "1");
    root.style.setProperty("--shade-z", frame2.active > 0.02 ? "2" : "0");
    root.style.setProperty("--shade-top-alpha", String(blurActive * 0.42));
    root.style.setProperty("--shade-mid-alpha", String(blurActive * 0.38));
    root.style.setProperty("--shade-bottom-alpha", String(blurActive * 0.48));

    root.style.setProperty("--title-y", `${introExit * -200}px`);
    root.style.setProperty("--title-scale", String(1 - introExit * 0.08));
    root.style.setProperty("--title-opacity", String(1 - introExit));

    root.style.setProperty("--flag-y", `${introExit * -120 + sharedHeroY * 0.4}px`);
    root.style.setProperty("--flag-scale", String(1 - introExit * 0.15 + frame2.enter * 0.05));
    root.style.setProperty("--flag-opacity", String(1 - introExit * 0.85));

    root.style.setProperty("--intro-copy-y", `${introExit * 80}px`);
    root.style.setProperty("--intro-copy-opacity", String(1 - introExit));

    root.style.setProperty("--panel2-opacity", String(panel2Opacity));
    root.style.setProperty(
      "--panel2-y",
      `calc(-50% + ${-frame2.exit * 80 + (1 - frame2.enter) * 50}px)`
    );
    root.style.setProperty("--panel3-opacity", String(panel3Opacity));
    root.style.setProperty(
      "--panel3-y",
      `calc(-50% + ${-frame3.exit * 80 + (1 - frame3.enter) * 50}px)`
    );

    root.style.setProperty("--sights-opacity", String(sightsEnter));
    root.style.setProperty("--sights-controls-opacity", String(sightsControlsEnter));
    if (sightsControls) {
      sightsControls.classList.toggle("is-ready", sightsControlsEnter > 0.98);
    }
    root.style.setProperty(
      "--sights-visibility",
      sightsEnter > 0.01 ? "visible" : "hidden"
    );
    root.style.setProperty("--sights-y", "0px");
    root.style.setProperty("--sights-enter-x", `${(1 - sightsEnter) * 420}vw`);
    root.style.setProperty("--sights-scale", String(1 / backScale));
    root.style.setProperty("--sights-top", `${sightsParentTop}px`);
    root.style.setProperty("--sights-screen-top", `${sightsScreenTop}px`);

    if (
      Math.abs(smoothScroll - targetScroll) > 0.08 ||
      Math.abs(mouseX - targetMouseX) > 0.001 ||
      Math.abs(mouseY - targetMouseY) > 0.001
    ) {
      requestTick();
    }
  }

  function requestTick() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(update);
  }

  /* ---------- Embers ---------- */
  function spawnEmbers() {
    const layer = document.getElementById("embers");
    if (!layer || layer.children.length) return;
    for (let i = 0; i < 16; i++) {
      const el = document.createElement("span");
      el.className = "ember";
      el.style.left = Math.random() * 100 + "%";
      el.style.setProperty("--ember-size", 2 + Math.random() * 2.5 + "px");
      el.style.setProperty("--ember-duration", 11 + Math.random() * 12 + "s");
      el.style.setProperty("--ember-delay", -Math.random() * 18 + "s");
      el.style.setProperty(
        "--ember-drift",
        (Math.random() * 10 - 5).toFixed(1) + "vw"
      );
      layer.appendChild(el);
    }
  }

  /* ---------- Modal ---------- */
  function openModal() {
    const m = document.getElementById("notesModal");
    if (m) m.hidden = false;
  }
  function closeModal() {
    const m = document.getElementById("notesModal");
    if (m) m.hidden = true;
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyI18n();
    spawnEmbers();

    const canvas = document.getElementById("flagCanvas");
    let flag = null;
    if (canvas) {
      flag = FlagCloth(canvas);
      flag.start();
    }

    document.getElementById("langBtn")?.addEventListener("click", () => {
      lang = lang === "id" ? "en" : "id";
      applyI18n();
    });

    document.getElementById("notesBtn")?.addEventListener("click", openModal);
    document.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    sightPrev?.addEventListener("click", () => moveSightSlider(-1));
    sightNext?.addEventListener("click", () => moveSightSlider(1));

    window.addEventListener("scroll", () => requestTick(), { passive: true });
    window.addEventListener("resize", () => {
      if (flag) flag.configure();
      updateSightSlider();
      requestTick();
    });
    window.addEventListener(
      "pointermove",
      (e) => {
        targetMouseX = e.clientX / window.innerWidth - 0.5;
        targetMouseY = e.clientY / window.innerHeight - 0.5;
        requestTick();
      },
      { passive: true }
    );

    requestTick();
  });
})();
