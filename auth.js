// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// REPLACE THIS OBJECT WITH YOUR KEYS FROM FIREBASE!
const firebaseConfig = {
  apiKey: "AIzaSyDRifIZcxUY_e2rYMhUW8T-q6v9hqB6y0Q",
  authDomain: "coaching-portal-ugcnet.firebaseapp.com",
  projectId: "coaching-portal-ugcnet",
  storageBucket: "coaching-portal-ugcnet.firebasestorage.app",
  messagingSenderId: "972456665369",
  appId: "1:972456665369:web:90ec17b9d3d75887ef2588",
  measurementId: "G-2PEYHGZ6QL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Handle the Login Button Click
document.getElementById('google-login-btn').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Logged in as: ", user.displayName);
            // Redirect to the protected dashboard
            window.location.href = "dashboard.html"; 
}).catch((error) => {
            console.error("Error signing in: ", error);
            // This will now pop up the EXACT reason Firebase is mad
            alert("Firebase Error: " + error.code + "\n\nMessage: " + error.message);
        });
});

// Auto-redirect if the user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "dashboard.html";
    }
});
