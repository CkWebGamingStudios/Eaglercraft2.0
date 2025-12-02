// client/game/entities/EntityManager.js
import Entity from './Entity.js';
import Mob from './Mob.js';

export default class EntityManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.entities = new Map(); // id -> Entity instance
    this.localPlayerId = null;
  }

  // handle snapshot from server
  applySnapshot(snapshot) {
    // players
    for (const p of snapshot.players) {
      if (p.id === this.localPlayerId) continue; // skip local, we own it
      let ent = this.entities.get(p.id);
      if (!ent) {
        ent = new Entity(p.id);
        this.entities.set(p.id, ent);
      }
      ent.applyState(p);
    }

    // mobs
    for (const m of snapshot.mobs) {
      let ent = this.entities.get(m.id);
      if (!ent) {
        ent = new Mob(m.id);
        this.entities.set(m.id, ent);
      }
      ent.applyState(m);
    }

    // remove stale remote players not present in snapshot
    const present = new Set(snapshot.players.map(p=>p.id).concat(snapshot.mobs.map(m=>m.id)));
    for (const id of Array.from(this.entities.keys())) {
      if (!present.has(id) && id !== this.localPlayerId) {
        this.entities.delete(id);
      }
    }
  }

  // called each frame to update client-side tick
  update(dt) {
    for (const ent of this.entities.values()) {
      if (ent.tick) ent.tick(dt);
    }
  }

  // debug: return array of renderable entity positions
  getRenderList() {
    const list = [];
    for (const ent of this.entities.values()) {
      const p = ent.getRenderPos();
      list.push({ id: ent.id, x:p.x, y:p.y, z:p.z });
    }
    return list;
  }
}
