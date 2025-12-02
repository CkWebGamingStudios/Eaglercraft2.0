import { Chunk } from "./chunk.js";

export function generateChunk(chunkX, chunkZ) {
    const c = new Chunk(chunkX, chunkZ);

    for (let x = 0; x < 16; x++) {
        for (let z = 0; z < 16; z++) {
            for (let y = 0; y < 256; y++) {
                if (y === 0) c.setBlock(x, y, z, 1); // stone bedrock-like
                else if (y < 3) c.setBlock(x, y, z, 3); // dirt
                else if (y === 3) c.setBlock(x, y, z, 2); // grass
                else c.setBlock(x, y, z, 0); // air
            }
        }
    }

    return c;
}
