// /game/ui/Hotbar.js
export default class Hotbar {
  constructor(onSelect) {
    this.onSelect = onSelect;
    this.slots = [];
    this.selected = 0;

    this.el = document.createElement('div');
    Object.assign(this.el.style, {
      position: 'fixed', left: '50%', bottom: '18px', transform: 'translateX(-50%)',
      display: 'flex', gap: '8px', pointerEvents: 'auto', zIndex: 9998
    });
    document.body.appendChild(this.el);

    for (let i=0;i<9;i++) {
      const s = document.createElement('div');
      s.className = 'hc-slot';
      s.dataset.idx = i;
      s.textContent = (i===0)?'Dirt':(i===1?'Grass':(i===2?'Stone':'Empty'));
      Object.assign(s.style, {
        background: 'rgba(2,10,20,0.6)', color: '#cfeefc', padding: '8px 12px',
        borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', userSelect:'none'
      });
      this.el.appendChild(s);
      this.slots.push(s);
      s.addEventListener('click', ()=> this.select(i));
    }

    window.addEventListener('wheel', (e)=> {
      const dir = e.deltaY > 0 ? 1 : -1;
      this.select((this.selected + dir + this.slots.length) % this.slots.length);
    });
    this.select(0);
  }

  setSlotText(idx, text) {
    if (this.slots[idx]) this.slots[idx].textContent = text;
  }

  select(idx) {
    this.slots[this.selected].style.outline = '';
    this.selected = idx;
    this.slots[this.selected].style.outline = '2px solid rgba(125,211,252,0.9)';
    if (this.onSelect) this.onSelect(this.selected);
  }

  getSelected() { return this.selected; }

  destroy() { this.el.remove(); }
}
