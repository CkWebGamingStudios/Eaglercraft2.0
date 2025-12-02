export default class Input {
    static keys = {};
    static mouse = { x: 0, y: 0, down: false };

    static init(canvas) {
        window.addEventListener("keydown", e => Input.keys[e.key] = true);
        window.addEventListener("keyup", e => Input.keys[e.key] = false);

        canvas.addEventListener("mousemove", e => {
            Input.mouse.x = e.clientX;
            Input.mouse.y = e.clientY;
        });

        canvas.addEventListener("mousedown", () => Input.mouse.down = true);
        canvas.addEventListener("mouseup", () => Input.mouse.down = false);
    }

    static isKeyDown(key) {
        return Input.keys[key] === true;
    }
}
