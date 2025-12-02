import Entity from "./Entity.js";
import Input from "../../engine/core/Input.js";

export default class Player extends Entity {
    constructor() {
        super();
        this.speed = 5;
    }

    update(dt, world) {
        let moveX = 0;
        let moveZ = 0;

        if (Input.isKeyDown("w")) moveZ -= 1;
        if (Input.isKeyDown("s")) moveZ += 1;
        if (Input.isKeyDown("a")) moveX -= 1;
        if (Input.isKeyDown("d")) moveX += 1;

        this.position.x += moveX * this.speed * dt;
        this.position.z += moveZ * this.speed * dt;
    }
}
