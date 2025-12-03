export function initHome(){
  const userEl = document.getElementById('welcome-user');
  const playBtn = document.getElementById('btn-play');
  const newsList = document.getElementById('news-list');

  // mock: load username
  const name = localStorage.getItem('username') || 'Player';
  userEl.textContent = `Hello, ${name}`;

  playBtn.addEventListener('click', () => {
    const launcherUrl = '#launcher.html';
    window.history.pushState({page:'launcher.html'}, '', launcherUrl);
    // ask main to load launcher
    window.dispatchEvent(new PopStateEvent('popstate', {state:{page:'launcher.html'}}));
  });

  // sample news
  newsList.innerHTML = '<ul><li>Launcher SPA loaded.</li></ul>';
}
