// /engine/resourcepack/ResourcePackLoader.js
export class ResourcePackLoader {
  constructor(glContext) {
    this.gl = glContext;
    this.atlasTexture = null;
    this.cols = 16;
    this.rows = 16;
    this.loaded = false;
  }

  async loadAtlas(url, cols=16, rows=16) {
    this.cols = cols; this.rows = rows;
    return new Promise((res, rej) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const gl = this.gl;
        this.atlasTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.atlasTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        this.loaded = true;
        res();
      };
      img.onerror = (e) => rej(e);
      img.src = url;
    });
  }

  getUV(tileIndex) {
    const col = tileIndex % this.cols;
    const row = Math.floor(tileIndex / this.cols);
    const tileW = 1 / this.cols;
    const tileH = 1 / this.rows;
    const u0 = col * tileW, v0 = row * tileH;
    return { u0, v0, u1: u0 + tileW, v1: v0 + tileH };
  }
}
