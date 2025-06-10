// ✅ Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDKzX5Z2MPAabKkrTYuXvdRr8cqYbDhoWM",
  authDomain: "grow-iot-8fba8.firebaseapp.com",
  databaseURL: "https://grow-iot-8fba8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "grow-iot-8fba8",
  storageBucket: "grow-iot-8fba8.appspot.com",
  messagingSenderId: "455814807543",
  appId: "1:455814807543:web:18f406aaeae13dee3b78f2",
  measurementId: "G-RTRHSX4E70"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Validasi Form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const errorMsg = document.getElementById('error-msg');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !username || !email || !password || !confirmPassword) {
      errorMsg.textContent = 'Semua field harus diisi!';
      return;
    }

    if (password !== confirmPassword) {
      errorMsg.textContent = 'Password dan konfirmasi password tidak cocok!';
      return;
    }

    // Simpan ke localStorage (sementara)
    const userData = {
      name,
      username,
      email,
      password,
    };

    localStorage.setItem('user', JSON.stringify(userData));

    alert(`Pendaftaran berhasil untuk ${name}`);
    window.location.href = 'login.html';
  });
});
