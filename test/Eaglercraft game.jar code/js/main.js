// main.js - bootstraps the engine
import { GameRenderer } from './engine/GameRenderer.js';
import { ResourcePackLoader } from './ui/ResourcePackLoader.js';
import { ServerSync } from './net/ServerSync.js';

const canvas = document.getElementById('gameCanvas');
const netStatusEl = document.getElementById('netStatus');

const renderer = new GameRenderer(canvas);
const packs = new ResourcePackLoader(renderer);
const net = new ServerSync();

net.connect().then(() => { netStatusEl.textContent = 'connected'; }).catch(()=>{ netStatusEl.textContent = 'offline'; });

packs.init().catch(e => console.warn('packs init', e));

renderer.start(); // starts render + game loop

// Hotbar initial UI
const hotbar = document.getElementById('hotbar');
const types = ['Grass','Dirt','Stone','Sand','Wood'];
types.forEach((t,i)=>{
  const el = document.createElement('div');
  el.className = 'slot';
  el.textContent = t;
  el.dataset.id = i+1;
  if(i===0) el.classList.add('selected');
  hotbar.appendChild(el);
  el.addEventListener('click', ()=>{
    document.querySelectorAll('.slot').forEach(s=>s.classList.remove('selected'));
    el.classList.add('selected');
    renderer.setSelectedBlock(Number(el.dataset.id));
  });
});

window.addEventListener('wheel', (e)=>{
  const slots = Array.from(document.querySelectorAll('.slot'));
  let idx = slots.findIndex(s=>s.classList.contains('selected'));
  idx = (idx + (e.deltaY>0?1:-1) + slots.length) % slots.length;
  slots.forEach(s=>s.classList.remove('selected'));
  slots[idx].classList.add('selected');
  renderer.setSelectedBlock(Number(slots[idx].dataset.id));
});
