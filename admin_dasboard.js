import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Navigasi UI
window.showSection = function (id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if (id === 'log') renderTable(dataLog);
};

// Ganti Password
window.changePassword = function () {
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

// Data Log dari Firebase
let dataLog = [];

// Baca data log dari Firebase
const logRef = ref(db, 'HQ/RIWAYAT');
onValue(logRef, (snapshot) => {
  dataLog = [];

  snapshot.forEach(tanggalSnap => {
    const tanggal = tanggalSnap.key;
    tanggalSnap.forEach(entrySnap => {
      const entry = entrySnap.val();

      // Tentukan aktivitas berdasarkan status alat
      let aktivitasText = "-";
      if (entry.status === "ON" || entry.status === 1) {
        aktivitasText = "Alat Hidup";
      } else if (entry.status === "OFF" || entry.status === 0) {
        aktivitasText = "Alat Mati";
      }

      dataLog.push({
        tanggal: tanggal,
        waktu: entry.waktu || "-",
        aktivitas: aktivitasText,
        ppm: entry.ppm ?? "-",
        setpoint: entry.setpoint ?? "-",
        suhu: entry.suhu ?? "-",
        ph: entry.ph ?? "-",
        tinggi_air: entry.tinggi_air ?? "-"
      });
    });
  });

  renderTable(dataLog);
});

// Render tabel log
function renderTable(filteredData = dataLog) {
  const tbody = document.getElementById('riwayatBody');
  tbody.innerHTML = '';

  if (filteredData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">Tidak ada data ditemukan</td></tr>';
    return;
  }

  filteredData.forEach(item => {
    const row = `
      <tr>
        <td>${item.tanggal}</td>
        <td>${item.waktu}</td>
        <td>${item.aktivitas}</td>
        <td>${item.ppm}</td>
        <td>${item.setpoint}</td>
        <td>${item.suhu}</td>
        <td>${item.ph}</td>
        <td>${item.tinggi_air}</td>
      </tr>`;
    tbody.innerHTML += row;
  });
}

// Filter Data
window.filterData = function () {
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
};

// Event Filter
document.getElementById('filterType').addEventListener('change', function () {
  const type = this.value;
  document.getElementById('filterHari').style.display = type === 'hari' ? 'inline-block' : 'none';
  document.getElementById('filterBulan').style.display = type === 'bulan' ? 'inline-block' : 'none';
});

// Export ke Excel
document.getElementById("downloadExcel").addEventListener("click", function () {
  const table = document.getElementById("logTableElement");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Riwayat Log" });
  XLSX.writeFile(wb, "riwayat_log_data.xlsx");
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", function () {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    localStorage.clear();
    window.location.href = "index.html";
  }
});

// Default tampilan
showSection('home');

function openDatasheet(path) {
  window.open(path, '_blank');
}
