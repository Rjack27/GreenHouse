window.addEventListener('load', () => {
  const hero = document.querySelector('.hero');
  hero.classList.add('visible');

  // Set gambar latar belakang berganti
  const images = [
    'img/Tanaman.jpg',
    'img/Selada.jpg',
    'img/Pakcoy.jpg'
  ];

  let current = 0;

  function changeBackground() {
    hero.style.opacity = 0; // mulai fade out
    setTimeout(() => {
      current = (current + 1) % images.length;
      hero.style.backgroundImage = `url(${images[current]})`;
      hero.style.opacity = 1; // fade in gambar baru
    }, 1000); // sesuai dengan durasi transisi CSS
  }

  // Set background awal
  hero.style.backgroundImage = `url(${images[0]})`;

  // Ganti gambar tiap 5 detik
  setInterval(changeBackground, 5000);

  // Jalankan animasi scroll pertama kali saat halaman dimuat
  handleScrollAnimation();
});

function handleScrollAnimation() {
  const sections = document.querySelectorAll('#tentangKami, #timKami');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      section.classList.add('visible');
    }
  });
}

// Event listener untuk animasi scroll
window.addEventListener('scroll', handleScrollAnimation);
