// File: js/auth.js
// -------------------------------------------------
// এই কোডটি কপি করে আপনার js/auth.js ফাইলে পেস্ট করুন
// -------------------------------------------------

const firebaseConfig = {
    apiKey: "AIzaSyC58UKWqXexFTzpkNPB9dy9Cn2Ncom8LeA",
    authDomain: "ariyan-project-lab-9b897.firebaseapp.com",
    projectId: "ariyan-project-lab-9b897",
    storageBucket: "ariyan-project-lab-9b897.appspot.com",
    messagingSenderId: "1039012899737",
    appId: "1:1039012899737:web:30b76fd347a89d0bec4108"
};

// Firebase ইনিশিয়ালাইজ
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Navbar আপডেট ফাংশন (লিঙ্কগুলো ঠিক করা হয়েছে)
function updateNavbar(user) {
    const navbarAuthContainer = document.getElementById('navbar-auth');
    if (!navbarAuthContainer) return;

    // চেক করা হচ্ছে আমরা অ্যাডমিন ফোল্ডারে আছি কি না
    const isInAdminFolder = window.location.pathname.includes('/admin/');
    const prefix = isInAdminFolder ? '../' : ''; // অ্যাডমিনে থাকলে এক ফোল্ডার ব্যাকে যাবে

    if (user) {
        // ইউজার লগইন করা থাকলে (সামনের / বাদ দেওয়া হয়েছে)
        navbarAuthContainer.innerHTML = `
            <a href="${prefix}dashboard.html" class="text-gray-700 hover:text-indigo-600">Dashboard</a>
            <a href="${prefix}profile.html" class="text-gray-700 hover:text-indigo-600">Profile</a>
            <button onclick="logout()" class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
        `;
    } else {
        // ইউজার লগইন করা না থাকলে (সামনের / বাদ দেওয়া হয়েছে)
        navbarAuthContainer.innerHTML = `
            <a href="${prefix}login.html" class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Login</a>
            <a href="${prefix}register.html" class="text-gray-700 hover:text-indigo-600">Register</a>
        `;
    }
}

// লগআউট ফাংশন (লিঙ্ক ঠিক করা হয়েছে)
function logout() {
    auth.signOut().then(() => {
        // চেক করা হচ্ছে আমরা অ্যাডমিন ফোল্ডারে আছি কি না
        const isInAdminFolder = window.location.pathname.includes('/admin/');
        if (isInAdminFolder) {
            window.location.href = '../login.html'; // অ্যাডমিন থেকে বের হলে
        } else {
            window.location.href = 'login.html'; // সাধারণ পেজ থেকে বের হলে
        }
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// অথেনটিকেশন স্টেট চেক
auth.onAuthStateChanged(updateNavbar);

// অ্যাডমিন চেক ফাংশন
async function isAdmin(user) {
    if (!user) return false;
    const userDoc = await db.collection('users').doc(user.uid).get();
    return userDoc.exists && userDoc.data().isAdmin === true;
}