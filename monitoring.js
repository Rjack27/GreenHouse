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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

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
        title: {
          display: true,
          text: 'Time (seconds)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'PPM'
        },
        suggestedMin: 0,
        suggestedMax: 600
      }
    }
  }
});

let startTime = Date.now();

function updateData() {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

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

    // Update chart
    data.labels.push(elapsed);
    data.datasets[0].data.push(ppm);
    data.datasets[1].data.push(setpoint);

    if (data.labels.length > 50) {
      data.labels.shift();
      data.datasets[0].data.shift();
      data.datasets[1].data.shift();
    }

    chart.update();

    // Update panel info
    document.getElementById("ppmValue").textContent = ppm.toFixed(2);
    document.getElementById("pwmValue").textContent = pwm.toFixed(0);
    document.getElementById("tempValue").textContent = suhu.toFixed(1);
    document.getElementById("setpointValue").textContent = setpoint.toFixed(2);
    document.getElementById("phValue").textContent = ph.toFixed(2);
    document.getElementById("tinggiValue").textContent = tinggi.toFixed(1);
  })
  .catch(err => {
    console.error("Firebase read error:", err);
  });
}

setInterval(updateData, 1000);
