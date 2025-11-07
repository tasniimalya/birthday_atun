// script.js — tombol kabur + quiz + confetti + audio
(function () {
  const btn = document.getElementById('trickButton');
  const content = document.getElementById('content');

  // confetti util (canvas-confetti)
  const canvas = document.getElementById('confettiCanvas');
  const confettiInstance = window.confetti && window.confetti.create
    ? window.confetti.create(canvas, { resize: true, useWorker: true })
    : null;

  // helper: explode confetti safely
  function boom(count = 150, spread = 120, y = 0.6) {
    if (!confettiInstance) return;
    confettiInstance({
      particleCount: count,
      spread,
      origin: { y }
    });
  }

  // play short sound (best-effort, might be blocked until user interacts)
  function playSound(url) {
    try {
      const a = new Audio(url);
      a.volume = 0.45;
      a.play().catch(()=>{/* ignore play block */});
    } catch (e) { /* ignore */ }
  }

  // Stronger escape behavior: faster and slightly smarter so it's chaseable but spicy
  function runAway(el) {
    const padding = 24; // keep inside viewport
    const maxX = Math.max(window.innerWidth - el.offsetWidth - padding, 0);
    const maxY = Math.max(window.innerHeight - el.offsetHeight - padding, 0);

    // bias to move away from cursor: pick far position
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);

    // quick small animation
    el.style.transition = 'left 0.18s ease, top 0.18s ease, transform 0.08s linear';
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    // tiny "jump" effect
    el.style.transform = 'translateY(-4px)';
    setTimeout(()=> el.style.transform = 'translateY(0)', 180);
  }

  // ensure button initially centered in container
  function centerButton() {
    const rect = btn.parentElement.getBoundingClientRect();
    btn.style.left = (rect.width/2 - btn.offsetWidth/2) + 'px';
    btn.style.top = '6px';
  }

  // increase difficulty if user tries many times
  let tryCount = 0;
  function onMouseEnter() {
    tryCount++;
    // make it run more aggressively if many attempts
    const loops = Math.min(1 + Math.floor(tryCount/2), 4);
    for (let i=0;i<loops;i++){
      // small timeout staggers movement so it's not instantaneous teleport-only
      setTimeout(()=> runAway(btn), i * 80);
    }
  }

  // allow touch to trigger the run-away in mobile as well
  btn.addEventListener('mouseenter', onMouseEnter);
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    onMouseEnter();
  }, {passive:false});

  // click: present quiz -> validate -> reveal content
  btn.addEventListener('click', () => {
    // prompt question (you already decided question = 20 + 20 x 3 + 2 x 3)
    const answer = prompt("Hitung: 20 + 20 x 3 + 2 x 3 = ?");
    // normalize
    if (answer !== null && answer.toString().trim() === "86") {
      // success
      btn.style.display = 'none';
      centerConfettiThenOpen();
    } else {
      // wrong
      tryCount++;
      alert("SALAH woyy! Coba lagi 😏 (ingat prioritas operasi ya)");
      boom(90, 110, 0.6);
      playSound('https://freesound.org/data/previews/523/523315_10319117-lq.mp3'); // optional
      // small punishment move
      runAway(btn);
    }
  });

  // center confetti and show content (play audio)
  function centerConfettiThenOpen(){
    boom(500, 360, 0.6);
    playSound('https://freesound.org/data/previews/523/523315_10319117-lq.mp3');

    setTimeout(() => {
      content.style.display = 'block';
      // smooth scroll content into view for small screens
      content.scrollIntoView({behavior: 'smooth', block: 'center'});
    }, 350);
  }

  // on resize, keep button inside viewport
  window.addEventListener('resize', () => {
    const maxX = Math.max(window.innerWidth - btn.offsetWidth - 24, 0);
    const maxY = Math.max(window.innerHeight - btn.offsetHeight - 24, 0);
    const curLeft = parseFloat(btn.style.left || 0);
    const curTop = parseFloat(btn.style.top || 0);
    if (curLeft > maxX) btn.style.left = maxX + 'px';
    if (curTop > maxY) btn.style.top = maxY + 'px';
  });

  // init
  setTimeout(() => {
    // position button relative to parent
    btn.style.position = 'absolute';
    centerButton();
  }, 60);

})();
