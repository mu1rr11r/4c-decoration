/* ============================================================
   4C DECORATION — index.js (النسخة الكاملة مع فلترة الخدمات)
============================================================ */

/* ============================================================
   SIDEBAR TOGGLE (Desktop)
============================================================ */
function toggleSidebar() {
  document.body.classList.toggle('sidebar-collapsed');
  document.getElementById('sidebar').classList.toggle('collapsed');
}

/* ============================================================
   MOBILE SIDEBAR
============================================================ */
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  const ham     = document.getElementById('hamburger');
  sidebar.classList.toggle('mobile-open');
  overlay.classList.toggle('open');
  ham.classList.toggle('open');
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('mobile-overlay').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* ============================================================
   SCROLL UTILITIES
============================================================ */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   SERVICES FILTER — الفلترة بالتاب
============================================================ */
const catIndexMap = {
  terazzo:    0,
  microcement:1,
  resinbound: 2,
  resinfloor: 3,
  epoxy:      4,
  courts:     5,
  concrete:   6,
  pools:      7,
  gardens:    8,
  decor:      9,
  stone:      10,
  resintables:11
};

function filterServices(cat) {
  const allCards = document.querySelectorAll('.service-card');

  /* تحديث حالة التابات (active) في البارين */
  document.querySelectorAll('.prod-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.cat === cat);
  });

  /* لو cat فاضي → اظهر كل الكاردز */
  if (!cat) {
    allCards.forEach(c => {
      c.style.display  = '';
      c.style.opacity  = '1';
      c.style.transform = '';
    });
    return;
  }

  const targetIdx = catIndexMap[cat];

  allCards.forEach((c, i) => {
    if (i === targetIdx) {
      c.style.display   = '';
      c.style.opacity   = '1';
      c.style.transform = '';
    } else {
      c.style.display = 'none';
    }
  });

  /* انتقل لقسم الخدمات بعد الفلترة */
  setTimeout(() => scrollToSection('services'), 80);
}

/* ============================================================
   ACTIVE NAV + SCROLL BEHAVIOR
============================================================ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const sidebar = document.getElementById('sidebar');

  if (currentScrollY <= 150) {
    document.body.classList.remove('sidebar-hidden');
    sidebar.classList.remove('hidden');
  } else if (currentScrollY > lastScrollY) {
    document.body.classList.add('sidebar-hidden');
    sidebar.classList.add('hidden');
  }

  let cur = '';
  sections.forEach(s => {
    if (currentScrollY >= s.offsetTop - 120) cur = s.id;
  });
  navItems.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + cur) a.classList.add('active');
  });

  const visible = currentScrollY > 400;
  document.getElementById('back-to-top').classList.toggle('visible', visible);
  document.getElementById('whatsapp-btn').classList.toggle('visible', visible);

  lastScrollY = currentScrollY;
});

/* ============================================================
   REVEAL ANIMATION
============================================================ */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), 80);
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ============================================================
   LIGHTBOX
============================================================ */
let lbImages = [], lbIdx = 0;

function openLightbox(card) {
  const visible = [...document.querySelectorAll('.project-card')]
    .filter(c => c.style.display !== 'none');

  lbImages = visible
    .map(c => ({
      src:     c.querySelector('img')?.src || '',
      caption: c.querySelector('.project-name')?.textContent || ''
    }))
    .filter(i => i.src);

  const clicked = card.querySelector('img')?.src;
  lbIdx = lbImages.findIndex(i => i.src === clicked);
  if (lbIdx < 0) lbIdx = 0;

  renderLb();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderLb() {
  const item = lbImages[lbIdx];
  if (!item) return;

  const img = document.getElementById('lightbox-img');
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = item.src;
    img.onload = () => { img.style.opacity = '1'; };
    if (img.complete) img.style.opacity = '1';
  }, 100);

  document.getElementById('lightbox-caption').textContent  = item.caption;
  document.getElementById('lightbox-counter').textContent  = `${lbIdx + 1} / ${lbImages.length}`;
}

function closeLightbox(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function lightboxNav(dir, e) {
  if (e) e.stopPropagation();
  lbIdx = (lbIdx + dir + lbImages.length) % lbImages.length;
  renderLb();
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowRight')  lightboxNav(-1, null);
  if (e.key === 'ArrowLeft')   lightboxNav(1, null);
});

/* ============================================================
   CONTACT FORM
============================================================ */
const form           = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body:   new FormData(form)
  });

  const result = await response.json();

  if (result.success) {
    successMessage.style.display = 'block';
    form.reset();
    setTimeout(() => { successMessage.style.display = 'none'; }, 3000);
  } else {
    alert('حدث خطأ أثناء الإرسال');
  }
});