import Modal, { showModal, close } from "./Modal.js";
import { login, signup, currentUser, logout } from "../modules/auth.js";

export function requireAuth(openAction) {
  const user = currentUser();
  if (user) return true;
  // open login modal and prevent action
  openAuthModal();
  return false;
}

function openAuthModal() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <h3 style="margin-top:0;margin-bottom:8px">Sign in</h3>
    <form id="auth-form">
      <div style="display:flex;flex-direction:column;gap:8px">
        <input name="name" placeholder="Name (signup only)" />
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button type="button" id="btn-login">Login</button>
        <button type="button" id="btn-signup">Sign up</button>
      </div>
    </form>
  `;

  showModal(wrapper);

  wrapper.querySelector("#btn-login").addEventListener("click", async () => {
    const form = wrapper.querySelector("#auth-form");
    const email = form.email.value.trim();
    const password = form.password.value;
    try {
      login({ email, password });
      close();
      location.reload();
    } catch (err) {
      alert(err.message || "Login failed");
    }
  });

  wrapper.querySelector("#btn-signup").addEventListener("click", async () => {
    const form = wrapper.querySelector("#auth-form");
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    try {
      signup({ name, email, password });
      close();
      location.reload();
    } catch (err) {
      alert(err.message || "Signup failed");
    }
  });
}

export function signOut() {
  logout();
  location.reload();
}
