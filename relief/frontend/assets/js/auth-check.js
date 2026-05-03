/**
 * Relief — Auth State Check
 * Shared across all pages.
 * - When logged out: shows "Get Started" → links to signup.html
 * - When logged in: shows user name or "Logout" button
 */
import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const authBtn = document.getElementById("nav-auth-btn");
    if (!authBtn) return;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Logged in — show Logout
            const displayName = user.displayName || "User";
            authBtn.textContent = "Logout";
            authBtn.title = `Signed in as ${displayName}`;
            authBtn.href = "#";
            authBtn.onclick = (e) => {
                e.preventDefault();
                signOut(auth).then(() => {
                    window.location.reload();
                });
            };
        } else {
            // Logged out — show Get Started
            authBtn.textContent = "Get Started";
            authBtn.href = "signup.html";
            authBtn.title = "";
            authBtn.onclick = null;
        }
    });
});
