// PlayerController.js - player movement + raycast for block place/break
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class PlayerController {
  constructor(camera, chunkRenderer){
    this.camera = camera;
    this.chunkRenderer = chunkRenderer;
    this.player = { x: 0, y: 20, z: 0, vx:0, vy:0, vz:0, yaw:0, pitch:0, onGround:false };
    this.height = 1.8;
    this.speed = 6;
    this.gravity = -20;
    this.keys = {};
    this.selected = 1;

    this.raycaster = new THREE.Raycaster();

    this._bindInputs();
  }

  setSelectedBlock(id){ this.selected = id; }

  _bindInputs(){
    window.addEventListener('keydown', e=> this.keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e=> this.keys[e.key.toLowerCase()] = false);

    document.addEventListener('click', ()=> {
      const el = document.querySelector('canvas');
      if (el && document.pointerLockElement !== el) el.requestPointerLock();
    });

    document.addEventListener('mousemove', e => {
      if (document.pointerLockElement !== document.querySelector('canvas')) return;
      this.player.yaw -= e.movementX * 0.002;
      this.player.pitch -= e.movementY * 0.002;
      this.player.pitch = Math.max(-Math.PI/2+0.01, Math.min(Math.PI/2-0.01, this.player.pitch));
      this.camera.rotation.x = this.player.pitch;
      this.camera.rotation.y = this.player.yaw;
    });

    // mouse buttons
    window.addEventListener('mousedown', (e)=>{
      if (e.button === 0) this.breakBlock();
      if (e.button === 2) this.placeBlock();
    });
    window.addEventListener('contextmenu', e=> e.preventDefault());
  }

  update(dt){
    // movement
    const f = (this.keys['w']?1:0) - (this.keys['s']?1:0);
    const r = (this.keys['d']?1:0) - (this.keys['a']?1:0);
    const yaw = this.player.yaw;
    const dx = Math.sin(yaw), dz = Math.cos(yaw);
    this.player.vx = (dx*f + dz*r) * this.speed;
    this.player.vz = (dz*f - dx*r) * this.speed;

    if (!this.player.onGround) this.player.vy += this.gravity * dt;

    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;
    this.player.z += this.player.vz * dt;

    if (this.player.y <= 2){
      this.player.y = 2; this.player.vy = 0; this.player.onGround = true;
    } else this.player.onGround = false;

    this.camera.position.set(this.player.x, this.player.y + this.height*0.5, this.player.z);
  }

  // shoot ray and find first non-air block within 6 units
  _trace(maxDist=6){
    this.raycaster.setFromCamera({ x:0, y:0 }, this.camera);
    const dir = new THREE.Vector3();
    this.raycaster.ray.direction.clone(dir);
    const step = 0.1;
    for (let d = 0; d <= maxDist; d += step){
      const p = this.raycaster.ray.at(d, new THREE.Vector3());
      const bx = Math.floor(p.x), by = Math.floor(p.y), bz = Math.floor(p.z);
      const b = this.chunkRenderer.getBlockWorld(bx, by, bz);
      if (b && b !== 0) {
        return { found: true, at: {x:bx,y:by,z:bz}, hitPos: p, dist:d };
      }
    }
    return { found:false };
  }

  breakBlock(){
    const hit = this._trace();
    if (!hit.found) return;
    const {x,y,z} = hit.at;
    this.chunkRenderer.setBlockWorld(x,y,z,0);
  }

  placeBlock(){
    const hit = this._trace();
    if (!hit.found) return;
    // place at previous step along ray (approx)
    const back = this.raycaster.ray.at(Math.max(0, hit.dist - 0.2), new THREE.Vector3());
    const px = Math.floor(back.x), py = Math.floor(back.y), pz = Math.floor(back.z);
    // safety: don't place inside player
    const dx = px - this.player.x, dy = py - this.player.y, dz = pz - this.player.z;
    if (Math.sqrt(dx*dx+dy*dy+dz*dz) < 0.9) return;
    this.chunkRenderer.setBlockWorld(px, py, pz, this.selected);
  }
}
