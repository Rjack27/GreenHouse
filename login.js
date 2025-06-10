document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Mencegah reload form

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');

  // Contoh validasi login statis
  if (Email === 'admin' && Password === '12345') {
    window.location.href = "index.html"; // Redirect ke halaman utama
  } else {
    errorMsg.textContent = "Email atau Password salah!";
  }
});

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDKzX5Z2MPAabKkrTYuXvdRr8cqYbDhoWM",
  authDomain: "grow-iot-8fba8.firebaseapp.com",
  databaseURL: "https://grow-iot-8fba8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "grow-iot-8fba8",
  storageBucket: "grow-iot-8fba8.firebasestorage.app",
  messagingSenderId: "455814807543",
  appId: "1:455814807543:web:18f406aaeae13dee3b78f2",
  measurementId: "G-RTRHSX4E70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("Email").value.trim();
  const password = document.getElementById("Password").value;
  const errorMsg = document.getElementById("error-msg");
  errorMsg.textContent = "";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Ambil status user dari Realtime Database
    const userRef = ref(database, 'users/' + user.uid);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const status = userData.status;

      if (status === "admin") {
        window.location.href = "admin_dasboard.html";
      } else {
        window.location.href = "user_dashboard.html";
      }
    } else {
      errorMsg.textContent = "Data pengguna tidak ditemukan.";
    }
  } catch (error) {
    errorMsg.textContent = "Email atau password salah.";
    console.error(error.message);
  }
});

