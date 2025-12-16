import { signup } from "../../modules/auth.js";

function ensureSignupCSS(){
  const href = 'src/signup.css';
  if (!document.querySelector(`link[href="${href}"]`)){
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }
}

export default function Signup(container) {
  ensureSignupCSS();

  container.innerHTML = `
    <section class="auth-page">
      <div class="auth-card">
        <header class="auth-header">
          <h1>Create your account</h1>
          <p>Join Study Wiki and share knowledge.</p>
        </header>

        <form id="signup-form" class="auth-form">
          <div class="field">
            <label>Display name</label>
            <input name="name" required />
          </div>

          <div class="field">
            <label>Email</label>
            <input name="email" type="email" required />
          </div>

          <div class="field">
            <label>Password</label>
            <input name="password" type="password" required />
          </div>

          <div class="dob-row">
            <input name="dob-day" placeholder="Day" />
            <input name="dob-month" placeholder="Month" />
            <input name="dob-year" placeholder="Year" />
          </div>

          <button id="signup-btn" class="btn-primary">
            Create account
          </button>

          <button id="signup-cancel" type="button" class="btn-secondary">
            Cancel
          </button>

          <div class="auth-note">
            By continuing, you agree to our
            <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.
          </div>

          <div id="signup-err" class="auth-error" style="display:none"></div>
        </form>
      </div>
    </section>
  `;

  const form = container.querySelector('#signup-form');
  const errBox = container.querySelector('#signup-err');

  container
    .querySelector('#signup-cancel')
    .addEventListener('click', () => {
      location.hash = '/home';
    });

  container
    .querySelector('#signup-btn')
    .addEventListener('click', async (e) => {
      e.preventDefault();
      errBox.style.display = 'none';

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;

      try {
        try {
          const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Signup failed');
          }
        } catch {
          signup({ name, email, password });
        }

        window.dispatchEvent(new CustomEvent('auth:changed'));
        location.hash = '/home';

      } catch (e) {
        errBox.textContent = e.message || String(e);
        errBox.style.display = 'block';
      }
    });
}
