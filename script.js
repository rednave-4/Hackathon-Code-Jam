// =====================================================
// PERJUANGAN — Road to Merdeka
// Stage 1: Rengasdengklok (Full Interactive Story)
// =====================================================

// -------------------- STAGE LIST (Dashboard) --------------------
const stages = [
  {
    id: 'rengasdengklok',
    number: 'BABAK 01',
    title: 'Rengasdengklok',
    date: '16 Agustus 1945',
    desc: 'Golongan muda menculik Soekarno-Hatta demi mempercepat proklamasi. Keputusan sulit di tengah tekanan Jepang.',
    status: 'available'
  },
  {
    id: 'proklamasi',
    number: 'BABAK 02',
    title: 'Proklamasi Kemerdekaan',
    date: '17 Agustus 1945',
    desc: 'Detik-detik bersejarah di Jalan Pegangsaan Timur 56. Teks proklamasi, bendera, dan tekad satu bangsa.',
    status: 'locked'
  },
  {
    id: 'surabaya',
    number: 'BABAK 03',
    title: 'Pertempuran Surabaya',
    date: '10 November 1945',
    desc: 'Arek-arek Suroboyo mempertahankan kota. Semangat juang yang menggemparkan dunia.',
    status: 'locked'
  },
  {
    id: 'agresi',
    number: 'BABAK 04',
    title: 'Agresi Militer Belanda',
    date: '1947 – 1948',
    desc: 'Perjuangan mempertahankan kemerdekaan di tengah agresi dan diplomasi yang rumit.',
    status: 'locked'
  },
  {
    id: 'sumpah',
    number: 'BABAK 05',
    title: 'Sumpah Pemuda',
    date: '28 Oktober 1928',
    desc: 'Satu nusa, satu bangsa, satu bahasa. Akar semangat persatuan yang menjadi fondasi kemerdekaan.',
    status: 'locked'
  }
];

