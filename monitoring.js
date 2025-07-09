// Firebase Config
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Chart.js setup
const ctx = document.getElementById('stepResponseChart').getContext('2d');
const data = {
  labels: [],
  datasets: [
    {
      label: 'PPM Output (ppm)',
      data: [],
      borderColor: 'blue',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0
    },
    {
      label: 'Setpoint',
      data: [],
      borderColor: 'red',
      borderDash: [5, 5],
      borderWidth: 2,
      fill: false,
      pointRadius: 0
    }
  ]
};
const chart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Time (seconds)' }
      },
      y: {
        title: { display: true, text: 'PPM' },
        suggestedMin: 0,
        suggestedMax: 600
      }
    }
  }
});

// Global state
let startTime = Date.now();

function updateData() {
  const now = new Date();
  const waktu = now.toLocaleTimeString();

  Promise.all([
    db.ref("HQ/SENSOR/tds").once("value"),
    db.ref("HQ/CONTROL/output_pid").once("value"),
    db.ref("HQ/SENSOR/temperature").once("value"),
    db.ref("HQ/CONTROL/setpoin").once("value"),
    db.ref("HQ/SENSOR/ph").once("value"),
    db.ref("HQ/SENSOR/tinggi_air").once("value")
  ])
  .then(([ppmSnap, pwmSnap, suhuSnap, setpointSnap, phSnap, tinggiSnap]) => {
    const ppm = parseFloat((ppmSnap.val() ?? "0").toString().trim()) || 0;
    const pwm = parseFloat((pwmSnap.val() ?? "0").toString().trim()) || 0;
    const suhu = parseFloat((suhuSnap.val() ?? "0").toString().trim()) || 0;
    const setpoint = parseFloat((setpointSnap.val() ?? "0").toString().trim()) || 0;
    const ph = parseFloat((phSnap.val() ?? "0").toString().trim()) || 0;
    const tinggi = parseFloat((tinggiSnap.val() ?? "0").toString().trim()) || 0;

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

    // Panel UI
    document.getElementById("ppmValue").textContent = ppm.toFixed(2);
    document.getElementById("pwmValue").textContent = pwm.toFixed(0);
    document.getElementById("tempValue").textContent = suhu.toFixed(1);
    document.getElementById("setpointValue").textContent = setpoint.toFixed(2);
    document.getElementById("phValue").textContent = ph.toFixed(2);
    document.getElementById("tinggiValue").textContent = tinggi.toFixed(1);

    // Riwayat tabel HTML (opsional)
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${waktu}</td>
      <td>${ppm.toFixed(2)}</td>
      <td>${setpoint.toFixed(2)}</td>
      <td>${pwm.toFixed(0)}</td>
      <td>${suhu.toFixed(1)}</td>
      <td>${ph.toFixed(2)}</td>
      <td>${tinggi.toFixed(1)}</td>
    `;
    const riwayatBody = document.getElementById("riwayatBody");
    riwayatBody.prepend(row);
    if (riwayatBody.rows.length > 30) {
      riwayatBody.deleteRow(riwayatBody.rows.length - 1);
    }

    // Simpan ke Firebase
    const tanggal = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const jamMenitDetik = now.toTimeString().substring(0, 8).replace(/:/g, "-"); // HH-MM-SS
    db.ref(`HQ/RIWAYAT/${tanggal}/${jamMenitDetik}`).set({
      waktu: waktu,
      ppm: ppm,
      setpoint: setpoint,
      pwm: pwm,
      suhu: suhu,
      ph: ph,
      tinggi: tinggi
    });

    // Log khusus
    const timestamp = Date.now();
    db.ref(`log_suhu/${timestamp}`).set({ waktu: timestamp, nilai: suhu });
    db.ref(`log_ph/${timestamp}`).set({ waktu: timestamp, nilai: ph });
    db.ref(`log_tds/${timestamp}`).set({ waktu: timestamp, nilai: ppm });
    db.ref(`log_ultrasonic/${timestamp}`).set({ waktu: timestamp, nilai: tinggi });
  })
  .catch(err => {
    console.error("Firebase read error:", err);
  });
}

// Jalankan update tiap 5 detik (bukan 1 detik)
setInterval(updateData, 5000);
