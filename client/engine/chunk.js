import { Blocks } from "./blockRegistry.js";

export class Chunk {
    constructor(cx, cz) {
        this.cx = cx;
        this.cz = cz;

        this.W = 16;
        this.H = 64;
        this.D = 16;

        this.blocks = new Uint8Array(this.W * this.H * this.D);

        this.mesh = null;
        this.needsRemesh = true;

        this.generate();
    }

    generate() {
        // simple flat world: grass on top, dirt under it
        for (let x = 0; x < this.W; x++) {
            for (let z = 0; z < this.D; z++) {
                
                let worldHeight = 20;

                for (let y = 0; y < this.H; y++) {
                    let index = this.index(x, y, z);

                    if (y === worldHeight)
                        this.blocks[index] = Blocks.GRASS;
                    else if (y < worldHeight)
                        this.blocks[index] = Blocks.DIRT;
                    else
                        this.blocks[index] = Blocks.AIR;
                }
            }
        }
    }

    index(x,y,z) {
        return x + z * this.W + y * this.W * this.D;
    }

    get(x,y,z) {
        if (x < 0 || x >= this.W) return Blocks.AIR;
        if (z < 0 || z >= this.D) return Blocks.AIR;
        if (y < 0 || y >= this.H) return Blocks.AIR;
        return this.blocks[this.index(x,y,z)];
    }
}
