export function buildChunkMesh(chunk) {
    const vertices = [];

    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 256; y++) {
            for (let z = 0; z < 16; z++) {
                const id = chunk.getBlock(x, y, z);
                if (id === 0) continue;

                // Simple cube (no culling)
                vertices.push(
                    x, y, z,
                    x+1, y, z,
                    x, y+1, z,
                    // …rest of cube vertices
                );
            }
        }
    }

    return new Float32Array(vertices);
}
