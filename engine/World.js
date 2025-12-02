// engine/World.js
// Minimal world: small grid of blocks (no heavy generation)

export class World {
  // chunksX,Z are counts of 16-sized chunks
  constructor(chunksX = 3, height = 16, chunksZ = 3) {
    this.chunkW = 16;
    this.chunkH = height;
    this.chunkD = 16;

    this.chunksX = chunksX;
    this.chunksZ = chunksZ;

    this.totalWidth = this.chunkW * this.chunksX;
    this.totalDepth = this.chunkD * this.chunksZ;

    // store blocks in a Set keyed by 'x;y;z' for sparse simplicity
    this.blocks = new Map();

    this._generateFlat();
  }

  _key(x,y,z){ return `${x};${y};${z}`; }

  setBlock(x,y,z,id){
    if (id === 0) this.blocks.delete(this._key(x,y,z));
    else this.blocks.set(this._key(x,y,z), id);
  }

  getBlock(x,y,z){
    return this.blocks.get(this._key(x,y,z)) || 0;
  }

  _generateFlat(){
    // create a small hill field centered
    const midX = (this.totalWidth/2)|0;
    const midZ = (this.totalDepth/2)|0;
    for (let x=0; x < this.totalWidth; x++){
      for (let z=0; z < this.totalDepth; z++){
        const dx = x - midX, dz = z - midZ;
        const dist = Math.sqrt(dx*dx + dz*dz);
        const base = 6 + Math.max(0, Math.floor(4 - dist*0.25)); // small hills
        for (let y=0; y< base; y++){
          const id = (y === base-1) ? 2 : 1; // grass top=2, dirt=1
          this.setBlock(x, y, z, id);
        }
      }
    }
  }

  // returns a small array of renderable blocks near player
  // each item: [x,y,z, [r,g,b]]
  getRenderableBlocks(player){
    const out = [];
    const px = Math.floor(player.position[0]);
    const pz = Math.floor(player.position[2]);
    const range = 8; // render radius in blocks

    for (let dx = -range; dx <= range; dx++){
      for (let dz = -range; dz <= range; dz++){
        for (let dy = -2; dy <= 6; dy++){
          const x = px + dx;
          const z = pz + dz;
          const y = Math.max(0, Math.floor(player.position[1])) + dy;
          const id = this.getBlock(x,y,z);
          if (!id) continue;
          // color mapping (id -> color)
          let col = [0.6,0.4,0.2];
          if (id === 2) col = [0.2,0.8,0.3]; // grass
          else if (id === 3) col = [0.5,0.5,0.5];
          out.push([x, y, z, col]);
        }
      }
    }

    return out;
  }
}
