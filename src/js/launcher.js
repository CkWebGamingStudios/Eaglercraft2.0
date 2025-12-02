// Check login
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html"; // not logged in → redirect
}

// Decode the token to show username
function parseJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

const decoded = parseJWT(token);
document.getElementById("username").innerText = "Welcome, " + decoded.email;

// Launcher actions
function playGame() {
  window.location.href = "/index.html"; // your game page
}

function openMP() {
  window.location.href = "/pages/multiplayer.html";
}

function settings() {
  window.location.href = "/player-settings.html";
}

function saveGame() {
  fetch("/api/saves/save", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: "demo save" })
  }).then(r => r.json()).then(console.log);
}

function loadGame() {
  fetch("/api/saves/load", {
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(r => r.json()).then(console.log);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}
