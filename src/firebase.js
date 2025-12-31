import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

// 🔥 Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBPRxclldaK4oJy3lIMgnUaSZdtdvfvZKI",
  authDomain: "hopinhub-web.firebaseapp.com",
  projectId: "hopinhub-web",
  storageBucket: "hopinhub-web.firebasestorage.app",
  messagingSenderId: "751322572480",
  appId: "1:751322572480:web:52e10ce7d6f918abec2f25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const messaging = getMessaging(app);