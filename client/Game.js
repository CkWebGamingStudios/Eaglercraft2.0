import { loadAllTextures } from "./engine/texture/TextureBootstrap.js";

async start() {
  this.renderer = new Renderer(this.canvas);

  // Load resource pack
  this.textureManager = await loadAllTextures();
  
  console.log("Textures loaded successfully");
  
  // Now world / player / chunks may safely use textures
}
