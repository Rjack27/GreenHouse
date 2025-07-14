import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Navigasi UI
window.showSection = function(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if (id === 'log') renderTable(dataLog);
};

// Ganti Password
window.changePassword = function() {
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    alert("Password dan konfirmasi password tidak sama.");
    return;
  }
  if (newPassword.length < 6) {
    alert("Password harus minimal 6 karakter.");
    return;
  }

  set(ref(db, "settings/password"), newPassword)
    .then(() => {
      alert("Password berhasil diganti.");
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmPassword").value = "";
    })
    .catch(error => alert("Error mengganti password: " + error.message));
};

// Data Log Dummy
const dataLog = [
  { tanggal: '2025-06-18', waktu: '08:00', aktivitas: 'Sensor aktif' },
  { tanggal: '2025-06-18', waktu: '12:00', aktivitas: 'Penyiraman otomatis' },
  { tanggal: '2025-06-17', waktu: '10:00', aktivitas: 'Sensor mati' },
  { tanggal: '2025-05-25', waktu: '14:00', aktivitas: 'Maintenance rutin' },
  { tanggal: '2025-05-01', waktu: '09:00', aktivitas: 'Pengecekan suhu' },
];

function renderTable(filteredData = dataLog) {
  const tbody = document.getElementById('riwayatBody');
  tbody.innerHTML = '';

  if (filteredData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">Tidak ada data ditemukan</td></tr>';
    return;
  }

  filteredData.forEach(item => {
    const row = `<tr>
      <td>${item.tanggal}</td>
      <td>${item.waktu}</td>
      <td>${item.aktivitas}</td>
      <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function filterData() {
  const filterType = document.getElementById('filterType').value;
  let filtered = [];

  if (filterType === 'hari') {
    const hari = document.getElementById('filterHari').value;
    filtered = dataLog.filter(item => item.tanggal === hari);
  } else {
    const bulan = document.getElementById('filterBulan').value;
    filtered = dataLog.filter(item => item.tanggal.startsWith(bulan));
  }

  renderTable(filtered);
}

window.filterData = filterData;

document.getElementById('filterType').addEventListener('change', function () {
  const type = this.value;
  document.getElementById('filterHari').style.display = type === 'hari' ? 'inline-block' : 'none';
  document.getElementById('filterBulan').style.display = type === 'bulan' ? 'inline-block' : 'none';
});

document.getElementById("downloadExcel").addEventListener("click", function () {
  const table = document.getElementById("logTableElement");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Riwayat Log" });
  XLSX.writeFile(wb, "riwayat_log_data.xlsx");
});

document.getElementById("logoutBtn").addEventListener("click", function () {
  const konfirmasi = confirm("Apakah Anda yakin ingin logout?");
  if (konfirmasi) {
    localStorage.clear();
    window.location.href = "login.html";
  }
});

// Default tampilan saat pertama kali dibuka
showSection('home');
