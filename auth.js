const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);

async function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  await firebase.createUserWithEmailAndPassword(auth, email, pass);
  alert("Account created!");
}

async function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  const user = await firebase.signInWithEmailAndPassword(auth, email, pass);

  // Get secure token
  const token = await user.user.getIdToken();

  // Send token to your Node server
  fetch("https://yourserver.com/api/authenticate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Authenticated:", data);
    window.location.href = "/home.html";
  });
}
