// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBATX_MRrWVHuPWulH5lkXaMVzt1GTIN-o",
  authDomain: "campustrack-12345.firebaseapp.com",
  projectId: "campustrack-12345",
  storageBucket: "campustrack-12345.firebasestorage.app",
  messagingSenderId: "574862314506",
  appId: "1:574862314506:web:1e9b5feec98963bfdd63f3",
  measurementId: "G-2YY2QVZND3" // optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);