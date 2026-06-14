// ═══ SCROLL ANIMATIONS ═══
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 80);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ═══ NAVBAR SCROLL ═══
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ═══ COUNTER ANIMATION ═══
function animateCount(el, target, suffix = '', duration = 1800) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = isFloat ? (target * ease).toFixed(1) : Math.floor(target * ease);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCount(el, target, suffix);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-row');
if (statsSection) statsObserver.observe(statsSection);

// ═══ SMOOTH SCROLL ═══
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ═══ AR ARROW ANIMATION ═══
let angle = 0;
const arArrow = document.querySelector('.ar-arrow');
if (arArrow) {
  setInterval(() => {
    angle = (angle + 15) % 360;
    arArrow.style.transform = `rotate(${angle}deg)`;
  }, 1500);
}
