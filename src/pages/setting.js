import { currentUser } from "../modules/auth.js";

export default function Setting(container) {
  const user = currentUser();
  container.innerHTML = `
    <section class="section">
      <h2>Settings</h2>
      <div class="card">
        ${user ? `
          <h3>Account</h3>
          <p><strong>Name:</strong> ${user.name || "(not set)"}</p>
          <p><strong>Email:</strong> ${user.email}</p>
        ` : `
          <p class="muted">No user signed in.</p>
          <p class="placeholder">Open <a href="#/auth">Account</a> to sign up or sign in.</p>
        `}
      </div>
    </section>
  `;
}
