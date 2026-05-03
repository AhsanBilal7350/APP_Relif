/**
 * Relief — Login Page Logic
 * Handles: Firebase email/password login, Google sign-in,
 * forgot password reset, toggle visibility.
 */
import { auth } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ── Redirect if already logged in ──
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "index.html";
    }
});

// ── DOM Elements ──
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("loginBtn");
const googleBtn = document.getElementById("googleLoginBtn");
const messageBox = document.getElementById("auth-message");

// Forgot Password
const forgotLink = document.getElementById("forgotPasswordLink");
const forgotModal = document.getElementById("forgotModal");
const closeModal = document.getElementById("closeModal");
const resetBtn = document.getElementById("resetBtn");
const resetEmail = document.getElementById("resetEmail");
const resetMessage = document.getElementById("reset-message");

// ── Utility: Show message ──
function showMessage(el, text, type = "error") {
    el.textContent = text;
    el.className = `auth-message show ${type}`;
    setTimeout(() => {
        el.classList.remove("show");
    }, 6000);
}

// ── Utility: Loading state ──
function setLoading(btn, loading) {
    const text = btn.querySelector(".btn-text");
    const loader = btn.querySelector(".btn-loader");
    if (loading) {
        text.style.display = "none";
        loader.style.display = "flex";
        btn.disabled = true;
    } else {
        text.style.display = "";
        loader.style.display = "none";
        btn.disabled = false;
    }
}

// ── Toggle Password Visibility ──
document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const input = document.getElementById(targetId);
        const eyeOpen = btn.querySelector(".eye-open");
        const eyeClosed = btn.querySelector(".eye-closed");

        if (input.type === "password") {
            input.type = "text";
            eyeOpen.style.display = "none";
            eyeClosed.style.display = "block";
        } else {
            input.type = "password";
            eyeOpen.style.display = "block";
            eyeClosed.style.display = "none";
        }
    });
});

// ── Form Submit — Email/Password Login ──
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
        showMessage(messageBox, "Please enter your email address.");
        emailInput.focus();
        return;
    }
    if (!password) {
        showMessage(messageBox, "Please enter your password.");
        passwordInput.focus();
        return;
    }

    setLoading(submitBtn, true);

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage(messageBox, "Logged in successfully! Redirecting...", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 800);
    } catch (err) {
        let msg = "Something went wrong. Please try again.";
        switch (err.code) {
            case "auth/user-not-found":
                msg = "No account found with this email. Please sign up first.";
                break;
            case "auth/wrong-password":
                msg = "Incorrect password. Please try again.";
                break;
            case "auth/invalid-email":
                msg = "Please enter a valid email address.";
                break;
            case "auth/too-many-requests":
                msg = "Too many failed attempts. Please try again later.";
                break;
            case "auth/invalid-credential":
                msg = "Invalid email or password. Please check and try again.";
                break;
            case "auth/user-disabled":
                msg = "This account has been disabled. Contact support.";
                break;
        }
        showMessage(messageBox, msg);
        setLoading(submitBtn, false);
    }
});

// ── Google Sign-In ──
googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        showMessage(messageBox, "Signed in with Google! Redirecting...", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 800);
    } catch (err) {
        if (err.code !== "auth/popup-closed-by-user") {
            showMessage(messageBox, "Google sign-in failed. Please try again.");
        }
    }
});

// ── Forgot Password Modal ──
forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    forgotModal.classList.add("show");
    resetEmail.value = emailInput.value; // pre-fill
    resetEmail.focus();
});

closeModal.addEventListener("click", () => {
    forgotModal.classList.remove("show");
});

forgotModal.addEventListener("click", (e) => {
    if (e.target === forgotModal) {
        forgotModal.classList.remove("show");
    }
});

resetBtn.addEventListener("click", async () => {
    const email = resetEmail.value.trim();
    if (!email) {
        showMessage(resetMessage, "Please enter your email address.");
        return;
    }

    setLoading(resetBtn, true);

    try {
        await sendPasswordResetEmail(auth, email);
        showMessage(resetMessage, "Reset link sent! Check your inbox.", "success");
        setTimeout(() => {
            forgotModal.classList.remove("show");
        }, 3000);
    } catch (err) {
        let msg = "Failed to send reset link.";
        if (err.code === "auth/user-not-found") {
            msg = "No account found with this email.";
        } else if (err.code === "auth/invalid-email") {
            msg = "Please enter a valid email.";
        }
        showMessage(resetMessage, msg);
    } finally {
        setLoading(resetBtn, false);
    }
});