// /engine/EntityRenderer.js
export class EntityRenderer {
  constructor(renderer) {
    this.renderer = renderer;
  }

  // draws simple colored cube at world pos (naive; create optimized buffer for production)
  drawCube(x,y,z, color=[1,0,0,1]) {
    // For simplicity we'll push a small quad using same atlas shader (not ideal)
    // Production: add a dedicated shader & model for entities.
  }
}
