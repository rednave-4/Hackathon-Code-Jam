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
    status: 'available'
  },
  {
    id: 'surabaya',
    number: 'BABAK 03',
    title: 'Pertempuran Surabaya',
    date: '10 November 1945',
    desc: 'Arek-arek Suroboyo mempertahankan kota. Semangat juang yang menggemparkan dunia.',
    status: 'available'
  },
  {
    id: 'agresi',
    number: 'BABAK 04',
    title: 'Agresi Militer Belanda',
    date: '1947 – 1948',
    desc: 'Perjuangan mempertahankan kemerdekaan di tengah agresi dan diplomasi yang rumit.',
    status: 'available'
  },
  {
    id: 'sumpah',
    number: 'BABAK 05',
    title: 'Sumpah Pemuda',
    date: '28 Oktober 1928',
    desc: 'Satu nusa, satu bangsa, satu bahasa. Akar semangat persatuan yang menjadi fondasi kemerdekaan.',
    status: 'available'
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
  // Babak 02 → game ketikan naskah proklamasi (Sayuti Melik)
  if (stageId === 'proklamasi') {
    window.location.href = 'ketikan.html';
    return;
  }

  if (!STAGE_MAPS[stageId]) return;

  storyState = {
    currentScene: rengasStory.start,
    tekad: 50,
    trust: 50,
    flags: {},
    stageId: stageId
  };

  game.currentStageId = stageId;
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
      loadMap(game.mapId);
    });
  }

  const btnStealthSkip = document.getElementById('btn-stealth-skip');
  if (btnStealthSkip) {
    btnStealthSkip.addEventListener('click', () => {
      document.getElementById('stealth-fail').style.display = 'none';
      loadMap(game.mapId + 1);
    });
  }

  const btnStealthContinue = document.getElementById('btn-stealth-continue');
  if (btnStealthContinue) {
    btnStealthContinue.addEventListener('click', () => {
      stopStealth();
      document.getElementById('stealth-success').style.display = 'none';
      showScreen('dashboard');
    });
  }
}

// ==================== MULTI-MAP 2D ADVENTURE ENGINE ====================

const game = {
  running: false,
  loopId: null,
  canvas: null,
  ctx: null,
  W: 800,
  H: 480,
  mapId: 0,
  alarm: 0,
  detected: false,
  keys: {},
  inventory: [],
  flags: {},
  nearInteract: null,
  dialogQueue: [],
  dialogOpen: false,
  joy: { active: false, dx: 0, dy: 0 },
  player: { x: 100, y: 300, r: 12, speed: 2.6, facing: 1 },
  animT: 0
};

