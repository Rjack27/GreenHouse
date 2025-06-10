document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('lihatInfo');
  const faktaBox = document.getElementById('fakta');

  const faktaList = [
    "Sistem hidroponik dapat menghemat hingga 90% air dibanding pertanian konvensional.",
    "Tanaman di GreenHouse tumbuh 30% lebih cepat karena lingkungan yang dikontrol.",
    "Pertanian vertikal memungkinkan panen sepanjang tahun tanpa tergantung musim."
  ];

  button.addEventListener('click', () => {
    const randomFakta = faktaList[Math.floor(Math.random() * faktaList.length)];
    faktaBox.textContent = randomFakta;
    faktaBox.classList.remove('d-none');
  });
});
