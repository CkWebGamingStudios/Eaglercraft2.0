export default class ModSystem {
    constructor() {
        this.mods = [];
    }

    register(mod) {
        this.mods.push(mod);
        if (mod.onLoad) mod.onLoad();
    }

    callEvent(event, data) {
        for (let mod of this.mods) {
            if (mod[event]) mod[event](data);
        }
    }
}