// ---------- ALL STAGE MAPS ----------
const STAGE_MAPS = {
  // ========== BABAK 01: RENGASDENGKLOK ==========
  rengasdengklok: [
    {
      id: 'menteng', title: 'Menteng 31 · 15 Agustus Malam',
      objective: 'Bicara dengan para pemuda. Ambil catatan, lalu ke Pegangsaan.',
      bg: '#0c1210', spawn: { x: 80, y: 350 },
      walls: [{ x:0,y:0,w:800,h:20},{x:0,y:460,w:800,h:20},{x:0,y:0,w:20,h:480},{x:780,y:0,w:20,h:480},{x:300,y:100,w:200,h:20},{x:300,y:100,w:20,h:120}],
      hides: [],
      npcs: [
        { x:200,y:200,name:'Sukarni',r:14,color:'#eab308', dialog:['Kita harus bergerak malam ini.','Bawa Soekarno-Hatta ke tempat aman.','Pergi ke Pegangsaan Timur.'] },
        { x:400,y:280,name:'Wikana',r:14,color:'#38bdf8', dialog:['PPKI buatan Jepang tidak bisa dipercaya.','Proklamasi harus dari rakyat.'] },
        { x:550,y:180,name:'Chaerul Saleh',r:14,color:'#f472b6', dialog:['Kalau perlu kita paksa.','Semangat pemuda tidak boleh padam!'] }
      ],
      items: [{ x:150,y:120,id:'surat_menteng',name:'Catatan Rapat',icon:'📜',taken:false }],
      patrols: [],
      exits: [{ x:720,y:300,w:50,h:60,to:1,label:'Ke Pegangsaan →' }],
      alarmEnabled: false
    },
    {
      id: 'jalan', title: 'Jalan Menuju Pegangsaan · Malam',
      objective: 'Sampai rumah Soekarno. Hindari patroli Jepang!',
      bg: '#0a100a', spawn: { x: 50, y: 240 },
      walls: [{x:0,y:0,w:800,h:40},{x:0,y:440,w:800,h:40},{x:250,y:80,w:30,h:150},{x:450,y:250,w:30,h:180}],
      hides: [{x:100,y:80,w:70,h:50},{x:300,y:300,w:70,h:50},{x:500,y:100,w:65,h:50},{x:620,y:320,w:70,h:50}],
      npcs: [],
      items: [{x:380,y:150,id:'kunci_pagar',name:'Kunci Pagar',icon:'🔑',taken:false}],
      patrols: [
        {x:200,y:150,r:12,path:[[200,150],[200,380]],idx:0,speed:1.35,vision:62},
        {x:550,y:200,r:12,path:[[400,200],[700,200]],idx:0,speed:1.5,vision:58}
      ],
      exits: [{x:730,y:200,w:50,h:60,to:2,label:'Rumah Soekarno →'}],
      alarmEnabled: true
    },
    {
      id: 'depan_rumah', title: 'Pegangsaan Timur 56 · Depan Rumah',
      objective: 'Masuk rumah tanpa ketahuan. Sembunyi di semak.',
      bg: '#0b130b', spawn: { x: 60, y: 300 },
      walls: [{x:500,y:0,w:30,h:180},{x:500,y:250,w:30,h:230},{x:650,y:80,w:130,h:20},{x:650,y:80,w:20,h:200}],
      hides: [{x:120,y:60,w:70,h:55},{x:200,y:280,w:75,h:55},{x:350,y:100,w:70,h:50},{x:380,y:350,w:70,h:50}],
      npcs: [], items: [],
      patrols: [
        {x:180,y:100,r:12,path:[[180,100],[180,400]],idx:0,speed:1.4,vision:65},
        {x:320,y:200,r:12,path:[[250,200],[450,200]],idx:0,speed:1.25,vision:60},
        {x:420,y:350,r:12,path:[[420,120],[420,400]],idx:0,speed:1.3,vision:58}
      ],
      exits: [{x:680,y:200,w:50,h:55,to:3,label:'Masuk Rumah 🚪'}],
      alarmEnabled: true
    },
    {
      id: 'dalam_rumah', title: 'Dalam Rumah Soekarno · 22.00',
      objective: 'Bicara dengan Soekarno & Hatta. Yakinkan mereka ikut.',
      bg: '#1a120c', spawn: { x: 100, y: 350 },
      walls: [{x:0,y:0,w:800,h:30},{x:0,y:450,w:800,h:30},{x:0,y:0,w:30,h:480},{x:770,y:0,w:30,h:480},{x:350,y:100,w:20,h:150}],
      hides: [],
      npcs: [
        {x:500,y:200,name:'Soekarno',r:16,color:'#fbbf24',dialog:['Apa maksud kalian tengah malam begini?','Proklamasi harus melalui prosedur.','...Baik. Kami ikut.']},
        {x:600,y:280,name:'Hatta',r:15,color:'#94a3b8',dialog:['Ini sangat berisiko.','Semoga keputusan ini tidak salah.']}
      ],
      items: [{x:200,y:150,id:'lampu',name:'Lampu Minyak',icon:'🪔',taken:false}],
      patrols: [],
      exits: [{x:700,y:350,w:55,h:55,to:4,label:'Ke Rengasdengklok →',requireFlag:'talked_soekarno'}],
      alarmEnabled: false
    },
    {
      id: 'rengas_halaman', title: 'Rengasdengklok · Siang',
      objective: 'Bicara penjaga PETA, ambil bendera, masuk rumah.',
      bg: '#121a10', spawn: { x: 80, y: 300 },
      walls: [{x:400,y:50,w:30,h:200},{x:550,y:200,w:200,h:25}],
      hides: [{x:150,y:80,w:70,h:50},{x:280,y:300,w:70,h:50}],
      npcs: [{x:300,y:180,name:'Shodanco Singgih',r:14,color:'#4ade80',dialog:['Kami jaga sekeliling.','Bung Karno aman. Masuk saja.']}],
      items: [{x:500,y:100,id:'bendera',name:'Bendera Merah Putih',icon:'🚩',taken:false}],
      patrols: [{x:200,y:150,r:11,path:[[200,100],[200,380]],idx:0,speed:1.1,vision:50}],
      exits: [{x:650,y:280,w:50,h:55,to:5,label:'Masuk Rumah →'}],
      alarmEnabled: true
    },
    {
      id: 'rengas_dalam', title: 'Rumah Rengasdengklok · Debat',
      objective: 'Desak Soekarno. Tunggu kabar Jakarta.',
      bg: '#1a140e', spawn: { x: 100, y: 320 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25},{x:0,y:0,w:25,h:480},{x:775,y:0,w:25,h:480}],
      hides: [],
      npcs: [
        {x:400,y:200,name:'Soekarno',r:16,color:'#fbbf24',dialog:['Kami mengerti semangat kalian.','Tunggu... ada kabar dari Jakarta.']},
        {x:520,y:260,name:'Hatta',r:15,color:'#94a3b8',dialog:['Soebardjo sedang menuju ke sini.']}
      ],
      items: [], patrols: [],
      exits: [{x:700,y:300,w:50,h:55,to:6,label:'Soebardjo Tiba →',requireFlag:'talked_rengas'}],
      alarmEnabled: false
    },
    {
      id: 'soebardjo', title: 'Rengasdengklok · 17.30 WIB',
      objective: 'Dengarkan jaminan Soebardjo. Kembali ke Jakarta.',
      bg: '#14100c', spawn: { x: 150, y: 300 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25}],
      hides: [],
      npcs: [
        {x:400,y:220,name:'Achmad Soebardjo',r:15,color:'#a78bfa',dialog:['Saya jamin dengan nyawa saya.','Proklamasi besok, 17 Agustus.','Kita kembali ke Jakarta.']},
        {x:550,y:280,name:'Wikana',r:14,color:'#38bdf8',dialog:['Ini kesepakatan terbaik.']}
      ],
      items: [], patrols: [],
      exits: [{x:680,y:300,w:60,h:55,to:'end',label:'Kembali ke Jakarta →'}],
      alarmEnabled: false
    }
  ],

  // ========== BABAK 02: PROKLAMASI ==========
  proklamasi: [
    {
      id: 'maeda', title: 'Rumah Laksamana Maeda · Dini Hari 17 Agustus',
      objective: 'Bantu susun naskah proklamasi. Bicara dengan tokoh.',
      bg: '#12100e', spawn: { x: 80, y: 320 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25},{x:0,y:0,w:25,h:480},{x:775,y:0,w:25,h:480},{x:380,y:80,w:20,h:160}],
      hides: [],
      npcs: [
        {x:250,y:200,name:'Soekarno',r:16,color:'#fbbf24',dialog:['Kita harus menulis naskah sekarang.','Singkat, tegas, dan jelas.']},
        {x:450,y:220,name:'Hatta',r:15,color:'#94a3b8',dialog:['Saya usulkan kalimat yang kuat.','Kemerdekaan adalah hak segala bangsa.']},
        {x:600,y:180,name:'Achmad Soebardjo',r:14,color:'#a78bfa',dialog:['Rumah Maeda relatif aman dari Jepang.','Segera selesaikan naskahnya.']}
      ],
      items: [{x:500,y:350,id:'naskah',name:'Konsep Naskah',icon:'📝',taken:false}],
      patrols: [],
      exits: [{x:700,y:300,w:55,h:55,to:1,label:'Ke Pegangsaan →',requireFlag:'got_naskah'}],
      alarmEnabled: false
    },
    {
      id: 'jalan_proklamasi', title: 'Menuju Pegangsaan Timur · Pagi',
      objective: 'Antar naskah ke lokasi proklamasi. Hindari patroli.',
      bg: '#0c140c', spawn: { x: 50, y: 250 },
      walls: [{x:0,y:0,w:800,h:35},{x:0,y:445,w:800,h:35},{x:280,y:100,w:25,h:140}],
      hides: [{x:120,y:80,w:65,h:50},{x:350,y:280,w:70,h:50},{x:550,y:120,w:65,h:50}],
      npcs: [],
      items: [{x:400,y:180,id:'tiang_bendera',name:'Potongan Tiang',icon:'🪵',taken:false}],
      patrols: [
        {x:220,y:160,r:12,path:[[220,120],[220,380]],idx:0,speed:1.4,vision:60},
        {x:500,y:300,r:12,path:[[400,300],[650,300]],idx:0,speed:1.3,vision:55}
      ],
      exits: [{x:720,y:220,w:50,h:55,to:2,label:'Pegangsaan 56 →'}],
      alarmEnabled: true
    },
    {
      id: 'pegangsaan', title: 'Pegangsaan Timur 56 · 10.00 WIB',
      objective: 'Siapkan upacara. Bicara tokoh, kibarkan bendera.',
      bg: '#10180e', spawn: { x: 100, y: 350 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25},{x:500,y:60,w:180,h:20},{x:500,y:60,w:20,h:120}],
      hides: [],
      npcs: [
        {x:300,y:200,name:'Soekarno',r:16,color:'#fbbf24',dialog:['Hari ini sejarah ditulis.','Atas nama bangsa Indonesia...']},
        {x:450,y:250,name:'Fatmawati',r:14,color:'#f9a8d4',dialog:['Bendera sudah siap.','Merah Putih harus berkibar.']},
        {x:600,y:180,name:'Latief Hendraningrat',r:14,color:'#4ade80',dialog:['Kami siap mengibarkan bendera.']}
      ],
      items: [{x:200,y:120,id:'bendera_proklamasi',name:'Bendera Proklamasi',icon:'🚩',taken:false}],
      patrols: [],
      exits: [{x:680,y:300,w:55,h:55,to:3,label:'Proklamasikan! →',requireFlag:'ready_proklamasi'}],
      alarmEnabled: false
    },
    {
      id: 'detik_proklamasi', title: 'Detik-Detik Proklamasi · 17 Agustus 1945',
      objective: 'Saksikan proklamasi. Bicara dengan semua tokoh.',
      bg: '#0e160c', spawn: { x: 150, y: 320 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25}],
      hides: [],
      npcs: [
        {x:350,y:200,name:'Soekarno',r:17,color:'#fbbf24',dialog:['PROKLAMASI','Kami bangsa Indonesia dengan ini menyatakan kemerdekaan Indonesia.','Hal-hal mengenai pemindahan kekuasaan dan lain-lain diselenggarakan dengan cara seksama dan dalam tempo yang sesingkat-singkatnya.']},
        {x:500,y:260,name:'Hatta',r:15,color:'#94a3b8',dialog:['Jakarta, 17 Agustus 1945.','Atas nama bangsa Indonesia.']},
        {x:250,y:280,name:'Rakyat',r:13,color:'#86efac',dialog:['MERDEKA!','MERDEKA! MERDEKA!']}
      ],
      items: [], patrols: [],
      exits: [{x:680,y:300,w:60,h:55,to:'end',label:'Selesai · Merdeka! →'}],
      alarmEnabled: false
    }
  ],

  // ========== BABAK 03: SURABAYA ==========
  surabaya: [
    {
      id: 'yamato', title: 'Hotel Yamato · September 1945',
      objective: 'Saksikan insiden bendera. Bicara Arek Suroboyo.',
      bg: '#0e1218', spawn: { x: 80, y: 300 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25},{x:400,y:80,w:25,h:200}],
      hides: [],
      npcs: [
        {x:250,y:200,name:'Arek Suroboyo',r:14,color:'#f87171',dialog:['Bendera Belanda di Hotel Yamato harus turun!','Merah Putih atau tidak sama sekali.']},
        {x:500,y:220,name:'Bung Tomo',r:15,color:'#fb923c',dialog:['Saudara-saudara!','Kami rather hancur leburlah Surabaya.','Bersiaplah!']}
      ],
      items: [{x:350,y:350,id:'sobekan_bendera',name:'Sobekan Bendera Belanda',icon:'✂️',taken:false}],
      patrols: [],
      exits: [{x:700,y:280,w:55,h:55,to:1,label:'Ke Jalanan Surabaya →'}],
      alarmEnabled: false
    },
    {
      id: 'jalanan_sby', title: 'Jalanan Surabaya · Menjelang 10 November',
      objective: 'Kumpulkan semangat rakyat. Hindari patrol Sekutu.',
      bg: '#0c1014', spawn: { x: 50, y: 250 },
      walls: [{x:0,y:0,w:800,h:35},{x:0,y:445,w:800,h:35},{x:300,y:90,w:30,h:160},{x:550,y:200,w:30,h:180}],
      hides: [{x:100,y:70,w:70,h:50},{x:250,y:300,w:70,h:50},{x:450,y:100,w:65,h:50},{x:650,y:320,w:70,h:50}],
      npcs: [
        {x:180,y:180,name:'Pemuda',r:13,color:'#4ade80',dialog:['Kami siap berperang.','Surabaya tidak akan menyerah.']}
      ],
      items: [{x:400,y:200,id:'radio_bungtomo',name:'Radio Bung Tomo',icon:'📻',taken:false}],
      patrols: [
        {x:200,y:140,r:12,path:[[200,100],[200,400]],idx:0,speed:1.45,vision:65},
        {x:480,y:280,r:12,path:[[350,280],[650,280]],idx:0,speed:1.35,vision:60},
        {x:600,y:150,r:12,path:[[600,100],[600,380]],idx:0,speed:1.3,vision:58}
      ],
      exits: [{x:720,y:220,w:50,h:55,to:2,label:'Markas Perlawanan →'}],
      alarmEnabled: true
    },
    {
      id: 'markas_sby', title: 'Markas Perlawanan · 10 November 1945',
      objective: 'Terima perintah Bung Tomo. Siapkan pertahanan.',
      bg: '#12100c', spawn: { x: 100, y: 320 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25},{x:0,y:0,w:25,h:480},{x:775,y:0,w:25,h:480}],
      hides: [],
      npcs: [
        {x:400,y:200,name:'Bung Tomo',r:16,color:'#fb923c',dialog:['Hari ini kita pertaruhkan segalanya.','Arek-arek Suroboyo, maju!','Lebih baik hancur daripada dijajah lagi.']},
        {x:550,y:280,name:'Komandan',r:14,color:'#4ade80',dialog:['Posisi sudah disiapkan.','Rakyat mendukung penuh.']}
      ],
      items: [{x:200,y:150,id:'senjata_rakyat',name:'Senjata Rakyat',icon:'⚔️',taken:false}],
      patrols: [],
      exits: [{x:680,y:300,w:55,h:55,to:3,label:'Ke Garis Depan →',requireFlag:'bungtomo_ok'}],
      alarmEnabled: false
    },
    {
      id: 'garis_depan', title: 'Garis Depan Surabaya · Pertempuran',
      objective: 'Bertahan. Hindari tembakan, kumpulkan amunisi.',
      bg: '#0a0e12', spawn: { x: 80, y: 300 },
      walls: [{x:250,y:0,w:25,h:180},{x:250,y:250,w:25,h:230},{x:500,y:80,w:25,h:200}],
      hides: [{x:120,y:80,w:70,h:55},{x:350,y:300,w:75,h:55},{x:580,y:150,w:70,h:50}],
      npcs: [],
      items: [{x:400,y:200,id:'amunisi',name:'Amunisi',icon:'💥',taken:false}],
      patrols: [
        {x:180,y:120,r:13,path:[[180,80],[180,400]],idx:0,speed:1.5,vision:70},
        {x:380,y:200,r:13,path:[[300,200],[480,200]],idx:0,speed:1.4,vision:65},
        {x:550,y:350,r:13,path:[[550,100],[550,400]],idx:0,speed:1.35,vision:68}
      ],
      exits: [{x:700,y:280,w:55,h:55,to:'end',label:'Pertahankan Surabaya! →'}],
      alarmEnabled: true
    }
  ],

  // ========== BABAK 04: AGRESI BELANDA ==========
  agresi: [
    {
      id: 'yogya_1947', title: 'Yogyakarta · 1947',
      objective: 'Dengar kabar Agresi. Bicara dengan pemimpin.',
      bg: '#12100e', spawn: { x: 100, y: 300 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25},{x:0,y:0,w:25,h:480},{x:775,y:0,w:25,h:480}],
      hides: [],
      npcs: [
        {x:300,y:200,name:'Soekarno',r:16,color:'#fbbf24',dialog:['Belanda melancarkan agresi.','Kita tidak akan menyerah.']},
        {x:500,y:240,name:'Sudirman',r:15,color:'#4ade80',dialog:['Perang gerilya adalah jalan kita.','TNI akan terus berjuang.']}
      ],
      items: [{x:200,y:150,id:'peta_gerilya',name:'Peta Gerilya',icon:'🗺️',taken:false}],
      patrols: [],
      exits: [{x:680,y:300,w:55,h:55,to:1,label:'Ke Medan Gerilya →'}],
      alarmEnabled: false
    },
    {
      id: 'gerilya', title: 'Medan Gerilya · Hutan',
      objective: 'Selinap di hutan. Hindari pasukan Belanda.',
      bg: '#0a140a', spawn: { x: 50, y: 280 },
      walls: [{x:200,y:50,w:30,h:160},{x:400,y:200,w:30,h:200},{x:600,y:80,w:30,h:150}],
      hides: [{x:100,y:60,w:75,h:55},{x:280,y:280,w:70,h:55},{x:480,y:100,w:70,h:50},{x:650,y:300,w:70,h:55}],
      npcs: [],
      items: [{x:350,y:180,id:'obat_luka',name:'Obat Luka',icon:'💊',taken:false}],
      patrols: [
        {x:180,y:150,r:12,path:[[180,100],[180,400]],idx:0,speed:1.4,vision:62},
        {x:450,y:250,r:12,path:[[350,250],[580,250]],idx:0,speed:1.35,vision:60},
        {x:620,y:180,r:12,path:[[620,100],[620,380]],idx:0,speed:1.3,vision:58}
      ],
      exits: [{x:720,y:250,w:50,h:55,to:2,label:'Pos Komando →'}],
      alarmEnabled: true
    },
    {
      id: 'pos_komando', title: 'Pos Komando Gerilya',
      objective: 'Terima perintah Jenderal Sudirman.',
      bg: '#10140c', spawn: { x: 120, y: 320 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25}],
      hides: [],
      npcs: [
        {x:400,y:220,name:'Jenderal Sudirman',r:16,color:'#4ade80',dialog:['Meski sakit, saya tetap memimpin.','Gerilya terus. Jangan menyerah.','Diplomasi dan senjata berjalan bersama.']},
        {x:550,y:280,name:'Perwira',r:14,color:'#86efac',dialog:['Pasukan siap menunggu perintah.']}
      ],
      items: [{x:250,y:150,id:'surat_perintah',name:'Surat Perintah',icon:'📩',taken:false}],
      patrols: [],
      exits: [{x:680,y:300,w:55,h:55,to:3,label:'Ke Perundingan →',requireFlag:'sudirman_ok'}],
      alarmEnabled: false
    },
    {
      id: 'perundingan', title: 'Perundingan · Diplomasi',
      objective: 'Dukung diplomasi. Bicara delegasi Indonesia.',
      bg: '#12101a', spawn: { x: 100, y: 300 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25}],
      hides: [],
      npcs: [
        {x:350,y:200,name:'Mohammad Roem',r:15,color:'#a78bfa',dialog:['Kita berunding, tapi tidak tunduk.','Kedaulatan harus diakui.']},
        {x:520,y:250,name:'Delegasi',r:14,color:'#94a3b8',dialog:['Dunia mulai melihat perjuangan kita.']}
      ],
      items: [], patrols: [],
      exits: [{x:680,y:300,w:60,h:55,to:'end',label:'Pertahankan Kedaulatan →'}],
      alarmEnabled: false
    }
  ],

  // ========== BABAK 05: SUMPAH PEMUDA ==========
  sumpah: [
    {
      id: 'kongres1', title: 'Kongres Pemuda I · 1926',
      objective: 'Kenali organisasi pemuda. Kumpulkan semangat.',
      bg: '#101218', spawn: { x: 80, y: 320 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25},{x:0,y:0,w:25,h:480},{x:775,y:0,w:25,h:480}],
      hides: [],
      npcs: [
        {x:250,y:200,name:'Pemuda Jong Java',r:14,color:'#38bdf8',dialog:['Kita perlu bersatu.','Beda organisasi, satu tujuan.']},
        {x:450,y:240,name:'Pemuda Sumatra',r:14,color:'#4ade80',dialog:['Dari Sabang sampai Merauke.']},
        {x:600,y:180,name:'Pemuda Ambon',r:14,color:'#f472b6',dialog:['Persatuan adalah kekuatan.']}
      ],
      items: [{x:350,y:350,id:'semangat_1',name:'Semangat Persatuan',icon:'✨',taken:false}],
      patrols: [],
      exits: [{x:700,y:300,w:55,h:55,to:1,label:'Ke Kongres II →'}],
      alarmEnabled: false
    },
    {
      id: 'jalan_1928', title: 'Jakarta · Menuju Kongres II',
      objective: 'Pergi ke lokasi Kongres Pemuda II.',
      bg: '#0c1014', spawn: { x: 50, y: 250 },
      walls: [{x:0,y:0,w:800,h:35},{x:0,y:445,w:800,h:35},{x:320,y:100,w:25,h:150}],
      hides: [{x:150,y:80,w:65,h:50},{x:400,y:300,w:70,h:50}],
      npcs: [],
      items: [{x:280,y:180,id:'undangan',name:'Undangan Kongres',icon:'🎫',taken:false}],
      patrols: [
        {x:220,y:160,r:11,path:[[220,120],[220,380]],idx:0,speed:1.2,vision:50}
      ],
      exits: [{x:720,y:230,w:50,h:55,to:2,label:'Gedung Kongres →'}],
      alarmEnabled: true
    },
    {
      id: 'kongres2', title: 'Kongres Pemuda II · 27-28 Oktober 1928',
      objective: 'Ikuti sidang. Bicara tokoh penting.',
      bg: '#12141a', spawn: { x: 100, y: 340 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25},{x:0,y:0,w:25,h:480},{x:775,y:0,w:25,h:480},{x:380,y:60,w:20,h:140}],
      hides: [],
      npcs: [
        {x:280,y:200,name:'Sugondo Djojopuspito',r:15,color:'#fbbf24',dialog:['Selamat datang di Kongres Pemuda II.','Hari ini kita tentukan arah bangsa.']},
        {x:450,y:240,name:'Muhammad Yamin',r:14,color:'#38bdf8',dialog:['Satu nusa, satu bangsa.','Bahasa Indonesia sebagai bahasa persatuan.']},
        {x:600,y:190,name:'Wage Rudolf Supratman',r:14,color:'#a78bfa',dialog:['Saya akan memperdengarkan sebuah lagu.','Indonesia Raya.']}
      ],
      items: [{x:200,y:120,id:'semangat_2',name:'Semangat Sumpah',icon:'🔥',taken:false}],
      patrols: [],
      exits: [{x:680,y:320,w:55,h:55,to:3,label:'Pembacaan Sumpah →',requireFlag:'kongres_ok'}],
      alarmEnabled: false
    },
    {
      id: 'sumpah_pemuda', title: 'Sumpah Pemuda · 28 Oktober 1928',
      objective: 'Saksikan pembacaan Sumpah Pemuda.',
      bg: '#0e1018', spawn: { x: 150, y: 320 },
      walls: [{x:0,y:0,w:800,h:25},{x:0,y:455,w:800,h:25}],
      hides: [],
      npcs: [
        {x:350,y:200,name:'Ketua',r:16,color:'#fbbf24',dialog:['Pertama: Kami putra dan putri Indonesia mengaku bertumpah darah yang satu, tanah Indonesia.','Kedua: Kami putra dan putri Indonesia mengaku berbangsa yang satu, bangsa Indonesia.','Ketiga: Kami putra dan putri Indonesia menjunjung bahasa persatuan, bahasa Indonesia.']},
        {x:520,y:260,name:'Seluruh Pemuda',r:14,color:'#86efac',dialog:['Satu Nusa! Satu Bangsa! Satu Bahasa!']}
      ],
      items: [], patrols: [],
      exits: [{x:680,y:300,w:60,h:55,to:'end',label:'Selesai · Sumpah Pemuda →'}],
      alarmEnabled: false
    }
  ]
};
// ---------- ENGINE ----------
function startStealth() {
  showScreen('stealth-stage');
  game.inventory = [];
  game.flags = {};
  game.alarm = 0;
  game.detected = false;
  game.mapId = 0;
  // reset items taken for this stage
  const maps = STAGE_MAPS[game.currentStageId] || [];
  maps.forEach(m => (m.items || []).forEach(it => { it.taken = false; }));
  updateInvUI();
  setTimeout(() => loadMap(0), 60);
}

