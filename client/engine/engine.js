import { Renderer } from "./renderer.js";
import { World } from "./world.js";
import { Player } from "./player.js";
import { Input } from "./input.js";

export class Engine {
    constructor(canvas) {
        this.canvas = canvas;

        this.renderer = new Renderer(canvas);
        this.world = new World();
        this.player = new Player();
        this.input = new Input(canvas, this.player);

        this.lastTime = 0;
    }

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(time) {
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.input.update(dt);
        this.player.update(dt);

        this.renderer.render(this.world, this.player);

        requestAnimationFrame(this.loop.bind(this));
    }
}
