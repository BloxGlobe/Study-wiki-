import { currentUser, changePassword, updateProfile } from "../modules/auth/auth.js";

export default function Setting(container) {
  const user = currentUser();

  container.innerHTML = `
    <section class="section settings-page">
      <div class="settings-header">
        <h2>Settings</h2>
        <p class="muted">Manage your account preferences</p>
      </div>

      <div class="settings-grid">
        <div class="card settings-card" id="settings-card">
          ${
            user
              ? `
            <!-- Account info -->
            <div class="settings-block">
              <h3>Account</h3>
              <div class="settings-row">
                <span class="label">Name</span>
                <span class="value">${user.name || "(not set)"}</span>
              </div>
              <div class="settings-row">
                <span class="label">Email</span>
                <span class="value">${user.email}</span>
              </div>
            </div>

            <!-- Profile picture -->
            <div class="settings-block">
              <h3>Profile picture</h3>
              <p class="muted small">Paste an image URL to update your avatar</p>
              <div class="inline-form">
                <input
                  type="text"
                  id="pfp-url"
                  placeholder="https://image.url/avatar.png"
                />
                <button id="save-pfp" class="btn-primary">Save</button>
              </div>
            </div>

            <!-- Password -->
            <div class="settings-block">
              <h3>Password</h3>
              <p class="muted small">Change your account password</p>
              <div class="stack">
                <input
                  type="password"
                  id="old-pass"
                  placeholder="Current password"
                />
                <input
                  type="password"
                  id="new-pass"
                  placeholder="New password"
                />
                <button id="change-pass" class="btn-primary">
                  Change password
                </button>
                <div id="pass-msg" class="muted small"></div>
              </div>
            </div>
          `
              : `
            <div class="settings-empty">
              <p class="muted">No user signed in.</p>
              <p class="placeholder">
                Open <a href="#/auth">Account</a> to sign up or sign in.
              </p>
            </div>
          `
          }
        </div>
      </div>
    </section>
  `;

  if (!user) return;

  const savePfp = container.querySelector("#save-pfp");
  savePfp.addEventListener("click", () => {
    const url = container.querySelector("#pfp-url").value.trim();
    if (!url) return;

    try {
      updateProfile(user.email, { pfp: url });
      container.querySelector("#pfp-url").value = "";
      container
        .querySelector("#settings-card")
        .insertAdjacentHTML(
          "beforeend",
          `<p class="auth-note">Profile picture updated.</p>`
        );
    } catch (err) {
      container
        .querySelector("#settings-card")
        .insertAdjacentHTML(
          "beforeend",
          `<p class="auth-error">${err.message}</p>`
        );
    }
  });

  const changeBtn = container.querySelector("#change-pass");
  changeBtn.addEventListener("click", () => {
    const oldPass = container.querySelector("#old-pass").value;
    const newPass = container.querySelector("#new-pass").value;
    const msg = container.querySelector("#pass-msg");

    try {
      changePassword(user.email, oldPass, newPass);
      msg.textContent = "Password changed successfully.";
      container.querySelector("#old-pass").value = "";
      container.querySelector("#new-pass").value = "";
    } catch (err) {
      msg.textContent = err.message || "Error";
    }
  });
}
