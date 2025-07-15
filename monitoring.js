// Konfigurasi Firebase (UPDATE)
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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Setup Chart.js
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

let startTime = Date.now();

function updateData() {
  console.log("🟡 Memulai updateData()");

  const now = new Date();
  const waktu = now.toLocaleTimeString();

  Promise.all([
    db.ref("HQ/SENSOR/tds").get(),
    db.ref("HQ/CONTROL/output_pid").get(),
    db.ref("HQ/SENSOR/temperature").get(),
    db.ref("HQ/CONTROL/setpoin").get(),
    db.ref("HQ/SENSOR/ph").get(),
    db.ref("HQ/SENSOR/tinggi_air").get()
  ])
    .then(([ppmSnap, pwmSnap, suhuSnap, setpointSnap, phSnap, tinggiSnap]) => {
      const ppm = parseFloat(ppmSnap.val()) || 0;
      const pwm = parseFloat(pwmSnap.val()) || 0;
      const suhu = parseFloat(suhuSnap.val()) || 0;
      const setpoint = parseFloat(setpointSnap.val()) || 0;
      const ph = parseFloat(phSnap.val()) || 0;
      const tinggi = parseFloat(tinggiSnap.val()) || 0;

      console.log("✅ Data sensor berhasil dibaca");
      console.log(`   PPM: ${ppm}, PWM: ${pwm}, Suhu: ${suhu}, Setpoint: ${setpoint}, pH: ${ph}, Ketinggian: ${tinggi}`);

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

      // Update tampilan nilai
      document.getElementById("ppmValue").textContent = ppm.toFixed(2);
      document.getElementById("pwmValue").textContent = pwm.toFixed(0);
      document.getElementById("tempValue").textContent = suhu.toFixed(1);
      document.getElementById("setpointValue").textContent = setpoint.toFixed(2);
      document.getElementById("phValue").textContent = ph.toFixed(2);
      document.getElementById("tinggiValue").textContent = tinggi.toFixed(1);

      // Simpan ke Firebase sebagai riwayat
      const tanggal = now.toISOString().split("T")[0];
      const jamMenitDetik = now.toTimeString().substring(0, 8).replace(/:/g, "-");

      console.log("🚀 Menyimpan ke RIWAYAT Firebase...");
      db.ref(`HQ/RIWAYAT/${tanggal}/${jamMenitDetik}`).set({
        waktu,
        ppm,
        setpoint,
        pwm,
        suhu,
        ph,
        tinggi
      })
        .then(() => {
          console.log("✅ Data RIWAYAT berhasil disimpan");
        })
        .catch(err => {
          console.error("❌ Gagal menyimpan ke RIWAYAT:", err);
        });

      // Simpan juga ke log sensor
      const timestamp = Date.now();
      db.ref(`log_suhu/${timestamp}`).set({ waktu: timestamp, nilai: suhu });
      db.ref(`log_ph/${timestamp}`).set({ waktu: timestamp, nilai: ph });
      db.ref(`log_tds/${timestamp}`).set({ waktu: timestamp, nilai: ppm });
      db.ref(`log_ultrasonic/${timestamp}`).set({ waktu: timestamp, nilai: tinggi });
    })
    .catch(err => {
      console.error("❌ Gagal membaca data dari Firebase:", err);
    });
}

// Jalankan setiap 5 detik
setInterval(updateData, 5000);
