// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, onValue, get, set, push } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

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
