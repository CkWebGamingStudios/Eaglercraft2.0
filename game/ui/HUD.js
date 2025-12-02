// /game/ui/HUD.js
export default class HUD {
  constructor() {
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      position: 'fixed', left: '0', top: '0', right: '0', pointerEvents: 'none',
      fontFamily: 'Inter, system-ui, Arial', color: '#dfeffc', zIndex: 9999
    });
    document.body.appendChild(this.container);

    // top-left status
    this.statusEl = document.createElement('div');
    Object.assign(this.statusEl.style, { padding: '8px', pointerEvents: 'auto' });
    this.container.appendChild(this.statusEl);

    // center crosshair
    this.cross = document.createElement('div');
    this.cross.innerText = '+';
    Object.assign(this.cross.style, {
      position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
      fontSize: '24px', color: 'rgba(255,255,255,0.85)', pointerEvents: 'none'
    });
    document.body.appendChild(this.cross);

    // message area
    this.msgEl = document.createElement('div');
    Object.assign(this.msgEl.style, {
      position: 'fixed', right: '10px', bottom: '120px', maxWidth: '340px', textAlign: 'right',
      pointerEvents: 'auto', fontSize: '13px'
    });
    document.body.appendChild(this.msgEl);

    this.fps = 0;
    this.last = performance.now();
  }

  setStatus(text) { this.statusEl.innerHTML = text; }

  showMessage(text, ttl = 3500) {
    const el = document.createElement('div');
    el.textContent = text;
    Object.assign(el.style, { background: 'rgba(0,0,0,0.5)', padding: '8px', marginTop: '6px', borderRadius: '6px' });
    this.msgEl.appendChild(el);
    setTimeout(()=> { el.style.opacity = '0'; setTimeout(()=>el.remove(),400); }, ttl);
  }

  update(dt) {
    // simple FPS
    const now = performance.now();
    this.fps = Math.round(1000 / Math.max(1, now - this.last));
    this.last = now;
    this.setStatus(`FPS: ${this.fps} • Blocks: ${window._worldStats?.totalBlocks || 0}`); 
  }

  destroy() {
    this.container.remove();
    this.cross.remove();
    this.msgEl.remove();
  }
}
`