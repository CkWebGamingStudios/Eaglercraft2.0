import Chunk from "./Chunk.js";

export default class World {
    constructor() {
        this.chunks = new Map();
    }

    key(x, z) {
        return `${x},${z}`;
    }

    loadChunk(cx, cz) {
        const k = this.key(cx, cz);
        if (this.chunks.has(k)) return this.chunks.get(k);

        const chunk = new Chunk(cx, cz);
        chunk.generate();
        this.chunks.set(k, chunk);
        return chunk;
    }

    getBlock(x, y, z) {
        const cx = Math.floor(x / 16);
        const cz = Math.floor(z / 16);

        const chunk = this.loadChunk(cx, cz);
        const lx = ((x % 16) + 16) % 16;
        const lz = ((z % 16) + 16) % 16;

        return chunk.get(lx, y, lz);
    }
}
