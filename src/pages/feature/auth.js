import { login, signup } from "../../modules/auth.js";

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
    <div class="rbx-auth-wrapper">
      <div class="rbx-auth-card">
        <div class="rbx-logo"><img src="https://images.rbxcdn.com/fc3f3e3158fc20ebb5ccc972064ebfe6.png" alt="Roblox logo"></div>
        <div class="rbx-auth-title">Log in to Roblox</div>

        <div id="forms">
          <form id="login-form" class="auth-form">
            <div class="field"><label>Email or username</label><input name="email" type="text" placeholder="Email or username" required /></div>
            <div class="field"><label>Password</label><input name="password" type="password" placeholder="Password" required /></div>
            <div class="auth-actions"><button id="login-btn" class="btn-primary">Log In</button></div>
            <div id="login-err" class="auth-error" style="display:none;margin-top:8px"></div>
            <div class="auth-aux"><a href="#/signup">Create account</a> · <a href="#/">Forgot password?</a></div>
          </form>

          <form id="signup-form" class="auth-form" style="display:none">
            <div class="field"><label>Display name</label><input name="username" placeholder="Display name" required /></div>
            <div class="field"><label>Email</label><input name="email" type="email" placeholder="Email" required /></div>
            <div class="field"><label>Password</label><input name="password" type="password" placeholder="Password" required /></div>
            <div class="auth-actions"><button id="signup-btn" class="btn-primary">Sign Up</button></div>
            <div id="signup-err" class="auth-error" style="display:none;margin-top:8px"></div>
            <div class="auth-aux">By creating an account you agree to the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.</div>
          </form>

        </div>

        <div class="auth-switch" style="margin-top:12px">
          <a href="#" id="show-login">Have an account? Log in</a>
          <span style="margin:0 8px;color:rgba(255,255,255,0.12)">|</span>
          <a href="#" id="show-signup">New? Create account</a>
        </div>
      </div>
    </div>
  `;

  const loginForm = container.querySelector('#login-form');
  const signupForm = container.querySelector('#signup-form');
  const loginErr = container.querySelector('#login-err');
  const signupErr = container.querySelector('#signup-err');

  function showLogin(){ loginForm.style.display='block'; signupForm.style.display='none'; }
  function showSignup(){ loginForm.style.display='none'; signupForm.style.display='block'; }

  container.querySelector('#show-signup').addEventListener('click', (e)=>{ e.preventDefault(); showSignup(); location.hash = '#/signup'; });
  container.querySelector('#show-login').addEventListener('click', (e)=>{ e.preventDefault(); showLogin(); location.hash = '#/auth'; });

  container.querySelector('#signup-btn').addEventListener('click', async (e) => {
    e.preventDefault(); signupErr.style.display='none';
    const name = signupForm.username.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    try {
      try {
        const res = await fetch('/api/signup', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ name, email, password }) });
        if (!res.ok) throw new Error((await res.json()).error || 'Signup failed');
      } catch (err) {
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
    e.preventDefault(); loginErr.style.display='none';
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

  // initialize view based on hash
  if (location.hash && location.hash.includes('signup')) showSignup(); else showLogin();
}
