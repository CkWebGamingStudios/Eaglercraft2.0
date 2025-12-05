export function enforceSecuredPlay() {
  const securedSite = 'https://eaglercraft2.pages.dev';
  const unsecuredSite = 'https://eaglercraft2-0.pages.dev';

  // Detect if user is on the unsecured site and presses "Play"
  const playButtons = document.querySelectorAll('.play-btn');
  playButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.location.origin === unsecuredSite) {
        alert('You must go to the secured site to play the game.');
        window.location.href = securedSite;
      }
    });
  });
}

// Usage: call this on page load
// import { enforceSecuredPlay } from './redirect-module.js';
// enforceSecuredPlay();
