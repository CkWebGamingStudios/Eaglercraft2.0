// src/js/sync.js
// Client-side module for custom JWT login + GitHub-backed template via Worker

const WORKER_BASE = 'https://your-worker-domain.workers.dev'; // <-- set your worker URL here

function getAuthHeader() {
  const token = localStorage.getItem('eagler_token');
  if (!token) return {};
  return { 'Authorization': 'Bearer ' + token };
}

// Simple login: call Worker /auth/login with email -> returns { token, uid }
export async function loginByEmail(email) {
  const res = await fetch(`${WORKER_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Login failed: ' + res.status + ' ' + txt);
  }
  const j = await res.json();
  localStorage.setItem('eagler_token', j.token);
  localStorage.setItem('eagler_uid', j.uid);
  return j;
}

// logout
export function logout() {
  localStorage.removeItem('eagler_token');
  localStorage.removeItem('eagler_uid');
}

// Load all template files for current user
export async function loadPlayerTemplate(uid) {
  const res = await fetch(`${WORKER_BASE}/player/${encodeURIComponent(uid)}`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Load failed: ' + res.status);
  const data = await res.json();
  // store cached copy for UI use
  localStorage.setItem(`player_template_${uid}`, JSON.stringify(data));
  return data;
}

// read single file
export async function readFile(uid, filePath) {
  const res = await fetch(`${WORKER_BASE}/player/${encodeURIComponent(uid)}/${filePath}`, { headers: getAuthHeader() });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Read failed: ' + res.status);
  }
  const txt = await res.text();
  try { return JSON.parse(txt); } catch(e) { return txt; }
}

// write file (bodyObj is object)
export async function writeFile(uid, filePath, bodyObj) {
  const payload = typeof bodyObj === 'string' ? bodyObj : JSON.stringify(bodyObj, null, 2);
  const res = await fetch(`${WORKER_BASE}/player/${encodeURIComponent(uid)}/${filePath}`, {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeader()),
    body: payload
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Write failed: ' + res.status + ' ' + txt);
  }
  return await res.json();
}

// Install version
export async function installVersion(uid, versionId) {
  const res = await fetch(`${WORKER_BASE}/player/${encodeURIComponent(uid)}/install/${encodeURIComponent(versionId)}`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Install failed: ' + res.status + ' ' + txt);
  }
  return await res.json();
}

// Download jar (proxy). onProgress optional callback (0..1)
export async function downloadJar(versionId, onProgress) {
  const res = await fetch(`${WORKER_BASE}/downloadJar/${encodeURIComponent(versionId)}`, { method: 'GET', headers: getAuthHeader() });
  if (!res.ok) throw new Error('Download failed: ' + res.status);
  const reader = res.body.getReader();
  const contentLength = res.headers.get('content-length') ? Number(res.headers.get('content-length')) : null;
  let received = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (onProgress && contentLength) onProgress(received / contentLength);
  }
  return new Blob(chunks, { type: 'application/java-archive' });
}
