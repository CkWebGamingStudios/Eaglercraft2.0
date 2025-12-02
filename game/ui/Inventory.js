// /game/ui/Inventory.js
export default class Inventory {
  constructor() {
    this.items = {}; // id -> count
    this.dom = null;
    this.open = false;
  }

  toggle() {
    if (this.open) this.close();
    else this.openUI();
  }

  openUI() {
    if (this.dom) return;
    this.open = true;
    this.dom = document.createElement('div');
    Object.assign(this.dom.style, {
      position:'fixed', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
      width:'580px', height:'380px', background:'rgba(4,12,20,0.88)', borderRadius:'10px',
      padding:'16px', color:'#cfeefc', zIndex:10000, pointerEvents:'auto'
    });

    const title = document.createElement('h3');
    title.textContent = 'Inventory';
    Object.assign(title.style, { marginTop:0 });
    this.dom.appendChild(title);

    const grid = document.createElement('div');
    Object.assign(grid.style, { display:'grid', gridTemplateColumns:'repeat(9,1fr)', gap:'8px', marginTop:'12px' });
    this.dom.appendChild(grid);

    for (let i=0;i<27;i++){
      const cell = document.createElement('div');
      Object.assign(cell.style, {
        background:'rgba(0,0,0,0.25)', padding:'12px', borderRadius:'6px', textAlign:'center'
      });
      const id = Object.keys(this.items)[i] || '';
      cell.textContent = id ? `${id} x${this.items[id]}` : '';
      grid.appendChild(cell);
    }

    const close = document.createElement('button');
    close.textContent = 'Close';
    close.onclick = ()=> this.close();
    Object.assign(close.style, { marginTop:'12px' });
    this.dom.appendChild(close);

    document.body.appendChild(this.dom);
  }

  close() {
    this.open = false;
    if (this.dom) { this.dom.remove(); this.dom = null; }
  }

  add(id, count=1) {
    this.items[id] = (this.items[id]||0) + count;
  }
}
