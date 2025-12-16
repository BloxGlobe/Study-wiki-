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
    // show ban modal to inform user
    try {
      showModal(`<div style="max-width:560px"><h3>Account banned</h3><p>Your account was automatically banned due to policy violations.</p><p><strong>Reason:</strong> ${user.banReason}</p><p><strong>Banned until:</strong> ${new Date(user.banUntil).toString()}</p><div style="margin-top:12px;display:flex;gap:8px"><button id="ban-ok" class="btn-primary">OK</button></div></div>`);
      document.querySelector('#ban-ok')?.addEventListener('click', () => {
        // close modal
        const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click'));
      });
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
        showModal(`<div style="max-width:560px"><h3>Account banned</h3><p>Your account is banned.</p><p><strong>Reason:</strong> ${user.banReason || 'policy violation'}</p><p><strong>Banned until:</strong> ${until}</p><div style="margin-top:12px;display:flex;gap:8px"><button id="ban-ok" class="btn-primary">OK</button></div></div>`);
        document.querySelector('#ban-ok')?.addEventListener('click', () => {
          const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click'));
        });
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
