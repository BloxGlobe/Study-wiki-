import { currentUser, changePassword, updateProfile } from "../modules/auth.js";

export default function Setting(container) {
  const user = currentUser();
  container.innerHTML = `
    <section class="section">
      <h2>Settings</h2>
      <div class="card" id="settings-card">
        ${user ? `
          <h3>Account</h3>
          <p><strong>Name:</strong> ${user.name || "(not set)"}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <div style="margin-top:12px">
            <h4>Change profile picture</h4>
            <input type="text" id="pfp-url" placeholder="Image URL" style="width:60%;padding:8px;margin-bottom:8px" />
            <button id="save-pfp" class="btn-primary">Save</button>
          </div>
          <div style="margin-top:12px">
            <h4>Change password</h4>
            <input type="password" id="old-pass" placeholder="Current password" style="width:60%;padding:8px;margin-bottom:8px" />
            <input type="password" id="new-pass" placeholder="New password" style="width:60%;padding:8px;margin-bottom:8px" />
            <div><button id="change-pass" class="btn-primary">Change password</button></div>
            <div id="pass-msg" style="margin-top:8px;color:var(--muted)"></div>
          </div>
        ` : `
          <p class="muted">No user signed in.</p>
          <p class="placeholder">Open <a href="#/auth">Account</a> to sign up or sign in.</p>
        `}
      </div>
    </section>
  `;

  if (!user) return;

  const savePfp = container.querySelector('#save-pfp');
  savePfp.addEventListener('click', () => {
    const url = container.querySelector('#pfp-url').value.trim();
    if (!url) return;
    try {
      updateProfile(user.email, { pfp: url });
      container.querySelector('#pfp-url').value = '';
      container.querySelector('#settings-card').insertAdjacentHTML('beforeend', `<p class="auth-note">Profile picture updated.</p>`);
    } catch (err) {
      container.querySelector('#settings-card').insertAdjacentHTML('beforeend', `<p class="auth-error">${err.message}</p>`);
    }
  });

  const changeBtn = container.querySelector('#change-pass');
  changeBtn.addEventListener('click', () => {
    const oldPass = container.querySelector('#old-pass').value;
    const newPass = container.querySelector('#new-pass').value;
    const msg = container.querySelector('#pass-msg');
    try {
      changePassword(user.email, oldPass, newPass);
      msg.textContent = 'Password changed.';
      container.querySelector('#old-pass').value = '';
      container.querySelector('#new-pass').value = '';
    } catch (err) {
      msg.textContent = err.message || 'Error';
    }
  });
}
