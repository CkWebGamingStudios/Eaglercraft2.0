/* main.js (root) — SPA loader for src/pages + page init mapping */
const contentEl = document.getElementById('content');
const sidebar = document.getElementById('sidebar');

const pageInitMap = {
  'home.html': () => import('./src/js/home.js').then(m => m.initHome()),
  'launcher.html': () => import('./src/js/launcher.js').then(m => m.initLauncher()),
  'servers.html': () => import('./src/js/servers.js').then(m => m.initServers()),
  'profile.html': () => import('./src/js/profile.js').then(m => m.initProfile()),
  'friends.html': () => import('./src/js/friends.js').then(m => m.initFriends()),
  'marketplace.html': () => import('./src/js/marketplace.js').then(m => m.initMarketplace()),
  'settings.html': () => import('./src/js/settings.js').then(m => m.initSettings()),
  'about.html': () => import('./src/js/about.js').then(m => m.initAbout()),
};

// Helper: set active sidebar item
function setActiveSidebar(page) {
  document.querySelectorAll('.nav-item').forEach(li => {
    li.classList.toggle('active', li.dataset.page === page);
  });
}

// Load HTML into content area and run its init
async function loadPage(page, pushState = true) {
  try {
    contentEl.innerHTML = '<div class="loading">Loading...</div>';
    const res = await fetch(`src/pages/${page}`);
    if (!res.ok) throw new Error('Page not found: ' + page);
    const html = await res.text();
    contentEl.innerHTML = html;
    setActiveSidebar(page);
    if (pageInitMap[page]) {
      await pageInitMap[page]();
    }
    if (pushState) {
      history.pushState({ page }, '', `#${page}`);
    }
    // focus main for keyboard users
    contentEl.querySelector('main, .page-root, #content')?.focus();
  } catch (err) {
    contentEl.innerHTML = `<div class="error">Error loading page: ${err.message}</div>`;
    console.error(err);
  }
}

// Sidebar clicks
sidebar.addEventListener('click', (e) => {
  const li = e.target.closest('[data-page]');
  if (!li) return;
  const page = li.dataset.page;
  loadPage(page);
});

// Handle back/forward
window.addEventListener('popstate', (e) => {
  const page = (e.state && e.state.page) || location.hash.replace('#','') || 'home.html';
  loadPage(page, false);
});

// Initialize from hash or default home
(function initSPA() {
  const initial = location.hash.replace('#','') || 'home.html';
  // Ensure sidebar active reflect
  setActiveSidebar(initial);
  loadPage(initial, false);
  // Load persisted theme early
  import('./src/js/settings.js').then(m => m.restoreTheme());
})();
