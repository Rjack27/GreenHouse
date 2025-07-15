// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAL3l3Fb9_Q1CAkjwxEBvG6Tb1W-HJwUCI",
  databaseURL: "https://hqchulo-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const refs = {
  setpoint: database.ref('HQ/CONTROL/setpoin'),
  pid: {
    kp: database.ref('HQ/CONTROL/kp'),
    ki: database.ref('HQ/CONTROL/ki'),
    kd: database.ref('HQ/CONTROL/kd')
  },
  status: database.ref('hq/status'),
  ppm: database.ref('hq/ppm'),
  pwm: database.ref('hq/pwm1')
};

let isTuning = false;

document.addEventListener('DOMContentLoaded', () => {
  loadCurrentValues();
  setupRealTimeListeners();
});

function loadCurrentValues() {
  refs.setpoint.once('value').then(snapshot => {
    const value = snapshot.val();
    document.getElementById('setpointInput').value = value;
    document.getElementById('currentSetpoint').textContent = value;
  });

  refs.pid.kp.once('value').then(snapshot => {
    document.getElementById('kpInput').value = snapshot.val();
    document.getElementById('kp').textContent = snapshot.val();
  });

  refs.pid.ki.once('value').then(snapshot => {
    document.getElementById('kiInput').value = snapshot.val();
    document.getElementById('ki').textContent = snapshot.val();
  });

  refs.pid.kd.once('value').then(snapshot => {
    document.getElementById('kdInput').value = snapshot.val();
    document.getElementById('kd').textContent = snapshot.val();
  });

  refs.status.once('value').then(snapshot => {
    document.getElementById('systemStatus').textContent = snapshot.val();
    isTuning = snapshot.val() === 'TUNING';
    updateZNTuningButton();
  });

  refs.ppm.once('value').then(snapshot => {
    document.getElementById('currentPPM').textContent = snapshot.val().toFixed(1);
  });

  refs.pwm.once('value').then(snapshot => {
    document.getElementById('pumpOutput').textContent = snapshot.val();
  });
}

function setupRealTimeListeners() {
  refs.pid.kp.on('value', snapshot => {
    document.getElementById('kp').textContent = snapshot.val().toFixed(2);
  });

  refs.pid.ki.on('value', snapshot => {
    document.getElementById('ki').textContent = snapshot.val().toFixed(2);
  });

  refs.pid.kd.on('value', snapshot => {
    document.getElementById('kd').textContent = snapshot.val().toFixed(2);
  });

  refs.status.on('value', snapshot => {
    document.getElementById('systemStatus').textContent = snapshot.val();
    isTuning = snapshot.val() === 'TUNING';
    updateZNTuningButton();
  });

  refs.ppm.on('value', snapshot => {
    document.getElementById('currentPPM').textContent = snapshot.val().toFixed(1);
  });

  refs.pwm.on('value', snapshot => {
    document.getElementById('pumpOutput').textContent = snapshot.val();
  });
}

function updateSetpoint() {
  const setpointInput = document.getElementById('setpointInput');
  const newSetpoint = parseFloat(setpointInput.value);
  if (isNaN(newSetpoint)) return showStatus('setpointStatus', 'Please enter a valid number', 'error');

  refs.setpoint.set(newSetpoint)
    .then(() => {
      showStatus('setpointStatus', 'Setpoint updated successfully!', 'success');
      document.getElementById('currentSetpoint').textContent = newSetpoint;
    })
    .catch(error => showStatus('setpointStatus', 'Error updating setpoint: ' + error.message, 'error'));
}

function updatePIDParam(param) {
  const input = document.getElementById(param + 'Input');
  const value = parseFloat(input.value);
  if (isNaN(value)) return showStatus('pidStatus', `Please enter a valid number for ${param}`, 'error');

  refs.pid[param].set(value)
    .then(() => showStatus('pidStatus', `${param.toUpperCase()} updated successfully!`, 'success'))
    .catch(error => showStatus('pidStatus', `Error updating ${param}: ${error.message}`, 'error'));
}

function startZNTuning() {
  if (isTuning) {
    refs.status.set('RUNNING').then(() => {
      showStatus('znStatus', 'Tuning stopped', 'success');
      document.getElementById('znProgress').style.display = 'none';
      isTuning = false;
      updateZNTuningButton();
    });
  } else {
    refs.status.set('TUNING').then(() => {
      showStatus('znStatus', 'Ziegler-Nichols tuning started!', 'success');
      document.getElementById('znProgress').style.display = 'block';
      isTuning = true;
      updateZNTuningButton();
      document.getElementById('currentKp').textContent = '0';
      document.getElementById('oscillationCount').textContent = '0';
      document.getElementById('oscillationPeriod').textContent = '0';
    });
  }
}

function updateZNTuningButton() {
  const btn = document.getElementById('znButton');
  if (isTuning) {
    btn.textContent = 'Stop Autotuning';
    btn.style.backgroundColor = '#dc3545';
  } else {
    btn.textContent = 'Start Autotuning';
    btn.style.backgroundColor = '#28a745';
  }
}

function showStatus(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `status ${type}`;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}
