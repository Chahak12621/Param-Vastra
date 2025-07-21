

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc, doc, setDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBESXGZuNefsSheDeay06i99fiiBgZkIwo",
  authDomain: "my-store-5cdaf.firebaseapp.com",
  projectId: "my-store-5cdaf",
  storageBucket: "my-store-5cdaf.firebasestorage.app",
  messagingSenderId: "17496201738",
  appId: "1:17496201738:web:f9cb6f361a8ef9e60cddf3",
  measurementId: "G-0LQDNNFC6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

// Export Firestore
export { app,orderBy,
  serverTimestamp, auth, deleteDoc, getDoc, sendPasswordResetEmail, doc, setDoc, db, initializeApp, collection, getDocs, query, where, addDoc, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword };
