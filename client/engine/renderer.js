export class Renderer {

    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl");

        this.resize();
        window.addEventListener("resize",()=>this.resize());

        this.loadTexture("/assets/textures/atlas.png");
        this.initShaders();
    }

    loadTexture(url) {
        const gl = this.gl;

        this.texture = gl.createTexture();
        const img = new Image();
        img.src = url;

        img.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                          gl.UNSIGNED_BYTE, img);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        };
    }

    initShaders() {
        const gl = this.gl;

        const vs = `
            attribute vec3 position;
            attribute vec2 uv;
            varying vec2 vUV;

            uniform mat4 uProj;
            uniform mat4 uView;

            void main() {
                vUV = uv;
                gl_Position = uProj * uView * vec4(position,1.0);
            }
        `;

        const fs = `
            precision mediump float;
            varying vec2 vUV;
            uniform sampler2D uTexture;

            void main() {
                gl_FragColor = texture2D(uTexture, vUV);
            }
        `;

        const compile = (src, t)=>{
            const s=gl.createShader(t);
            gl.shaderSource(s,src);
            gl.compileShader(s);
            return s;
        };

        this.prog = gl.createProgram();
        gl.attachShader(this.prog, compile(vs,gl.VERTEX_SHADER));
        gl.attachShader(this.prog, compile(fs,gl.FRAGMENT_SHADER));
        gl.linkProgram(this.prog);
        gl.useProgram(this.prog);

        this.aPos = gl.getAttribLocation(this.prog,"position");
        this.aUV = gl.getAttribLocation(this.prog,"uv");

        this.uProj = gl.getUniformLocation(this.prog,"uProj");
        this.uView = gl.getUniformLocation(this.prog,"uView");
    }

    render(world,player) {
        const gl = this.gl;
        gl.clearColor(0.5,0.7,1.0,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        gl.useProgram(this.prog);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        for (const chunk of world.getChunks()) {
            if (!chunk.mesh) continue;

            // position buffer
            const vb = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vb);
            gl.bufferData(gl.ARRAY_BUFFER, chunk.mesh.vertices, gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.aPos,3,gl.FLOAT,false,0,0);
            gl.enableVertexAttribArray(this.aPos);

            // uv buffer
            const ub = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, ub);
            gl.bufferData(gl.ARRAY_BUFFER, chunk.mesh.uvs, gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.aUV,2,gl.FLOAT,false,0,0);
            gl.enableVertexAttribArray(this.aUV);

            // index buffer
            const ib = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, chunk.mesh.indices, gl.STATIC_DRAW);

            gl.drawElements(gl.TRIANGLES, chunk.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
        }
    }
}
