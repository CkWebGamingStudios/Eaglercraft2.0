import { writeFile } from "../sync.js";

document.getElementById("saveSettingsBtn").addEventListener("click", async () => {
  const uid = localStorage.getItem("eagler_uid");
  if (!uid) return alert("Not logged in");

  const settingsObj = {
    theme: document.getElementById("themeSwitch").checked ? "dark" : "light",
    vsync: document.getElementById("vsyncSwitch").checked,
    fov: Number(document.getElementById("fovSlider").value),
  };

  await writeFile(uid, "settings.json", settingsObj);
  alert("Settings saved!");
});
