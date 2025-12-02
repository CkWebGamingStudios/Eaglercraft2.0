export const BlockRegistry = {
    blocks: {},
    register(id, props) {
        this.blocks[id] = props;
    },
    get(id) {
        return this.blocks[id];
    }
};

// Register default blocks:
BlockRegistry.register(0, { name: "air", solid: false });
BlockRegistry.register(1, { name: "stone", solid: true });
BlockRegistry.register(2, { name: "grass", solid: true });
BlockRegistry.register(3, { name: "dirt",  solid: true });
BlockRegistry.register(4, { name: "wood",  solid: true });
