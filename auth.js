import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut, 
    setPersistence, 
    browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDRifIZcxUY_e2rYMhUW8T-q6v9hqB6y0Q",
    authDomain: "coaching-portal-ugcnet.firebaseapp.com",
    projectId: "coaching-portal-ugcnet",
    storageBucket: "coaching-portal-ugcnet.firebasestorage.app",
    messagingSenderId: "972456665369",
    appId: "1:972456665369:web:90ec17b9d3d75887ef2588",
    measurementId: "G-2PEYHGZ6QL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// TODO: PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const googleSheetApiUrl = "https://script.google.com/macros/s/AKfycbxcq8R_xv6IJNT3m_b_k5iT6oOQzb8g-e2SRO0UZyYUXTTnCxXeyTwtqR1ltYeF3bos/exec";

const loginBtn = document.getElementById('google-login-btn');

// Handle the Login Button Click
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginBtn.innerText = "Verifying..."; // Show loading state

        // 1. Force Firebase to remember the user permanently on this device
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                // 2. Trigger the Google Login Popup
                return signInWithPopup(auth, provider);
            })
            .then((result) => {
                const user = result.user;
                
                // 3. Ask Google Sheets if this email is approved
                fetch(googleSheetApiUrl + "?email=" + encodeURIComponent(user.email))
                    .then(response => response.json())
                    .then(data => {
                        if (data.approved) {
                            window.location.href = "dashboard.html"; 
                        } else {
                            // Email not in sheet -> force sign out
                            signOut(auth).then(() => {
                                alert("Access Denied: Your email (" + user.email + ") is not approved for this coaching portal.");
                                loginBtn.innerText = "Sign in with Google";
                            });
                        }
                    })
                    .catch(err => {
                        console.error("Sheet API Error:", err);
                        alert("Error verifying your account. Please try again.");
                        signOut(auth);
                        loginBtn.innerText = "Sign in with Google";
                    });
                    
            }).catch((error) => {
                console.error("Error signing in: ", error);
                alert("Login Error: " + error.message);
                loginBtn.innerText = "Sign in with Google";
            });
    });
}

// Auto-redirect if an approved user comes back to the index page
onAuthStateChanged(auth, (user) => {
    if (user && (window.location.pathname.endsWith("index.html") || window.location.pathname === "/")) {
        fetch(googleSheetApiUrl + "?email=" + encodeURIComponent(user.email))
            .then(response => response.json())
            .then(data => {
                if (data.approved) {
                    window.location.href = "dashboard.html";
                } else {
                    signOut(auth);
                }
            });
    }
});
