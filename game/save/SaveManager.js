// /game/save/SaveManager.js
export class SaveManager {
  constructor(dbName='ec2_worlds_v1') { this.dbName = dbName; }

  _open() {
    return new Promise((res, rej) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = e => {
        e.target.result.createObjectStore('worlds', { keyPath: 'name' });
      };
      req.onsuccess = e => res(e.target.result);
      req.onerror = e => rej(e);
    });
  }

  async save(name, state) {
    const db = await this._open();
    return new Promise((res, rej) => {
      const tx = db.transaction('worlds', 'readwrite');
      tx.objectStore('worlds').put({ name, state, savedAt: Date.now() });
      tx.oncomplete = ()=> res(true);
      tx.onerror = e=> rej(e);
    });
  }

  async load(name) {
    const db = await this._open();
    return new Promise((res, rej) => {
      const tx = db.transaction('worlds', 'readonly');
      const req = tx.objectStore('worlds').get(name);
      req.onsuccess = ()=> res(req.result ? req.result.state : null);
      req.onerror = e => rej(e);
    });
  }

  async list() {
    const db = await this._open();
    return new Promise((res, rej) => {
      const tx = db.transaction('worlds', 'readonly');
      const all = tx.objectStore('worlds').getAll();
      all.onsuccess = ()=> res(all.result);
      all.onerror = e=> rej(e);
    });
  }
}
