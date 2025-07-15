// Import modul dari Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAL3l3Fb9_Q1CAkjwxEBvG6Tb1W-HJwUCI",
  authDomain: "hqchulo.firebaseapp.com",
  databaseURL: "https://hqchulo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hqchulo",
  storageBucket: "hqchulo.firebasestorage.app",
  messagingSenderId: "1008179913372",
  appId: "1:1008179913372:web:be2b758dfc42ee61544359",
  measurementId: "G-LE5GX298ZJ"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Tangani submit form
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const isAdmin = document.getElementById("isAdminSwitch").checked;
  const errorMsg = document.getElementById("error-msg");

  errorMsg.textContent = "";

  if (password !== confirmPassword) {
    errorMsg.textContent = "Konfirmasi password tidak cocok.";
    return;
  }

  try {
    // Buat user di Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Simpan data tambahan ke Realtime Database
    await set(ref(database, 'users/' + user.uid), {
      uid: user.uid,
      name: name,
      username: username,
      email: email,
      status: isAdmin ? "admin" : "user"
    });

    // Redirect ke login
    alert("Pendaftaran berhasil! Silakan login.");
    window.location.href = "login.html";
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-in-use") {
      errorMsg.textContent = "Email sudah terdaftar.";
    } else if (error.code === "auth/weak-password") {
      errorMsg.textContent = "Password terlalu lemah. Gunakan minimal 6 karakter.";
    } else {
      errorMsg.textContent = "Terjadi kesalahan saat mendaftar.";
    }
  }
});