// -------------------- STORY DATA: RENGASDENGKLOK --------------------
const rengasStory = {
  start: 'scene_01',

  scenes: {
    // ===== SCENE 1: Rapat Malam =====
    scene_01: {
      location: 'Jakarta — Markas Golongan Muda · 15 Agustus 1945, Malam',
      speaker: 'Narator',
      text: 'Kabinet Jepang di Indonesia goyah. Kabar kekalahan Jepang sudah menyebar. Di sebuah rumah sederhana, para pemuda berkumpul. Suasana tegang. Sukarni berdiri di tengah ruangan.',
      choices: [
        {
          text: 'Dengarkan dengan seksama dan siapkan diri.',
          effects: { tekad: 5 },
          next: 'scene_02'
        },
        {
          text: 'Langsung usulkan tindakan tegas.',
          effects: { tekad: 15, trust: -5 },
          next: 'scene_02'
        }
      ]
    },

    scene_02: {
      location: 'Jakarta — Markas Golongan Muda · Malam Hari',
      speaker: 'Sukarni',
      text: 'Soekarno dan Hatta masih ragu. Mereka menunggu “izin” dari Jepang. Kita tidak bisa menunggu lagi! Besok pagi kita bawa mereka ke tempat aman. Rengasdengklok.',
      choices: [
        {
          text: '“Saya siap. Kapan kita bergerak?”',
          effects: { tekad: 10 },
          next: 'scene_03'
        },
        {
          text: '“Apakah ini tidak terlalu berbahaya? Bagaimana kalau Jepang menindak?”',
          effects: { tekad: -5, trust: 5 },
          next: 'scene_03'
        },
        {
          text: '“Kalau perlu, kita paksa mereka dengan senjata.”',
          effects: { tekad: 20, trust: -10 },
          next: 'scene_03'
        }
      ]
    },

    // ===== SCENE 2: Persiapan Operasi =====
    scene_03: {
      location: 'Jakarta — Menjelang Tengah Malam',
      speaker: 'Wikana',
      text: 'Kita bagi tugas. Beberapa orang jaga di luar rumah Bung Karno. Yang lain masuk dan “mengundang” beliau. Ingat, jangan sampai ada yang terluka. Kita butuh mereka hidup dan sehat.',
      choices: [
        {
          text: 'Memilih ikut tim yang masuk ke dalam rumah.',
          effects: { tekad: 10 },
          next: 'scene_04'
        },
        {
          text: 'Memilih menjadi pengawal di luar (lebih aman).',
          effects: { trust: 5 },
          next: 'scene_04'
        }
      ]
    },

    // ===== SCENE 3: Di Depan Rumah Soekarno =====
    scene_04: {
      location: 'Jalan Pegangsaan Timur · Dini Hari 16 Agustus',
      speaker: 'Narator',
      text: 'Rumah Bung Karno gelap. Hanya lampu kecil di teras. Dua orang pemuda sudah menunggu. Jantungmu berdegup. Ini saatnya.',
      choices: [
        {
          text: 'Langsung ketuk pintu dengan tegas.',
          effects: { tekad: 10, trust: -5 },
          next: 'scene_05a'
        },
        {
          text: 'Panggil pelan-pelan: “Bung Karno… ada berita penting.”',
          effects: { trust: 10 },
          next: 'scene_05b'
        },
        {
          text: 'Tunggu beberapa menit lagi, pastikan tidak ada pengawas Jepang.',
          effects: { trust: 5 },
          next: 'scene_05b'
        }
      ]
    },

    scene_05a: {
      location: 'Dalam Rumah Soekarno',
      speaker: 'Soekarno',
      text: 'Apa-apaan ini?! Kalian datang tengah malam membawa senjata? Apakah kalian gila?!',
      choices: [
        {
          text: '“Maaf Bung, ini demi keselamatan bangsa. Kami harus membawa Bung sekarang.”',
          effects: { trust: 5 },
          next: 'scene_06'
        },
        {
          text: '“Bung tidak punya pilihan. Ikut dengan kami.”',
          effects: { tekad: 15, trust: -15 },
          next: 'scene_06'
        }
      ]
    },

    scene_05b: {
      location: 'Dalam Rumah Soekarno',
      speaker: 'Soekarno',
      text: 'Ada apa malam-malam begini? Kalian terlihat gelisah…',
      choices: [
        {
          text: 'Jelaskan dengan tenang: Jepang sudah kalah, proklamasi harus segera.',
          effects: { trust: 15 },
          next: 'scene_06'
        },
        {
          text: '“Bung harus ikut kami ke tempat yang lebih aman. Sekarang.”',
          effects: { tekad: 5, trust: 5 },
          next: 'scene_06'
        }
      ]
    },

    // ===== SCENE 4: Keputusan Membawa Fatmawati =====
    scene_06: {
      location: 'Dalam Rumah Soekarno',
      speaker: 'Narator',
      text: 'Soekarno akhirnya setuju untuk ikut, meski dengan wajah tegang. Fatmawati muncul dari dalam dengan wajah khawatir. Ia memegang tangan anak-anaknya.',
      choices: [
        {
          text: 'Bawa Fatmawati dan anak-anak ikut serta.',
          effects: { trust: 10 },
          next: 'scene_07'
        },
        {
          text: 'Tinggalkan mereka di rumah demi keamanan.',
          effects: { trust: -5, tekad: 5 },
          next: 'scene_07'
        },
        {
          text: 'Hanya bawa Fatmawati, anak-anak ditinggal dengan pembantu.',
          effects: { trust: 5 },
          next: 'scene_07'
        }
      ]
    },

    // ===== SCENE 5: Perjalanan =====
    scene_07: {
      location: 'Perjalanan menuju Rengasdengklok · Dini Hari',
      speaker: 'Hatta',
      text: 'Tindakan kalian ini sangat berbahaya. Jika Jepang mengetahui, semua bisa berakhir buruk. Apa yang kalian harapkan dari kami di sana?',
      choices: [
        {
          text: '“Kami ingin Bung menyatakan kemerdekaan tanpa campur tangan Jepang.”',
          effects: { trust: 10 },
          next: 'scene_08'
        },
        {
          text: '“Rakyat sudah tidak sabar. Bung harus memimpin sekarang juga.”',
          effects: { tekad: 10 },
          next: 'scene_08'
        },
        {
          text: 'Diam saja. Biarkan suasana tetap tegang.',
          effects: { trust: -5 },
          next: 'scene_08'
        }
      ]
    },

    // ===== SCENE 6: Tiba di Rengasdengklok =====
    scene_08: {
      location: 'Rengasdengklok · Pagi Hari 16 Agustus 1945',
      speaker: 'Narator',
      text: 'Mobil berhenti di depan sebuah rumah di Rengasdengklok. Udara pagi masih sejuk, tapi ketegangan terasa tebal. Soekarno dan Hatta dibawa masuk. Para pemuda menjaga di sekeliling.',
      choices: [
        {
          text: 'Langsung buka pembicaraan tentang proklamasi.',
          effects: { tekad: 10 },
          next: 'scene_09'
        },
        {
          text: 'Biarkan mereka istirahat sebentar dulu.',
          effects: { trust: 10 },
          next: 'scene_09'
        }
      ]
    },

    // ===== SCENE 7: Konfrontasi Inti =====
    scene_09: {
      location: 'Rumah di Rengasdengklok',
      speaker: 'Soekarno',
      text: 'Baik. Sekarang katakan apa yang kalian inginkan. Tapi ingat, kemerdekaan tidak bisa diproklamasikan dengan cara yang sembrono. Ada prosedur, ada tanggung jawab.',
      choices: [
        {
          text: 'Pendekatan idealis: “Rakyat sudah siap. Dunia sudah berubah. Saatnya sekarang, Bung!”',
          effects: { trust: 15, tekad: 5 },
          next: 'scene_10'
        },
        {
          text: 'Pendekatan tegas: “Kalau Bung tidak mau, kami akan cari pemimpin lain yang berani.”',
          effects: { tekad: 20, trust: -20 },
          next: 'scene_10'
        },
        {
          text: 'Pendekatan emosional: “Berapa lama lagi kami harus menunggu? Darah pemuda sudah siap tertumpah.”',
          effects: { tekad: 10, trust: 5 },
          next: 'scene_10'
        }
      ]
    },

    scene_10: {
      location: 'Rumah di Rengasdengklok',
      speaker: 'Hatta',
      text: 'Kami mengerti semangat kalian. Tapi memproklamasikan kemerdekaan tanpa persiapan matang justru bisa merugikan. Jepang masih punya kekuatan di sini.',
      choices: [
        {
          text: '“Jepang sudah kalah total di Pasifik. Mereka tidak punya daya lagi.”',
          effects: { trust: 10 },
          next: 'scene_11'
        },
        {
          text: '“Kami tidak peduli. Lebih baik mati sebagai bangsa merdeka.”',
          effects: { tekad: 15, trust: -10 },
          next: 'scene_11'
        }
      ]
    },

    // ===== SCENE 8: Campur Tangan Soebardjo =====
    scene_11: {
      location: 'Rumah di Rengasdengklok · Siang Hari',
      speaker: 'Narator',
      text: 'Beberapa jam berlalu. Ahmad Soebardjo tiba. Ia mewakili golongan tua yang ingin menengahi. Para pemuda sempat bersitegang apakah akan mengizinkannya masuk.',
      choices: [
        {
          text: 'Izinkan Soebardjo menemui Soekarno-Hatta.',
          effects: { trust: 15 },
          next: 'scene_12'
        },
        {
          text: 'Tolak. “Ini urusan kami dengan Bung Karno.”',
          effects: { tekad: 10, trust: -10 },
          next: 'scene_12'
        }
      ]
    },

    // ===== SCENE 9: Keputusan Akhir =====
    scene_12: {
      location: 'Rumah di Rengasdengklok · Sore Hari',
      speaker: 'Soekarno',
      text: 'Baiklah… Kami akan kembali ke Jakarta. Proklamasi akan kami lakukan. Tapi dengan cara yang terhormat dan bertanggung jawab. Apakah kalian bisa menerima itu?',
      choices: [
        {
          text: 'Terima. Kembali ke Jakarta bersama mereka. (Jalur Historis)',
          effects: { trust: 20 },
          next: 'ending_historis'
        },
        {
          text: 'Tolak. “Kami tetap di sini sampai Bung menyatakan kemerdekaan sekarang juga.”',
          effects: { tekad: 25, trust: -25 },
          next: 'ending_radikal'
        },
        {
          text: 'Kompromi: “Kami ikut kembali, tapi Bung harus berjanji proklamasi paling lambat besok pagi.”',
          effects: { tekad: 10, trust: 10 },
          next: 'ending_kompromi'
        }
      ]
    },

    // ===== ENDINGS =====
    ending_historis: {
      isEnding: true,
      badge: 'ENDING HISTORIS',
      title: 'Kembali ke Jakarta',
      desc: 'Kamu memilih jalur yang sama dengan sejarah. Soekarno dan Hatta kembali ke Jakarta. Keesokan harinya, 17 Agustus 1945, Proklamasi Kemerdekaan dibacakan. Semangat pemuda berhasil mendorong para pemimpin tanpa merusak kepercayaan.',
      type: 'historis'
    },

    ending_radikal: {
      isEnding: true,
      badge: 'ENDING RADIKAL',
      title: 'Tekanan Maksimal',
      desc: 'Kamu menolak kompromi. Ketegangan meningkat. Setelah perdebatan panjang, akhirnya Soekarno setuju untuk segera menyusun teks proklamasi di Rengasdengklok. Namun kepercayaan beliau terhadap golongan muda retak. Sejarah berjalan berbeda…',
      type: 'radikal'
    },

    ending_kompromi: {
      isEnding: true,
      badge: 'ENDING KOMPROMI',
      title: 'Janji Besok Pagi',
      desc: 'Kamu berhasil mendapatkan jaminan. Semua pihak kembali ke Jakarta dengan satu kesepakatan: proklamasi paling lambat pagi esok. Suasana lebih tenang, dan kepercayaan tetap terjaga. Sebuah jalan tengah yang bijak.',
      type: 'kompromi'
    }
  }
};

