import WebGL from "./WebGL.js";

export default class Shader {
    constructor(vertexSrc, fragmentSrc) {
        const gl = WebGL.gl;

        this.program = gl.createProgram();
        const vs = this.loadShader(vertexSrc, gl.VERTEX_SHADER);
        const fs = this.loadShader(fragmentSrc, gl.FRAGMENT_SHADER);

        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error("Shader link error:", gl.getProgramInfoLog(this.program));
        }
    }

    loadShader(src, type) {
        const gl = WebGL.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    use() {
        WebGL.gl.useProgram(this.program);
    }

    getLoc(name) {
        return WebGL.gl.getUniformLocation(this.program, name);
    }
}
