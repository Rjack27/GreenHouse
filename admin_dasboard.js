import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Firebase configuration
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

// UI Navigation
window.showSection = function(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  
  // Refresh log table when log section is shown
  if (id === 'log') {
    renderTable(dataLog);
  }
};

window.showChartTab = function(tabId) {
  document.getElementById('realtimeCharts').style.display = 'none';
  document.getElementById('historicalCharts').style.display = 'none';
  document.getElementById(tabId).style.display = 'block';
};

// Real-time Data Elements
const tdsValue = document.getElementById("tdsValue");
const motorSpeed = document.getElementById("motorSpeed");
const tempValue = document.getElementById("tempValue");
const phValue = document.getElementById("phValue");
const waterLevelValue = document.getElementById("waterLevelValue");
const minTdsInput = document.getElementById("minTds");
const maxTdsInput = document.getElementById("maxTds");
const motorControlInput = document.getElementById("motorControl");

// Real-time Data Listeners
onValue(ref(db, "sensor/tds"), snapshot => {
  const value = snapshot.val();
  tdsValue.textContent = value;
  updateRealtimeChart(chartTDS, value);
});

onValue(ref(db, "sensor/temp"), snapshot => {
  const value = snapshot.val();
  tempValue.textContent = value;
  updateRealtimeChart(chartSuhu, value);
});

onValue(ref(db, "sensor/ph"), snapshot => {
  const value = snapshot.val();
  phValue.textContent = value;
  updateRealtimeChart(chartPH, value);
});

onValue(ref(db, "sensor/water_level"), snapshot => {
  const value = snapshot.val();
  waterLevelValue.textContent = value;
  updateRealtimeChart(chartUltrasonic, value);
});

onValue(ref(db, "motor/speed"), snapshot => {
  motorSpeed.textContent = snapshot.val();
});

onValue(ref(db, "control"), snapshot => {
  const data = snapshot.val();
  if (data) {
    minTdsInput.value = data.minTds || '';
    maxTdsInput.value = data.maxTds || '';
    motorControlInput.value = data.motorSpeed || '';
  }
});

// Control Functions
window.updateControl = function() {
  const controlRef = ref(db, "control");
  set(controlRef, {
    minTds: parseInt(minTdsInput.value),
    maxTds: parseInt(maxTdsInput.value),
    motorSpeed: parseInt(motorControlInput.value)
  }).then(() => {
    alert("Pengaturan berhasil disimpan.");
  }).catch((error) => {
    alert("Error menyimpan pengaturan: " + error.message);
  });
};

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
    .catch((error) => {
      alert("Error mengganti password: " + error.message);
    });
};

// Log Data and Filtering
const dataLog = [
  { tanggal: '2025-06-18', waktu: '08:00', aktivitas: 'Sensor aktif' },
  { tanggal: '2025-06-18', waktu: '12:00', aktivitas: 'Penyiraman otomatis' },
  { tanggal: '2025-06-17', waktu: '10:00', aktivitas: 'Sensor mati' },
  { tanggal: '2025-05-25', waktu: '14:00', aktivitas: 'Maintenance rutin' },
  { tanggal: '2025-05-01', waktu: '09:00', aktivitas: 'Pengecekan suhu' },
];

function renderTable(filteredData = dataLog) {
  const tbody = document.getElementById('logTable');
  tbody.innerHTML = '';

  if (filteredData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">Tidak ada data ditemukan</td></tr>';
    return;
  }

  filteredData.forEach(item => {
    const row = `<tr>
      <td>${item.tanggal}</td>
      <td>${item.waktu}</td>
      <td>${item.aktivitas}</td>
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

document.getElementById('filterType').addEventListener('change', function() {
  const type = this.value;
  document.getElementById('filterHari').style.display = type === 'hari' ? 'inline-block' : 'none';
  document.getElementById('filterBulan').style.display = type === 'bulan' ? 'inline-block' : 'none';
});

// Chart Configuration
const maxDataPoints = 10;

// Real-time Charts
const createRealtimeChart = (ctx, label, color) => {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        borderColor: color,
        backgroundColor: 'transparent',
        tension: 0.3,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { 
          ticks: { display: true },
          grid: { display: false }
        },
        y: { 
          beginAtZero: false,
          grid: { color: 'rgba(0,0,0,0.05)' }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });
};

const chartSuhu = createRealtimeChart(document.getElementById('chartSuhu'), 'Suhu (°C)', 'orange');
const chartPH = createRealtimeChart(document.getElementById('chartPH'), 'pH', 'blue');
const chartTDS = createRealtimeChart(document.getElementById('chartTDS'), 'TDS (ppm)', 'teal');
const chartUltrasonic = createRealtimeChart(document.getElementById('chartUltrasonic'), 'Level Air (cm)', 'purple');

const updateRealtimeChart = (chart, value) => {
  const time = new Date().toLocaleTimeString('id-ID');
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(value);

  if (chart.data.labels.length > maxDataPoints) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
};

// Historical Charts
function createHistoricalChart(ctx, label, color, labels, values) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: values,
        borderColor: color,
        backgroundColor: 'transparent',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: false,
          grid: { color: 'rgba(0,0,0,0.05)' }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}

function renderHistoricalChart(sensorPath, canvasId, label, color) {
  const sensorRef = ref(db, sensorPath);
  onValue(sensorRef, snapshot => {
    const data = snapshot.val();
    const labels = [];
    const values = [];

    for (const key in data) {
      if (data[key].waktu && data[key].nilai !== undefined) {
        labels.push(formatTimestamp(data[key].waktu));
        values.push(data[key].nilai);
      }
    }

    // Only create chart if we have data
    if (labels.length > 0 && values.length > 0) {
      createHistoricalChart(document.getElementById(canvasId), label, color, labels, values);
    }
  });
}

// Initialize all historical charts
renderHistoricalChart('log_suhu', 'historicalChartSuhu', 'Grafik Suhu (°C)', 'orange');
renderHistoricalChart('log_ph', 'historicalChartPH', 'Grafik pH', 'blue');
renderHistoricalChart('log_tds', 'historicalChartTDS', 'Grafik Nutrisi (ppm)', 'teal');
renderHistoricalChart('log_ultrasonic', 'historicalChartUltrasonic', 'Grafik Level Air (cm)', 'purple');

// Initialize the page
showSection('home');
showChartTab('realtimeCharts');