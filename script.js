const loader = document.getElementById('loader');
const header = document.getElementById('siteHeader');
const celebrateButton = document.getElementById('celebrateButton');
const finalButton = document.getElementById('finalButton');
const heroMedia = document.querySelector('[data-parallax]');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let confetti = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function launchConfetti(amount = 160) {
  const colors = ['#ead6a0', '#c6a15b', '#003b25', '#9a1720', '#f5efe3'];

  for (let i = 0; i < amount; i += 1) {
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: -30 - Math.random() * window.innerHeight * .35,
      w: 5 + Math.random() * 11,
      h: 3 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 1.8 + Math.random() * 4.6,
      drift: -1.8 + Math.random() * 3.6,
      rotate: Math.random() * Math.PI,
      spin: -.12 + Math.random() * .24,
      life: 180 + Math.random() * 120
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confetti = confetti.filter((piece) => piece.life > 0 && piece.y < window.innerHeight + 60);

  confetti.forEach((piece) => {
    piece.x += piece.drift + Math.sin(piece.y * .012);
    piece.y += piece.speed;
    piece.rotate += piece.spin;
    piece.life -= 1;

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotate);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
    ctx.restore();
  });

  requestAnimationFrame(drawConfetti);
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');

      const number = entry.target.querySelector('[data-count]');
      if (number) animateCount(number);

      observer.unobserve(entry.target);
    });
  }, { threshold: .16, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
}

function animateCount(element) {
  if (element.dataset.done) return;

  const target = Number(element.dataset.count);
  const start = performance.now();
  const duration = 1200;
  element.dataset.done = 'true';

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}

function updateParallax() {
  if (reducedMotion || !heroMedia) return;

  const shift = Math.min(window.scrollY * .12, 70);
  heroMedia.style.transform = `translateY(${shift}px) scale(1.04)`;
}

function celebrate(label) {
  launchConfetti(240);

  if (!label) return;

  const oldText = label.textContent;
  label.textContent = 'С днем рождения, Олег';
  window.setTimeout(() => {
    label.textContent = oldText;
  }, 1900);
}

window.addEventListener('load', () => {
  window.setTimeout(() => loader.classList.add('is-hidden'), 550);
  launchConfetti(90);
});

window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', () => {
  updateHeader();
  updateParallax();
}, { passive: true });

celebrateButton.addEventListener('click', () => celebrate(celebrateButton));
finalButton.addEventListener('click', () => celebrate(finalButton));

resizeCanvas();
drawConfetti();
initReveal();
updateHeader();
updateParallax();
