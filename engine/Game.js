// /engine/Game.js  (update)
import { World } from './World.js';
import { Renderer } from './Renderer.js';
import { Player } from './Player.js';
import { Networking } from './Networking.js';
import EntityManager from '../game/entities/EntityManager.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.world = new World(2);
    this.player = new Player(this.world);
    this.net = new Networking(this);
    this.entityManager = new EntityManager(this.renderer);

    this.running = false;
    this._last = performance.now();

    // auto-load atlas if present
    const img = new Image();
    img.onload = () => this.renderer.applyAtlas(img, 16, 16);
    img.onerror = ()=> console.warn('atlas not found at /assets/textures/atlas.png');
    img.src = '/assets/textures/atlas.png';
  }

  async start(){
    await this.net.connect().catch(e => console.warn('net connect fail', e));
    this.net.onSnapshot = (snap) => {
      this.entityManager.localPlayerId = this.net.clientId;
      this.entityManager.applySnapshot(snap);
    };

    // regular send of player state
    setInterval(()=> this.net.sendPlayerState(), 50);

    this.running = true;
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(){
    if (!this.running) return;
    const now = performance.now();
    const dt = (now - this._last)/1000;
    this._last = now;

    // ensure chunks around player are loaded
    this.world.loadAround(this.player.position[0], this.player.position[2]);

    this.player.update(dt);
    this.entityManager.update(dt);

    this.renderer.render(this.world, this.player, this.entityManager.getRenderList());

    requestAnimationFrame(this.loop.bind(this));
  }
}
