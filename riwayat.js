// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, onValue, get, set, push } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

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
const db = getDatabase(app);

// Fungsi untuk menampilkan data riwayat berdasarkan tanggal
window.tampilkanRiwayat = async function () {
  const tanggalInput = document.getElementById("tanggal").value;
  const tbody = document.getElementById("logData");
  tbody.innerHTML = "";

  if (!tanggalInput) {
    alert("Pilih tanggal terlebih dahulu!");
    return;
  }

  const dataRef = ref(db, "riwayat/" + tanggalInput);
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    Object.keys(data).forEach(time => {
      const value = data[time];
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${time}</td>
        <td>${value}</td>
      `;
      tbody.appendChild(row);
    });
  } else {
    tbody.innerHTML = `<tr><td colspan="2">Tidak ada data pada tanggal ini.</td></tr>`;
  }
};
