// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXskTNngGNuPvd2H-XMl7XX-cCnzeaH48",
  authDomain: "shubh-avasar.firebaseapp.com",
  projectId: "shubh-avasar",
  storageBucket: "shubh-avasar.appspot.com",
  messagingSenderId: "959361176050",
  appId: "1:959361176050:web:3e50583f736f8b02e15b6b",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);

export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account", // ✅ Always ask which Google account to use
});


export { auth};
