/* ==========================================================================
   PERJUANGAN — data.js
   Mission chain + full Learn Mode articles (ID / EN).
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.MISSIONS = [
  {
    id: "sumpah-pemuda",
    order: 1,
    icon: "unity",
    x: 16,
    y: 78,
    title: { id: "Sumpah Pemuda", en: "Youth Pledge" },
    subtitle: { id: "Ikrar Persatuan", en: "The Pledge of Unity" },
    date: { id: "28 Oktober 1928", en: "28 October 1928" },
    blurb: {
      id: "Pemuda-pemudi dari seluruh penjuru Nusantara berkumpul dan mengikrarkan satu tekad: satu tanah air, satu bangsa, satu bahasa Indonesia.",
      en: "Youth from across the archipelago gathered and pledged one resolve: one homeland, one nation, one Indonesian language.",
    },
  },
  {
    id: "rengasdengklok",
    order: 2,
    icon: "night-op",
    x: 36,
    y: 55,
    title: { id: "Rengasdengklok", en: "Rengasdengklok" },
    subtitle: { id: "Desakan Golongan Muda", en: "The Young Group's Pressure" },
    date: { id: "16 Agustus 1945", en: "16 August 1945" },
    blurb: {
      id: "Golongan muda membawa Soekarno dan Hatta ke Rengasdengklok, mendesak agar proklamasi segera dikumandangkan tanpa menunggu keputusan Jepang.",
      en: "Young activists took Soekarno and Hatta to Rengasdengklok, pressing for an immediate proclamation without waiting for Japan.",
    },
  },
  {
    id: "proklamasi",
    order: 3,
    icon: "manuscript",
    x: 50,
    y: 28,
    title: { id: "Proklamasi", en: "Proclamation" },
    subtitle: { id: "Lahirnya Republik", en: "Birth of the Republic" },
    date: { id: "17 Agustus 1945", en: "17 August 1945" },
    blurb: {
      id: "Di kediaman Jalan Pegangsaan Timur No. 56, naskah proklamasi dibacakan oleh Soekarno didampingi Hatta. Republik Indonesia lahir.",
      en: "At Pegangsaan Timur 56, Soekarno read the proclamation text beside Hatta. The Republic of Indonesia was born.",
    },
  },
  {
    id: "surabaya",
    order: 4,
    icon: "battle",
    x: 68,
    y: 50,
    title: { id: "Pertempuran Surabaya", en: "Battle of Surabaya" },
    subtitle: { id: "Hari Pahlawan", en: "Heroes' Day" },
    date: { id: "10 November 1945", en: "10 November 1945" },
    blurb: {
      id: "Rakyat Surabaya, bersenjata seadanya namun berhati baja, melawan kekuatan Sekutu dalam pertempuran besar pertama pasca-proklamasi.",
      en: "The people of Surabaya, lightly armed but unyielding, faced Allied forces in the first major battle after the proclamation.",
    },
  },
  {
    id: "agresi-gerilya",
    order: 5,
    icon: "guerrilla",
    x: 86,
    y: 74,
    title: { id: "Agresi & Gerilya", en: "Aggression & Guerrilla War" },
    subtitle: { id: "Mempertahankan Kedaulatan", en: "Defending Sovereignty" },
    date: { id: "1947 – 1949", en: "1947 – 1949" },
    blurb: {
      id: "Belanda melancarkan agresi militer. TNI dan rakyat menjawab lewat taktik gerilya di pelosok negeri, hingga pengakuan kedaulatan.",
      en: "The Dutch launched military aggressions. The army and people answered with guerrilla tactics across the country until sovereignty was recognized.",
    },
  },
];

/* ---------- Learn Mode full articles ---------- */
PJ.LEARN_ARTICLES = {
  "sumpah-pemuda": {
    id: {
      lead: "Kongres Pemuda II di Batavia menghasilkan ikrar yang menjadi fondasi kebangsaan Indonesia modern.",
      sections: [
        {
          h: "Latar belakang (1926–1928)",
          p: "Sejak awal abad ke-20, organisasi pemuda tumbuh berdasarkan daerah atau etnis: Jong Java, Jong Sumatranen Bond, Jong Celebes, dan lainnya. Kongres Pemuda I (1926) mulai membuka ruang dialog lintas kelompok, namun belum menghasilkan ikrar bersama yang kuat. Di tengah politik etis dan pergerakan nasional yang semakin sadar, muncullah kebutuhan akan satu identitas yang melampaui batas daerah.",
        },
        {
          h: "Kongres Pemuda II",
          p: "Pada 27–28 Oktober 1928, Kongres Pemuda II digelar di Batavia (Jakarta). Dipimpin oleh Soegondo Djojopoespito, kongres ini melibatkan utusan dari berbagai organisasi pemuda. Muhammad Yamin berperan besar dalam perumusan gagasan, sementara Wage Rudolf Supratman memperdengarkan lagu yang kelak menjadi Indonesia Raya.",
        },
        {
          h: "Isi Sumpah Pemuda",
          p: "Putusan kongres yang dikenal sebagai Sumpah Pemuda berbunyi, secara ringkas: kami putra dan putri Indonesia mengaku bertumpah darah yang satu, tanah Indonesia; berbangsa yang satu, bangsa Indonesia; dan menjunjung bahasa persatuan, bahasa Indonesia. Ikrar ini menegaskan kesatuan wilayah, bangsa, dan bahasa sebagai dasar kebangsaan.",
        },
        {
          h: "Tokoh penting",
          p: "Soegondo Djojopoespito (ketua), Muhammad Yamin (perumus gagasan), Wage Rudolf Supratman (pencipta lagu), serta utusan organisasi pemuda dari berbagai daerah. Peran perempuan juga hadir melalui organisasi seperti Putri Indonesia dan lainnya yang mendukung semangat kongres.",
        },
        {
          h: "Dampak",
          p: "Sumpah Pemuda menjadi tonggak psikologis dan politis: bahasa Indonesia diperkuat sebagai lingua franca pergerakan, dan kesadaran “satu bangsa” menguat di luar struktur kolonial. Ikrar 1928 menjadi salah satu akar moral Proklamasi 1945.",
        },
        {
          h: "Kutipan",
          p: "“Kami putra dan putri Indonesia menjunjung bahasa persatuan, bahasa Indonesia.” — inti Putusan Kongres Pemuda II, 28 Oktober 1928.",
        },
      ],
    },
    en: {
      lead: "The Second Youth Congress in Batavia produced a pledge that became a foundation of modern Indonesian nationhood.",
      sections: [
        {
          h: "Background (1926–1928)",
          p: "From the early 20th century, youth organizations grew along regional or ethnic lines: Jong Java, Jong Sumatranen Bond, Jong Celebes, and others. The First Youth Congress (1926) opened cross-group dialogue but did not yet yield a strong shared pledge. Amid the Ethical Policy and a rising national movement, the need for an identity beyond regional borders became clear.",
        },
        {
          h: "Second Youth Congress",
          p: "On 27–28 October 1928 the Second Youth Congress was held in Batavia (Jakarta). Chaired by Soegondo Djojopoespito, it brought together delegates from many youth organizations. Muhammad Yamin played a major role in shaping the ideas, while Wage Rudolf Supratman performed the song that would become Indonesia Raya.",
        },
        {
          h: "The Youth Pledge",
          p: "The congress resolution known as the Youth Pledge states, in essence: we the sons and daughters of Indonesia acknowledge one motherland, the land of Indonesia; one nation, the Indonesian nation; and uphold the language of unity, the Indonesian language. It affirmed unity of territory, nation, and language as the basis of nationhood.",
        },
        {
          h: "Key figures",
          p: "Soegondo Djojopoespito (chair), Muhammad Yamin (ideational architect), Wage Rudolf Supratman (composer), and delegates from regional youth bodies. Women also took part through organizations such as Putri Indonesia that supported the congress spirit.",
        },
        {
          h: "Impact",
          p: "The Youth Pledge became a psychological and political milestone: Indonesian was strengthened as the movement’s lingua franca, and the sense of “one nation” grew beyond colonial structures. The 1928 pledge became one of the moral roots of the 1945 Proclamation.",
        },
        {
          h: "Quote",
          p: "“We the sons and daughters of Indonesia uphold the language of unity, the Indonesian language.” — core of the Second Youth Congress resolution, 28 October 1928.",
        },
      ],
    },
  },

  "rengasdengklok": {
    id: {
      lead: "Malam tegang di Rengasdengklok memaksa keputusan: proklamasi tidak boleh ditunda oleh perhitungan politik Jepang.",
      sections: [
        {
          h: "Konteks Agustus 1945",
          p: "Setelah Jepang menyerah pada Sekutu (15 Agustus 1945), muncul kekosongan kekuasaan di Hindia Belanda. Golongan tua di BPUPKI/PPKI cenderung menunggu saat yang “aman” dan koordinasi dengan pihak Jepang. Golongan muda menolak penundaan: kemerdekaan harus dinyatakan segera atas nama bangsa sendiri.",
        },
        {
          h: "Peristiwa 16 Agustus",
          p: "Pada dini hari 16 Agustus 1945, sejumlah pemuda—termasuk Wikana, Chaerul Saleh, dan dukungan dari PETA di bawah pengaruh tokoh seperti Singgih—membawa Soekarno dan Hatta ke Rengasdengklok, Karawang. Tujuannya mendesak agar proklamasi dilakukan tanpa menunggu restu Jepang atau skenario Sekutu.",
        },
        {
          h: "Negosiasi dan kembali ke Jakarta",
          p: "Di Rengasdengklok berlangsung perundingan tegang. Akhirnya dicapai kesepakatan bahwa proklamasi akan dilaksanakan keesokan harinya. Soekarno dan Hatta kembali ke Jakarta. Malam itu pula naskah proklamasi disusun di rumah Laksamana Maeda, dengan keterlibatan tokoh muda dan tua.",
        },
        {
          h: "Tokoh penting",
          p: "Wikana, Chaerul Saleh, dan pemuda lainnya sebagai pendesak; Soekarno dan Mohammad Hatta sebagai pemimpin yang akhirnya membacakan proklamasi; dukungan dari unsur PETA dan jaringan underground pemuda di Jakarta.",
        },
        {
          h: "Dampak",
          p: "Rengasdengklok memotong keraguan dan mempercepat jadwal proklamasi. Peristiwa ini menandai bahwa kemerdekaan adalah keputusan bangsa Indonesia sendiri, bukan hadiah dari kekuatan asing yang sedang kalah atau menang perang.",
        },
        {
          h: "Kutipan semangat",
          p: "Desakan golongan muda pada dasarnya sederhana: “Sekarang, atau sejarah akan mencatat kita ragu.”",
        },
      ],
    },
    en: {
      lead: "A tense night in Rengasdengklok forced the issue: the proclamation must not be delayed by Japanese political calculations.",
      sections: [
        {
          h: "Context of August 1945",
          p: "After Japan’s surrender to the Allies (15 August 1945), a power vacuum opened in the Dutch East Indies. Older leaders in BPUPKI/PPKI tended to wait for a “safe” moment and coordination with the Japanese. Younger activists rejected delay: independence had to be declared at once in the nation’s own name.",
        },
        {
          h: "The events of 16 August",
          p: "In the early hours of 16 August 1945, youths—including Wikana, Chaerul Saleh, and support from PETA under figures such as Singgih—took Soekarno and Hatta to Rengasdengklok, Karawang. The aim was to press for a proclamation without waiting for Japanese approval or Allied scenarios.",
        },
        {
          h: "Negotiation and return to Jakarta",
          p: "Tense talks took place in Rengasdengklok. Agreement was reached that the proclamation would be held the next day. Soekarno and Hatta returned to Jakarta. That same night the proclamation text was drafted at Admiral Maeda’s house, with both young and older leaders involved.",
        },
        {
          h: "Key figures",
          p: "Wikana, Chaerul Saleh and other youths as the pressure group; Soekarno and Mohammad Hatta as the leaders who would read the proclamation; support from PETA elements and underground youth networks in Jakarta.",
        },
        {
          h: "Impact",
          p: "Rengasdengklok cut through hesitation and accelerated the proclamation. It marked independence as a decision of the Indonesian nation itself, not a gift from foreign powers winning or losing the war.",
        },
        {
          h: "Spirit of the moment",
          p: "The young group’s demand was essentially simple: “Now—or history will record that we hesitated.”",
        },
      ],
    },
  },

  "proklamasi": {
    id: {
      lead: "Pada 17 Agustus 1945, di Jalan Pegangsaan Timur 56, Republik Indonesia dinyatakan berdiri.",
      sections: [
        {
          h: "Penyusunan naskah",
          p: "Naskah proklamasi disusun pada malam 16 menuju 17 Agustus di rumah Laksamana Tadashi Maeda. Konsep awal dikerjakan bersama; tulisan tangan Soekarno kemudian diketik. Isi naskah singkat dan tegas: pernyataan kemerdekaan dan transfer kekuasaan yang akan dilaksanakan dengan cara saksama.",
        },
        {
          h: "Pembacaan 17 Agustus 1945",
          p: "Pagi hari, sekitar pukul 10.00, Soekarno didampingi Mohammad Hatta membacakan proklamasi di halaman rumahnya di Pegangsaan Timur 56, Jakarta. Bendera Merah Putih dikibarkan. Upacara sederhana ini menjadi titik lahirnya negara Republik Indonesia secara de facto.",
        },
        {
          h: "Isi pokok naskah",
          p: "Proklamasi menyatakan bahwa bangsa Indonesia menyatakan dengan ini kemerdekaannya. Hal-hal mengenai pemindahan kekuasaan dan lain-lain diselenggarakan dengan cara saksama dan dalam tempo yang sesingkat-singkatnya. Ditandatangani atas nama bangsa Indonesia oleh Soekarno dan Hatta.",
        },
        {
          h: "Tokoh dan saksi",
          p: "Soekarno dan Hatta sebagai proklamator; Sukarni, Sayuti Melik, dan tokoh muda yang terlibat penyusunan; hadirin terbatas di halaman rumah. Sayuti Melik dikenal mengetik naskah final.",
        },
        {
          h: "Dampak langsung",
          p: "Berita proklamasi menyebar melalui radio dan jaringan pergerakan. Di berbagai daerah muncul dukungan dan pengambilalihan kekuasaan dari Jepang. Sekutu dan Belanda tidak langsung mengakui, sehingga perjuangan diplomasi dan bersenjata berlanjut hingga 1949.",
        },
        {
          h: "Kutipan",
          p: "“Kami bangsa Indonesia dengan ini menyatakan kemerdekaan Indonesia.” — pembuka naskah Proklamasi, 17 Agustus 1945.",
        },
      ],
    },
    en: {
      lead: "On 17 August 1945, at Pegangsaan Timur 56, the Republic of Indonesia was declared.",
      sections: [
        {
          h: "Drafting the text",
          p: "The proclamation text was drafted on the night of 16–17 August at Admiral Tadashi Maeda’s house. An initial draft was prepared together; Soekarno’s handwriting was then typed. The text was short and firm: a declaration of independence and a transfer of power to be carried out carefully and as quickly as possible.",
        },
        {
          h: "The reading on 17 August 1945",
          p: "In the morning, around 10:00, Soekarno accompanied by Mohammad Hatta read the proclamation in the yard of his house at Pegangsaan Timur 56, Jakarta. The Red-and-White flag was raised. This simple ceremony marked the de facto birth of the Republic of Indonesia.",
        },
        {
          h: "Core of the text",
          p: "The proclamation stated that the Indonesian people hereby declared their independence. Matters concerning the transfer of power and so on would be carried out carefully and in the shortest possible time. It was signed in the name of the Indonesian nation by Soekarno and Hatta.",
        },
        {
          h: "Figures and witnesses",
          p: "Soekarno and Hatta as the proclaimers; Sukarni, Sayuti Melik and young activists involved in drafting; a limited crowd in the yard. Sayuti Melik is known for typing the final text.",
        },
        {
          h: "Immediate impact",
          p: "News of the proclamation spread by radio and activist networks. In many regions support rose and power was taken over from the Japanese. The Allies and the Dutch did not recognize it at once, so diplomatic and armed struggle continued until 1949.",
        },
        {
          h: "Quote",
          p: "“We the people of Indonesia hereby declare Indonesia’s independence.” — opening of the Proclamation text, 17 August 1945.",
        },
      ],
    },
  },

  "surabaya": {
    id: {
      lead: "Pertempuran Surabaya November 1945 menjadi simbol perlawanan rakyat dan dikenang sebagai Hari Pahlawan.",
      sections: [
        {
          h: "Latar setelah proklamasi",
          p: "Setelah 17 Agustus, Surabaya menjadi salah satu pusat ketegangan. Senjata Jepang diambil alih rakyat dan laskar. Kedatangan pasukan Sekutu (terutama Inggris dengan elemen India) yang didampingi kepentingan pemulihan otoritas Belanda memicu konflik.",
        },
        {
          h: "Insiden dan ultimatum",
          p: "Ketegangan memuncak setelah insiden yang menewaskan Brigadir Mallaby (Oktober 1945). Pihak Inggris mengeluarkan ultimatum agar rakyat Surabaya menyerahkan senjata. Ultimatum itu ditolak. Suara Bung Tomo melalui radio membakar semangat perlawanan.",
        },
        {
          h: "10 November 1945",
          p: "Pada 10 November, pasukan Sekutu melancarkan serangan besar ke Surabaya. Rakyat, pejuang, dan laskar bertahan dengan senjata seadanya. Pertempuran berlangsung dahsyat selama berhari-hari, menelan banyak korban, dan memaksa banyak penduduk mengungsi.",
        },
        {
          h: "Tokoh dan semangat",
          p: "Bung Tomo dikenal melalui orasi radio yang mengobarkan juang. Ribuan pejuang tanpa nama dari berbagai lapisan—pemuda, santri, pekerja—membela kota. Komando formal bercampur dengan perlawanan spontan rakyat.",
        },
        {
          h: "Dampak dan warisan",
          p: "Secara militer Surabaya akhirnya dikuasai Sekutu, namun secara moral pertempuran itu menunjukkan bahwa Republik tidak mudah ditekan. Tanggal 10 November diperingati sebagai Hari Pahlawan. Nama Surabaya terikat erat dengan mitos perlawanan rakyat.",
        },
        {
          h: "Kutipan",
          p: "Semangat yang diingat dari masa itu: lebih baik hancur daripada dijajah kembali—tekad yang disuarakan di udara Surabaya.",
        },
      ],
    },
    en: {
      lead: "The Battle of Surabaya in November 1945 became a symbol of popular resistance and is remembered as Heroes’ Day.",
      sections: [
        {
          h: "Aftermath of the proclamation",
          p: "After 17 August, Surabaya became a focus of tension. Japanese weapons were seized by civilians and militias. The arrival of Allied troops (mainly British with Indian units), linked to restoring Dutch authority, triggered conflict.",
        },
        {
          h: "Incident and ultimatum",
          p: "Tension peaked after the incident that killed Brigadier Mallaby (October 1945). The British issued an ultimatum for Surabaya’s people to surrender their weapons. It was rejected. Bung Tomo’s voice on the radio inflamed the will to resist.",
        },
        {
          h: "10 November 1945",
          p: "On 10 November Allied forces launched a major assault on Surabaya. Civilians, fighters and militias held out with limited weapons. The battle raged for days, cost many lives, and forced mass displacement.",
        },
        {
          h: "Figures and spirit",
          p: "Bung Tomo is remembered for radio orations that stirred the fight. Thousands of unnamed fighters from many walks of life—youth, students of religion, workers—defended the city. Formal command mixed with spontaneous popular resistance.",
        },
        {
          h: "Impact and legacy",
          p: "Militarily Surabaya was eventually taken by the Allies, but morally the battle showed that the Republic would not be easily crushed. 10 November is commemorated as Heroes’ Day. Surabaya remains bound to the myth of popular resistance.",
        },
        {
          h: "Spirit of the time",
          p: "The resolve remembered from those days: better to be destroyed than colonized again—a will voiced over the air of Surabaya.",
        },
      ],
    },
  },

  "agresi-gerilya": {
    id: {
      lead: "Dua agresi militer Belanda dijawab dengan perang gerilya dan diplomasi hingga pengakuan kedaulatan pada 1949.",
      sections: [
        {
          h: "Agresi Militer I (1947)",
          p: "Belanda melancarkan Agresi Militer I (Operatie Product) pada Juli 1947 untuk merebut kembali wilayah dan sumber daya. Republik kehilangan banyak kota penting, namun tidak menyerah. Perjuangan berlanjut di bidang diplomasi (PBB, perundingan) dan di lapangan.",
        },
        {
          h: "Agresi Militer II (1948) dan gerilya",
          p: "Pada Desember 1948 Belanda melancarkan Agresi II (Operatie Kraai), menduduki Yogyakarta dan menahan pemimpin Republik. Jenderal Soedirman memimpin perang gerilya; pemerintahan darurat terbentuk di Sumatra (PDRI). Taktik gerilya menyulitkan kontrol Belanda di luar kota besar.",
        },
        {
          h: "Diplomasi dan Roem–Royen",
          p: "Tekanan internasional, termasuk dari AS dan PBB, serta biaya perang yang tinggi, mendorong Belanda kembali ke meja perundingan. Persetujuan Roem–Royen (1949) membuka jalan pengembalian kepemimpinan Republik dan Konferensi Meja Bundar.",
        },
        {
          h: "Pengakuan kedaulatan",
          p: "Melalui Konferensi Meja Bundar di Den Haag, Belanda mengakui kedaulatan RIS (Republik Indonesia Serikat) pada 27 Desember 1949. Dalam perjalanan berikutnya, bentuk negara kembali ke Negara Kesatuan Republik Indonesia.",
        },
        {
          h: "Tokoh dan rakyat",
          p: "Jenderal Soedirman menjadi lambang keteguhan gerilya. Sjafruddin Prawiranegara memimpin PDRI. Di tingkat lokal, rakyat desa mendukung logistik dan intelijen pejuang. Tanpa dukungan itu, gerilya sulit bertahan.",
        },
        {
          h: "Warisan",
          p: "Periode 1945–1949 membuktikan bahwa proklamasi harus dipertahankan dengan darah, diplomasi, dan ketahanan rakyat. Agresi dan gerilya menjadi babak penutup jalan menuju pengakuan internasional atas kemerdekaan Indonesia.",
        },
      ],
    },
    en: {
      lead: "Two Dutch military aggressions were met with guerrilla war and diplomacy until sovereignty was recognized in 1949.",
      sections: [
        {
          h: "First Military Aggression (1947)",
          p: "The Dutch launched the First Military Aggression (Operatie Product) in July 1947 to retake territory and resources. The Republic lost many key cities but did not surrender. The struggle continued in diplomacy (UN, negotiations) and on the ground.",
        },
        {
          h: "Second Aggression (1948) and guerrilla war",
          p: "In December 1948 the Dutch launched the Second Aggression (Operatie Kraai), occupying Yogyakarta and detaining Republican leaders. General Soedirman led guerrilla warfare; an emergency government formed in Sumatra (PDRI). Guerrilla tactics made Dutch control outside major cities difficult.",
        },
        {
          h: "Diplomacy and Roem–Royen",
          p: "International pressure, including from the US and the UN, and the high cost of war pushed the Dutch back to the table. The Roem–Royen Agreement (1949) opened the way for the return of Republican leadership and the Round Table Conference.",
        },
        {
          h: "Recognition of sovereignty",
          p: "Through the Round Table Conference in The Hague, the Dutch recognized the sovereignty of the RIS (United States of Indonesia) on 27 December 1949. Later the form of the state returned to the Unitary Republic of Indonesia.",
        },
        {
          h: "Figures and people",
          p: "General Soedirman became the symbol of guerrilla resolve. Sjafruddin Prawiranegara led the PDRI. At the local level, villagers supported fighters with logistics and intelligence. Without that support, guerrilla war would have been hard to sustain.",
        },
        {
          h: "Legacy",
          p: "The years 1945–1949 proved that the proclamation had to be defended with blood, diplomacy, and popular endurance. Aggression and guerrilla war closed the road to international recognition of Indonesian independence.",
        },
      ],
    },
  },
};

PJ.STORAGE_KEY = "perjuangan_v2_progress";
PJ.LEARN_STORAGE_KEY = "perjuangan_v2_learn_progress";
