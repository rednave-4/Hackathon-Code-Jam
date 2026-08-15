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

// ==================== STEALTH MINI-GAME (Canvas 2D) ====================
const stealth = {
  running: false,
  alarm: 0,
  detected: false,
  keys: {},
  loopId: null,
  canvas: null,
  ctx: null,
  W: 800,
  H: 480,
  player: { x: 50, y: 350, r: 11, speed: 2.8 },
  patrols: [],
  walls: [],
  hides: [],
  goal: { x: 720, y: 220, w: 50, h: 50 }
};

function startStealth() {
  showScreen('stealth-stage');
  // small delay so canvas is visible
  setTimeout(resetStealth, 50);
}

function stopStealth() {
  stealth.running = false;
  if (stealth.loopId) cancelAnimationFrame(stealth.loopId);
  window.removeEventListener('keydown', onStealthKeyDown);
  window.removeEventListener('keyup', onStealthKeyUp);
}

function resetStealth() {
  stopStealth();

  const canvas = document.getElementById('stealth-canvas');
  if (!canvas) return;

  stealth.canvas = canvas;
  stealth.ctx = canvas.getContext('2d');
  stealth.W = canvas.width;
  stealth.H = canvas.height;
  stealth.alarm = 0;
  stealth.detected = false;
  stealth.keys = {};
  stealth.player = { x: 55, y: stealth.H - 80, r: 11, speed: 2.8 };

  // Walls (simple rectangles)
  stealth.walls = [
    // outer border handled by clamp
    { x: 200, y: 0, w: 30, h: 160 },
    { x: 200, y: 220, w: 30, h: 260 },
    { x: 400, y: 100, w: 30, h: 180 },
    { x: 550, y: 0, w: 30, h: 140 },
    { x: 550, y: 200, w: 30, h: 280 }
  ];

  // Hide zones (bushes)
  stealth.hides = [
    { x: 80, y: 60, w: 70, h: 55 },
    { x: 100, y: 200, w: 65, h: 50 },
    { x: 280, y: 40, w: 70, h: 55 },
    { x: 300, y: 300, w: 75, h: 55 },
    { x: 450, y: 250, w: 70, h: 50 },
    { x: 620, y: 80, w: 60, h: 50 },
    { x: 600, y: 350, w: 70, h: 55 }
  ];

  // Goal (door of house)
  stealth.goal = { x: stealth.W - 70, y: stealth.H / 2 - 30, w: 45, h: 55 };

  // Patrols
  stealth.patrols = [
    {
      x: 150, y: 120, r: 12,
      path: [{ x: 150, y: 120 }, { x: 150, y: 380 }],
      pathIndex: 0, speed: 1.3, vision: 58
    },
    {
      x: 480, y: 80, r: 12,
      path: [{ x: 480, y: 80 }, { x: 480, y: 400 }],
      pathIndex: 0, speed: 1.1, vision: 55
    },
    {
      x: 320, y: 200, r: 12,
      path: [{ x: 250, y: 200 }, { x: 500, y: 200 }],
      pathIndex: 0, speed: 1.4, vision: 52
    }
  ];

  updateAlarmUI();
  document.getElementById('stealth-fail').style.display = 'none';
  document.getElementById('stealth-success').style.display = 'none';

  window.addEventListener('keydown', onStealthKeyDown);
  window.addEventListener('keyup', onStealthKeyUp);

  stealth.running = true;
  stealth.loopId = requestAnimationFrame(stealthLoop);
}

function onStealthKeyDown(e) {
  stealth.keys[e.key.toLowerCase()] = true;
  if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
}

function onStealthKeyUp(e) {
  stealth.keys[e.key.toLowerCase()] = false;
}

function updateAlarmUI() {
  const el = document.getElementById('alarm-value');
  if (el) el.textContent = Math.round(stealth.alarm);
}

function isPlayerHidden() {
  const p = stealth.player;
  return stealth.hides.some(h =>
    p.x > h.x && p.x < h.x + h.w &&
    p.y > h.y && p.y < h.y + h.h
  );
}

function collidesWall(nx, ny) {
  const r = stealth.player.r;
  return stealth.walls.some(w =>
    nx + r > w.x && nx - r < w.x + w.w &&
    ny + r > w.y && ny - r < w.y + w.h
  );
}

