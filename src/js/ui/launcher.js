import { installVersion, downloadJar } from "../sync.js";

document.getElementById("installBtn").addEventListener("click", async () => {
  const uid = localStorage.getItem("eagler_uid");
  const versionId = document.getElementById("versionSelect").value;

  const meta = await installVersion(uid, versionId);
  console.log("Version installed:", meta);
  alert("Version metadata installed.");
});

document.getElementById("downloadJarBtn").addEventListener("click", async () => {
  const versionId = document.getElementById("versionSelect").value;

  const blob = await downloadJar(versionId, percent => {
    console.log("Download progress:", Math.floor(percent * 100) + "%");
  });

  // Save jar locally for debugging (browser only)
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `minecraft-${versionId}.jar`;
  a.click();
});
