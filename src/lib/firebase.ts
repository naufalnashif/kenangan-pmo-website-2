import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDblAeZzH7oO5KlEary71uS3esArC4vG70",
  authDomain: "kenangan-pmo-9aadc.firebaseapp.com",
  projectId: "kenangan-pmo-9aadc",
  storageBucket: "kenangan-pmo-9aadc.appspot.com",
  messagingSenderId: "747967614926",
  appId: "1:747967614926:web:c0da27d9ef16183444659f",
  measurementId: "G-6F1T6PFK4P"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Initialize Analytics if running in the browser
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

export { app, db, analytics };
