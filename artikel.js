const artikelData = [
  {
    judul: "Pengertian dan Berbagai Manfaat Greenhouse untuk Tanaman",
    gambar: "img/Greenhouse.jpeg",
    link: "https://www.gramedia.com/literasi/manfaat-greenhouse/?srsltid=AfmBOoqApDqyil_epKa90aLVrO3Cr_JAv33ABYRAV0IW3KOZNl3p-fC5"
  },
  {
    judul: "Mengenal Lebih Jauh dan Monitoring Pembangunan Smart Greenhouse",
    gambar: "img/Smart.jpg",
    link: "https://dinkpp.lamongankab.go.id/posting/19631#:~:text=Dengan%20sistem%20ini%2C%20petani%20atau,air%2C%20serta%20peningkatan%20hasil%20pertanian."
  },
  {
    judul: "Pengertian Greenhouse Lengkap dengan Fungsi, Manfaat, dan Ketentuannya",
    gambar: "img/house.jpeg",
    link: "https://www.detik.com/jogja/berita/d-7543040/pengertian-greenhouse-lengkap-dengan-fungsi-manfaat-dan-ketentuannya"
  },
  {
    judul: "Teknologi Pertanian Modern: Smart Farming dan Internet of Things",
    gambar: "img/Smart Farming.jpg",
    link: "https://www.bpjsketenagakerjaan.go.id/artikel/17587/artikel-smart-farming,-apa-itu-dan-bagaimana-aplikasinya-di-indonesia#:~:text=Smart%20farming%20atau%20pertanian%20pintar,internet%20of%20things%20(IoT)."
  },
  {
    judul: "Cara Kerja Greenhouse Otomatis dan Manfaatnya bagi Petani",
    gambar: "img/smart-greenhouse.jpg",
    link: "https://www.linknet.id/article/contoh-iot-dalam-bidang-pertanian#:~:text=3.%20Smart%20greenhouse,maupun%20memberikan%20pupuk%20dan%20pestisida."
  },
  {
    judul: "IoT dalam Bidang Pertanian untuk Smart Farming",
    gambar: "img/industri.jpg",
    link: "https://www.cloudcomputing.id/pengetahuan-dasar/iot-dalam-bidang-pertanian#:~:text=Salah%20satu%20terobosan%20terbaru%20dalam,Livestock%20management:"
  },
  {
    judul: "4 Langkah Ciptakan Greenhouse Mini, Inovasi Berkebun di Lahan Sempit",
    gambar: "img/tips.jpg",
    link: "https://www.idntimes.com/life/diy/greenhouse-mini-c1c2-01-pqvh4-8ds8hz"
  },
  {
    judul: "Peran Teknologi IoT dalam Smart Green House untuk Tanaman",
    gambar: "img/peran.png",
    link: "https://kumparan.com/firmawatinini/peran-teknologi-iot-dalam-smart-green-house-untuk-tanaman-22q2FovkTs4"
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
