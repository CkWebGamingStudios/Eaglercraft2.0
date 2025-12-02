export class Player {
    constructor() {
        this.position = [8, 10, 8];
        this.velocity = [0, 0, 0];
        this.speed = 0.08;
        this.gravity = 0.004;
        this.onGround = false;
    }

    update(input, world) {
        // Horizontal movement
        if (input.forward) this.position[2] -= this.speed;
        if (input.back)    this.position[2] += this.speed;
        if (input.left)    this.position[0] -= this.speed;
        if (input.right)   this.position[0] += this.speed;

        // Gravity
        this.velocity[1] -= this.gravity;

        // Apply velocity
        this.position[1] += this.velocity[1];

        // Simple ground collision
        if (this.position[1] < 4) {
            this.position[1] = 4;
            this.velocity[1] = 0;
            this.onGround = true;
        }
    }
}
