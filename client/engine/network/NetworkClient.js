// client/engine/network/NetworkClient.js
export default class NetworkClient {
  constructor(url) {
    this.url = url || `ws://${location.hostname}:3000/ws`;
    this.ws = null;
    this.clientId = null;
    this.onSnapshot = null;
    this._sendQueue = [];
    this._lastSent = 0;
    this._sendInterval = 50; // ms (20Hz)
  }

  connect() {
    return new Promise((res, rej) => {
      this.ws = new WebSocket(this.url);
      this.ws.addEventListener('open', () => {
        console.log('WS open', this.url);
        res();
      });
      this.ws.addEventListener('message', evt => {
        let msg;
        try { msg = JSON.parse(evt.data); } catch(e){ return; }
        this._handle(msg);
      });
      this.ws.addEventListener('close', ()=> console.log('WS closed'));
      this.ws.addEventListener('error', e => { console.error('WS error', e); rej(e); });
    });
  }

  _handle(msg) {
    if (msg.type === 'welcome') {
      this.clientId = msg.clientId;
      console.log('welcome', this.clientId);
    } else if (msg.type === 'snapshot') {
      if (this.onSnapshot) this.onSnapshot(msg);
    } else {
      console.log('net msg', msg.type, msg);
    }
  }

  sendPlayerState(state) {
    const now = performance.now();
    if (now - this._lastSent < this._sendInterval) {
      // queue last state (overwrite)
      this._sendQueue[0] = state;
      return;
    }
    this._lastSent = now;
    const payload = { type:'playerState', state };
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(payload));
  }

  sendChat(text) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify({ type:'chat', text }));
  }

  disconnect() {
    if (this.ws) this.ws.close();
  }
}
