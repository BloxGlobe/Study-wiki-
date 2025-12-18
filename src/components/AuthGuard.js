import Modal, { showModal, close } from "./Modal.js";
import { login, signup, currentUser, logout } from "../modules/auth/auth.js";
import { getUsers } from "../utils/storage.js";

export function requireAuth(openAction) {
  const user = currentUser();

  if (user) {
    // check banned status
    const u = getUsers().find(
      x => x.id === String(user.id) || x.email === user.email
    );

    if (u && u.banned) {
      alert("Your account is banned. Contact moderator.");
      return false;
    }

    return true;
  }

  openAuthModal();
  return false;
}

function openAuthModal() {
  const wrapper = document.createElement("div");
  wrapper.className = "auth-modal";

  wrapper.innerHTML = `
    <h3 class="auth-title">Sign in</h3>

    <form id="auth-form" class="auth-form">
      <input name="name" placeholder="Name (signup only)" />
      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />

      <div class="auth-actions">
        <button type="button" id="btn-login" class="btn-primary">Login</button>
        <button type="button" id="btn-signup" class="btn-secondary">Sign up</button>
      </div>

      <p class="auth-hint">
        Or use the <a href="#/login">full login page</a>
      </p>
    </form>
  `;

  showModal(wrapper);

  const form = wrapper.querySelector("#auth-form");

  wrapper.querySelector("#btn-login").addEventListener("click", () => {
    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      login({ email, password });
      close();
      window.dispatchEvent(new CustomEvent("auth:changed"));
    } catch (err) {
      alert(err.message || "Login failed");
    }
  });

  wrapper.querySelector("#btn-signup").addEventListener("click", () => {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      signup({ name, email, password });
      close();
      window.dispatchEvent(new CustomEvent("auth:changed"));
    } catch (err) {
      alert(err.message || "Signup failed");
    }
  });
}

export function signOut() {
  logout();
  window.dispatchEvent(new CustomEvent("auth:changed"));
}
