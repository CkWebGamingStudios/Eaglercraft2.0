export default class ItemRegistry {
    static items = {};

    static register(id, data) {
        ItemRegistry.items[id] = data;
    }

    static get(id) {
        return ItemRegistry.items[id];
    }
}

ItemRegistry.register("stone", { type: "block", blockId: 1 });
ItemRegistry.register("dirt", { type: "block", blockId: 3 });
