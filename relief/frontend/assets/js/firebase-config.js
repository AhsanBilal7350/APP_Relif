/**
 * Shared Firebase configuration — single source of truth.
 * All other scripts import { auth } from this module.
 */
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBFUMSclbKfZg5dKHjqzvF9aXHjYno65T4",
    authDomain: "relief-299c8.firebaseapp.com",
    projectId: "relief-299c8",
    storageBucket: "relief-299c8.firebasestorage.app",
    messagingSenderId: "617393399334",
    appId: "1:617393399334:web:b7a7589bdcdca58f10a8e7"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