// -------------------- STATE --------------------
let currentScreen = 'entrance-1';
let storyState = {
  currentScene: null,
  tekad: 50,
  trust: 50,
  flags: {}
};

// -------------------- HELPERS --------------------
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    currentScreen = id;
  }
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updateStatsUI() {
  const tekadEl = document.getElementById('stat-tekad');
  const trustEl = document.getElementById('stat-trust');
  if (tekadEl) tekadEl.style.width = clamp(storyState.tekad, 0, 100) + '%';
  if (trustEl) trustEl.style.width = clamp(storyState.trust, 0, 100) + '%';
}

// -------------------- PARTICLES --------------------
function createParticles() {
  const container = document.getElementById('particles-1');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
    container.appendChild(p);
  }
}

// -------------------- DASHBOARD --------------------
function renderStages() {
  const grid = document.getElementById('stages-grid');
  if (!grid) return;
  grid.innerHTML = '';

  stages.forEach(stage => {
    const card = document.createElement('div');
    card.className = `stage-card ${stage.status}`;
    card.dataset.id = stage.id;

    card.innerHTML = `
      <div class="stage-number">${stage.number}</div>
      <h3>${stage.title}</h3>
      <div class="stage-date">${stage.date}</div>
      <p>${stage.desc}</p>
      <div class="stage-status">
        ${stage.status === 'available' ? '● Tersedia' : '🔒 Terkunci'}
      </div>
    `;

    if (stage.status === 'available') {
      card.addEventListener('click', () => startStage(stage.id));
    }
    grid.appendChild(card);
  });
}

