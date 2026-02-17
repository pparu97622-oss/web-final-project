const firebaseConfig = {
    apiKey: "AIzaSyBp4MhCmcq5091W0WOkYKv0UehiDgyeJkw",
    authDomain: "fashion-store-1d981.firebaseapp.com",
    projectId: "fashion-store-1d981",
    storageBucket: "fashion-store-1d981.firebasestorage.app",
    messagingSenderId: "686134430796",
    appId: "1:686134430796:web:499c5692828ba0768bb8e9"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const ADMIN_EMAIL = "ghyalpolama62@gmail.com";
let isRegister = false;

// --- AUTH OBSERVER (Keep track of login state) ---
auth.onAuthStateChanged(user => {
    const adminLink = document.getElementById('nav-admin-link');
    const userLink = document.getElementById('nav-user-link');
    
    if (user) {
        // User is signed in
        console.log("Active User:", user.email);
        userLink.innerText = user.displayName || "ACCOUNT";
        
        // Check for Admin Privileges
        if (user.email === ADMIN_EMAIL) {
            if(adminLink) adminLink.classList.remove('hidden');
        } else {
            if(adminLink) adminLink.classList.add('hidden');
        }
    } else {
        // User is signed out
        userLink.innerText = "LOGIN";
        if(adminLink) adminLink.classList.add('hidden');
    }
});

// --- YOUR ORIGINAL FUNCTIONS ---

function toggleAuth() {
    isRegister = !isRegister;
    document.getElementById('auth-title').innerText = isRegister ? "Register" : "Welcome";
    document.getElementById('reg-name').classList.toggle('hidden');
    document.getElementById('auth-btn').innerText = isRegister ? "Create Account" : "Sign In";
}

async function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const name = document.getElementById('reg-name').value;
    try {
        if (isRegister) {
            const res = await auth.createUserWithEmailAndPassword(email, pass);
            await res.user.updateProfile({ displayName: name });
            // Close modal after success
            document.getElementById('auth-modal').classList.add('hidden');
        } else {
            await auth.signInWithEmailAndPassword(email, pass);
            // Close modal after success
            document.getElementById('auth-modal').classList.add('hidden');
        }
    } catch (e) { 
        alert(e.message); 
    }
}

function logout() { 
    auth.signOut().then(() => {
        location.reload(); // Refresh to reset UI state
    }); 
}