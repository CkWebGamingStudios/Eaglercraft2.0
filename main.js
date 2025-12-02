// main.js - minimal frontend to interact with functions APIs

const out = text => { document.getElementById('out').textContent = JSON.stringify(text, null, 2); };

async function apiFetch(path, method='GET', body=null) {
  const token = localStorage.getItem('ec_token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  try { return { status: res.status, data: JSON.parse(text) }; } catch(e) { return { status: res.status, data: text }; }
}

document.getElementById('btnLogin').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const r = await apiFetch('/api/login', 'POST', { email, password });
  out(r);
  if (r.status === 200 && r.data.token) {
    localStorage.setItem('ec_token', r.data.token);
  }
});

document.getElementById('btnSignup').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const r = await apiFetch('/api/register', 'POST', { email, password, displayName: email.split('@')[0] });
  out(r);
});

document.getElementById('btnSave').addEventListener('click', async () => {
  const demo = { level: 1, score: Math.floor(Math.random() * 1000) };
  const r = await apiFetch('/api/save', 'POST', { data: demo });
  out(r);
});

document.getElementById('btnLoad').addEventListener('click', async () => {
  const r = await apiFetch('/api/load', 'GET');
  out(r);
});