function stopStealth() {
  game.running = false;
  if (game.loopId) cancelAnimationFrame(game.loopId);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
}

function loadMap(id) {
  stopStealth();
  if (id === 'end' || id >= (STAGE_MAPS[game.currentStageId] || []).length) {
    // Stage complete → go to story/ending summary
    onStageComplete();
    return;
  }

  game.mapId = id;
  const maps = STAGE_MAPS[game.currentStageId] || STAGE_MAPS.rengasdengklok;
  const m = maps[id];
  game.player.x = m.spawn.x;
  game.player.y = m.spawn.y;
  game.alarm = 0;
  game.detected = false;
  game.nearInteract = null;
  game.dialogOpen = false;

  // reset items taken state only if first time? keep taken across maps for inventory
  // (items already have taken flag)

  const canvas = document.getElementById('stealth-canvas');
  game.canvas = canvas;
  game.ctx = canvas.getContext('2d');
  game.W = canvas.width;
  game.H = canvas.height;

  document.getElementById('map-title').textContent = m.title;
  document.getElementById('objective-bar').textContent = 'Tujuan: ' + m.objective;
  document.getElementById('stealth-fail').style.display = 'none';
  document.getElementById('stealth-success').style.display = 'none';
  document.getElementById('npc-dialog').style.display = 'none';
  document.getElementById('inv-panel').style.display = 'none';

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  setupMobileControls();

  game.running = true;
  game.loopId = requestAnimationFrame(gameLoop);
}

