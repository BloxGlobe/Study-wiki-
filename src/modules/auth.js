import { getUsers, saveUser, updateUsers } from "../utils/storage.js";
import { setCurrentUser, getCurrentUser, clearCurrentUser } from "./session.js";
import { sanitizeText, containsBadWords } from "../utils/filter.js";
import { showModal } from "../components/Modal.js";

const BAN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function signup({ name, email, password }) {
  if (!email || !password) throw new Error("Email and password required");
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error("A user with that email already exists");
  }
  // sanitize name
  const safeName = sanitizeText(name || "");
  const isBad = containsBadWords(name || "") || containsBadWords(email || "");
  const user = { id: Date.now().toString(), name: safeName, email, password, banned: false };
  if (isBad) {
    // auto-ban and save record with expiry
    user.banned = true;
    user.banUntil = Date.now() + BAN_DURATION_MS;
    user.banReason = 'Automated moderation: offensive display name or email';
    saveUser(user);
    // show ban modal to inform user (modernized)
    try {
      const untilStr = new Date(user.banUntil).toString();
      const remaining = Math.max(0, Number(user.banUntil) - Date.now());
      const mins = Math.ceil(remaining/60000);
      const html = `
        <div style="max-width:560px">
          <h3>Account temporarily suspended</h3>
          <p style="margin-top:6px">Your account was automatically suspended by our moderation system.</p>
          <p style="margin-top:8px"><strong>Reason:</strong> ${user.banReason}</p>
          <p style="margin-top:6px"><strong>Suspended until:</strong> ${untilStr}</p>
          <p style="margin-top:6px;color:var(--muted)">Estimated time remaining: ${mins} minute(s)</p>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button id="ban-view" class="btn-secondary">View details</button>
            <button id="ban-close" class="btn-primary">Close</button>
          </div>
        </div>
      `;
      showModal(html);
      document.querySelector('#ban-close')?.addEventListener('click', () => { const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click')); });
      document.querySelector('#ban-view')?.addEventListener('click', () => { const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click')); location.hash = '/banned'; });
    } catch (e) {}
    // inform caller
    throw new Error('Account auto-banned due to policy - see notice');
  }
  saveUser(user);
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  try { window.dispatchEvent(new CustomEvent('auth:changed', { detail: { id: user.id, name: user.name, email: user.email } })); } catch(e){}
  return getCurrentUser();
}

export function login({ email, password }) {
  if (!email || !password) throw new Error("Email and password required");
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  if (user.banned) {
    const now = Date.now();
    if (user.banUntil && now >= Number(user.banUntil)) {
      // lift ban
      const users = getUsers();
      const idx = users.findIndex(u => u.email === email);
      if (idx !== -1) {
        users[idx].banned = false;
        delete users[idx].banUntil;
        delete users[idx].banReason;
        updateUsers(users);
      }
      // continue to login after lifting ban
    } else {
      // show modal with ban info
      try {
        const until = user.banUntil ? new Date(Number(user.banUntil)).toString() : 'unknown';
        const remaining = user.banUntil ? Math.max(0, Number(user.banUntil) - Date.now()) : 0;
        const mins = Math.ceil(remaining/60000);
        const html = `
          <div style="max-width:560px">
            <h3>Account temporarily suspended</h3>
            <p style="margin-top:6px">Your account is suspended and cannot sign in right now.</p>
            <p style="margin-top:8px"><strong>Reason:</strong> ${user.banReason || 'policy violation'}</p>
            <p style="margin-top:6px"><strong>Suspended until:</strong> ${until}</p>
            <p style="margin-top:6px;color:var(--muted)">Estimated time remaining: ${mins} minute(s)</p>
            <div style="display:flex;gap:8px;margin-top:12px">
              <button id="ban-view" class="btn-secondary">View ban</button>
              <button id="ban-close" class="btn-primary">Close</button>
            </div>
          </div>
        `;
        showModal(html);
        document.querySelector('#ban-close')?.addEventListener('click', () => { const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click')); });
        document.querySelector('#ban-view')?.addEventListener('click', () => { const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click')); location.hash = '/banned'; });
      } catch (e) {}
      throw new Error('This account is banned');
    }
  }
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  try { window.dispatchEvent(new CustomEvent('auth:changed', { detail: { id: user.id, name: user.name, email: user.email } })); } catch(e){}
  return getCurrentUser();
}

export function logout() {
  clearCurrentUser();
}

export function currentUser() {
  return getCurrentUser();
}

// Lift ban for a user by email (immediate unban)
export function unbanUser(email){
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) throw new Error('User not found');
  users[idx].banned = false;
  delete users[idx].banUntil;
  delete users[idx].banReason;
  updateUsers(users);
  return users[idx];
}

// Reset a user's display name (username)
export function resetUsername(email, newName){
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) throw new Error('User not found');
  users[idx].name = sanitizeText(newName || '');
  updateUsers(users);
  // refresh session if current user
  const cur = getCurrentUser();
  if (cur && cur.email === email) setCurrentUser({ id: users[idx].id, name: users[idx].name, email: users[idx].email });
  return users[idx];
}

export function changePassword(email, oldPassword, newPassword){
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email && u.password === oldPassword);
  if (idx === -1) throw new Error('Invalid credentials');
  users[idx].password = newPassword;
  updateUsers(users);
  return true;
}

export function updateProfile(email, updates){
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) throw new Error('User not found');
  users[idx] = { ...users[idx], ...updates };
  updateUsers(users);
  // if current user updated, refresh session
  const cur = getCurrentUser();
  if (cur && cur.email === email) setCurrentUser({ id: users[idx].id, name: users[idx].name, email: users[idx].email });
  return users[idx];
}