function stealthLoop() {
  if (!stealth.running) return;

  const p = stealth.player;
  let dx = 0, dy = 0;
  const sp = p.speed;

  if (stealth.keys['w'] || stealth.keys['arrowup']) dy -= sp;
  if (stealth.keys['s'] || stealth.keys['arrowdown']) dy += sp;
  if (stealth.keys['a'] || stealth.keys['arrowleft']) dx -= sp;
  if (stealth.keys['d'] || stealth.keys['arrowright']) dx += sp;

  // Normalize diagonal
  if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }

  let nx = p.x + dx;
  let ny = p.y + dy;

  // Bounds
  nx = Math.max(p.r + 2, Math.min(stealth.W - p.r - 2, nx));
  ny = Math.max(p.r + 2, Math.min(stealth.H - p.r - 2, ny));

  // Wall collision (simple)
  if (!collidesWall(nx, p.y)) p.x = nx;
  if (!collidesWall(p.x, ny)) p.y = ny;

  // Move patrols
  stealth.patrols.forEach(pat => {
    const target = pat.path[pat.pathIndex];
    const dist = Math.hypot(target.x - pat.x, target.y - pat.y);
    if (dist < 4) {
      pat.pathIndex = (pat.pathIndex + 1) % pat.path.length;
    } else {
      const angle = Math.atan2(target.y - pat.y, target.x - pat.x);
      pat.x += Math.cos(angle) * pat.speed;
      pat.y += Math.sin(angle) * pat.speed;
    }

    // Detection
    if (!stealth.detected) {
      const d = Math.hypot(p.x - pat.x, p.y - pat.y);
      if (d < pat.vision && !isPlayerHidden()) {
        stealth.alarm += 1.6;
        if (stealth.alarm >= 100) {
          stealth.alarm = 100;
          stealth.detected = true;
          updateAlarmUI();
          onStealthFail();
          return;
        }
      }
    }
  });

  // Alarm decay
  if (!stealth.detected && stealth.alarm > 0) {
    stealth.alarm = Math.max(0, stealth.alarm - 0.12);
  }
  updateAlarmUI();

  // Goal check
  const g = stealth.goal;
  if (!stealth.detected &&
      p.x > g.x && p.x < g.x + g.w &&
      p.y > g.y && p.y < g.y + g.h) {
    onStealthSuccess();
    return;
  }

  drawStealth();
  stealth.loopId = requestAnimationFrame(stealthLoop);
}

function drawStealth() {
  const ctx = stealth.ctx;
  const W = stealth.W;
  const H = stealth.H;
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#0b140b';
  ctx.fillRect(0, 0, W, H);

  // Grid subtle
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Hide zones
  stealth.hides.forEach(h => {
    ctx.fillStyle = 'rgba(40, 130, 55, 0.35)';
    ctx.strokeStyle = 'rgba(80, 180, 90, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.fillRect(h.x, h.y, h.w, h.h);
    ctx.strokeRect(h.x, h.y, h.w, h.h);
    ctx.setLineDash([]);
    // leaf icon
    ctx.font = '16px serif';
    ctx.fillStyle = 'rgba(100, 200, 110, 0.7)';
    ctx.fillText('🌿', h.x + h.w / 2 - 8, h.y + h.h / 2 + 6);
  });

  // Walls
  stealth.walls.forEach(w => {
    ctx.fillStyle = '#2a2a2a';
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeRect(w.x, w.y, w.w, w.h);
  });

  // House
  const hx = W - 95, hy = H / 2 - 70, hw = 85, hh = 130;
  ctx.fillStyle = '#3a2a1a';
  ctx.strokeStyle = '#5a4030';
  ctx.lineWidth = 2;
  ctx.fillRect(hx, hy, hw, hh);
  ctx.strokeRect(hx, hy, hw, hh);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Rumah', hx + 22, hy + hh - 12);
  ctx.fillText('Soekarno', hx + 14, hy + hh + 2);

  // Goal door
  const g = stealth.goal;
  ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 3]);
  ctx.fillRect(g.x, g.y, g.w, g.h);
  ctx.strokeRect(g.x, g.y, g.w, g.h);
  ctx.setLineDash([]);
  ctx.font = '18px serif';
  ctx.fillText('🚪', g.x + 12, g.y + 32);

  // Patrols + vision
  stealth.patrols.forEach(pat => {
    // vision circle
    ctx.beginPath();
    ctx.arc(pat.x, pat.y, pat.vision, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 16, 46, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(200, 16, 46, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // body
    ctx.beginPath();
    ctx.arc(pat.x, pat.y, pat.r, 0, Math.PI * 2);
    ctx.fillStyle = '#c8102e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.font = '12px serif';
    ctx.fillText('🇯🇵', pat.x - 7, pat.y + 4);
  });

  // Player
  const pl = stealth.player;
  const hidden = isPlayerHidden();
  ctx.beginPath();
  ctx.arc(pl.x, pl.y, pl.r, 0, Math.PI * 2);
  ctx.fillStyle = hidden ? '#86efac' : '#4ade80';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
  // glow
  if (!hidden) {
    ctx.beginPath();
    ctx.arc(pl.x, pl.y, pl.r + 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.25)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function onStealthFail() {
  stealth.running = false;
  document.getElementById('stealth-fail').style.display = 'flex';
}

function onStealthSuccess() {
  stealth.running = false;
  storyState.tekad = Math.min(100, (storyState.tekad || 50) + 15);
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
