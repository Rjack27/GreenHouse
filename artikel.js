const artikelData = [
  {
    judul: "Teknologi GreenHouse Modern",
    isi: "Menciptakan kondisi iklim yang optimal merupakan salah satu kunci dalam budidaya tanaman hortikultura, dan hal tersebut merupakan salah satu manfaat utama greenhouse.",
    gambar: "img/teknologi.jpg"
  },
  {
    judul: "Budidaya Sayur Organik",
    isi: "Dengan sistem tanam hidroponik dalam greenhouse, hasil panen lebih cepat dan bebas pestisida.",
    gambar: "img/budidaya sayur organic.jpg"
  },
  {
    judul: "Peluang Bisnis GreenHouse",
    isi: "Masyarakat mulai melirik bisnis rumah kaca untuk ketahanan pangan dan peningkatan ekonomi.",
    gambar: "img/bisnis.jpg"
  }
];

const artikelList = document.getElementById("artikel-list");

artikelData.forEach((artikel) => {
  const col = document.createElement("div");
  col.className = "col-md-4";

  col.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img src="${artikel.gambar}" class="card-img-top" alt="Gambar Artikel">
      <div class="card-body">
        <h5 class="card-title">${artikel.judul}</h5>
        <p class="card-text">${artikel.isi}</p>
      </div>
    </div>
  `;

  artikelList.appendChild(col);
});
