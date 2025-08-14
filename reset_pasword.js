import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAL3l3Fb9_Q1CAkjwxEBvG6Tb1W-HJwUCI",
  authDomain: "hqchulo.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Link reset password telah dikirim ke email Anda.");
    })
    .catch((error) => {
      alert("Gagal mengirim reset password: " + error.message);
    });
});
