import BlockRegistry from "./BlockRegistry.js";

export default class Chunk {
    constructor(x, z) {
        this.x = x;
        this.z = z;

        // 16×256×16 simple voxel array
        this.blocks = new Uint16Array(16 * 256 * 16);
    }

    index(x, y, z) {
        return x + (z * 16) + (y * 256);
    }

    get(x, y, z) {
        return this.blocks[this.index(x, y, z)];
    }

    set(x, y, z, id) {
        this.blocks[this.index(x, y, z)] = id;
    }

    generate() {
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                for (let y = 0; y < 256; y++) {

                    if (y === 0) this.set(x, y, z, 1);     // bedrock
                    else if (y < 60) this.set(x, y, z, 1); // stone
                    else if (y < 63) this.set(x, y, z, 3); // dirt
                    else if (y === 63) this.set(x, y, z, 2); // grass
                    else this.set(x, y, z, 0);            // air

                }
            }
        }
    }
}
