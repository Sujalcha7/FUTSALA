import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwrQ20ocUvDlmkdQhgov8wWehBAJF88r0",
  authDomain: "futsala-7a374.firebaseapp.com",
  projectId: "futsala-7a374",
  storageBucket: "futsala-7a374.firebasestorage.app",
  messagingSenderId: "660035744078",
  appId: "1:660035744078:web:f8d8f08ada88b53e206e1f",
  measurementId: "G-9NQLFP35G8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
