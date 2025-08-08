// src/firebaseConfig.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Only import analytics functions inside a check
let getAnalytics, isSupported;

if (typeof window !== "undefined") {
  const analyticsModule = await import("firebase/analytics");
  getAnalytics = analyticsModule.getAnalytics;
  isSupported = analyticsModule.isSupported;
}


const firebaseConfig = {
  apiKey: "AIzaSyAX2_t6DOdApKOAecfKVimSWndrJhYkxIY",
  authDomain: "parking-booking-app-20ab0.firebaseapp.com",
  projectId: "parking-booking-app-20ab0",
  storageBucket: "parking-booking-app-20ab0.firebasestorage.app",
  messagingSenderId: "621083776819",
  appId: "1:621083776819:web:fe7dbc6fd4d819fdc0d046",
  measurementId: "G-XN12VKD87D"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics (client-side only)
let analytics;
if (typeof window !== "undefined" && isSupported) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };