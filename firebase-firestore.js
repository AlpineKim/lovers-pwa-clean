// Import required Firebase SDKs for app, authentication, and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Firebase configuration for the LOVERS PWA project
const firebaseConfig = {
  apiKey: "AIzaSyBP95i8uOQQegp8ey-zf3cHah9oeejaaLs",
  authDomain: "lovers-pwa.firebaseapp.com",
  projectId: "lovers-pwa",
  storageBucket: "lovers-pwa.firebasestorage.app",
  messagingSenderId: "966142079690",
  appId: "1:966142079690:web:c817588c8ad4e73edc7a33",
  measurementId: "G-R4V0H041S8"
};

// Initialize Firebase application
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Expose auth functions globally for inline onclick support
window.signIn = async function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ SIGN-IN SUCCESS:", userCredential.user.email);
  } catch (error) {
    console.error("❌ SIGN-IN ERROR:", error.message);
  }
};

window.signOut = async function() {
  try {
    await firebaseSignOut(auth);
    console.log("✅ SIGNED OUT");
  } catch (error) {
    console.error("❌ SIGN-OUT ERROR:", error.message);
  }
};

// Auth state listener for dynamic interface changes
onAuthStateChanged(auth, async (user) => {
  const status = document.getElementById("status");
  const checklistEl = document.getElementById("checklist");

  if (user) {
    status.textContent = `Signed in as: ${user.email}`;
    console.log("🔄 FETCHING checklist for:", user.uid);

    // Define the activity list
    const items = ["Kissing", "Cuddling", "Oral (giving)", "Oral (receiving)", "Vibrator use"];

    // Query Firestore for this user's existing responses
    const checklistRef = collection(db, "checklists");
    const q = query(checklistRef, where("uid", "==", user.uid));
    const snapshot = await getDocs(q);

    // Reset checklist container
    checklistEl.innerHTML = "";

    // Render buttons per activity
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
          console.log(`✅ SAVED: ${item} = ${response}`);
        };
        div.appendChild(button);
      });

      checklistEl.appendChild(div);
    });

  } else {
    // User not authenticated
    status.textContent = "Not signed in";
    checklistEl.textContent = "Please sign in to load checklist.";
  }
}); // 🔚 onAuthStateChanged