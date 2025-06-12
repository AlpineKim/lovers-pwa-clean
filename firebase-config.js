const firebaseConfig = {
  apiKey: "AIzaSyBP95i8uOQQegp8ey-zf3cHah9oeejaaLs",
  authDomain: "lovers-pwa.firebaseapp.com",
  projectId: "lovers-pwa",
  storageBucket: "lovers-pwa.firebasestorage.app",
  messagingSenderId: "966142079690",
  appId: "1:966142079690:web:c817588c8ad4e73edc7a33",
  measurementId: "G-R4V0H041S8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
