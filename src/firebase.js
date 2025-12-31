import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPRxclldaK4oJy3lIMgnUaSZdtdvfvZKI",
  authDomain: "hopinhub-web.firebaseapp.com",
  projectId: "hopinhub-web",
  storageBucket: "hopinhub-web.firebasestorage.app",
  messagingSenderId: "751322572480",
  appId: "1:751322572480:web:52e10ce7d6f918abec2f25"
};

export const app = initializeApp(firebaseConfig);

// ✅ Auth
export const auth = getAuth(app);

// ✅ Google provider
export const provider = new GoogleAuthProvider();

// ✅ Firestore
export const db = getFirestore(app);
