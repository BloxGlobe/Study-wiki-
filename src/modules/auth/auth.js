import { getUsers, saveUser, updateUsers } from "../../utils/storage.js";
import { setCurrentUser, getCurrentUser, clearCurrentUser } from "../sessions/session.js";
import { sanitizeText, containsBadWords } from "../../utils/filter.js";
import { showModal } from "../../components/Modal.js";

const BAN_DURATION_MS = 24 * 60 * 60 * 1000; // still used elsewhere if needed

export function signup({ name, email, password }) {
  if (!email || !password) throw new Error("Email and password required");

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error("A user with that email already exists");
  }

  // ❌ never allow bad emails
  if (containsBadWords(email)) {
    throw new Error("Email contains prohibited words");
  }

  // 🧼 sanitize & reset bad usernames
  let finalName = sanitizeText(name || "");
  if (containsBadWords(finalName)) {
    finalName = `User_${Math.floor(Math.random() * 10000)}`;
    try {
      showModal(`
        <div style="max-width:520px">
          <h3>Username adjusted</h3>
          <p>Your display name contained restricted words and was automatically changed.</p>
          <p style="margin-top:6px"><strong>New name:</strong> ${finalName}</p>
          <button class="btn-primary" style="margin-top:12px"
            onclick="document.querySelector('.app-modal')?.dispatchEvent(new Event('click'))">
            OK
          </button>
        </div>
      `);
    } catch (e) {}
  }

  const user = {
    id: Date.now().toString(),
    name: finalName,
    email,
    password,
    banned: false
  };

  saveUser(user);

  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  try {
    window.dispatchEvent(new CustomEvent("auth:changed", {
      detail: { id: user.id, name: user.name, email: user.email }
    }));
  } catch (e) {}

  return getCurrentUser();
}

export function login({ email, password }) {
  if (!email || !password) throw new Error("Email and password required");

  const user = getUsers().find(
    u => u.email === email && u.password === password
  );
  if (!user) throw new Error("Invalid email or password");

  if (user.banned) {
    const now = Date.now();
    if (user.banUntil && now >= Number(user.banUntil)) {
      // auto-unban
      const users = getUsers();
      const idx = users.findIndex(u => u.email === email);
      if (idx !== -1) {
        users[idx].banned = false;
        delete users[idx].banUntil;
        delete users[idx].banReason;
        updateUsers(users);
      }
    } else {
      try {
        const until = user.banUntil
          ? new Date(Number(user.banUntil)).toString()
          : "unknown";
        const remaining = user.banUntil
          ? Math.max(0, Number(user.banUntil) - Date.now())
          : 0;
        const mins = Math.ceil(remaining / 60000);

        showModal(`
          <div style="max-width:560px">
            <h3>Account temporarily suspended</h3>
            <p>Your account is currently banned.</p>
            <p><strong>Reason:</strong> ${user.banReason || "policy violation"}</p>
            <p><strong>Suspended until:</strong> ${until}</p>
            <p style="color:var(--muted)">Remaining: ${mins} minute(s)</p>
            <button class="btn-primary"
              onclick="document.querySelector('.app-modal')?.dispatchEvent(new Event('click'))">
              Close
            </button>
          </div>
        `);
      } catch (e) {}
      throw new Error("This account is banned");
    }
  }

  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  try {
    window.dispatchEvent(new CustomEvent("auth:changed", {
      detail: { id: user.id, name: user.name, email: user.email }
    }));
  } catch (e) {}

  return getCurrentUser();
}

export function logout() {
  clearCurrentUser();
}

export function currentUser() {
  return getCurrentUser();
}

// Lift ban for a user by email
export function unbanUser(email) {
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) throw new Error("User not found");
  users[idx].banned = false;
  delete users[idx].banUntil;
  delete users[idx].banReason;
  updateUsers(users);
  return users[idx];
}

// Reset a user's display name
export function resetUsername(email, newName) {
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) throw new Error("User not found");

  users[idx].name = sanitizeText(newName || "");
  updateUsers(users);

  const cur = getCurrentUser();
  if (cur && cur.email === email) {
    setCurrentUser({
      id: users[idx].id,
      name: users[idx].name,
      email: users[idx].email
    });
  }

  return users[idx];
}

export function changePassword(email, oldPassword, newPassword) {
  const users = getUsers();
  const idx = users.findIndex(
    u => u.email === email && u.password === oldPassword
  );
  if (idx === -1) throw new Error("Invalid credentials");

  users[idx].password = newPassword;
  updateUsers(users);
  return true;
}

export function updateProfile(email, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) throw new Error("User not found");

  users[idx] = { ...users[idx], ...updates };
  updateUsers(users);

  const cur = getCurrentUser();
  if (cur && cur.email === email) {
    setCurrentUser({
      id: users[idx].id,
      name: users[idx].name,
      email: users[idx].email
    });
  }

  return users[idx];
}
