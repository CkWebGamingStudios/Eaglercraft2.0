// client/game/entities/Mob.js
import Entity from './Entity.js';

export default class Mob extends Entity {
  constructor(id) {
    super(id);
    this.state = 'idle';
    this.age = 0;
  }

  // server authoritative, client uses applyState; this local update used only for simple client-side predicted behavior if needed
  tick(dt) {
    this.age += dt;
    // simple bobbing for idle mobs to look alive
    this.bob = Math.sin(this.age * 2) * 0.08;
  }

  render(ctx) {
    // placeholder: draw a simple cube via renderer's debug API or push a visual marker
    // The game renderer should read entity positions via entityManager and draw models.
  }
}
