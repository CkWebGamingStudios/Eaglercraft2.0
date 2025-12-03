export function initMarketplace(){
  const list = document.getElementById('market-list');
  // mock items
  const items = [
    {id:'pack-1', title:'Nature Pack', price:'Free'},
    {id:'shader-1', title:'Cool Shader', price:'2.99'}
  ];
  list.innerHTML = items.map(i => `<div class="market-item"><strong>${i.title}</strong> — ${i.price} <button data-id="${i.id}" class="btn">Preview</button></div>`).join('');
  list.querySelectorAll('button[data-id]').forEach(b => b.addEventListener('click', ()=> alert('Preview: '+b.dataset.id)));
}
