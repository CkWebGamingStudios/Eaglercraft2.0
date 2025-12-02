// ChunkRenderer.js - chunked voxel world using instanced meshes and face-culling
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class ChunkRenderer {
  constructor(scene){
    this.scene = scene;
    this.CHUNK = 16;
    this.HEIGHT = 64;
    this.BS = 1;
    this.RADIUS = 3;

    this.palette = {
      1: { name:'grass', color:0x7ccf4b },
      2: { name:'dirt', color:0x8b5a2b },
      3: { name:'stone', color:0x9e9e9e },
      4: { name:'sand', color:0xe4d96f },
      5: { name:'wood', color:0x8f6b4a }
    };

    // create instanced meshes (one per block type)
    this.instanced = {};
    this.MAX_INST = 40000;
    this.tmpObj = new THREE.Object3D();
    const geom = new THREE.BoxGeometry(this.BS, this.BS, this.BS);
    for (const id of Object.keys(this.palette)){
      const mat = new THREE.MeshStandardMaterial({ color: this.palette[id].color });
      const mesh = new THREE.InstancedMesh(geom, mat, this.MAX_INST);
      mesh.count = 0;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.instanced[id] = mesh;
      this.scene.add(mesh);
    }

    this.chunks = new Map(); // key -> {cx,cz,data:Uint8Array}
  }

  key(cx,cz){ return `${cx},${cz}`; }

  _index(x,y,z){ return y*this.CHUNK*this.CHUNK + z*this.CHUNK + x; }

  generateChunk(cx, cz){
    const S = this.CHUNK, H = this.HEIGHT;
    const arr = new Uint8Array(S*H*S);
    for(let x=0;x<S;x++){
      for(let z=0;z<S;z++){
        const wx = cx*S + x, wz = cz*S + z;
        const h = Math.max(1, Math.floor(10 + Math.sin(wx*0.07)*6 + Math.cos(wz*0.07)*4));
        for(let y=0;y<H;y++){
          let b = 0;
          if (y < 2) b = 3;
          else if (y <= h-2) b = 2;
          else if (y === h-1) b = 1;
          arr[this._index(x,y,z)] = b;
        }
      }
    }
    this.chunks.set(this.key(cx,cz), { cx, cz, data: arr });
  }

  generateInitialChunks(){
    for(let cx=-this.RADIUS; cx<=this.RADIUS; cx++){
      for(let cz=-this.RADIUS; cz<=this.RADIUS; cz++){
        this.generateChunk(cx, cz);
      }
    }
    this.rebuildInstances();
  }

  rebuildInstances(){
    // reset
    for (const id of Object.keys(this.instanced)) this.instanced[id].count = 0;
    const counters = {}; for (const id of Object.keys(this.instanced)) counters[id]=0;

    for (const [k, chunk] of this.chunks.entries()){
      const {cx, cz, data} = chunk;
      for(let y=0;y<this.HEIGHT;y++){
        for(let z=0;z<this.CHUNK;z++){
          for(let x=0;x<this.CHUNK;x++){
            const b = data[this._index(x,y,z)];
            if (!b) continue;
            // simple face-culling: check if any neighbor is air - we render cube anyway but culling could remove hidden faces.
            // For now we still place full cubes but still reduce count by skipping internal blocks:
            const nx = x+1< this.CHUNK ? data[this._index(x+1,y,z)] : 0;
            const px = x-1>=0 ? data[this._index(x-1,y,z)] : 0;
            const nz = z+1< this.CHUNK ? data[this._index(x,y,z+1)] : 0;
            const pz = z-1>=0 ? data[this._index(x,y,z-1)] : 0;
            const ny = y+1< this.HEIGHT ? data[this._index(x,y+1,z)] : 0;
            const py = y-1>=0 ? data[this._index(x,y-1,z)] : 0;
            // skip if fully surrounded (internal block)
            if (nx && px && nz && pz && ny && py) continue;

            const inst = this.instanced[b];
            const idx = counters[b]++;
            this.tmpObj.position.set((cx*this.CHUNK + x + 0.5)*this.BS, y + 0.5, (cz*this.CHUNK + z + 0.5)*this.BS);
            this.tmpObj.updateMatrix();
            inst.setMatrixAt(idx, this.tmpObj.matrix);
          }
        }
      }
    }

    for (const id of Object.keys(this.instanced)){
      const mesh = this.instanced[id];
      mesh.count = counters[id] || 0;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  update(dt, player){
    // future: stream chunks based on player pos
  }

  // editing API: set block in world coords
  setBlockWorld(wx, wy, wz, blockId){
    const cx = Math.floor(wx / this.CHUNK), cz = Math.floor(wz / this.CHUNK);
    const lx = ((wx % this.CHUNK) + this.CHUNK) % this.CHUNK;
    const lz = ((wz % this.CHUNK) + this.CHUNK) % this.CHUNK;
    const key = this.key(cx,cz);
    const chunk = this.chunks.get(key);
    if (!chunk) return false;
    chunk.data[this._index(lx,wy,lz)] = blockId;
    this.rebuildInstances();
    return true;
  }

  getBlockWorld(wx, wy, wz){
    const cx = Math.floor(wx / this.CHUNK), cz = Math.floor(wz / this.CHUNK);
    const lx = ((wx % this.CHUNK) + this.CHUNK) % this.CHUNK;
    const lz = ((wz % this.CHUNK) + this.CHUNK) % this.CHUNK;
    const key = this.key(cx,cz);
    const chunk = this.chunks.get(key);
    if (!chunk) return 0;
    return chunk.data[this._index(lx,wy,lz)];
  }
}