// -------------------- STORY ENGINE --------------------
function startStage(stageId) {
  if (stageId !== 'rengasdengklok') return;

  // Reset story state
  storyState = {
    currentScene: rengasStory.start,
    tekad: 50,
    trust: 50,
    flags: {}
  };

  // Start with Stealth first
  startStealth();
}

function startStoryAfterStealth() {
  const label = document.getElementById('story-stage-label');
  if (label) label.textContent = 'BABAK 01 · RENGASDENGKLOK';
  updateStatsUI();
  showScreen('stage-story');
  renderScene(storyState.currentScene);
}

function renderScene(sceneId) {
  const scene = rengasStory.scenes[sceneId];
  if (!scene) return;

  // Ending?
  if (scene.isEnding) {
    showEnding(scene);
    return;
  }

  const loc = document.getElementById('scene-location');
  if (loc) loc.textContent = scene.location || '';
  const speaker = document.getElementById('speaker-name');
  if (speaker) speaker.textContent = scene.speaker || 'Narator';
  const dialogue = document.getElementById('dialogue-text');
  if (dialogue) dialogue.textContent = scene.text || '';

  const container = document.getElementById('choices-container');
  if (!container) return;
  container.innerHTML = '';

  const letters = ['A', 'B', 'C', 'D'];
  (scene.choices || []).forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-letter">${letters[idx]}</span>${choice.text}`;
    btn.addEventListener('click', () => applyChoice(choice));
    container.appendChild(btn);
  });

  const hint = document.getElementById('story-hint');
  if (hint) {
    hint.textContent = (scene.choices && scene.choices.length) ? 'Pilih salah satu opsi di atas' : '';
  }
}