function onStageComplete() {
  stopStealth();
  document.getElementById('success-title').textContent = 'TAHAP SELESAI';
  document.getElementById('success-desc').textContent =
    'Kamu telah melewati rangkaian peristiwa Rengasdengklok. Rombongan kembali ke Jakarta untuk menyusun naskah proklamasi.';
  document.getElementById('stealth-success').style.display = 'flex';
  // btn continue will go to story or dashboard
  storyState.tekad = Math.min(100, (storyState.tekad || 50) + 20);
}

function onKeyDown(e) {
  game.keys[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === 'e') tryInteract();
  if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) e.preventDefault();
}
function onKeyUp(e) {
  game.keys[e.key.toLowerCase()] = false;
}

function setupMobileControls() {
  const zone = document.getElementById('joystick-zone');
  const knob = document.getElementById('joystick-knob');
  const action = document.getElementById('mobile-action');
  if (!zone) return;

  const setJoy = (clientX, clientY) => {
    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const max = 35;
    const len = Math.hypot(dx, dy) || 1;
    if (len > max) { dx = dx / len * max; dy = dy / len * max; }
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    game.joy.dx = dx / max;
    game.joy.dy = dy / max;
    game.joy.active = true;
  };
  const resetJoy = () => {
    knob.style.transform = 'translate(-50%, -50%)';
    game.joy.dx = 0; game.joy.dy = 0; game.joy.active = false;
  };

  zone.ontouchstart = (e) => { e.preventDefault(); setJoy(e.touches[0].clientX, e.touches[0].clientY); };
  zone.ontouchmove = (e) => { e.preventDefault(); setJoy(e.touches[0].clientX, e.touches[0].clientY); };
  zone.ontouchend = resetJoy;

  if (action) {
    action.onclick = (e) => { e.preventDefault(); tryInteract(); };
  }

  // Tap on canvas to interact with nearest
  const canvas = document.getElementById('stealth-canvas');
  if (canvas) {
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      // if near something, interact
      tryInteract();
    };
  }
}

