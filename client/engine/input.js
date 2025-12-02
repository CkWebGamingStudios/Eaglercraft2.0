export class Input {
    constructor(canvas, player) {
        this.player = player;
        this.keys = {};

        window.addEventListener("keydown", e => this.keys[e.key] = true);
        window.addEventListener("keyup", e => this.keys[e.key] = false);

        canvas.addEventListener("click", () => canvas.requestPointerLock());

        document.addEventListener("mousemove", e => {
            if (document.pointerLockElement === canvas) {
                player.yaw -= e.movementX * 0.002;
                player.pitch -= e.movementY * 0.002;
                player.pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, player.pitch));
            }
        });
    }

    update(dt) {
        const speed = 5;

        if (this.keys["w"]) this.player.z -= speed * dt;
        if (this.keys["s"]) this.player.z += speed * dt;
        if (this.keys["a"]) this.player.x -= speed * dt;
        if (this.keys["d"]) this.player.x += speed * dt;
    }
}
