// engine/Renderer.js
// Minimal WebGL renderer for small voxel scenes.
// Uses WebGL2 if available, falls back to WebGL1 (with Uint16 indices).

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!this.gl) throw new Error("WebGL not supported");

    this.isWebGL2 = (this.gl instanceof WebGL2RenderingContext);
    this.clearColor = [0.2, 0.4, 0.7, 1];

    this._initShaders();
    this._initCubeBuffers();
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  setClearColor(r,g,b,a){ this.clearColor = [r,g,b,a]; }

  resize(){
    const c = this.canvas;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    this.gl.viewport(0,0,c.width,c.height);
  }

  _createShader(src,type){
    const gl = this.gl;
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("Shader compile error:", gl.getShaderInfoLog(s));
    }
    return s;
  }

  _initShaders(){
    const gl = this.gl;

    const vs = `#version 300 es
      precision highp float;
      in vec3 aPos;
      in vec3 aColor;
      uniform mat4 uProj;
      uniform mat4 uView;
      out vec3 vColor;
      void main(){
        vColor = aColor;
        gl_Position = uProj * uView * vec4(aPos, 1.0);
      }
    `;
    const fs = `#version 300 es
      precision mediump float;
      in vec3 vColor;
      out vec4 outColor;
      void main(){ outColor = vec4(vColor, 1.0); }
    `;

    // fallback for WebGL1 (strip version directive)
    const vs1 = vs.replace('#version 300 es','');
    const fs1 = fs.replace('#version 300 es','').replace('out vec4 outColor;','').replace('outColor =','gl_FragColor =');

    let vert = this.isWebGL2 ? vs : vs1;
    let frag = this.isWebGL2 ? fs : fs1;

    const vsh = this._createShader(vert, gl.VERTEX_SHADER);
    const fsh = this._createShader(frag, gl.FRAGMENT_SHADER);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vsh);
    gl.attachShader(this.program, fsh);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.warn("Program link:", gl.getProgramInfoLog(this.program));
    }

    gl.useProgram(this.program);
    // attribute/uniform locations
    this.aPos = gl.getAttribLocation(this.program, "aPos");
    this.aColor = gl.getAttribLocation(this.program, "aColor");
    this.uProj = gl.getUniformLocation(this.program, "uProj");
    this.uView = gl.getUniformLocation(this.program, "uView");
  }

  _initCubeBuffers(){
    // single unit cube vertex positions (we will offset in vertex shader by CPU)
    // cube defined as 36 vertices (6 faces * 2 triangles * 3 verts)
    // but for simplicity we create a simple VBO per-instance below (CPU transform).
    this.unitCube = {
      // positions for one cube: 36 * 3 floats
      positions: new Float32Array([
        // front
        0,0,1, 1,0,1, 1,1,1, 0,0,1, 1,1,1, 0,1,1,
        // back
        1,0,0, 0,0,0, 0,1,0, 1,0,0, 0,1,0, 1,1,0,
        // left
        0,0,0, 0,0,1, 0,1,1, 0,0,0, 0,1,1, 0,1,0,
        // right
        1,0,1, 1,0,0, 1,1,0, 1,0,1, 1,1,0, 1,1,1,
        // top
        0,1,1, 1,1,1, 1,1,0, 0,1,1, 1,1,0, 0,1,0,
        // bottom
        0,0,0, 1,0,0, 1,0,1, 0,0,0, 1,0,1, 0,0,1
      ]),
      // colors placeholder (will be filled per-draw)
    };

    const gl = this.gl;
    // create buffers (we will upload per-render a dynamic buffer for many cubes)
    this.posBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();
  }

  // player/view math helpers (basic)
  _perspective(fovy, aspect, near, far){
    const f = 1.0 / Math.tan(fovy/2);
    const nf = 1/(near - far);
    return new Float32Array([
      f/aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far+near)*nf, -1,
      0, 0, (2*far*near)*nf, 0
    ]);
  }

  _lookAt(eye, center, up){
    // compute simple lookAt matrix (column-major)
    const fx = center[0]-eye[0], fy = center[1]-eye[1], fz = center[2]-eye[2];
    let rlf = 1/Math.hypot(fx,fy,fz); const fxn = fx*rlf, fyn = fy*rlf, fzn = fz*rlf;
    const sx = fyn*up[2]-fzn*up[1], sy = fzn*up[0]-fxn*up[2], sz = fxn*up[1]-fyn*up[0];
    const rls = 1/Math.hypot(sx,sy,sz); const sxn=sx*rls, syn=sy*rls, szn=sz*rls;
    const ux = syn*fzn - szn*fyn, uy = szn*fxn - sxn*fzn, uz = sxn*fyn - syn*fxn;
    const out = new Float32Array(16);
    out[0]=sxn; out[1]=ux; out[2]=-fxn; out[3]=0;
    out[4]=syn; out[5]=uy; out[6]=-fyn; out[7]=0;
    out[8]=szn; out[9]=uz; out[10]=-fzn; out[11]=0;
    out[12]=-(sxn*eye[0]+syn*eye[1]+szn*eye[2]);
    out[13]=-(ux*eye[0]+uy*eye[1]+uz*eye[2]);
    out[14]= (fxn*eye[0]+fyn*eye[1]+fzn*eye[2]);
    out[15]=1;
    return out;
  }

  render(blockList, player){
    const gl = this.gl;
    this.resize();
    gl.clearColor(...this.clearColor);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(this.program);

    // projection
    const proj = this._perspective((60*Math.PI)/180, this.canvas.width/this.canvas.height, 0.1, 1000.0);
    // view (simple yaw/pitch from player)
    const eye = [player.position[0], player.position[1]+player.eyeHeight, player.position[2]];
    const dir = [
      Math.cos(player.pitch) * Math.sin(player.yaw),
      Math.sin(player.pitch),
      Math.cos(player.pitch) * Math.cos(player.yaw)
    ];
    const center = [ eye[0] + dir[0], eye[1] + dir[1], eye[2] + dir[2] ];
    const view = this._lookAt(eye, center, [0,1,0]);

    gl.uniformMatrix4fv(this.uProj, false, proj);
    gl.uniformMatrix4fv(this.uView, false, view);

    // Build aggregated arrays (positions & colors) per-cube (fast enough for small scenes)
    const positions = [];
    const colors = [];

    for (let b of blockList) {
      // for each cube, append unit-cube vertices offset by its x,y,z
      const offX = b[0], offY = b[1], offZ = b[2];
      const col = b[3] || [0.6,0.6,0.6];

      const p = this.unitCube.positions;
      for (let i=0;i<p.length;i+=3){
        positions.push(p[i]+offX, p[i+1]+offY, p[i+2]+offZ);
        colors.push(col[0], col[1], col[2]);
      }
    }

    if (positions.length === 0) return;

    const posArr = new Float32Array(positions);
    const colArr = new Float32Array(colors);

    // upload pos buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, posArr, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.aPos);
    gl.vertexAttribPointer(this.aPos, 3, gl.FLOAT, false, 0, 0);

    // upload color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colArr, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.aColor);
    gl.vertexAttribPointer(this.aColor, 3, gl.FLOAT, false, 0, 0);

    // number of vertices = positions.length/3
    const vertCount = posArr.length / 3;
    gl.drawArrays(gl.TRIANGLES, 0, vertCount);
  }
}