function applyChoice(choice) {
  // Apply effects
  if (choice.effects) {
    if (choice.effects.tekad) storyState.tekad = clamp(storyState.tekad + choice.effects.tekad, 0, 100);
    if (choice.effects.trust) storyState.trust = clamp(storyState.trust + choice.effects.trust, 0, 100);
  }
  updateStatsUI();

  // Go next
  if (choice.next) {
    storyState.currentScene = choice.next;
    // Small delay for feel
    setTimeout(() => renderScene(choice.next), 280);
  }
}

function showEnding(endingScene) {
  const badge = document.getElementById('ending-badge');
  if (badge) badge.textContent = endingScene.badge;
  const title = document.getElementById('ending-title');
  if (title) title.textContent = endingScene.title;
  const desc = document.getElementById('ending-desc');
  if (desc) desc.textContent = endingScene.desc;
  const stats = document.getElementById('ending-stats');
  if (stats) {
    stats.innerHTML = `
      Tekad Akhir: <span>${Math.round(storyState.tekad)}</span> &nbsp;&nbsp;
      Kepercayaan: <span>${Math.round(storyState.trust)}</span>
    `;
  }
  showScreen('stage-ending');
}

// -------------------- EVENTS --------------------
function initEvents() {
  // Entrance 1 → 2
  const goToCredits = () => {
    if (currentScreen === 'entrance-1') showScreen('entrance-2');
  };
  document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.key === 'Enter') && currentScreen === 'entrance-1') {
      e.preventDefault();
      goToCredits();
    }
  });

  const entrance1 = document.getElementById('entrance-1');
  if (entrance1) entrance1.addEventListener('click', goToCredits);

  // Entrance 2 → Dashboard
  const btnDashboard = document.getElementById('btn-to-dashboard');
  if (btnDashboard) {
    btnDashboard.addEventListener('click', () => showScreen('dashboard'));
  }

  // Back from story
  const btnBackStory = document.getElementById('btn-back-story');
  if (btnBackStory) {
    btnBackStory.addEventListener('click', () => showScreen('dashboard'));
  }

  // Ending → Dashboard
  const btnEndingBack = document.getElementById('btn-ending-back');
  if (btnEndingBack) {
    btnEndingBack.addEventListener('click', () => showScreen('dashboard'));
  }

  // Stealth controls
  const btnBackStealth = document.getElementById('btn-back-stealth');
  if (btnBackStealth) {
    btnBackStealth.addEventListener('click', () => {
      stopStealth();
      showScreen('dashboard');
    });
  }

  const btnStealthRetry = document.getElementById('btn-stealth-retry');
  if (btnStealthRetry) {
    btnStealthRetry.addEventListener('click', () => {
      document.getElementById('stealth-fail').style.display = 'none';
      resetStealth();
    });
  }

  const btnStealthSkip = document.getElementById('btn-stealth-skip');
  if (btnStealthSkip) {
    btnStealthSkip.addEventListener('click', () => {
      stopStealth();
      document.getElementById('stealth-fail').style.display = 'none';
      startStoryAfterStealth();
    });
  }

  const btnStealthContinue = document.getElementById('btn-stealth-continue');
  if (btnStealthContinue) {
    btnStealthContinue.addEventListener('click', () => {
      stopStealth();
      document.getElementById('stealth-success').style.display = 'none';
      startStoryAfterStealth();
    });
  }
}

// ==================== STEALTH MINI-GAME ====================
const stealth = {
  running: false,
  alarm: 0,
  player: { x: 40, y: 300, size: 22, speed: 3.2 },
  keys: {},
  patrols: [],
  hideSpots: [],
  mapW: 0,
  mapH: 0,
  loopId: null,
  detected: false
};

function startStealth() {
  showScreen('stealth-stage');
  resetStealth();
}

