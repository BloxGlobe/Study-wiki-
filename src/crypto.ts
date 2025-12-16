// Minimal TypeScript password helper using Web Crypto API (browser)
// Note: This is a demo helper. For production, use a server-side secure hash + salt storage.

export async function hashPassword(password: string, salt?: Uint8Array) {
  const enc = new TextEncoder();
  const pw = enc.encode(password);
  salt = salt || crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', pw, { name: 'PBKDF2' }, false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256);
  const hash = new Uint8Array(derived);
  return { hash: bufferToBase64(hash), salt: bufferToBase64(salt) };
}

export async function verifyPassword(password: string, saltB64: string, hashB64: string) {
  const enc = new TextEncoder();
  const pw = enc.encode(password);
  const salt = base64ToBuffer(saltB64);
  const keyMaterial = await crypto.subtle.importKey('raw', pw, { name: 'PBKDF2' }, false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256);
  const h = bufferToBase64(new Uint8Array(derived));
  return h === hashB64;
}

function bufferToBase64(buf: Uint8Array){
  let binary = '';
  const len = buf.byteLength;
  for (let i=0;i<len;i++) binary += String.fromCharCode(buf[i]);
  return btoa(binary);
}

function base64ToBuffer(b64: string){
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
  return arr;
}
