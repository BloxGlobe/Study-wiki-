const SESSION_KEY = "studywiki:session";

export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    try { window.dispatchEvent(new CustomEvent('auth:changed', { detail: null })); } catch(e){}
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  try { window.dispatchEvent(new CustomEvent('auth:changed', { detail: user })); } catch(e){}
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(SESSION_KEY);
  try { window.dispatchEvent(new CustomEvent('auth:changed', { detail: null })); } catch(e){}
}
