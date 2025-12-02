import { BlockTextures } from "./blockRegistry.js";

export class ChunkMesher {

    static buildMesh(chunk) {
        let vertices = [];
        let colors = [];
        let uvs = [];
        let indices = [];

        const faces = [
            { dir:[ 1,0,0], uvFace:"side" },
            { dir:[-1,0,0], uvFace:"side" },
            { dir:[ 0,1,0], uvFace:"top" },
            { dir:[ 0,-1,0], uvFace:"bottom" },
            { dir:[ 0,0,1], uvFace:"side" },
            { dir:[ 0,0,-1], uvFace:"side" },
        ];

        const tileSize = 1/16; // assuming 256×256 atlas using 16×16 tiles

        for (let x=0; x<chunk.W; x++)
        for (let y=0; y<chunk.H; y++)
        for (let z=0; z<chunk.D; z++) {

            const block = chunk.get(x,y,z);
            if (!block) continue;

            const tex = BlockTextures[block];

            for (let f=0; f<6; f++) {
                const face = faces[f];

                // detect neighbouring block
                let nx=x+face.dir[0];
                let ny=y+face.dir[1];
                let nz=z+face.dir[2];
                if (chunk.get(nx,ny,nz) !== 0) continue;

                const uvTile = (
                    tex[face.uvFace] ||
                    tex.all
                );

                const u0 = uvTile[0] * tileSize;
                const v0 = uvTile[1] * tileSize;
                const u1 = u0 + tileSize;
                const v1 = v0 + tileSize;

                const vs = [
                    [0,0,0], [1,0,0], [1,1,0], [0,1,0]
                ];

                const startIndex = vertices.length/3;

                // vertices and UVs
                for (let i=0;i<4;i++) {
                    const vx = x + (i===1||i===2?1:0);
                    const vy = y + (i>=2?1:0);
                    const vz = z;

                    vertices.push(vx,vy,vz);

                    // UV mapping (fixed order)
                    const uvX = (i===1||i===2)?u1:u0;
                    const uvY = (i>=2)?v1:v0;
                    uvs.push(uvX,uvY);
                }

                indices.push(
                    startIndex, startIndex+1, startIndex+2,
                    startIndex, startIndex+2, startIndex+3
                );
            }
        }

        return {
            vertices: new Float32Array(vertices),
            uvs: new Float32Array(uvs),
            indices: new Uint16Array(indices)
        };
    }
}
