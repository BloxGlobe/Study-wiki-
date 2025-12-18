import { currentUser, updateProfile } from "../../../modules/auth.js";

export default function Profile(container) {
  const user = currentUser();
  container.innerHTML = `
    <section class="section profile-page">
      <h2>Profile</h2>
      ${
        user
          ? `
      <div class="card">
        <div class="profile-row">
          <span class="label">Name:</span>
          <span class="value">${user.name}</span>
        </div>
        <div class="profile-row">
          <span class="label">Email:</span>
          <span class="value">${user.email}</span>
        </div>
        <div class="profile-row">
          <span class="label">Profile picture:</span>
          <img src="${user.pfp || ''}" alt="Avatar" class="avatar-small"/>
        </div>
      </div>
      `
          : `<p class="muted">No user signed in.</p>`
      }
    </section>
  `;

  // Could add more profile management logic later (e.g., activity history, badges, etc.)
}