function getMap() {
  const maps = STAGE_MAPS[game.currentStageId] || STAGE_MAPS.rengasdengklok;
  return maps[game.mapId];
}

function isHidden() {
  const p = game.player;
  return (getMap().hides || []).some(h =>
    p.x > h.x && p.x < h.x + h.w && p.y > h.y && p.y < h.y + h.h
  );
}

function collides(nx, ny) {
  const r = game.player.r;
  return (getMap().walls || []).some(w =>
    nx + r > w.x && nx - r < w.x + w.w && ny + r > w.y && ny - r < w.y + w.h
  );
}

function updateNearInteract() {
  const p = game.player;
  const m = getMap();
  let best = null;
  let bestD = 42;

  (m.npcs || []).forEach(n => {
    const d = Math.hypot(p.x - n.x, p.y - n.y);
    if (d < bestD) { bestD = d; best = { type: 'npc', ref: n }; }
  });
  (m.items || []).forEach(it => {
    if (it.taken) return;
    const d = Math.hypot(p.x - it.x, p.y - it.y);
    if (d < bestD) { bestD = d; best = { type: 'item', ref: it }; }
  });
  (m.exits || []).forEach(ex => {
    if (p.x > ex.x && p.x < ex.x + ex.w && p.y > ex.y && p.y < ex.y + ex.h) {
      best = { type: 'exit', ref: ex };
      bestD = 0;
    }
  });

  game.nearInteract = best;
  const hint = document.getElementById('interact-hint');
  if (hint) {
    if (!best) hint.textContent = 'WASD / Joystick bergerak · E / Tap untuk interaksi';
    else if (best.type === 'npc') hint.textContent = `Tekan E / Tap · Bicara dengan ${best.ref.name}`;
    else if (best.type === 'item') hint.textContent = `Tekan E / Tap · Ambil ${best.ref.name}`;
    else if (best.type === 'exit') hint.textContent = `Tekan E / Tap · ${best.ref.label}`;
  }
}

