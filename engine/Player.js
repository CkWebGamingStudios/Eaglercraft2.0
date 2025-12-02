// engine/Player.js
// Minimal FPS-style player controller (pointer lock + WASD + jump)

export class Player {
  constructor(world) {
    this.world = world;
    this.position = [0, 8, 0];
    this.velocity = [0, 0, 0];
    this.yaw = 0;    // rotation around Y
    this.pitch = 0;  // up/down
    this.eyeHeight = 0.9;

    this._speed = 6.0; // blocks/sec
    this._jump = 8.5;
    this._gravity = -30;

    this._keys = {};
    this._initInput();
  }

  _initInput(){
    window.addEventListener("keydown", e => this._keys[e.key.toLowerCase()] = true);
    window.addEventListener("keyup", e => this._keys[e.key.toLowerCase()] = false);

    const canvas = document.getElementById("game");
    canvas.addEventListener("click", ()=> canvas.requestPointerLock?.());

    document.addEventListener("mousemove", (e)=>{
      if (document.pointerLockElement !== canvas) return;
      this.yaw -= e.movementX * 0.002;
      this.pitch -= e.movementY * 0.002;
      if (this.pitch > Math.PI/2) this.pitch = Math.PI/2;
      if (this.pitch < -Math.PI/2) this.pitch = -Math.PI/2;
    });
  }

  update(dt){
    // basic movement relative to yaw
    const forward = (this._keys["w"]?1:0) - (this._keys["s"]?1:0);
    const strafe  = (this._keys["d"]?1:0) - (this._keys["a"]?1:0);

    const sinY = Math.sin(this.yaw), cosY = Math.cos(this.yaw);
    const dx = (sinY * forward + cosY * strafe) * this._speed * dt;
    const dz = (cosY * forward - sinY * strafe) * this._speed * dt;

    this.position[0] += dx;
    this.position[2] += dz;

    // gravity
    this.velocity[1] += this._gravity * dt;
    this.position[1] += this.velocity[1] * dt;

    // ground collision (simple)
    if (this.position[1] < 2){
      this.position[1] = 2;
      this.velocity[1] = 0;
      if (this._keys[" "]) this.velocity[1] = this._jump; // space to jump
    }
  }
}
