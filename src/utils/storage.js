const STORAGE_KEY = "studywiki:data";

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getAllNotes() {
  return getStore().notes || [];
}

export function saveNote(note) {
  const store = getStore();
  store.notes.push(note);
  saveStore(store);
}

export function updateNotes(notes) {
  const store = getStore();
  store.notes = notes;
  saveStore(store);
}

export function getUsers() {
  return getStore().users || [];
}

export function saveUser(user) {
  const store = getStore();
  store.users.push(user);
  saveStore(store);
}