function tryInteract() {
  if (game.dialogOpen || game.detected) return;
  const near = game.nearInteract;
  if (!near) return;

  if (near.type === 'npc') {
    openDialog(near.ref);
    // set flags based on NPC name
    const n = near.ref.name;
    if (n === 'Soekarno') {
      if (game.mapId === 3) game.flags.talked_soekarno = true;
      if (game.mapId === 5) game.flags.talked_rengas = true;
    }
    if (n === 'Bung Tomo') game.flags.bungtomo_ok = true;
    if (n === 'Jenderal Sudirman') game.flags.sudirman_ok = true;
    if (n === 'Sugondo Djojopuspito' || n === 'Muhammad Yamin') game.flags.kongres_ok = true;
  } else if (near.type === 'item') {
    const it = near.ref;
    if (!it.taken) {
      it.taken = true;
      game.inventory.push({ id: it.id, name: it.name, icon: it.icon });
      updateInvUI();
      if (it.id === 'naskah') game.flags.got_naskah = true;
      if (it.id === 'bendera_proklamasi') game.flags.ready_proklamasi = true;
    }
  } else if (near.type === 'exit') {
    const ex = near.ref;
    if (ex.requireFlag && !game.flags[ex.requireFlag]) {
      // show brief message
      openDialog({ name: 'Sistem', dialog: ['Kamu belum menyelesaikan tujuan di sini.'] });
      return;
    }
    loadMap(ex.to);
  }
}

