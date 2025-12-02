export class Chunk {
    constructor(x, z) {
        this.x = x;
        this.z = z;
        this.size = 16;
        this.height = 256;

        this.blocks = new Uint16Array(this.size * this.height * this.size);
    }

    index(x, y, z) {
        return y * 256 + z * 16 + x;
    }

    getBlock(x, y, z) {
        return this.blocks[this.index(x, y, z)];
    }

    setBlock(x, y, z, id) {
        this.blocks[this.index(x, y, z)] = id;
    }
}
