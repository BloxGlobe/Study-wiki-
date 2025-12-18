const STORAGE_KEY = "studywiki:data";
let listeners = [];

function getStore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const base = { notes: [], users: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
    return base;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return { notes: [], users: [] };
  }
}

function saveStore(store) {
  // Store the updated data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  // Notify listeners
  listeners.forEach(cb => cb(store));
}

// --- Notes ---
export function getAllNotes() {
  return getStore().notes || [];
}

export function saveNote(note) {
  const store = getStore();
  store.notes = store.notes || [];
  store.notes.push(note);
  saveStore(store);
}

export function updateNotes(notes) {
  const store = getStore();
  store.notes = notes || [];
  saveStore(store);
}

// --- Users ---
export function getUsers() {
  return getStore().users || [];
}

export function saveUser(user) {
  const store = getStore();
  store.users = store.users || [];
  store.users.push(user);
  saveStore(store);
}

export function updateUsers(users) {
  const store = getStore();
  store.users = users || [];
  saveStore(store);
}

// --- Live update subscription ---
export function onStoreChange(callback) {
  if (typeof callback === "function") listeners.push(callback);
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
}
