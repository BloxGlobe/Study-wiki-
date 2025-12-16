// src/main.js
import { router } from "./router.js";
import Modal from "./components/Modal.js";
import { requireAuth, signOut } from "./components/AuthGuard.js";
import { currentUser } from "./modules/auth.js";

function createAuthButton() {
  const topbar = document.querySelector(".topbar .top-actions");
  if (!topbar) return;

  const authBtn = document.createElement("button");
  authBtn.className = "btn";
  authBtn.id = "auth-btn";

  function refresh() {
    const user = currentUser();
    authBtn.textContent = user ? `Sign out (${user.name || user.email})` : "Login / Sign up";
  }

  authBtn.addEventListener("click", () => {
    const user = currentUser();
    if (user) {
      signOut();
      refresh();
    } else {
      requireAuth();
    }
  });

  topbar.insertBefore(authBtn, topbar.firstChild);
  refresh();
}

// global error detector to surface runtime errors in a modal
function installErrorHandlers() {
  window.addEventListener("error", (ev) => {
    try {
      const msg = ev && ev.message ? ev.message : String(ev.error || "Unknown error");
      Modal.showModal(`<div><h3>Error</h3><pre style="white-space:pre-wrap">${msg}</pre></div>`);
    } catch (e) {
      console.error(e);
    }
  });

  window.addEventListener("unhandledrejection", (ev) => {
    try {
      const msg = ev && ev.reason ? (ev.reason.message || String(ev.reason)) : "Promise rejected";
      Modal.showModal(`<div><h3>Unhandled rejection</h3><pre style="white-space:pre-wrap">${msg}</pre></div>`);
    } catch (e) {
      console.error(e);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  installErrorHandlers();
  createAuthButton();
  // protect New Note button as a sample guarded action
  const newNote = document.getElementById("new-note-btn");
  if (newNote) {
    newNote.addEventListener("click", (e) => {
      if (!requireAuth()) e.preventDefault();
    });
  }

  router(); // initial load
});