function resetStealth() {
  stopStealth();
  stealth.alarm = 0;
  stealth.detected = false;
  stealth.player = { x: 30, y: 0, size: 22, speed: 3.2 }; // y set after map size known
  stealth.keys = {};

  const map = document.getElementById('stealth-map');
  if (!map) return;

  // Clear previous dynamic elements
  map.querySelectorAll('.hide-spot, .wall, .house, .patrol, .vision').forEach(el => el.remove());

  // Wait for layout
  requestAnimationFrame(() => {
    stealth.mapW = map.clientWidth;
    stealth.mapH = map.clientHeight;
    stealth.player.y = stealth.mapH * 0.65;
    stealth.player.x = 30;

    buildStealthMap(map);
    updatePlayerPos();
    updateAlarmUI();

    document.getElementById('stealth-fail').style.display = 'none';
    document.getElementById('stealth-success').style.display = 'none';

    stealth.running = true;
    stealth.loopId = requestAnimationFrame(stealthLoop);

    // Keyboard
    window.addEventListener('keydown', stealthKeyDown);
    window.addEventListener('keyup', stealthKeyUp);
  });
}

function stopStealth() {
  stealth.running = false;
  if (stealth.loopId) cancelAnimationFrame(stealth.loopId);
  window.removeEventListener('keydown', stealthKeyDown);
  window.removeEventListener('keyup', stealthKeyUp);
}

function buildStealthMap(map) {
  const W = stealth.mapW;
  const H = stealth.mapH;

  // Hide spots (bushes / trees)
  stealth.hideSpots = [
    { x: 120, y: 80, w: 70, h: 55 },
    { x: 250, y: 200, w: 80, h: 60 },
    { x: 100, y: 320, w: 75, h: 50 },
    { x: 380, y: 90, w: 65, h: 55 },
    { x: 320, y: 300, w: 70, h: 50 },
    { x: 480, y: 220, w: 60, h: 55 }
  ];

  // Scale if map smaller
  const scaleX = W / 700;
  const scaleY = H / 420;
  stealth.hideSpots = stealth.hideSpots.map(s => ({
    x: s.x * scaleX,
    y: s.y * scaleY,
    w: s.w * scaleX,
    h: s.h * scaleY
  }));

  stealth.hideSpots.forEach(s => {
    const el = document.createElement('div');
    el.className = 'hide-spot';
    el.style.left = s.x + 'px';
    el.style.top = s.y + 'px';
    el.style.width = s.w + 'px';
    el.style.height = s.h + 'px';
    map.appendChild(el);
  });

  // House (goal area)
  const houseW = Math.min(110, W * 0.18);
  const houseH = Math.min(140, H * 0.35);
  const houseX = W - houseW - 25;
  const houseY = H * 0.28;

  const house = document.createElement('div');
  house.className = 'house';
  house.style.left = houseX + 'px';
  house.style.top = houseY + 'px';
  house.style.width = houseW + 'px';
  house.style.height = houseH + 'px';
  house.textContent = 'Rumah Soekarno';
  map.appendChild(house);

  // Goal zone (door area in front of house)
  const goal = document.getElementById('goal');
  if (goal) {
    goal.style.left = (houseX - 10) + 'px';
    goal.style.top = (houseY + houseH * 0.55) + 'px';
    goal.style.right = 'auto';
  }

  // Patrols
  stealth.patrols = [
    {
      x: 180 * scaleX,
      y: 60 * scaleY,
      size: 24,
      dir: 1,
      speed: 1.4,
      range: 90 * scaleX,
      baseX: 180 * scaleX,
      vision: 55
    },
    {
      x: 400 * scaleX,
      y: 280 * scaleY,
      size: 24,
      dir: -1,
      speed: 1.1,
      range: 110 * scaleX,
      baseX: 400 * scaleX,
      vision: 50
    }
  ];

  stealth.patrols.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'patrol';
    el.id = 'patrol-' + i;
    el.style.left = p.x + 'px';
    el.style.top = p.y + 'px';
    map.appendChild(el);

    const vis = document.createElement('div');
    vis.className = 'vision';
    vis.id = 'vision-' + i;
    vis.style.width = (p.vision * 2) + 'px';
    vis.style.height = (p.vision * 2) + 'px';
    vis.style.left = (p.x + p.size / 2) + 'px';
    vis.style.top = (p.y + p.size / 2) + 'px';
    map.appendChild(vis);
  });
}

