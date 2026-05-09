/* ============================================================
   index.js — 4C Decoration
============================================================ */

/* ============================================================
   NAVBAR SCROLL
============================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
});

/* ============================================================
   MOBILE MENU
============================================================ */
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* ============================================================
   BACK TO TOP
============================================================ */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   PROJECT FILTER
============================================================ */
const animStyle = document.createElement('style');
animStyle.textContent = `
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(animStyle);

function filterProjects(cat, btn) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  let visible = 0;
  document.querySelectorAll('.project-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = 'block';
      card.style.animation = 'none';
      void card.offsetHeight;
      card.style.animation = 'fadeInScale 0.4s ease';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  const empty = document.getElementById('empty-state');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}

/* ============================================================
   GO TO PROJECTS FROM SERVICES (click service card)
============================================================ */
function goToProjects(cat) {
  // Find matching filter button
  const filterBtn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
  filterProjects(cat, filterBtn);

  // Smooth scroll to projects section
  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    setTimeout(() => {
      const top = projectsSection.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 50);
  }
}

/* ============================================================
   LIGHTBOX
============================================================ */
let lightboxImages = [];
let lightboxIndex  = 0;

function buildImageList(activeCategory) {
  // Collect all visible project cards
  const cards = [...document.querySelectorAll('.project-card')]
    .filter(c => c.style.display !== 'none');

  lightboxImages = cards.map(card => {
    const img     = card.querySelector('.project-bg img');
    const caption = card.querySelector('.project-name')?.textContent || '';
    return { src: img ? img.src : '', caption };
  }).filter(i => i.src);

  return cards;
}

function openLightbox(card) {
  const visibleCards = buildImageList();
  const img  = card.querySelector('.project-bg img');
  if (!img) return;

  // Find index of clicked card
  const clickedSrc = img.src;
  lightboxIndex = lightboxImages.findIndex(i => i.src === clickedSrc);
  if (lightboxIndex === -1) lightboxIndex = 0;

  renderLightboxImage();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderLightboxImage() {
  const item = lightboxImages[lightboxIndex];
  if (!item) return;

  const lbImg = document.getElementById('lightbox-img');
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = item.src;
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
    // In case already cached
    if (lbImg.complete) lbImg.style.opacity = '1';
  }, 120);

  document.getElementById('lightbox-caption').textContent = item.caption;
  document.getElementById('lightbox-counter').textContent =
    `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function closeLightbox(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function lightboxNav(dir, e) {
  if (e) e.stopPropagation();
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  renderLightboxImage();
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape') { closeLightbox(); }
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   lightboxNav(-1, null);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown')  lightboxNav(1, null);
});

// Touch / swipe support for lightbox
let touchStartX = 0;
document.getElementById('lightbox')?.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});
document.getElementById('lightbox')?.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) lightboxNav(diff > 0 ? 1 : -1, null);
});

/* ============================================================
   CONTACT FORM SUBMIT (demo)
============================================================ */
function submitForm() {
  const btn = document.querySelector('.form-submit');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
  btn.style.background = 'var(--gray)';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check-circle"></i> تم الإرسال بنجاح!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الرسالة';
      btn.style.background = '';
    }, 3000);
  }, 1800);
}

/* ============================================================
   COUNTER ANIMATION
============================================================ */
function animateCounter(el, target) {
  let count = 0;
  const step = Math.ceil(target / 50);
  const interval = setInterval(() => {
    count += step;
    if (count >= target) { count = target; clearInterval(interval); }
    el.textContent = '+' + count;
  }, 30);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      if (nums[0]) animateCounter(nums[0], 50);
      if (nums[1]) animateCounter(nums[1], 5);
      if (nums[2]) animateCounter(nums[2], 40);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);