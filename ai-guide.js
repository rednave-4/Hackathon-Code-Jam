/* ==========================================================================
   PERJUANGAN — ai-guide.js
   Real AI Historical Guide via Google Gemini (free API key).
   Fallback: smarter local retrieval if no key / offline.
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.AIGuide = (function () {
  const history = []; // {role:'user'|'assistant', text}
  let open = false;
  let busy = false;
  const KEY_STORAGE = "perjuangan_gemini_key_v1";
  const PROVIDER_STORAGE = "perjuangan_ai_provider_v1";

  function lang() {
    return (PJ.I18N && PJ.I18N.getLang()) || "id";
  }
  function isId() {
    return lang() === "id";
  }

  function getApiKey() {
    if (window.PJ_AI_KEY) return window.PJ_AI_KEY;
    try {
      return localStorage.getItem(KEY_STORAGE) || "";
    } catch (e) {
      return "";
    }
  }

  function setApiKey(key) {
    try {
      if (key) localStorage.setItem(KEY_STORAGE, key.trim());
      else localStorage.removeItem(KEY_STORAGE);
    } catch (e) {}
    window.PJ_AI_KEY = key ? key.trim() : "";
    updateStatus();
  }

  function hasRealAI() {
    return !!(getApiKey() || window.PJ_AI_ENDPOINT);
  }

  /* -------------------- system prompt -------------------- */
  function systemPrompt() {
    const corpus = buildContextPack();
    if (isId()) {
      return (
        "Anda adalah Pemandu Sejarah AI untuk game edukasi PERJUANGAN (kemerdekaan Indonesia, fokus 1928–1949).\n" +
        "Aturan:\n" +
        "1. Jawab akurat, jelas, ramah, dalam Bahasa Indonesia.\n" +
        "2. Prioritaskan fakta sejarah Indonesia yang benar. Jika tidak yakin, katakan ragu dan sarankan sumber.\n" +
        "3. Boleh menjawab tokoh/peristiwa di luar daftar misi (mis. Bung Tomo, Tan Malaka, Linggarjati, Renville) selama relevan dengan perjuangan kemerdekaan.\n" +
        "4. Jangan mengarang kutipan atau tanggal. Singkat kecuali user minta detail.\n" +
        "5. Hubungkan ke materi game bila relevan (Sumpah Pemuda, Rengasdengklok, Proklamasi, Surabaya, Agresi & Gerilya).\n" +
        "6. Format: paragraf pendek; gunakan **tebal** untuk nama penting.\n\n" +
        "Materi inti game:\n" + corpus
      );
    }
    return (
      "You are the AI Historical Guide for the educational game PERJUANGAN (Indonesian independence, focus 1928–1949).\n" +
      "Rules:\n" +
      "1. Answer accurately, clearly, in English.\n" +
      "2. Prefer verified Indonesian history. If unsure, say so.\n" +
      "3. You may discuss related figures/events beyond the mission list (e.g. Bung Tomo, Tan Malaka, Linggarjati) when relevant.\n" +
      "4. Do not invent quotes or dates. Keep answers concise unless asked for detail.\n" +
      "5. Tie answers to game topics when useful (Youth Pledge, Rengasdengklok, Proclamation, Surabaya, Aggression & Guerrilla).\n" +
      "6. Use short paragraphs; **bold** key names.\n\n" +
      "Core game material:\n" + corpus
    );
  }

  function tField(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    const l = isId() ? "id" : "en";
    return obj[l] || obj.en || obj.id || "";
  }

  function buildContextPack() {
    const parts = [];
    (PJ.MISSIONS || []).forEach(function (m) {
      parts.push(
        "- " + tField(m.title) + " (" + tField(m.date) + "): " + tField(m.blurb)
      );
    });
    (PJ.GLOSSARY || []).slice(0, 12).forEach(function (g) {
      parts.push("- " + tField(g.term) + ": " + tField(g.def));
    });
    // short article leads
    const arts = PJ.LEARN_ARTICLES || {};
    const cl = isId() ? "id" : "en";
    Object.keys(arts).forEach(function (id) {
      const pack = arts[id][cl] || arts[id].en || arts[id].id;
      if (pack && pack.lead) parts.push("- [" + id + "] " + pack.lead);
    });
    return parts.join("\n");
  }

  /* -------------------- Gemini API -------------------- */
  async function askGemini(userText) {
    const key = getApiKey();
    if (!key) return null;

    const model = window.PJ_AI_MODEL || "gemini-2.0-flash";
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model +
      ":generateContent?key=" +
      encodeURIComponent(key);

    // Build multi-turn contents
    const contents = [];
    // include last ~8 turns for memory
    const recent = history.slice(-8);
    recent.forEach(function (m) {
      contents.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }],
      });
    });
    contents.push({ role: "user", parts: [{ text: userText }] });

    const body = {
      systemInstruction: { parts: [{ text: systemPrompt() }] },
      contents: contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 700,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(function () { return ""; });
      console.warn("[AIGuide] Gemini error", res.status, errText);
      if (res.status === 400 || res.status === 403 || res.status === 429) {
        throw new Error(
          isId()
            ? "API Gemini menolak permintaan (cek API key / kuota). Status " + res.status
            : "Gemini API rejected the request (check API key / quota). Status " + res.status
        );
      }
      throw new Error("Gemini HTTP " + res.status);
    }

    const data = await res.json();
    const text =
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.map(function (p) { return p.text || ""; }).join("");

    return (text || "").trim() || null;
  }

  /* -------------------- OpenAI-compatible optional -------------------- */
  async function askOpenAICompat(userText) {
    const endpoint = window.PJ_AI_ENDPOINT;
    if (!endpoint) return null;
    const key = getApiKey() || window.PJ_AI_KEY;
    const messages = [{ role: "system", content: systemPrompt() }];
    history.slice(-8).forEach(function (m) {
      messages.push({ role: m.role === "assistant" ? "assistant" : "user", content: m.text });
    });
    messages.push({ role: "user", content: userText });

    const res = await fetch(endpoint, {
      method: "POST",
      headers: Object.assign(
        { "Content-Type": "application/json" },
        key ? { Authorization: "Bearer " + key } : {}
      ),
      body: JSON.stringify({
        model: window.PJ_AI_MODEL || "gpt-4o-mini",
        messages: messages,
        temperature: 0.4,
        max_tokens: 700,
      }),
    });
    if (!res.ok) throw new Error("OpenAI-compat HTTP " + res.status);
    const data = await res.json();
    return (
      (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ||
      null
    );
  }

  /* -------------------- Local fallback (smarter FAQ + retrieval) -------------------- */
  const FAQ = [
    {
      keys: ["bung tomo", "sutomo", "tono"],
      id: "**Bung Tomo** (Sutomo, 1920–1981) adalah orator dan pemimpin perjuangan di Surabaya. Pidato radio-nya yang berapi-api memobilisasi rakyat dalam **Pertempuran Surabaya** (Oktober–November 1945). Ia menjadi simbol perlawanan arek-arek Suroboyo dan dikenang erat dengan **Hari Pahlawan** 10 November.",
      en: "**Bung Tomo** (Sutomo, 1920–1981) was an orator and resistance leader in Surabaya. His fiery radio speeches mobilized the people during the **Battle of Surabaya** (Oct–Nov 1945). He is a symbol of Surabaya’s resistance and is closely tied to **Heroes’ Day** on 10 November.",
    },
    {
      keys: ["soekarno", "sukarno", "bung karno"],
      id: "**Soekarno** (Bung Karno) adalah proklamator dan Presiden pertama RI. Bersama **Mohammad Hatta**, ia membacakan Proklamasi pada **17 Agustus 1945** di Pegangsaan Timur 56, Jakarta.",
      en: "**Soekarno** was a proclamation leader and Indonesia’s first president. With **Mohammad Hatta**, he read the Proclamation on **17 August 1945** at Pegangsaan Timur 56, Jakarta.",
    },
    {
      keys: ["hatta", "bung hatta", "mohammad hatta"],
      id: "**Mohammad Hatta** (Bung Hatta) adalah proklamator dan Wakil Presiden pertama RI. Ia mendampingi Soekarno saat Proklamasi dan berperan besar dalam diplomasi serta ekonomi awal republik.",
      en: "**Mohammad Hatta** was a proclamation leader and Indonesia’s first vice president. He stood with Soekarno at the Proclamation and played major roles in early diplomacy and economic policy.",
    },
    {
      keys: ["soedirman", "sudirman", "jenderal soedirman"],
      id: "**Jenderal Soedirman** adalah Panglima Besar TNI yang memimpin perang gerilya saat Agresi Belanda. Meski sakit, ia tetap memimpin dari tandu — simbol keteguhan perjuangan bersenjata mempertahankan kemerdekaan.",
      en: "**General Soedirman** was the TNI commander who led guerrilla war against Dutch aggression. Despite illness, he continued to lead from a stretcher — a symbol of armed resolve to defend independence.",
    },
    {
      keys: ["tan malaka"],
      id: "**Tan Malaka** adalah tokoh kiri dan pemikir kemerdekaan yang menekankan kedaulatan penuh. Ia berpengaruh pada perdebatan strategi revolusi, meski jalur politiknya sering berbeda dari kepemimpinan utama republik.",
      en: "**Tan Malaka** was a leftist independence thinker who stressed full sovereignty. He influenced debates on revolutionary strategy, though often apart from the republic’s main leadership path.",
    },
  ];

  function localFaq(q) {
    const low = q.toLowerCase();
    for (var i = 0; i < FAQ.length; i++) {
      if (FAQ[i].keys.some(function (k) { return low.indexOf(k) !== -1; })) {
        return isId() ? FAQ[i].id : FAQ[i].en;
      }
    }
    return null;
  }

  function retrieveLocal(q) {
    const tokens = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 2; });
    const docs = [];
    (PJ.MISSIONS || []).forEach(function (m) {
      const text = [tField(m.title), tField(m.blurb), tField(m.date)].join(" ").toLowerCase();
      var s = 0;
      tokens.forEach(function (t) { if (text.indexOf(t) !== -1) s++; });
      if (s) docs.push({ s: s, title: tField(m.title), body: tField(m.blurb) + " (" + tField(m.date) + ")" });
    });
    (PJ.GLOSSARY || []).forEach(function (g) {
      const text = (tField(g.term) + " " + tField(g.def)).toLowerCase();
      var s = 0;
      tokens.forEach(function (t) { if (text.indexOf(t) !== -1) s++; });
      if (s) docs.push({ s: s + 0.5, title: tField(g.term), body: tField(g.def) });
    });
    docs.sort(function (a, b) { return b.s - a.s; });
    return docs.slice(0, 2);
  }

  function localAnswer(q) {
    const faq = localFaq(q);
    if (faq) return faq;
    const hits = retrieveLocal(q);
    if (!hits.length) {
      return isId()
        ? "Mode lokal: saya hanya punya pengetahuan terbatas tanpa API key. Tambahkan **Gemini API key** (gratis) di pengaturan AI agar bisa menjawab seperti chatbot penuh — termasuk tokoh seperti Bung Tomo secara lebih luas.\n\nSementara itu coba tanya misi game: Sumpah Pemuda, Rengasdengklok, Proklamasi, Surabaya, Agresi & Gerilya."
        : "Local mode: limited knowledge without an API key. Add a free **Gemini API key** in AI settings for full chatbot answers.\n\nFor now, try game topics: Youth Pledge, Rengasdengklok, Proclamation, Surabaya, Guerrilla war.";
    }
    return hits.map(function (h) { return "**" + h.title + "**\n" + h.body; }).join("\n\n");
  }

  async function ask(userText) {
    const q = String(userText || "").trim();
    if (!q) return "";

    // Prefer real AI
    try {
      if (window.PJ_AI_ENDPOINT) {
        const r = await askOpenAICompat(q);
        if (r) return r;
      }
      if (getApiKey()) {
        const r = await askGemini(q);
        if (r) return r;
      }
    } catch (e) {
      console.warn(e);
      return (
        (isId()
          ? "Gagal memanggil AI online: "
          : "Online AI failed: ") +
        (e.message || e) +
        (isId()
          ? "\n\nMemakai jawaban lokal sementara."
          : "\n\nFalling back to local answer.") +
        "\n\n" +
        localAnswer(q)
      );
    }

    return localAnswer(q);
  }

  /* -------------------- UI -------------------- */
  function els() {
    return {
      root: document.getElementById("aiGuide"),
      log: document.getElementById("aiLog"),
      input: document.getElementById("aiInput"),
      send: document.getElementById("aiSend"),
      fab: document.getElementById("aiFab"),
      close: document.getElementById("aiClose"),
      status: document.getElementById("aiStatus"),
      settingsBtn: document.getElementById("aiSettingsBtn"),
    };
  }

  function updateStatus() {
    const el = els().status;
    if (!el) return;
    if (hasRealAI()) {
      el.textContent = isId() ? "AI online (Gemini)" : "AI online (Gemini)";
      el.classList.add("is-online");
      el.classList.remove("is-offline");
    } else {
      el.textContent = isId() ? "Mode lokal — tambah API key" : "Local mode — add API key";
      el.classList.add("is-offline");
      el.classList.remove("is-online");
    }
  }

  function renderMsg(role, text) {
    const log = els().log;
    if (!log) return;
    const row = document.createElement("div");
    row.className = "ai-msg ai-msg--" + role;
    const bubble = document.createElement("div");
    bubble.className = "ai-bubble";
    bubble.innerHTML = String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
    row.appendChild(bubble);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function greet() {
    if (hasRealAI()) {
      return isId()
        ? "Saya **Pemandu Sejarah AI** PERJUANGAN (Gemini). Tanyakan apa saja seputar perjuangan kemerdekaan — tokoh, tanggal, sebab-akibat, atau misi dalam game."
        : "I am the PERJUANGAN **AI Historical Guide** (Gemini). Ask anything about the independence struggle — people, dates, causes, or in-game missions.";
    }
    return isId()
      ? "Saya pemandu sejarah PERJUANGAN. Saat ini **mode lokal** (terbatas).\n\nAgar pintar seperti ChatGPT untuk sejarah Indonesia, klik ⚙ dan tempel **Gemini API key gratis** dari Google AI Studio."
      : "I am the PERJUANGAN guide in **local mode** (limited).\n\nFor full AI answers, click ⚙ and paste a free **Gemini API key** from Google AI Studio.";
  }

  function setOpen(v) {
    open = !!v;
    const root = els().root;
    const input = els().input;
    if (!root) return;
    root.classList.toggle("is-open", open);
    if (open) {
      if (!history.length) {
        const g = greet();
        history.push({ role: "assistant", text: g });
        renderMsg("assistant", g);
      }
      updateStatus();
      setTimeout(function () { if (input) input.focus(); }, 200);
    }
  }

  function openSettings() {
    const root = document.getElementById("modalRoot");
    if (!root) return;
    const current = getApiKey();
    root.innerHTML =
      '<div class="modal__backdrop" data-close></div>' +
      '<div class="modal__box" role="dialog" aria-modal="true">' +
      '<div class="modal__eyebrow">AI</div>' +
      "<h3 class=\"modal__title\">" +
      (isId() ? "Pengaturan AI" : "AI Settings") +
      "</h3>" +
      '<p class="modal__body">' +
      (isId()
        ? "Pakai <strong>Google Gemini</strong> (gratis). Ambil API key di <strong>aistudio.google.com</strong> → Get API key, lalu tempel di bawah."
        : "Uses <strong>Google Gemini</strong> (free tier). Get a key at <strong>aistudio.google.com</strong> → Get API key, then paste below.") +
      "</p>" +
      '<label class="ai-key-label">Gemini API Key</label>' +
      '<input type="password" id="aiKeyInput" class="ai-key-input" placeholder="AIza..." value="' +
      (current ? current.replace(/"/g, "&quot;") : "") +
      '" />' +
      '<div class="modal__actions">' +
      '<button type="button" class="btn btn--ghost" data-close>' +
      (isId() ? "Batal" : "Cancel") +
      "</button>" +
      '<button type="button" class="btn btn--ghost" id="aiKeyClear">' +
      (isId() ? "Hapus key" : "Clear key") +
      "</button>" +
      '<button type="button" class="btn btn--primary" id="aiKeySave">' +
      (isId() ? "Simpan" : "Save") +
      "</button>" +
      "</div></div>";

    requestAnimationFrame(function () {
      root.classList.add("is-open");
    });
    root.querySelectorAll("[data-close]").forEach(function (n) {
      n.addEventListener("click", function () {
        root.classList.remove("is-open");
        setTimeout(function () {
          root.innerHTML = "";
        }, 220);
      });
    });
    var save = document.getElementById("aiKeySave");
    var clear = document.getElementById("aiKeyClear");
    if (save) {
      save.addEventListener("click", function () {
        var v = (document.getElementById("aiKeyInput") || {}).value || "";
        setApiKey(v);
        root.classList.remove("is-open");
        setTimeout(function () {
          root.innerHTML = "";
        }, 220);
        // refresh greet if only local before
        if (v) {
          renderMsg(
            "assistant",
            isId()
              ? "API key tersimpan. AI online siap — silakan tanya apa saja."
              : "API key saved. Online AI is ready — ask anything."
          );
        }
      });
    }
    if (clear) {
      clear.addEventListener("click", function () {
        setApiKey("");
        var inp = document.getElementById("aiKeyInput");
        if (inp) inp.value = "";
        updateStatus();
      });
    }
  }

  async function handleSend() {
    const input = els().input;
    const send = els().send;
    if (!input || busy) return;
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    history.push({ role: "user", text: q });
    renderMsg("user", q);
    busy = true;
    if (send) send.disabled = true;
    renderMsg("assistant", isId() ? "Menulis jawaban…" : "Thinking…");
    const log = els().log;
    const thinking = log && log.lastElementChild;

    try {
      const answer = await ask(q);
      if (thinking) thinking.remove();
      history.push({ role: "assistant", text: answer });
      renderMsg("assistant", answer);
    } catch (e) {
      if (thinking) thinking.remove();
      renderMsg(
        "assistant",
        isId() ? "Terjadi kesalahan. Coba lagi." : "Something went wrong. Try again."
      );
    }
    busy = false;
    if (send) send.disabled = false;
    input.focus();
  }

  function bind() {
    const e = els();
    if (e.fab) e.fab.addEventListener("click", function () { setOpen(!open); });
    if (e.close) e.close.addEventListener("click", function () { setOpen(false); });
    if (e.send) e.send.addEventListener("click", handleSend);
    if (e.settingsBtn) e.settingsBtn.addEventListener("click", openSettings);
    if (e.input) {
      e.input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" && !ev.shiftKey) {
          ev.preventDefault();
          handleSend();
        }
      });
    }
    document.querySelectorAll("[data-open-ai]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        setOpen(true);
      });
    });
    const root = e.root;
    if (root) {
      root.addEventListener("click", function (ev) {
        const chip = ev.target.closest("[data-ai-suggest]");
        if (!chip) return;
        const input = els().input;
        if (input) {
          input.value = chip.getAttribute("data-ai-suggest") || "";
          handleSend();
        }
      });
    }
  }

  function applyI18n() {
    const title = document.getElementById("aiTitle");
    const ph = document.getElementById("aiInput");
    const send = document.getElementById("aiSend");
    if (title && PJ.I18N) title.textContent = PJ.I18N.t("ai_title");
    if (ph && PJ.I18N) ph.placeholder = PJ.I18N.t("ai_placeholder");
    if (send && PJ.I18N) send.textContent = PJ.I18N.t("ai_send");
    updateStatus();
    const chips = document.getElementById("aiChips");
    if (chips) {
      const suggestions = isId()
        ? [
            "Siapa itu Bung Tomo?",
            "Kapan Proklamasi dibacakan?",
            "Mengapa Rengasdengklok penting?",
            "Apa peran Jenderal Soedirman?",
            "Ceritakan Pertempuran Surabaya",
            "Daftar misi game",
          ]
        : [
            "Who was Bung Tomo?",
            "When was the Proclamation read?",
            "Why does Rengasdengklok matter?",
            "What was General Soedirman’s role?",
            "Tell me about the Battle of Surabaya",
            "List game missions",
          ];
      chips.innerHTML = suggestions
        .map(function (s) {
          return (
            '<button type="button" class="ai-chip" data-ai-suggest="' +
            s.replace(/"/g, "&quot;") +
            '">' +
            s +
            "</button>"
          );
        })
        .join("");
    }
  }

  function init() {
    // migrate window key if set
    if (window.PJ_AI_KEY && !getApiKey()) setApiKey(window.PJ_AI_KEY);
    bind();
    applyI18n();
    document.addEventListener("pj:langchange", applyI18n);
  }

  return {
    init: init,
    ask: ask,
    setOpen: setOpen,
    applyI18n: applyI18n,
    setApiKey: setApiKey,
    openSettings: openSettings,
  };
})();
