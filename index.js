window.addEventListener('load', () => {
  const hero = document.querySelector('.hero');
  hero.classList.add('visible');

  const images = [
    'img/Tanaman.jpg',
    'img/Selada.jpg',
    'img/Pakcoy.jpg'
  ];

  let current = 0;

  function changeBackground() {
    hero.style.opacity = 0;  // mulai fade out
    setTimeout(() => {
      current = (current + 1) % images.length;
      hero.style.backgroundImage = `url(${images[current]})`;
      hero.style.opacity = 1;  // fade in gambar baru
    }, 1000);  // waktu sesuai transition opacity
  }

  // Set background awal
  hero.style.backgroundImage = `url(${images[0]})`;

  // Ganti gambar tiap 5 detik
  setInterval(changeBackground, 5000);
});
