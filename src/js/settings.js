/* settings.js exports initSettings and restoreTheme (used early) */
export function restoreTheme(){
  const dark = localStorage.getItem('dark') === 'true';
  document.body.classList.toggle('dark', dark);
}

export function initSettings(){
  // Elements
  const darkToggle = document.getElementById('dark-toggle');
  const vsyncToggle = document.getElementById('vsync-toggle');
  const fullscreenToggle = document.getElementById('fullscreen-toggle');
  const fovSlider = document.getElementById('fov-slider');
  const fovVal = document.getElementById('fov-val');
  const sensSlider = document.getElementById('sens-slider');
  const sensVal = document.getElementById('sens-val');
  const guiScale = document.getElementById('gui-scale');
  const saveBtn = document.getElementById('save-settings');
  const resetBtn = document.getElementById('reset-settings');
  const status = document.getElementById('settings-status');

  // Load values
  darkToggle.checked = localStorage.getItem('dark') === 'true';
  vsyncToggle.checked = localStorage.getItem('vsync') === 'true';
  fullscreenToggle.checked = localStorage.getItem('fullscreen') === 'true';
  fovSlider.value = localStorage.getItem('fov') || 90;
  fovVal.textContent = fovSlider.value;
  sensSlider.value = localStorage.getItem('sensitivity') || 50;
  sensVal.textContent = sensSlider.value;
  guiScale.value = localStorage.getItem('guiScale') || 'normal';

  // UI handlers
  darkToggle.addEventListener('change', ()=> {
    document.body.classList.toggle('dark', darkToggle.checked);
    localStorage.setItem('dark', darkToggle.checked);
  });

  vsyncToggle.addEventListener('change', ()=> localStorage.setItem('vsync', vsyncToggle.checked));
  fullscreenToggle.addEventListener('change', ()=> localStorage.setItem('fullscreen', fullscreenToggle.checked));

  fovSlider.addEventListener('input', ()=> fovVal.textContent = fovSlider.value);
  sensSlider.addEventListener('input', ()=> sensVal.textContent = sensSlider.value);

  saveBtn.addEventListener('click', ()=> {
    localStorage.setItem('fov', fovSlider.value);
    localStorage.setItem('sensitivity', sensSlider.value);
    localStorage.setItem('guiScale', guiScale.value);
    status.textContent = 'Settings saved.';
    setTimeout(()=> status.textContent = '', 1800);
  });

  resetBtn.addEventListener('click', ()=> {
    if(!confirm('Reset settings to defaults?')) return;
    localStorage.removeItem('fov');
    localStorage.removeItem('sensitivity');
    localStorage.removeItem('guiScale');
    localStorage.removeItem('vsync');
    localStorage.removeItem('fullscreen');
    localStorage.removeItem('dark');
    // reapply
    restoreTheme();
    initSettings(); // re-init to update UI
  });
}
