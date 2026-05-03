/**
 * Relief — API Configuration
 * 
 * When running locally (via start.bat), API calls go to localhost:8000.
 * When deployed on GitHub Pages, API calls go to your deployed backend URL.
 * 
 * ► UPDATE the PRODUCTION_API_URL below after deploying your backend
 *   (e.g., to Vercel, Render, Railway, etc.)
 */

const PRODUCTION_API_URL = ""; // e.g. "https://relief-api.vercel.app"

// Auto-detect: if served from localhost → local backend, else → production
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_BASE = isLocal ? "" : PRODUCTION_API_URL;

export { API_BASE };
