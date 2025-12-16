import { getUsers, saveUser, updateUsers } from "../utils/storage.js";
import { setCurrentUser, getCurrentUser, clearCurrentUser } from "./session.js";
import { sanitizeText, containsBadWords } from "../utils/filter.js";

export function signup({ name, email, password }) {
  if (!email || !password) throw new Error("Email and password required");
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error("A user with that email already exists");
  }
  // sanitize name
  const safeName = sanitizeText(name || "");
  const user = { id: Date.now().toString(), name: safeName, email, password };
  saveUser(user);
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  try { window.dispatchEvent(new CustomEvent('auth:changed', { detail: { id: user.id, name: user.name, email: user.email } })); } catch(e){}
  return getCurrentUser();
}

export function login({ email, password }) {
  if (!email || !password) throw new Error("Email and password required");
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
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
