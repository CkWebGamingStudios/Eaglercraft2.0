// /engine/Block.js
export const Blocks = {
  AIR: 0,
  DIRT: 1,
  GRASS: 2,
  STONE: 3,
  WOOD: 4
};

export const BlockInfo = {
  [Blocks.AIR]:  { id: Blocks.AIR,   name: 'air',  solid: false,  tile: null },
  [Blocks.DIRT]: { id: Blocks.DIRT,  name: 'dirt', solid: true,   tile: 2 },
  [Blocks.GRASS]:{ id: Blocks.GRASS, name: 'grass',solid: true,   tileTop:0, tileSide:1, tileBottom:2 },
  [Blocks.STONE]:{ id: Blocks.STONE, name: 'stone',solid: true,   tile: 3 },
  [Blocks.WOOD]: { id: Blocks.WOOD,  name: 'wood', solid: true,   tile: 4 }
};

// helper: returns tile index for face type ("top","bottom","side")
export function getTileFor(blockId, face='side') {
  const info = BlockInfo[blockId];
  if (!info) return 2; // dirt fallback
  if (info.tile !== undefined) return info.tile;
  if (face === 'top' && info.tileTop !== undefined) return info.tileTop;
  if (face === 'bottom' && info.tileBottom !== undefined) return info.tileBottom;
  return info.tileSide ?? info.tile ?? 2;
}
