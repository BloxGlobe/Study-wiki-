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
    <section class="section auth-page">
      <h2>Sign up / Sign in</h2>
      <div class="card auth-card">
        <div class="auth-tabs">
          <button id="tab-signup" class="btn-primary">Sign Up</button>
          <button id="tab-login" class="btn-secondary">Log In</button>
        </div>

        <div id="auth-forms">
          <form id="signup-form" class="auth-form-full">
            <input name="username" placeholder="Username" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <div class="policy">By signing up you agree to the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.</div>
            <div style="display:flex;gap:8px;margin-top:12px"><button id="signup-btn" class="btn-primary">Sign Up</button></div>
            <div id="signup-err" class="auth-error" style="display:none;margin-top:8px"></div>
          </form>

          <form id="login-form" class="auth-form-full" style="display:none">
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <div style="display:flex;gap:8px;margin-top:12px"><button id="login-btn" class="btn-primary">Log In</button></div>
            <div id="login-err" class="auth-error" style="display:none;margin-top:8px"></div>
          </form>
        </div>
      </div>
    </section>
  `;

  const tabSignup = container.querySelector('#tab-signup');
  const tabLogin = container.querySelector('#tab-login');
  const signupForm = container.querySelector('#signup-form');
  const loginForm = container.querySelector('#login-form');
  const signupErr = container.querySelector('#signup-err');
  const loginErr = container.querySelector('#login-err');

  tabSignup.addEventListener('click', () => { signupForm.style.display='block'; loginForm.style.display='none'; });
  tabLogin.addEventListener('click', () => { signupForm.style.display='none'; loginForm.style.display='block'; });

  container.querySelector('#signup-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    signupErr.style.display='none';
    const name = signupForm.username.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    try {
      // try server signup first
      try {
        const res = await fetch('/api/signup', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ name, email, password }) });
        if (!res.ok) throw new Error((await res.json()).error || 'Signup failed');
      } catch (err) {
        // fallback to client
        signup({ name, email, password });
      }
      window.dispatchEvent(new CustomEvent('auth:changed'));
      location.hash = '/home';
    } catch (err) {
      signupErr.textContent = err.message || String(err);
      signupErr.style.display = 'block';
    }
  });

  container.querySelector('#login-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    loginErr.style.display='none';
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;
    try {
      try {
        const res = await fetch('/api/login', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ email, password }) });
        if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
      } catch (err) {
        login({ email, password });
      }
      window.dispatchEvent(new CustomEvent('auth:changed'));
      location.hash = '/home';
    } catch (err) {
      loginErr.textContent = err.message || String(err);
      loginErr.style.display = 'block';
    }
  });
}
