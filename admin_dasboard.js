import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.showSection = function(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

const tdsValue = document.getElementById("tdsValue");
const motorSpeed = document.getElementById("motorSpeed");
const minTdsInput = document.getElementById("minTds");
const maxTdsInput = document.getElementById("maxTds");
const motorControlInput = document.getElementById("motorControl");

onValue(ref(db, "sensor/tds"), snapshot => {
  tdsValue.textContent = snapshot.val();
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

window.updateControl = function () {
  const controlRef = ref(db, "control");
  set(controlRef, {
    minTds: parseInt(minTdsInput.value),
    maxTds: parseInt(maxTdsInput.value),
    motorSpeed: parseInt(motorControlInput.value)
  });
  alert("Pengaturan berhasil disimpan.");
};

window.changePassword = function () {
  const newPassword = document.getElementById("newPassword").value;
  if (newPassword.length < 6) {
    alert("Password harus minimal 6 karakter.");
    return;
  }
  set(ref(db, "settings/password"), newPassword);
  alert("Password berhasil diganti.");
};

const maxDataPoints = 10;

const createChart = (ctx, label, color) => {
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
      }]
    },
    options: {
      scales: {
        x: { ticks: { display: true } },
        y: { beginAtZero: true }
      }
    }
  });
};

const chartSuhu = createChart(document.getElementById('chartSuhu').getContext('2d'), 'Suhu (°C)', 'orange');
const chartPH = createChart(document.getElementById('chartPH').getContext('2d'), 'pH', 'blue');
const chartTDS = createChart(document.getElementById('chartTDS').getContext('2d'), 'TDS (ppm)', 'teal');
const chartUltrasonic = createChart(document.getElementById('chartUltrasonic').getContext('2d'), 'Level Air (cm)', 'purple');

const updateChart = (chart, value) => {
  const time = new Date().toLocaleTimeString('id-ID');
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(value);

  if (chart.data.labels.length > maxDataPoints) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
};

// Simulasi pembaruan data sensor setiap 3 detik
setInterval(() => {
  const tdsValue = Math.floor(Math.random() * 1000);
  const motorSpeed = Math.floor(Math.random() * 100);

  document.getElementById('tdsValue').innerText = `${tdsValue} ppm`;
  document.getElementById('motorSpeed').innerText = `${motorSpeed} %`;

  updateChart(chartSuhu, Math.random() * 40);
  updateChart(chartPH, (Math.random() * 3) + 5);
  updateChart(chartTDS, tdsValue);
  updateChart(chartUltrasonic, Math.random() * 100);
}, 3000);

const buttons = document.querySelectorAll(".accordion-button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;

    // Close others
    document.querySelectorAll(".accordion-content").forEach((el) => {
      if (el !== content) el.style.display = "none";
    });

    // Toggle current
    content.style.display =
      content.style.display === "block" ? "none" : "block";
  });
});
