(function () {
  const btn = document.getElementById('trickButton');
  const content = document.getElementById('content');

  const canvas = document.getElementById('confettiCanvas');
  const confettiInstance = window.confetti && window.confetti.create
    ? window.confetti.create(canvas, { resize: true, useWorker: true })
    : null;

  function boom(count = 150, spread = 120, y = 0.6) {
    if (!confettiInstance) return;
    confettiInstance({
      particleCount: count,
      spread,
      origin: { y }
    });
  }

  function playSound(url) {
    try {
      const a = new Audio(url);
      a.volume = 0.45;
      a.play().catch(()=>{});
    } catch (e) { }
  }

  function runAway(el) {
    const padding = 24;
    const maxX = window.innerWidth - el.offsetWidth - padding;
    const maxY = window.innerHeight - el.offsetHeight - padding;

    // Friendly: ±150px dari posisi sekarang
    const x = Math.min(Math.max(el.offsetLeft + (Math.random()*300 - 150), padding), maxX);
    const y = Math.min(Math.max(el.offsetTop + (Math.random()*300 - 150), padding), maxY);

    el.style.transition = 'left 0.3s ease, top 0.3s ease, transform 0.12s linear';
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    el.style.transform = 'translateY(-4px)';
    setTimeout(()=> el.style.transform = 'translateY(0)', 180);
  }

  let tryCount = 0;
  function onMouseEnter() {
    tryCount++;
    runAway(btn); // cuma 1x per hover friendly
  }

  btn.addEventListener('mouseenter', onMouseEnter);
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    onMouseEnter();
  }, {passive:false});

  btn.addEventListener('click', () => {
    const answer = prompt("Hitung: 20 + 20 x 3 + 2 x 3 = ?");
    if (answer !== null && answer.toString().trim() === "86") {
      btn.style.display = 'none';
      boom(500, 360, 0.6);
      playSound('https://freesound.org/data/previews/523/523315_10319117-lq.mp3');
      content.style.display = 'block';
      setTimeout(()=> content.classList.add('show'), 50);
      content.scrollIntoView({behavior: 'smooth', block: 'center'});
    } else {
      tryCount++;
      alert("SALAH 😏 Coba lagi!");
      boom(90, 110, 0.6);
      playSound('https://freesound.org/data/previews/523/523315_10319117-lq.mp3');
      runAway(btn);
    }
  });

  window.addEventListener('resize', () => {
    const maxX = window.innerWidth - btn.offsetWidth - 24;
    const maxY = window.innerHeight - btn.offsetHeight - 24;
    const curLeft = parseFloat(btn.style.left || 0);
    const curTop = parseFloat(btn.style.top || 0);
    if (curLeft > maxX) btn.style.left = maxX + 'px';
    if (curTop > maxY) btn.style.top = maxY + 'px';
  });

})();
