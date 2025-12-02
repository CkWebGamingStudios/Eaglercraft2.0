// /client/engine/texture/TextureBootstrap.js

import TextureManager from "./TextureManager.js";
import BlockLoader from "./BlockLoader.js";
import ItemLoader from "./ItemLoader.js";
import EntityLoader from "./EntityLoader.js";
import ArmourForEntity from "./ArmourForEntity.js";
import UIImageLoader from "./UIImageLoader.js";
import GenericLoader from "./GenericLoader.js";

// Loader switch map
const LOADER_MAP = {
  "BlockLoader.js": BlockLoader,
  "ItemLoader.js": ItemLoader,
  "EntityLoader.js": EntityLoader,
  "ArmourForEntity.js": ArmourForEntity,
  "UIImageLoader.js": UIImageLoader,
  "GenericLoader.js": GenericLoader
};

export async function loadAllTextures() {
  const tm = new TextureManager();

  // Load the index
  const index = await fetch("/assets/textures_index.json").then(r => r.json());

  for (const entry of index) {
    const loaderName = entry.loader || "GenericLoader.js";
    const loader = LOADER_MAP[loaderName];

    if (!loader) {
      console.warn("Unknown loader:", loaderName, "for", entry.id);
      continue;
    }

    try {
      loader(tm, entry);
    } catch (err) {
      console.error(`Failed to load ${entry.id}:`, err);
    }
  }

  console.log("All textures registered:", tm.textures.size);
  return tm;
}
