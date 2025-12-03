export function initProfile(){
  const username = document.getElementById('username');
  const skin = document.getElementById('skin-url');
  const save = document.getElementById('save-profile');
  const logout = document.getElementById('logout');
  const status = document.getElementById('profile-status');

  username.value = localStorage.getItem('username') || '';
  skin.value = localStorage.getItem('skinUrl') || '';

  save.addEventListener('click', () => {
    localStorage.setItem('username', username.value);
    localStorage.setItem('skinUrl', skin.value);
    status.textContent = 'Profile saved.';
    setTimeout(()=>status.textContent='','2000');
  });

  logout.addEventListener('click', () => {
    // remove auth tokens etc (integrate with your auth.js)
    localStorage.removeItem('authToken');
    status.textContent = 'Logged out.';
    // optionally redirect
  });
}
