export default class Camera {
    constructor() {
        this.position = { x: 0, y: 2, z: 5 };
        this.rotation = { x: 0, y: 0 };
    }

    getMatrix() {
        const view = mat4.create();
        mat4.rotateX(view, view, this.rotation.x);
        mat4.rotateY(view, view, this.rotation.y);
        mat4.translate(view, view, [-this.position.x, -this.position.y, -this.position.z]);
        return view;
    }
}
