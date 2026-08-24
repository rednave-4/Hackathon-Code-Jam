/* ==========================================================================
   PERJUANGAN — modal.js
   Small themed modal helper used for the reset-confirm dialog and the
   "stage coming soon" placeholder triggered by startMission().
   ========================================================================== */

window.PJ = window.PJ || {};

PJ.Modal = (function () {
  const root = () => document.getElementById("modalRoot");

  function close() {
    const el = root();
    el.classList.remove("is-open");
    setTimeout(() => {
      el.innerHTML = "";
    }, 220);
  }

  function open(html) {
    const el = root();
    el.innerHTML = `<div class="modal__backdrop" data-close></div><div class="modal__box" role="dialog" aria-modal="true">${html}</div>`;
    requestAnimationFrame(() => el.classList.add("is-open"));
    el.querySelectorAll("[data-close]").forEach((n) => n.addEventListener("click", close));
    document.addEventListener("keydown", escHandler);
  }

  function escHandler(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", escHandler);
    }
  }

  function info({ title, body, note }) {
    open(`
      <div class="modal__eyebrow">${note ? note.toUpperCase() : "INFO"}</div>
      <h3 class="modal__title">${title}</h3>
      <p class="modal__body">${body}</p>
      <div class="modal__actions">
        <button class="btn btn--primary" data-close>MENGERTI</button>
      </div>
    `);
  }

  function confirm({ title, body, confirmLabel, cancelLabel, onConfirm }) {
    open(`
      <h3 class="modal__title">${title}</h3>
      <p class="modal__body">${body}</p>
      <div class="modal__actions">
        <button class="btn btn--ghost" data-close>${cancelLabel || "BATAL"}</button>
        <button class="btn btn--danger" id="modalConfirmBtn">${confirmLabel || "KONFIRMASI"}</button>
      </div>
    `);
    document.getElementById("modalConfirmBtn").addEventListener("click", () => {
      close();
      if (typeof onConfirm === "function") onConfirm();
    });
  }

  return { info, confirm, close };
})();
