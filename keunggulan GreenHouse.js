document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('keunggulan-content');
  const menuItems = document.querySelectorAll('.dropdown-item');

  const kontenKeunggulan = {
    pertanian: `
      <h3>Pertanian Unggul</h3>
      <p>Desa kami memiliki lahan subur yang mendukung pertanian organik dan berkelanjutan. Produk unggulan seperti padi, sayuran, dan buah-buahan telah menembus pasar kota.</p>
    `,
    riset: `
      <h3>Riset dan Inovasi</h3>
      <p>Kolaborasi dengan universitas telah menghasilkan riset pertanian cerdas dan pengelolaan lingkungan yang efektif berbasis teknologi.</p>
    `,
    pariwisata: `
      <h3>Pariwisata Alam</h3>
      <p>Wisata alam seperti air terjun, kebun teh, dan kegiatan budaya menarik banyak pengunjung setiap tahun.</p>
    `
  };

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const key = item.dataset.content;
      contentArea.innerHTML = kontenKeunggulan[key] || '<p>Konten tidak ditemukan.</p>';
    });
  });
});
