// ═══ STORE DATA FOR DEMO ═══
const STORES = {
  nike:     { name: 'Nike Store',  dist: '~48 metres', path: 'M 180,277 L 180,150 L 83,150 L 83,68',  dx: 83,  dy: 68  },
  zara:     { name: 'Zara',        dist: '~52 metres', path: 'M 180,277 L 180,150 L 276,150 L 276,68', dx: 276, dy: 68  },
  food:     { name: 'Food Court',  dist: '~38 metres', path: 'M 180,277 L 180,225 L 83,225',           dx: 83,  dy: 225 },
  cinema:   { name: 'Cinema',      dist: '~42 metres', path: 'M 180,277 L 180,225 L 276,225',          dx: 276, dy: 225 },
  atm:      { name: 'ATM Zone',    dist: '~22 metres', path: 'M 180,277 L 180,150 L 64,150',           dx: 64,  dy: 150 },
  pharmacy: { name: 'Pharmacy',    dist: '~25 metres', path: 'M 180,277 L 180,150 L 295,150',          dx: 295, dy: 150 },
};

function navigateTo(storeId) {
  const store = STORES[storeId];
  if (!store) return;

  const pathEl = document.getElementById('nav-path');
  const ringEl = document.getElementById('dest-ring');
  const dotEl  = document.getElementById('dest-dot');
  if (!pathEl || !ringEl || !dotEl) return;

  // Update path
  pathEl.setAttribute('d', store.path);
  const len = pathEl.getTotalLength();
  pathEl.style.strokeDasharray = len + ' ' + len;
  pathEl.style.strokeDashoffset = len;
  pathEl.style.opacity = '0';

  // Trigger draw animation (force reflow first)
  pathEl.getBoundingClientRect();
  pathEl.style.transition = 'stroke-dashoffset 0.75s ease-out, opacity 0.15s';
  pathEl.style.strokeDashoffset = '0';
  pathEl.style.opacity = '1';

  // Move destination ring + dot
  ringEl.setAttribute('cx', store.dx);
  ringEl.setAttribute('cy', store.dy);
  ringEl.style.opacity = '0';
  dotEl.setAttribute('cx', store.dx);
  dotEl.setAttribute('cy', store.dy);
  dotEl.style.opacity = '0';

  setTimeout(() => {
    ringEl.style.transition = 'opacity 0.3s';
    ringEl.style.opacity = '1';
    dotEl.style.transition = 'opacity 0.3s';
    dotEl.style.opacity = '1';
  }, 650);

  // Update info card
  document.getElementById('dest-name').textContent = store.name;
  document.getElementById('dest-dist').textContent = store.dist;

  // Highlight active store area
  const areas = { nike:'area-nike', zara:'area-zara', food:'area-food', cinema:'area-cinema', atm:'area-atm', pharmacy:'area-pharmacy' };
  Object.values(areas).forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.fill = 'rgba(59,111,240,0.05)'; el.style.stroke = 'rgba(59,111,240,0.15)'; }
  });
  const activeArea = document.getElementById(areas[storeId]);
  if (activeArea) { activeArea.style.fill = 'rgba(59,111,240,0.14)'; activeArea.style.stroke = 'rgba(59,111,240,0.5)'; }
}

// ═══ STORE BUTTON CLICKS ═══
document.querySelectorAll('.store-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.store-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    navigateTo(btn.dataset.store);
  });
});

// ═══ TAB SWITCHING ═══
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');

    // Re-trigger fade-up animations on newly visible cards
    document.querySelectorAll('#tab-' + btn.dataset.tab + ' .fade-up').forEach((el, i) => {
      el.classList.remove('in');
      setTimeout(() => el.classList.add('in'), i * 60);
    });
  });
});

// ═══ SCROLL ANIMATIONS ═══
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 70);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ═══ NAVBAR SCROLL ═══
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ═══ COUNTER ANIMATION ═══
function animateCount(el, target, suffix, duration) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const step = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = isFloat ? (target * ease).toFixed(1) : Math.floor(target * ease);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCount(el, target, suffix, 1600);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

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

// ═══ AUTO-CYCLE DEMO ON LOAD ═══
// Show nike path immediately when demo section enters view
const demoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => navigateTo('nike'), 400);
      demoObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const demoSection = document.getElementById('demo');
if (demoSection) demoObserver.observe(demoSection);
