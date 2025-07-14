const artikelData = [
  {
    judul: "Pengertian dan Berbagai Manfaat Greenhouse untuk Tanaman ",
    gambar: "img/Greenhouse.jpeg",
    link: "https://www.gramedia.com/literasi/manfaat-greenhouse/?srsltid=AfmBOoqApDqyil_epKa90aLVrO3Cr_JAv33ABYRAV0IW3KOZNl3p-fC5"
  },
  {
    judul: "Mengenal Lebih Jauh dan Monitoring Pembanguna Smart Greenhouse",
    gambar: "img/Smart.jpg",
    link: "https://dinkpp.lamongankab.go.id/posting/19631#:~:text=Dengan%20sistem%20ini%2C%20petani%20atau,air%2C%20serta%20peningkatan%20hasil%20pertanian."
  },
  {
    judul: "Pengertian Greenhouse Lengkap dengan Fungsi, Manfaat, dan Ketentuannya",
    gambar: "img/house.jpeg",
    link: "https://www.detik.com/jogja/berita/d-7543040/pengertian-greenhouse-lengkap-dengan-fungsi-manfaat-dan-ketentuannya"
  }
];

const artikelList = document.getElementById("artikel-list");

artikelData.forEach(artikel => {
  const div = document.createElement("div");
  div.className = "artikel-item";
  div.innerHTML = `
    <img src="${artikel.gambar}" alt="${artikel.judul}" />
    <h3>${artikel.judul}</h3>
    <a href="${artikel.link}" target="_blank">Baca Selengkapnya</a>
  `;
  artikelList.appendChild(div);
});