function openDialog(npc) {
  game.dialogOpen = true;
  game.dialogQueue = [...(npc.dialog || ['...'])];
  document.getElementById('npc-name').textContent = npc.name;
  document.getElementById('npc-text').textContent = game.dialogQueue.shift() || '...';
  document.getElementById('npc-dialog').style.display = 'block';
}

function nextDialog() {
  if (game.dialogQueue.length === 0) {
    document.getElementById('npc-dialog').style.display = 'none';
    game.dialogOpen = false;
    return;
  }
  document.getElementById('npc-text').textContent = game.dialogQueue.shift();
}

function updateInvUI() {
  const count = document.getElementById('inv-count');
  if (count) count.textContent = game.inventory.length;
  const list = document.getElementById('inv-list');
  if (!list) return;
  if (game.inventory.length === 0) {
    list.innerHTML = '<p class="inv-empty">Kosong</p>';
  } else {
    list.innerHTML = game.inventory.map(it =>
      `<div class="inv-item"><span>${it.icon}</span> ${it.name}</div>`
    ).join('');
  }
}

function gameLoop() {
  if (!game.running) return;
  game.animT += 0.05;

  if (!game.dialogOpen && !game.detected) {
    // Movement
    let dx = 0, dy = 0;
    const sp = game.player.speed;
    if (game.keys['w'] || game.keys['arrowup']) dy -= sp;
    if (game.keys['s'] || game.keys['arrowdown']) dy += sp;
    if (game.keys['a'] || game.keys['arrowleft']) dx -= sp;
    if (game.keys['d'] || game.keys['arrowright']) dx += sp;
    // joystick
    if (game.joy.active) {
      dx += game.joy.dx * sp;
      dy += game.joy.dy * sp;
    }
    if (dx && dy) { dx *= 0.707; dy *= 0.707; }
    if (dx > 0) game.player.facing = 1;
    if (dx < 0) game.player.facing = -1;

    let nx = game.player.x + dx;
    let ny = game.player.y + dy;
    nx = Math.max(16, Math.min(game.W - 16, nx));
    ny = Math.max(16, Math.min(game.H - 16, ny));
    if (!collides(nx, game.player.y)) game.player.x = nx;
    if (!collides(game.player.x, ny)) game.player.y = ny;

    // Patrols
    const m = getMap();
    if (m.alarmEnabled) {
      (m.patrols || []).forEach(pat => {
        const path = pat.path;
        const target = path[pat.idx];
        const dist = Math.hypot(target[0] - pat.x, target[1] - pat.y);
        if (dist < 5) pat.idx = (pat.idx + 1) % path.length;
        else {
          const ang = Math.atan2(target[1] - pat.y, target[0] - pat.x);
          pat.x += Math.cos(ang) * pat.speed;
          pat.y += Math.sin(ang) * pat.speed;
        }
        const d = Math.hypot(game.player.x - pat.x, game.player.y - pat.y);
        if (d < pat.vision && !isHidden()) {
          game.alarm += 1.5;
          if (game.alarm >= 100) {
            game.alarm = 100;
            game.detected = true;
            document.getElementById('stealth-fail').style.display = 'flex';
            game.running = false;
          }
        }
      });
      if (!game.detected && game.alarm > 0) game.alarm = Math.max(0, game.alarm - 0.1);
      const av = document.getElementById('alarm-value');
      if (av) av.textContent = Math.round(game.alarm);
    }

    updateNearInteract();
  }

  drawGame();
  game.loopId = requestAnimationFrame(gameLoop);
}

