// GameRenderer.js — composer for renderer, player, chunks
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { ChunkRenderer } from './world/ChunkRenderer.js';
import { PlayerController } from './entities/PlayerController.js';

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 20, 0);

    // lights
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(100,200,100);
    this.scene.add(dir);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    // subsystems
    this.chunkRenderer = new ChunkRenderer(this.scene);
    this.player = new PlayerController(this.camera, this.chunkRenderer);

    this.selectedBlock = 1; // default

    window.addEventListener('resize', ()=> {
      this.camera.aspect = window.innerWidth/window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.last = performance.now();
    this.running = false;
  }

  setSelectedBlock(id) { this.selectedBlock = id; this.player.setSelectedBlock(id); }

  start() {
    if (this.running) return;
    this.running = true;
    this.chunkRenderer.generateInitialChunks();
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(now) {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;

    this.player.update(dt);
    this.chunkRenderer.update(dt, this.player.player);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop.bind(this));
  }
}
