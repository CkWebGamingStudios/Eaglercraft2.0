export const Blocks = {
    AIR: 0,
    DIRT: 1,
    GRASS: 2,
    STONE: 3
};

// Each face gets atlas coordinates (u,v tile)
export const BlockTextures = {
    0: null, // air
    1: {       // dirt
        all: [2,0]
    },
    2: {       // grass
        top: [0,0],
        bottom: [2,0],
        side: [1,0]
    },
    3: {       // stone
        all: [3,0]
    }
};
