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
