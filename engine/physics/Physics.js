export default class Physics {
    constructor() {
        this.entities = [];
        this.gravity = -9.8;
    }

    add(entity) {
        this.entities.push(entity);
    }

    update(dt) {
        for (let e of this.entities) {
            if (!e.physics) continue;

            e.velocity.y += this.gravity * dt;
            e.position.x += e.velocity.x * dt;
            e.position.y += e.velocity.y * dt;
            e.position.z += e.velocity.z * dt;

            if (e.position.y < 0) {
                e.position.y = 0;
                e.velocity.y = 0;
            }
        }
    }
}
