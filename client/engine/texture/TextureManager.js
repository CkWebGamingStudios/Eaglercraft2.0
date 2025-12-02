export default class TextureManager {
  constructor(){ this.textures=new Map(); this.models=new Map(); this.entities=new Map(); }
  registerTexture(id,p){ this.textures.set(id,p); }
  registerModel(id,p){ this.models.set(id,p); }
  registerEntityDef(id,p){ this.entities.set(id,p); }
  async getImage(id){
    const path=this.textures.get(id);
    if(!path) throw new Error("Texture not found: "+id);
    return await this._loadImage("/"+path);
  }
  _loadImage(url){
    return new Promise((res,rej)=>{
      const img=new Image(); img.crossOrigin="anonymous";
      img.onload=()=>res(img); img.onerror=e=>rej(e); img.src=url;
    });
  }
}