// /engine/Chunk.js
import { getTileFor } from './Block.js';

export class Chunk {
  constructor(cx = 0, cz = 0, W = 16, H = 128, D = 16) {
    this.cx = cx; this.cz = cz;
    this.W = W; this.H = H; this.D = D;
    this.size = W * H * D;
    this.blocks = new Uint8Array(this.size); // store block ids
    this.mesh = null; // generated mesh
    this.needsRemesh = true;
    this.generateBase();
  }

  index(x,y,z){
    return x + z * this.W + y * this.W * this.D;
  }
  inBounds(x,y,z){
    return x>=0 && x<this.W && y>=0 && y<this.H && z>=0 && z<this.D;
  }

  get(x,y,z){
    if (!this.inBounds(x,y,z)) return 0;
    return this.blocks[this.index(x,y,z)];
  }

  set(x,y,z, id){
    if (!this.inBounds(x,y,z)) return;
    this.blocks[this.index(x,y,z)] = id;
    this.needsRemesh = true;
  }

  // quick base generator (flat + small hills)
  generateBase(){
    for (let x=0;x<this.W;x++){
      for (let z=0;z<this.D;z++){
        // simple height function
        const wx = (this.cx * this.W) + x;
        const wz = (this.cz * this.D) + z;
        const h = 16 + Math.floor(Math.sin(wx*0.08)*4 + Math.cos(wz*0.08)*3);
        for (let y=0;y<this.H;y++){
          if (y === 0) this.set(x,y,z, 3); // stone bedrock
          else if (y < h-1) this.set(x,y,z, 1); // dirt
          else if (y === h-1) this.set(x,y,z, 2); // grass
          else this.set(x,y,z, 0);
        }
      }
    }
    this.needsRemesh = true;
  }

  // Build mesh: per-visible-face quads (no greedy merging for simplicity)
  buildMesh(atlasCols=16, atlasRows=16){
    const verts = [];
    const uvs = [];
    const colors = [];
    const inds = [];
    let idx = 0;
    const tileW = 1/atlasCols, tileH = 1/atlasRows;

    for (let x=0;x<this.W;x++){
      for (let y=0;y<this.H;y++){
        for (let z=0;z<this.D;z++){
          const b = this.get(x,y,z);
          if (!b) continue;
          // for each face, if neighbor is air -> add quad
          const px = (this.cx * this.W) + x;
          const pz = (this.cz * this.D) + z;
          const posX = px, posY = y, posZ = pz;

          const pushQuad = (vx,vy,vz, ux,uy,uz, faceName) => {
            // quad corners (two triangles) — local coords
            const corners = [
              [vx,vy,vz],
              [vx+ux, vy+uy, vz+uz],
              [vx+ux - (uz?0:0), vy+uy, vz+uz - (ux?0:0)],
              [vx - (uz?0:0), vy, vz - (ux?0:0)]
            ];
            // simpler: compute 4 corners explicit for axis-aligned faces
            // For reliability use explicit face definitions (handled below)
          };

          // We'll add 6 faces explicitly with straightforward coordinates & UVs.
          // +X face
          if (this.get(x+1,y,z) === 0) {
            verts.push(posX+1, posY, posZ, posX+1, posY+1, posZ, posX+1, posY+1, posZ+1, posX+1, posY, posZ+1);
            const tile = getTileFor(b,'side');
            const col = tile % atlasCols, row = Math.floor(tile/atlasCols);
            const u0 = col*tileW, v0 = row*tileH, u1 = u0+tileW, v1=v0+tileH;
            uvs.push(u0,v1, u1,v1, u1,v0, u0,v0);
            for (let i=0;i<4;i++) colors.push(1,1,1,1);
            inds.push(idx, idx+1, idx+2, idx, idx+2, idx+3);
            idx+=4;
          }
          // -X face
          if (this.get(x-1,y,z) === 0) {
            verts.push(posX, posY, posZ+1, posX, posY+1, posZ+1, posX, posY+1, posZ, posX, posY, posZ);
            const tile = getTileFor(b,'side');
            const col = tile % atlasCols, row = Math.floor(tile/atlasCols);
            const u0 = col*tileW, v0 = row*tileH, u1 = u0+tileW, v1=v0+tileH;
            uvs.push(u0,v1, u1,v1, u1,v0, u0,v0);
            for (let i=0;i<4;i++) colors.push(1,1,1,1);
            inds.push(idx, idx+1, idx+2, idx, idx+2, idx+3);
            idx+=4;
          }
          // +Y top
          if (this.get(x,y+1,z) === 0) {
            verts.push(posX, posY+1, posZ+1, posX+1, posY+1, posZ+1, posX+1, posY+1, posZ, posX, posY+1, posZ);
            const tile = getTileFor(b,'top');
            const col = tile % atlasCols, row = Math.floor(tile/atlasCols);
            const u0 = col*tileW, v0 = row*tileH, u1 = u0+tileW, v1=v0+tileH;
            uvs.push(u0,v1, u1,v1, u1,v0, u0,v0);
            for (let i=0;i<4;i++) colors.push(1,1,1,1);
            inds.push(idx, idx+1, idx+2, idx, idx+2, idx+3);
            idx+=4;
          }
          // -Y bottom
          if (this.get(x,y-1,z) === 0) {
            verts.push(posX, posY, posZ, posX+1, posY, posZ, posX+1, posY, posZ+1, posX, posY, posZ+1);
            const tile = getTileFor(b,'bottom');
            const col = tile % atlasCols, row = Math.floor(tile/atlasCols);
            const u0 = col*tileW, v0 = row*tileH, u1 = u0+tileW, v1=v0+tileH;
            uvs.push(u0,v1, u1,v1, u1,v0, u0,v0);
            for (let i=0;i<4;i++) colors.push(1,1,1,1);
            inds.push(idx, idx+1, idx+2, idx, idx+2, idx+3);
            idx+=4;
          }
          // +Z face
          if (this.get(x,y,z+1) === 0) {
            verts.push(posX, posY, posZ+1, posX, posY+1, posZ+1, posX+1, posY+1, posZ+1, posX+1, posY, posZ+1);
            const tile = getTileFor(b,'side');
            const col = tile % atlasCols, row = Math.floor(tile/atlasCols);
            const u0 = col*tileW, v0 = row*tileH, u1 = u0+tileW, v1=v0+tileH;
            uvs.push(u0,v1, u1,v1, u1,v0, u0,v0);
            for (let i=0;i<4;i++) colors.push(1,1,1,1);
            inds.push(idx, idx+1, idx+2, idx, idx+2, idx+3);
            idx+=4;
          }
          // -Z face
          if (this.get(x,y,z-1) === 0) {
            verts.push(posX+1, posY, posZ, posX+1, posY+1, posZ, posX, posY+1, posZ, posX, posY, posZ);
            const tile = getTileFor(b,'side');
            const col = tile % atlasCols, row = Math.floor(tile/atlasCols);
            const u0 = col*tileW, v0 = row*tileH, u1 = u0+tileW, v1=v0+tileH;
            uvs.push(u0,v1, u1,v1, u1,v0, u0,v0);
            for (let i=0;i<4;i++) colors.push(1,1,1,1);
            inds.push(idx, idx+1, idx+2, idx, idx+2, idx+3);
            idx+=4;
          }
        }
      }
    }

    this.mesh = {
      vertices: new Float32Array(verts),
      uvs: new Float32Array(uvs),
      colors: new Float32Array(colors),
      indices: new Uint32Array(inds)
    };
    this.needsRemesh = false;
    return this.mesh;
  }
}
