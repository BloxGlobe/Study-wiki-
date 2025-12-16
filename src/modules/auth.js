import { getUsers, saveUser } from "../utils/storage.js";
import { setCurrentUser, getCurrentUser, clearCurrentUser } from "./session.js";

export function signup({ name, email, password }) {
  if (!email || !password) throw new Error("Email and password required");
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error("A user with that email already exists");
  }
  const user = { id: Date.now(), name: name || "", email, password };
  saveUser(user);
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  return getCurrentUser();
}

export function login({ email, password }) {
  if (!email || !password) throw new Error("Email and password required");
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  return getCurrentUser();
}

export function logout() {
  clearCurrentUser();
}

export function currentUser() {
  return getCurrentUser();
}
