/* ==========================================================================
   PERJUANGAN — data.js
   Mission chain data. Order matters: index defines unlock sequence.
   Node coordinates are in a normalized 0–100 (x) / 0–100 (y) space that
   matches both the SVG route viewBox and the percentage-positioned node
   buttons, so paths and nodes always stay perfectly aligned.
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.MISSIONS = [
  {
    id: "sumpah-pemuda",
    order: 1,
    title: "Sumpah Pemuda",
    subtitle: "Youth Pledge",
    date: "28 Oktober 1928",
    icon: "unity",
    x: 16,
    y: 78,
    blurb:
      "Pemuda-pemudi dari seluruh penjuru Nusantara berkumpul dan mengikrarkan satu tekad: satu tanah air, satu bangsa, satu bahasa Indonesia. Ikrar ini menjadi fondasi persatuan yang mempersiapkan jalan menuju kemerdekaan.",
  },
  {
    id: "rengasdengklok",
    order: 2,
    title: "Rengasdengklok",
    subtitle: "The Abduction",
    date: "16 Agustus 1945",
    icon: "night-op",
    x: 36,
    y: 55,
    blurb:
      "Golongan muda membawa Soekarno dan Hatta ke Rengasdengklok, mendesak agar proklamasi segera dikumandangkan tanpa menunggu keputusan dari pihak Jepang. Malam penuh ketegangan ini mempercepat langkah menuju kemerdekaan.",
  },
  {
    id: "proklamasi",
    order: 3,
    title: "Proklamasi",
    subtitle: "The Declaration",
    date: "17 Agustus 1945",
    icon: "manuscript",
    x: 50,
    y: 28,
    blurb:
      "Di kediaman Jalan Pegangsaan Timur No. 56, naskah proklamasi dibacakan oleh Soekarno didampingi Hatta. Detik itu menandai lahirnya Republik Indonesia sebagai bangsa yang merdeka dan berdaulat.",
  },
  {
    id: "surabaya",
    order: 4,
    title: "Pertempuran Surabaya",
    subtitle: "Battle of Surabaya",
    date: "10 November 1945",
    icon: "battle",
    x: 68,
    y: 50,
    blurb:
      "Rakyat Surabaya, bersenjata seadanya namun berhati baja, melawan kekuatan Sekutu dalam pertempuran besar pertama pasca-proklamasi. Semangat perlawanan ini mengobarkan api juang di seluruh negeri.",
  },
  {
    id: "agresi-gerilya",
    order: 5,
    title: "Agresi & Gerilya",
    subtitle: "Aggression & Guerrilla War",
    date: "1947 – 1948",
    icon: "guerrilla",
    x: 86,
    y: 74,
    blurb:
      "Belanda melancarkan agresi militer untuk merebut kembali kendali. TNI dan rakyat menjawab lewat taktik gerilya di pelosok negeri, mempertahankan kedaulatan dengan keuletan dan pengorbanan panjang.",
  },
];

PJ.STORAGE_KEY = "perjuangan_v2_progress";
