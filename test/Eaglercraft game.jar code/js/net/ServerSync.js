// ServerSync - very small WebSocket wrapper; integrate with your server
export class ServerSync {
  constructor(url='ws://localhost:3000') { this.url = url; this.ws = null; }
  connect(){
    return new Promise((res, rej) => {
      try {
        this.ws = new WebSocket(this.url);
        this.ws.addEventListener('open', ()=> res());
        this.ws.addEventListener('error', (e)=> rej(e));
      } catch(e){ rej(e); }
    });
  }
  send(obj){ if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(obj)); }
  sendChat(text){ this.send({ type:'chat', text }); }
}
