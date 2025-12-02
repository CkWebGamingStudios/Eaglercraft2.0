export default class BlockRegistry {
    static blocks = {};

    static register(id, blockData) {
        BlockRegistry.blocks[id] = blockData;
    }

    static get(id) {
        return BlockRegistry.blocks[id] || BlockRegistry.blocks["air"];
    }
}

// Default Blocks
BlockRegistry.register("air", { solid: false });
BlockRegistry.register("stone", { solid: true });
BlockRegistry.register("grass", { solid: true });
BlockRegistry.register("dirt", { solid: true });
