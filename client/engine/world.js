import { Chunk } from "./chunk.js";
import { ChunkMesher } from "./chunkMesher.js";

export class World {
    constructor() {
        this.chunks = new Map();

        this.loadChunk(0,0);
        this.loadChunk(1,0);
        this.loadChunk(0,1);
        this.loadChunk(-1,0);
    }

    key(cx,cz) {
        return cx + ":" + cz;
    }

    loadChunk(cx,cz) {
        const chunk = new Chunk(cx,cz);
        chunk.mesh = ChunkMesher.buildMesh(chunk);
        this.chunks.set(this.key(cx,cz), chunk);
    }

    getChunk(cx,cz) {
        return this.chunks.get(this.key(cx,cz));
    }

    getChunks() {
        return this.chunks.values();
    }
}
