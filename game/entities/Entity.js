export default class Entity {
    constructor() {
        this.position = { x: 0, y: 64, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.physics = true;
    }

    update(dt, world) {}

    render() {}
}
