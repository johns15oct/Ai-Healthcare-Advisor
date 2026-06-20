import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAqBgCvpJ9vc2z4_z0zwIhmhjOHcCxEfGg",
  authDomain: "ai-health-adviser.firebaseapp.com",
  projectId: "ai-health-adviser",
  storageBucket: "ai-health-adviser.firebasestorage.app",
  messagingSenderId: "679503548226",
  appId: "1:679503548226:web:298fd2a6b1b11150e2c2db",
  measurementId: "G-5TRX4Y30N1"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
