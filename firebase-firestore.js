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

window.signIn = async function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Signed in:", userCredential.user.email);
  } catch (error) {
    console.error("❌ Sign-in error:", error.message);
  }
};

window.signOut = async function() {
  try {
    await firebaseSignOut(auth);
    console.log("✅ Signed out");
  } catch (error) {
    console.error("❌ Sign-out error:", error.message);
  }
};

onAuthStateChanged(auth, async (user) => {
  const status = document.getElementById("status");
  if (user) {
    status.textContent = `Signed in as: ${user.email}`;
    console.log("🔄 Fetching checklist...");
    const checklistRef = collection(db, "checklists");
    const q = query(checklistRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const container = document.getElementById("checklist");
    container.innerHTML = "";
    const items = ["Kissing", "Cuddling", "Oral (giving)", "Oral (receiving)", "Vibrator use"];

    items.forEach((item, index) => {
      const div = document.createElement("div");
      div.textContent = item + ": ";
      ["Yes", "Future", "Maybe", "No"].forEach(response => {
        const button = document.createElement("button");
        button.textContent = response;
        button.onclick = async () => {
          const docId = `${user.uid}-${index}`;
          await setDoc(doc(db, "checklists", docId), {
            uid: user.uid,
            itemId: index,
            response: response
          });
          console.log(`✅ Saved [${item}] -> ${response}`);
        };
        div.appendChild(button);
      });
      container.appendChild(div);
    });
  } else {
    status.textContent = "Not signed in";
    document.getElementById("checklist").textContent = "Please sign in to load checklist.";
  }
});