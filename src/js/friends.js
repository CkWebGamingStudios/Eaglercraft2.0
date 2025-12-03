export function initFriends(){
  const addInput = document.getElementById('friend-add');
  const addBtn = document.getElementById('friend-add-btn');
  const list = document.getElementById('friends-list');

  function render(){
    const friends = JSON.parse(localStorage.getItem('friends')||'[]');
    list.innerHTML = friends.length ? friends.map(f => `<li>${f} <button data-rm="${f}" class="btn" style="background:#ef4444">Remove</button></li>`).join('') : '<li>No friends</li>';
    list.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', ()=> {
      removeFriend(b.dataset.rm);
    }));
  }
  function addFriend(name){
    if(!name) return;
    const friends = JSON.parse(localStorage.getItem('friends')||'[]');
    if(friends.includes(name)) return alert('Already friend');
    friends.push(name); localStorage.setItem('friends', JSON.stringify(friends)); render();
  }
  function removeFriend(name){
    let friends = JSON.parse(localStorage.getItem('friends')||'[]');
    friends = friends.filter(f=>f!==name); localStorage.setItem('friends', JSON.stringify(friends)); render();
  }

  addBtn.addEventListener('click', ()=> { addFriend(addInput.value.trim()); addInput.value=''; });
  render();
}
