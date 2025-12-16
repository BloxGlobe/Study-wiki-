import { login, signup } from "../../modules/auth.js";
import { showModal } from "../../components/Modal.js";

function ensureAuthCSS() {
  const href = "src/auth.css";
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
}

export default function AuthPage(container) {
  ensureAuthCSS();
  container.innerHTML = `
    <section class="section">
      <h2>Account</h2>
      <div class="card">
        <div id="auth-root">
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button id="open-login" class="btn-secondary">Login</button>
            <button id="open-signup" class="btn-primary">Create account</button>
          </div>
          <p class="auth-note" style="margin-top:12px">Opening the full auth page lets you create an account. After creation you'll be redirected back.</p>
        </div>
      </div>
    </section>
  `;

  const openLogin = container.querySelector("#open-login");
  const openSignup = container.querySelector("#open-signup");

  openLogin.addEventListener("click", () => openForm("login"));
  openSignup.addEventListener("click", () => openForm("signup"));

  function openForm(mode) {
    const form = document.createElement("div");
    form.className = "auth-form";
    form.innerHTML = `
      <h3>${mode === "login" ? "Login to your account" : "Create an account"}</h3>
      <input name="name" type="text" placeholder="Full name" style="display:${mode==='signup'?'block':'none'}" />
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <div class="auth-actions">
        <button class="btn-secondary" id="cancel">Cancel</button>
        <button class="btn-primary" id="submit">${mode==='login'? 'Login':'Sign up'}</button>
      </div>
      <div class="auth-error" id="err" style="display:none"></div>
    `;

    showModal(form);

    form.querySelector("#cancel").addEventListener("click", () => {
      document.querySelector('.app-modal')?.dispatchEvent(new Event('click'));
    });

    form.querySelector("#submit").addEventListener("click", async () => {
      const name = form.querySelector('[name="name"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const password = form.querySelector('[name="password"]')?.value || "";
      const errEl = form.querySelector('#err');
      errEl.style.display = 'none';
      try {
        if (mode === 'signup') {
          signup({ name, email, password });
        } else {
          login({ email, password });
        }
        // redirect to home
        location.hash = '/home';
        // close modal by simulating click on overlay
        document.querySelector('.app-modal')?.dispatchEvent(new Event('click'));
      } catch (err) {
        errEl.textContent = err.message || String(err);
        errEl.style.display = 'block';
      }
    });
  }
}
