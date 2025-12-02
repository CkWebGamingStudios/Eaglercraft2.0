export default class Engine {
    constructor() {
        this.lastTime = 0;
        this.delta = 0;
        this.running = false;

        this.updateCallbacks = [];
        this.renderCallbacks = [];
    }

    start() {
        if (this.running) return;
        this.running = true;
        requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        this.running = false;
    }

    loop(time) {
        if (!this.running) return;

        this.delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        // Update Systems
        for (let fn of this.updateCallbacks) fn(this.delta);

        // Render Systems
        for (let fn of this.renderCallbacks) fn();

        requestAnimationFrame(this.loop.bind(this));
    }

    onUpdate(fn) {
        this.updateCallbacks.push(fn);
    }

    onRender(fn) {
        this.renderCallbacks.push(fn);
    }
}
