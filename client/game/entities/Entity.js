// client/game/entities/Entity.js
export default class Entity {
  constructor(id) {
    this.id = id;
    this.x = 0; this.y = 0; this.z = 0;
    this.vx = 0; this.vy = 0; this.vz = 0;
    this.pitch = 0; this.yaw = 0;
    this.lastUpdate = Date.now();

    // interpolation buffer for smooth rendering
    this._interp = { x:this.x, y:this.y, z:this.z, t: Date.now() };
  }

  applyState(state) {
    this.x = state.x; this.y = state.y; this.z = state.z;
    if ('vx' in state) this.vx = state.vx;
    if ('vy' in state) this.vy = state.vy;
    if ('vz' in state) this.vz = state.vz;
    if ('yaw' in state) this.yaw = state.yaw;
    this.lastUpdate = Date.now();

    // update interp target
    this._interp.targetX = this.x;
    this._interp.targetY = this.y;
    this._interp.targetZ = this.z;
    this._interp.startX = this._interp.x;
    this._interp.startY = this._interp.y;
    this._interp.startZ = this._interp.z;
    this._interp.startT = Date.now();
    this._interp.endT = Date.now() + 120; // smooth over 120ms
  }

  // call each render tick to get interpolated position
  getRenderPos() {
    const now = Date.now();
    const t0 = this._interp.startT || now;
    const t1 = this._interp.endT || now;
    const f = t1 === t0 ? 1 : Math.max(0, Math.min(1, (now - t0) / (t1 - t0)));
    const ix = this._interp.startX + ( (this._interp.targetX - this._interp.startX) * f );
    const iy = this._interp.startY + ( (this._interp.targetY - this._interp.startY) * f );
    const iz = this._interp.startZ + ( (this._interp.targetZ - this._interp.startZ) * f );
    this._interp.x = ix; this._interp.y = iy; this._interp.z = iz;
    return { x: ix, y: iy, z: iz };
  }
}
