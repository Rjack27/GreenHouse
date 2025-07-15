// ===============================
// Fungsi Navigasi Halaman
// ===============================
function showSection(sectionId) {
  document.querySelectorAll('main section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById(sectionId).classList.remove('hidden');
}

// ===============================
// Event Listener Filter Dropdown
// ===============================
document.getElementById('filterType').addEventListener('change', () => {
  const type = document.getElementById('filterType').value;
  document.getElementById('filterHari').style.display = (type === 'hari') ? 'inline-block' : 'none';
  document.getElementById('filterBulan').style.display = (type === 'bulan') ? 'inline-block' : 'none';
});

// ===============================
// Dummy Data Log
// ===============================
const dummyLogs = [
  {
    tanggal: '2025-07-14',
    waktu: '09:00',
    aktivitas: 'Monitoring',
    ppm: 550,
    setpoint: 600,
    suhu: 28.5,
    ph: 6.5,
    tinggi: 12
  },
  {
    tanggal: '2025-07-14',
    waktu: '12:00',
    aktivitas: 'Monitoring',
    ppm: 580,
    setpoint: 600,
    suhu: 29.0,
    ph: 6.6,
    tinggi: 11.8
  }
];

// ===============================
// Tampilkan Data Log ke Tabel
// ===============================
function filterData() {
  const tbody = document.getElementById('riwayatBody');
  tbody.innerHTML = '';

  dummyLogs.forEach(log => {
    const row = `
      <tr>
        <td>${log.tanggal}</td>
        <td>${log.waktu}</td>
        <td>${log.aktivitas}</td>
        <td>${log.ppm}</td>
        <td>${log.setpoint}</td>
        <td>${log.suhu}</td>
        <td>${log.ph}</td>
        <td>${log.tinggi}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ===============================
// Export Data ke Excel
// ===============================
function downloadExcel() {
  const table = document.getElementById('logTableElement');
  const wb = XLSX.utils.table_to_book(table, { sheet: "Riwayat" });
  XLSX.writeFile(wb, "riwayat_data.xlsx");
}

// ===============================
// Ganti Password (Dummy)
// ===============================
function changePassword() {
  const pass = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (!pass || !confirm) {
    alert("Password tidak boleh kosong.");
  } else if (pass !== confirm) {
    alert("Password tidak cocok.");
  } else {
    alert("Password berhasil diganti.");
  }
}
