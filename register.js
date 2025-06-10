document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorMsg = document.getElementById("error-msg");

  if (password !== confirmPassword) {
    errorMsg.textContent = "Password tidak cocok!";
    return;
  }

  // Simulasi registrasi berhasil
  alert("Registrasi berhasil untuk " + name);
  window.location.href = "login.html"; // Redirect ke halaman login
});
