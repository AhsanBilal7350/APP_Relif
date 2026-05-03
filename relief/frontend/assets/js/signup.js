/**
 * Relief — Signup Page Logic
 * Handles: Firebase email/password signup, Google signup,
 * password strength indicator, toggle visibility, form validation.
 */
import { auth } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ── Redirect if already logged in ──
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "index.html";
    }
});

// ── DOM Elements ──
const form = document.getElementById("signupForm");
const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const submitBtn = document.getElementById("signupBtn");
const googleBtn = document.getElementById("googleSignupBtn");
const messageBox = document.getElementById("auth-message");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

// ── Utility: Show message ──
function showMessage(text, type = "error") {
    messageBox.textContent = text;
    messageBox.className = `auth-message show ${type}`;
    // Auto-hide after 6 seconds
    setTimeout(() => {
        messageBox.classList.remove("show");
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

// ── Password Strength Indicator ──
passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
        { width: "0%", color: "#eee", label: "" },
        { width: "20%", color: "#ef5350", label: "Weak" },
        { width: "40%", color: "#ff9800", label: "Fair" },
        { width: "60%", color: "#ffc107", label: "Good" },
        { width: "80%", color: "#66bb6a", label: "Strong" },
        { width: "100%", color: "#43a047", label: "Excellent" }
    ];

    const level = levels[score] || levels[0];
    strengthFill.style.width = level.width;
    strengthFill.style.backgroundColor = level.color;
    strengthText.textContent = level.label;
    strengthText.style.color = level.color;
});

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

// ── Form Submit — Email/Password Signup ──
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    // Validation
    if (!name) {
        showMessage("Please enter your full name.");
        nameInput.focus();
        return;
    }
    if (!email) {
        showMessage("Please enter your email address.");
        emailInput.focus();
        return;
    }
    if (password.length < 6) {
        showMessage("Password must be at least 6 characters.");
        passwordInput.focus();
        return;
    }
    if (password !== confirm) {
        showMessage("Passwords do not match.");
        confirmInput.focus();
        return;
    }

    setLoading(submitBtn, true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set display name
        await updateProfile(userCredential.user, { displayName: name });
        showMessage("Account created successfully! Redirecting...", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    } catch (err) {
        let msg = "Something went wrong. Please try again.";
        switch (err.code) {
            case "auth/email-already-in-use":
                msg = "This email is already registered. Please sign in instead.";
                break;
            case "auth/invalid-email":
                msg = "Please enter a valid email address.";
                break;
            case "auth/weak-password":
                msg = "Password is too weak. Use at least 6 characters.";
                break;
            case "auth/operation-not-allowed":
                msg = "Email/password accounts are not enabled.";
                break;
        }
        showMessage(msg);
        setLoading(submitBtn, false);
    }
});

// ── Google Sign-Up ──
googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        showMessage("Signed in with Google! Redirecting...", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 800);
    } catch (err) {
        if (err.code !== "auth/popup-closed-by-user") {
            showMessage("Google sign-up failed. Please try again.");
        }
    }
});
