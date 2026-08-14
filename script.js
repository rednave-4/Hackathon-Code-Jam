// ===================== DATA STAGE =====================
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

// ===================== STATE =====================
let currentScreen = 'entrance-1';

// ===================== HELPERS =====================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    currentScreen = id;
  }
}

// ===================== PARTICLES (Entrance 1) =====================
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

// ===================== RENDER STAGE CARDS =====================
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
      card.addEventListener('click', () => openStage(stage));
    }

    grid.appendChild(card);
  });
}

// ===================== OPEN STAGE (placeholder) =====================
function openStage(stage) {
  document.getElementById('stage-title').textContent = stage.title;
  document.getElementById('stage-desc').textContent = stage.desc + ' · ' + stage.date;
  showScreen('stage-placeholder');
}

// ===================== EVENT LISTENERS =====================
function initEvents() {
  // Entrance 1 → Entrance 2
  const goToCredits = () => {
    if (currentScreen === 'entrance-1') {
      showScreen('entrance-2');
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      goToCredits();
    }
  });

  document.getElementById('entrance-1').addEventListener('click', goToCredits);

  // Entrance 2 → Dashboard
  document.getElementById('btn-to-dashboard').addEventListener('click', () => {
    showScreen('dashboard');
  });

  // Back from stage
  document.getElementById('btn-back').addEventListener('click', () => {
    showScreen('dashboard');
  });
}

// ===================== OPTIONAL: Ganti nama pembuat =====================
function setCreatorName(name) {
  const el = document.getElementById('creator-name');
  if (el && name) {
    el.textContent = name;
  }
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderStages();
  initEvents();

  // Ganti nama di sini kalau mau
  // setCreatorName('Nama Kamu');
});