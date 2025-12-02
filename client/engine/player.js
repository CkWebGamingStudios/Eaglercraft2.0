export class Player {
    constructor() {
        this.x = 0;
        this.y = 1;
        this.z = 5;

        this.pitch = 0;
        this.yaw = 0;
    }

    update(dt) {
        // movement handled in Input.js
    }

    getViewMatrix() {
        const view = mat4.create();
        mat4.rotateX(view, view, this.pitch);
        mat4.rotateY(view, view, this.yaw);
        mat4.translate(view, view, [-this.x, -this.y, -this.z]);
        return view;
    }
}
