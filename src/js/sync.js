const WORKER_URL = 'https://eaglercraft2.pages.dev/worker'; // Worker endpoint

async function saveUserData(data) {
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-JWT-Assertion': window.CF_ACCESS_JWT || ''
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    console.error('Failed to save data:', e);
    return null;
  }
}

async function loadUserData() {
  try {
    const res = await fetch(WORKER_URL, {
      method: 'GET',
      headers: {
        'CF-Access-JWT-Assertion': window.CF_ACCESS_JWT || ''
      }
    });
    return await res.json();
  } catch (e) {
    console.error('Failed to load data:', e);
    return {};
  }
}

// Version install
async function installVersion(versionData) {
  const userData = await loadUserData();
  userData.installedVersions = userData.installedVersions || {};
  userData.installedVersions[versionData.version] = versionData;
  await saveUserData(userData);
}

// GitHub sync
async function syncWithGitHub(repoMeta) {
  const userData = await loadUserData();
  userData.githubMeta = repoMeta;
  await saveUserData(userData);
}
