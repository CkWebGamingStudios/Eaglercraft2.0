export default class WebGL {
    static gl = null;

    static init(canvas) {
        const gl = canvas.getContext("webgl2");
        if (!gl) throw new Error("WebGL2 not supported on this browser.");
        WebGL.gl = gl;
        return gl;
    }
}
