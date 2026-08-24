/* ==========================================================================
   PERJUANGAN — firebase-init.js
   Firebase initialization (Compat SDK for vanilla JS).
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.Firebase = (function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDRdxPofDv8Sy-mEWgq8o3t5F2_z0rGFzg",
    authDomain: "perjuangan-1945.firebaseapp.com",
    projectId: "perjuangan-1945",
    storageBucket: "perjuangan-1945.firebasestorage.app",
    messagingSenderId: "994127954034",
    appId: "1:994127954034:web:e11e63a31c3d087a0602eb",
    measurementId: "G-SVN3HFF80E",
  };

  let db = null;
  let ready = false;
  let initPromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function init() {
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        await loadScript("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js");
        await loadScript("https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore-compat.js");

        if (typeof firebase === "undefined") {
          console.warn("[PERJUANGAN] Firebase SDK gagal dimuat. Menggunakan localStorage saja.");
          return false;
        }

        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        ready = true;
        console.log("[PERJUANGAN] Firebase siap.");
        return true;
      } catch (err) {
        console.warn("[PERJUANGAN] Firebase init gagal, fallback localStorage:", err);
        ready = false;
        return false;
      }
    })();

    return initPromise;
  }

  function isReady() {
    return ready && db !== null;
  }

  function getDb() {
    return db;
  }

  return { init, isReady, getDb, config: firebaseConfig };
})();
