// ResourcePackLoader - placeholder; extensible to download/activate resource packs and inject textures
export class ResourcePackLoader {
  constructor(renderer) {
    this.renderer = renderer;
    this.db = 'eagler_packs_v1';
  }

  async init() {
    // placeholder: check local storage for chosen pack
    const chosen = localStorage.getItem('eagler:selectedPack');
    if (chosen) {
      console.log('apply pack', chosen);
      // apply pack -- in future: load atlas and replace materials
    } else {
      console.log('no pack chosen, using default colors');
    }
  }

  // stub: add/replace textures — implement atlas application here
  async applyPackFromURL(url){ console.log('apply pack url', url); }
}
