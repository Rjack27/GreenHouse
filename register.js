// Import modul dari Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Konfigurasi Firebase
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
