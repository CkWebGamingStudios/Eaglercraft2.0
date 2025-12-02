// Sidebar navigation
function nav(section) {
  alert("Open section: " + section);
}

// HUB section control
function openSection(name) {
  const content = document.getElementById("hub-content");

  if (name === "forums") {
    content.innerHTML = "<h2>Forums</h2><p>Community discussions coming soon...</p>";
  }

  if (name === "lab") {
    content.innerHTML = "<h2>Lab</h2><p>Experimental features and prototypes...</p>";
  }

  if (name === "game") {
    window.location.href = "/src/pages/world.html"; // Start the game
  }
}
