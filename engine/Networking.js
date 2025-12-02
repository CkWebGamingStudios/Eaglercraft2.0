// /engine/Networking.js
export class Networking {
  constructor(game, url) {
    this.game = game;
    this.url = url || `ws://${location.hostname}:3000/ws`;
    this.ws = null;
    this.clientId = null;
    this.onSnapshot = null;
  }

  connect(){
    return new Promise((res, rej) => {
      this.ws = new WebSocket(this.url);
      this.ws.addEventListener('open', ()=> {
        console.log('connected to gateway');
        res();
      });
      this.ws.addEventListener('message', evt => {
        let msg;
        try { msg = JSON.parse(evt.data); } catch(e){ return; }
        this._handle(msg);
      });
      this.ws.addEventListener('close', ()=> console.log('ws closed'));
      this.ws.addEventListener('error', e => { console.error('ws error', e); rej(e); });
    });
  }

  _handle(msg){
    if (msg.type === 'welcome') {
      this.clientId = msg.clientId;
      console.log('welcome', this.clientId);
    } else if (msg.type === 'snapshot') {
      if (this.onSnapshot) this.onSnapshot(msg);
    } else {
      // other messages
      console.log('net msg', msg);
    }
  }

  sendPlayerState(){
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const p = this.game.player;
    this.ws.send(JSON.stringify({ type:'playerState', state: {
      x: p.position[0], y: p.position[1], z: p.position[2], yaw: p.yaw, pitch: p.pitch
    }}));
  }
}
