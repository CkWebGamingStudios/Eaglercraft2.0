export function initServers(){
  const addr = document.getElementById('server-address');
  const addBtn = document.getElementById('add-server');
  const refreshBtn = document.getElementById('refresh-servers');
  const list = document.getElementById('servers-list');

  function render(){
    const servers = JSON.parse(localStorage.getItem('servers')||'[]');
    list.innerHTML = servers.length ? servers.map(s => `<li><strong>${s}</strong> <button data-remove="${s}" class="btn" style="background:#ef4444">Remove</button></li>`).join('') : '<li>No servers</li>';
    list.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        removeServer(btn.dataset.remove);
      });
    });
  }

  function addServer(s){
    if(!s) return;
    const servers = JSON.parse(localStorage.getItem('servers')||'[]');
    if(servers.includes(s)) return alert('Already added');
    servers.push(s);
    localStorage.setItem('servers', JSON.stringify(servers));
    render();
  }

  function removeServer(s){
    let servers = JSON.parse(localStorage.getItem('servers')||'[]');
    servers = servers.filter(x=>x!==s);
    localStorage.setItem('servers', JSON.stringify(servers));
    render();
  }

  addBtn.addEventListener('click', ()=> { addServer(addr.value.trim()); addr.value=''; });
  refreshBtn.addEventListener('click', render);
  render();
}
