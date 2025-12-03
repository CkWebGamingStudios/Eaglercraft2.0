export function initLauncher(){
  const versionSelect = document.getElementById('version-select');
  const memorySlider = document.getElementById('memory-slider');
  const memoryVal = document.getElementById('memory-val');
  const playBtn = document.getElementById('play-btn');
  const status = document.getElementById('launcher-status');

  // populate versions (example)
  const versions = ['1.21.1','1.20.2','snapshot-23w17a'];
  versions.forEach(v => {
    const opt = document.createElement('option'); opt.value = v; opt.textContent = v;
    versionSelect.appendChild(opt);
  });

  memorySlider.value = localStorage.getItem('memory') || 2048;
  memoryVal.textContent = memorySlider.value;
  memorySlider.addEventListener('input', ()=> memoryVal.textContent = memorySlider.value);

  playBtn.addEventListener('click', () => {
    status.textContent = `Launching ${versionSelect.value} with ${memorySlider.value} MB...`;
    // trigger actual launch flow here (native or server)
    setTimeout(()=> status.textContent = 'Started (demo).', 1200);
    localStorage.setItem('memory', memorySlider.value);
  });
}