function stealthKeyDown(e) {
  stealth.keys[e.key.toLowerCase()] = true;
  // prevent scroll
  if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
}

function stealthKeyUp(e) {
  stealth.keys[e.key.toLowerCase()] = false;
}

function updatePlayerPos() {
  const el = document.getElementById('player');
  if (el) {
    el.style.left = stealth.player.x + 'px';
    el.style.top = stealth.player.y + 'px';
  }
}

function updateAlarmUI() {
  const el = document.getElementById('alarm-value');
  if (el) el.textContent = Math.round(stealth.alarm);
}

function isHidden() {
  const px = stealth.player.x + stealth.player.size / 2;
  const py = stealth.player.y + stealth.player.size / 2;
  return stealth.hideSpots.some(s =>
    px > s.x && px < s.x + s.w &&
    py > s.y && py < s.y + s.h
  );
}

function stealthLoop() {
  if (!stealth.running) return;

  const p = stealth.player;
  const speed = p.speed;

  // Movement
  let dx = 0, dy = 0;
  if (stealth.keys['w'] || stealth.keys['arrowup']) dy -= speed;
  if (stealth.keys['s'] || stealth.keys['arrowdown']) dy += speed;
  if (stealth.keys['a'] || stealth.keys['arrowleft']) dx -= speed;
  if (stealth.keys['d'] || stealth.keys['arrowright']) dx += speed;

  p.x = Math.max(4, Math.min(stealth.mapW - p.size - 4, p.x + dx));
  p.y = Math.max(4, Math.min(stealth.mapH - p.size - 4, p.y + dy));
  updatePlayerPos();

  // Move patrols
  stealth.patrols.forEach((pat, i) => {
    pat.x += pat.speed * pat.dir;
    if (pat.x > pat.baseX + pat.range || pat.x < pat.baseX - pat.range) {
      pat.dir *= -1;
    }

    const pel = document.getElementById('patrol-' + i);
    const vel = document.getElementById('vision-' + i);
    if (pel) {
      pel.style.left = pat.x + 'px';
      pel.style.top = pat.y + 'px';
    }
    if (vel) {
      vel.style.left = (pat.x + pat.size / 2) + 'px';
      vel.style.top = (pat.y + pat.size / 2) + 'px';
    }

    // Detection
    if (!stealth.detected) {
      const cx = p.x + p.size / 2;
      const cy = p.y + p.size / 2;
      const pcx = pat.x + pat.size / 2;
      const pcy = pat.y + pat.size / 2;
      const dist = Math.hypot(cx - pcx, cy - pcy);

      if (dist < pat.vision && !isHidden()) {
        stealth.alarm += 1.8;
        updateAlarmUI();
        if (stealth.alarm >= 100) {
          stealth.detected = true;
          onStealthFail();
          return;
        }
      } else {
        // slowly decay alarm
        if (stealth.alarm > 0) {
          stealth.alarm = Math.max(0, stealth.alarm - 0.15);
          updateAlarmUI();
        }
      }
    }
  });

  // Check goal
  const goal = document.getElementById('goal');
  if (goal && !stealth.detected) {
    const gr = goal.getBoundingClientRect();
    const pr = document.getElementById('player').getBoundingClientRect();
    const mapRect = document.getElementById('stealth-map').getBoundingClientRect();

    const gx = gr.left - mapRect.left;
    const gy = gr.top - mapRect.top;
    const gw = gr.width;
    const gh = gr.height;

    if (p.x + p.size > gx && p.x < gx + gw &&
        p.y + p.size > gy && p.y < gy + gh) {
      onStealthSuccess();
      return;
    }
  }

  stealth.loopId = requestAnimationFrame(stealthLoop);
}

function onStealthFail() {
  stealth.running = false;
  document.getElementById('stealth-fail').style.display = 'flex';
}

function onStealthSuccess() {
  stealth.running = false;
  // Bonus tekad for successful stealth
  storyState.tekad = Math.min(100, storyState.tekad + 15);
  document.getElementById('stealth-success').style.display = 'flex';
}

// -------------------- INIT --------------------
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderStages();
  initEvents();

  // Ganti nama pembuat di sini:
  // document.getElementById('creator-name').textContent = 'Nama Kamu';
});
