  const tombol = document.getElementById('btn');

tombol.addEventListener('mouseover', () => {
  const x = Math.random() * (window.innerWidth - tombol.offsetWidth);
  const y = Math.random() * (window.innerHeight - tombol.offsetHeight);

  tombol.style.position = 'absolute';
  tombol.style.left = x + 'px';
  tombol.style.top = y + 'px';
  tombol.style.transition = '0.2s'; // speed kabur
});
