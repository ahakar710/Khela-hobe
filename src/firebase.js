import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbYOONLiGY_I3kz8F9K3iX_zJXx2-lSzI",
  authDomain: "khela-hobe-9d39b.firebaseapp.com",
  projectId: "khela-hobe-9d39b",
  storageBucket: "khela-hobe-9d39b.firebasestorage.app",
  messagingSenderId: "427181263995",
  appId: "1:427181263995:web:e66d07054750cd226526de"
};

export const firebaseConfigured = !Object.values(firebaseConfig)
  .some(v => String(v).startsWith("YOUR_"));

let app, auth, db;

if (firebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export {
  auth,
  db,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
};
