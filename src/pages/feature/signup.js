import { signup } from "../../modules/auth.js";

function ensureSignupCSS(){
	const href = 'src/signup.css';
	if (!document.querySelector(`link[href="${href}"]`)){
		const l = document.createElement('link'); l.rel='stylesheet'; l.href=href; document.head.appendChild(l);
	}
}

export default function Signup(container) {
		ensureSignupCSS();
		container.innerHTML = `
		  <div class="rbx-signup-wrapper">
		    <div class="rbx-signup-card">
		      <div class="rbx-signup-hero">
		        <img src="https://images.rbxcdn.com/fc3f3e3158fc20ebb5ccc972064ebfe6.png" alt="logo">
		        <div class="rbx-signup-title">Create your Roblox account</div>
		      </div>
		      <form id="signup-form" class="signup-form">
		        <div class="field"><label>Display name</label><input name="name" placeholder="Display name" required /></div>
		        <div class="field"><label>Email</label><input name="email" type="email" placeholder="Email" required /></div>
		        <div class="field"><label>Password</label><input name="password" type="password" placeholder="Password" required /></div>
		        <div class="dob-row">
		          <input name="dob-day" placeholder="Day" />
		          <input name="dob-month" placeholder="Month" />
		          <input name="dob-year" placeholder="Year" />
		        </div>
		        <div class="signup-cta"><button id="signup-btn" class="btn-primary">Sign Up</button> <button id="signup-cancel" class="btn-secondary" type="button">Cancel</button></div>
		        <div class="signup-note">By creating an account you agree to the <a href="#">Terms</a> and <a href="#">Privacy</a>.</div>
		        <div id="signup-err" class="auth-error" style="display:none;margin-top:8px"></div>
		      </form>
		    </div>
		  </div>
		`;

		const form = container.querySelector('#signup-form');
		const err = container.querySelector('#signup-err');

		container.querySelector('#signup-cancel').addEventListener('click', ()=>{ location.hash = '/home'; });

		container.querySelector('#signup-btn').addEventListener('click', async (e)=>{
			e.preventDefault();
			err.style.display='none';
			const name = form.name.value.trim();
			const email = form.email.value.trim();
			const password = form.password.value;
			try{
				// try server signup first
				try{
					const res = await fetch('/api/signup', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ name, email, password }) });
					if (!res.ok) throw new Error((await res.json()).error || 'Signup failed');
				} catch(err){
					signup({ name, email, password });
				}
				window.dispatchEvent(new CustomEvent('auth:changed'));
				location.hash = '/home';
			} catch(err){
				err.textContent = err.message || String(err);
				err.style.display = 'block';
			}
		});
}
