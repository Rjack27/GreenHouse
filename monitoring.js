import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase Config
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

// Setup Chart.js
const ctx = document.getElementById("stepResponseChart").getContext("2d");
const data = {
  labels: [],
  datasets: [
    {
      label: "PPM Output (ppm)",
      data: [],
      borderColor: "blue",
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0,
    },
    {
      label: "Setpoint",
      data: [],
      borderColor: "red",
      borderDash: [5, 5],
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
    }
  ]
};

const chart = new Chart(ctx, {
  type: "line",
  data: data,
  options: {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Time (seconds)" }
      },
      y: {
        title: { display: true, text: "PPM" },
        suggestedMin: 0,
        suggestedMax: 1000
      }
    }
  }
});

let startTime = Date.now();

// Listener data realtime
const sensorRef = ref(db, "SENSOR");
onValue(sensorRef, (snapshot) => {
  const sensor = snapshot.val();
  if (!sensor) return;

  const now = new Date();
  const waktu = now.toLocaleTimeString();

  const ppm = parseFloat(sensor.tds) || 0;
  const pwm = parseFloat(sensor.output_pid) || 0;
  const suhu = parseFloat(sensor.suhu) || 0;
  const setpoint = parseFloat(sensor.setpoint) || 0;
  const ph = parseFloat(sensor.ph) || 0;
  const tinggi = parseFloat(sensor.tinggi_air) || 0;

  // Update info panel
  document.getElementById("ppmValue").textContent = ppm.toFixed(2);
  document.getElementById("pwmValue").textContent = pwm.toFixed(0);
  document.getElementById("suhuValue").textContent = suhu.toFixed(1);
  document.getElementById("setpointValue").textContent = setpoint.toFixed(2);
  document.getElementById("phValue").textContent = ph.toFixed(2);
  document.getElementById("tinggiAirValue").textContent = tinggi.toFixed(1);

  // Update grafik
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  data.labels.push(elapsed);
  data.datasets[0].data.push(ppm);
  data.datasets[1].data.push(setpoint);
  if (data.labels.length > 50) {
    data.labels.shift();
    data.datasets[0].data.shift();
    data.datasets[1].data.shift();
  }
  chart.update();

  // Simpan ke RIWAYAT dan log harian
  const tanggal = now.toISOString().split("T")[0];
  const jam = now.toTimeString().substring(0, 8).replace(/:/g, "-");

  set(ref(db, `HQ/RIWAYAT/${tanggal}/${jam}`), {
    waktu,
    ppm,
    setpoint,
    pwm,
    suhu,
    ph,
    tinggi
  });

  const timestamp = Date.now();
  set(ref(db, `log_suhu/${timestamp}`), { waktu: timestamp, nilai: suhu });
  set(ref(db, `log_ph/${timestamp}`), { waktu: timestamp, nilai: ph });
  set(ref(db, `log_tds/${timestamp}`), { waktu: timestamp, nilai: ppm });
  set(ref(db, `log_ultrasonic/${timestamp}`), { waktu: timestamp, nilai: tinggi });
});
