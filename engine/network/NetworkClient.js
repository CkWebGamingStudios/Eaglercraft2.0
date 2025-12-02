export default class NetworkClient {
    constructor(url) {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => console.log("Connected to server");
        this.ws.onmessage = msg => this.onMessage(JSON.parse(msg.data));
        this.ws.onclose = () => console.log("Disconnected");
    }

    send(obj) {
        this.ws.send(JSON.stringify(obj));
    }

    onMessage(data) {}
}
