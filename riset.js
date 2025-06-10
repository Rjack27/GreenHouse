document.addEventListener('DOMContentLoaded', () => {
  const tombol = document.getElementById('lihatRiset');
  const info = document.getElementById('infoRiset');

  const proyek = [
    "Pengembangan sistem pemantauan kelembaban tanah otomatis berbasis IoT.",
    "Riset AI untuk prediksi penyakit tanaman sejak dini.",
    "Eksperimen pemanfaatan drone dalam pemetaan lahan pertanian.",
    "Kerja sama dengan universitas lokal untuk riset pupuk organik cair dari limbah organik."
  ];

  tombol.addEventListener('click', () => {
    const hasil = proyek[Math.floor(Math.random() * proyek.length)];
    info.textContent = hasil;
    info.classList.remove('d-none');
  });
});
