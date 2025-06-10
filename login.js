document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Mencegah reload form

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');

  // Contoh validasi login statis
  if (Email === 'admin' && Password === '12345') {
    window.location.href = "index.html"; // Redirect ke halaman utama
  } else {
    errorMsg.textContent = "Email atau Password salah!";
  }
});