function drawGame() {
  const ctx = game.ctx;
  if (!ctx) return;
  const m = getMap();
  const W = game.W, H = game.H;

  ctx.fillStyle = m.bg || '#0b140b';
  ctx.fillRect(0, 0, W, H);

  // subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  // hides
  (m.hides || []).forEach(h => {
    ctx.fillStyle = 'rgba(40,130,55,0.35)';
    ctx.strokeStyle = 'rgba(80,180,90,0.45)';
    ctx.setLineDash([4,3]);
    ctx.fillRect(h.x, h.y, h.w, h.h);
    ctx.strokeRect(h.x, h.y, h.w, h.h);
    ctx.setLineDash([]);
    ctx.font = '15px serif';
    ctx.fillStyle = 'rgba(100,200,110,0.7)';
    ctx.fillText('🌿', h.x + h.w/2 - 8, h.y + h.h/2 + 5);
  });

  // walls
  (m.walls || []).forEach(w => {
    ctx.fillStyle = '#2c2c2c';
    ctx.strokeStyle = '#555';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeRect(w.x, w.y, w.w, w.h);
  });

  // exits
  (m.exits || []).forEach(ex => {
    ctx.fillStyle = 'rgba(212,175,55,0.2)';
    ctx.strokeStyle = '#D4AF37';
    ctx.setLineDash([5,3]);
    ctx.fillRect(ex.x, ex.y, ex.w, ex.h);
    ctx.strokeRect(ex.x, ex.y, ex.w, ex.h);
    ctx.setLineDash([]);
    ctx.fillStyle = '#D4AF37';
    ctx.font = '11px Inter,sans-serif';
    ctx.fillText(ex.label || '→', ex.x + 4, ex.y - 6);
  });

  // items
  (m.items || []).forEach(it => {
    if (it.taken) return;
    const bob = Math.sin(game.animT * 2) * 3;
    ctx.font = '18px serif';
    ctx.fillText(it.icon, it.x - 9, it.y + 6 + bob);
  });

  // npcs
  (m.npcs || []).forEach(n => {
    const bob = Math.sin(game.animT + n.x) * 2;
    ctx.beginPath();
    ctx.arc(n.x, n.y + bob, n.r, 0, Math.PI * 2);
    ctx.fillStyle = n.color || '#aaa';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = '10px Inter,sans-serif';
    ctx.fillText(n.name, n.x - n.r, n.y - n.r - 6 + bob);
  });

  // patrols
  (m.patrols || []).forEach(pat => {
    ctx.beginPath();
    ctx.arc(pat.x, pat.y, pat.vision, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,16,46,0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,16,46,0.28)';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(pat.x, pat.y, pat.r, 0, Math.PI * 2);
    ctx.fillStyle = '#c8102e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.font = '11px serif';
    ctx.fillText('🇯🇵', pat.x - 7, pat.y + 4);
  });

  // player
  const pl = game.player;
  const hidden = isHidden();
  const bob = Math.sin(game.animT * 3) * 1.5;
  ctx.beginPath();
  ctx.arc(pl.x, pl.y + bob, pl.r, 0, Math.PI * 2);
  ctx.fillStyle = hidden ? '#86efac' : '#4ade80';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
  if (!hidden) {
    ctx.beginPath();
    ctx.arc(pl.x, pl.y + bob, pl.r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(74,222,128,0.25)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

// wire extra UI
function wireAdventureUI() {
  const invBtn = document.getElementById('inv-btn');
  const invPanel = document.getElementById('inv-panel');
  const invClose = document.getElementById('inv-close');
  if (invBtn) invBtn.onclick = () => {
    invPanel.style.display = invPanel.style.display === 'none' ? 'block' : 'none';
  };
  if (invClose) invClose.onclick = () => { invPanel.style.display = 'none'; };

  const npcNext = document.getElementById('npc-next');
  if (npcNext) npcNext.onclick = nextDialog;
}

// -------------------- INIT --------------------
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderStages();
  initEvents();
  wireAdventureUI();

  // Ganti nama pembuat di sini:
  // document.getElementById('creator-name').textContent = 'Nama Kamu';
});
