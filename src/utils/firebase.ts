// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7tjwfwIvF2E23AYZgeCk-g3X_zExXkXc",
  authDomain: "aitan-security-dashboard.firebaseapp.com",
  projectId: "aitan-security-dashboard",
  storageBucket: "aitan-security-dashboard.firebasestorage.app",
  messagingSenderId: "650561410027",
  appId: "1:650561410027:web:98bb4e3125ae6bb6d77fae",
  measurementId: "G-C68FQCL93S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);