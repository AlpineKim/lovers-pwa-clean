
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBP95i8uOQQegp8ey-zf3cHah9oeejaaLs",
  authDomain: "lovers-pwa.firebaseapp.com",
  projectId: "lovers-pwa",
  storageBucket: "lovers-pwa.firebasestorage.app",
  messagingSenderId: "966142079690",
  appId: "1:966142079690:web:c817588c8ad4e73edc7a33",
  measurementId: "G-R4V0H041S8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUID = null;

function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      currentUID = userCredential.user.uid;
      document.getElementById("user-status").innerText = "Signed in as: " + userCredential.user.email;
      loadChecklist();
    })
    .catch((error) => {
      alert("Login error: " + error.message);
    });
}

function signOut() {
  firebaseSignOut(auth).then(() => {
    currentUID = null;
    document.getElementById("user-status").innerText = "Signed out";
    document.getElementById("checklist").innerHTML = "";
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUID = user.uid;
    document.getElementById("user-status").innerText = "Signed in as: " + user.email;
    loadChecklist();
  }
});

async function loadChecklist() {
  const container = document.getElementById("checklist");
  container.innerHTML = "Loading checklist...";

  const items = ["kissing", "holding hands", "cuddling", "oral", "toys", "dirty talk"]; // example items
  container.innerHTML = "";
  for (let item of items) {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = \`\${item}: 
      <button onclick="saveResponse('\${item}', 'yes')">Yes</button>
      <button onclick="saveResponse('\${item}', 'maybe')">Maybe</button>
      <button onclick="saveResponse('\${item}', 'no')">No</button>
      <span id="response-\${item}"></span>
    \`;
    container.appendChild(div);
  }

  const q = query(collection(db, "checklists"), where("uid", "==", currentUID));
  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const respEl = document.getElementById("response-" + data.itemId);
    if (respEl) {
      respEl.textContent = "(" + data.response + ")";
    }
  });
}

async function saveResponse(itemId, response) {
  if (!currentUID) return alert("Please sign in first.");
  const docRef = doc(db, "checklists", currentUID + "-" + itemId);
  await setDoc(docRef, { uid: currentUID, itemId, response });
  const respEl = document.getElementById("response-" + itemId);
  if (respEl) respEl.textContent = "(" + response + ")";
}

window.signIn = signIn;
window.signOut = signOut;
window.saveResponse = saveResponse;
