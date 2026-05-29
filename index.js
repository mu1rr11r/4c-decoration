/* ============================================================
   4C CONSTRUCTION — index.js
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
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('mobile-overlay');
  var ham     = document.getElementById('hamburger');
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
  var section = document.getElementById(sectionId);
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   SERVICES FILTER
============================================================ */
var catIndexMap = {
  terazzo:0, microcement:1, resinbound:2, resinfloor:3,
  epoxy:4, courts:5, concrete:6, pools:7,
  gardens:8, decor:9, stone:10, resintables:11
};

function filterServices(cat) {
  var allCards = document.querySelectorAll('.service-card');

  document.querySelectorAll('.prod-tab').forEach(function(tab) {
    tab.classList.toggle('active', tab.dataset.cat === cat);
  });

  if (!cat) {
    allCards.forEach(function(c) {
      c.style.display  = '';
      c.style.opacity  = '1';
      c.style.transform = '';
    });
    return;
  }

  var targetIdx = catIndexMap[cat];

  allCards.forEach(function(c, i) {
    if (i === targetIdx) {
      c.style.display   = '';
      c.style.opacity   = '1';
      c.style.transform = '';
    } else {
      c.style.display = 'none';
    }
  });

  setTimeout(function() { scrollToSection('services'); }, 80);
}

/* ============================================================
   SIDEBAR VISIBILITY — فقط في الهوم
============================================================ */
function updateSidebarVisibility() {
  var homeSection = document.getElementById('home');
  var sidebar     = document.getElementById('sidebar');
  var scrollY     = window.scrollY;
  var homeBottom  = homeSection ? homeSection.offsetTop + homeSection.offsetHeight * 0.5 : 600;

  var isMobile = window.innerWidth <= 900;

  if (isMobile) {
    sidebar.classList.remove('visible');
    document.body.classList.remove('no-sidebar');
    document.body.classList.remove('sidebar-collapsed');
    return;
  }

  if (scrollY < homeBottom) {
    sidebar.classList.add('visible');
    document.body.classList.remove('no-sidebar');
  } else {
    sidebar.classList.remove('visible');
    document.body.classList.add('no-sidebar');
  }
}

/* ============================================================
   ACTIVE NAV + SCROLL BEHAVIOR
============================================================ */
var sections = document.querySelectorAll('section[id]');
var navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', function() {
  var currentScrollY = window.scrollY;

  updateSidebarVisibility();

  var cur = '';
  sections.forEach(function(s) {
    if (currentScrollY >= s.offsetTop - 120) cur = s.id;
  });
  navItems.forEach(function(a) {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + cur) a.classList.add('active');
  });

  var visible = currentScrollY > 400;
  document.getElementById('back-to-top').classList.toggle('visible', visible);
  document.getElementById('whatsapp-btn').classList.toggle('visible', visible);
});

window.addEventListener('DOMContentLoaded', function() {
  updateSidebarVisibility();
});

window.addEventListener('resize', function() {
  updateSidebarVisibility();
});

/* ============================================================
   REVEAL ANIMATION
============================================================ */
var ro = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      setTimeout(function() { e.target.classList.add('visible'); }, 80);
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(function(el) { ro.observe(el); });

/* ============================================================
   LIGHTBOX
============================================================ */
var lbImages = [], lbIdx = 0;

function openLightbox(card) {
  var visible = [];
  document.querySelectorAll('.project-card').forEach(function(c) {
    if (c.style.display !== 'none') visible.push(c);
  });

  lbImages = [];
  visible.forEach(function(c) {
    var img = c.querySelector('img');
    var name = c.querySelector('.project-name');
    if (img) {
      lbImages.push({
        src: img.src || '',
        caption: name ? name.textContent : ''
      });
    }
  });

  var clickedImg = card.querySelector('img');
  var clickedSrc = clickedImg ? clickedImg.src : '';
  lbIdx = lbImages.findIndex(function(i) { return i.src === clickedSrc; });
  if (lbIdx < 0) lbIdx = 0;

  renderLb();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderLb() {
  var item = lbImages[lbIdx];
  if (!item) return;

  var img = document.getElementById('lightbox-img');
  img.style.opacity = '0';
  setTimeout(function() {
    img.src = item.src;
    img.onload = function() { img.style.opacity = '1'; };
    if (img.complete) img.style.opacity = '1';
  }, 100);

  document.getElementById('lightbox-caption').textContent = item.caption;
  document.getElementById('lightbox-counter').textContent = (lbIdx + 1) + ' / ' + lbImages.length;
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

document.addEventListener('keydown', function(e) {
  var lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowRight')  lightboxNav(-1, null);
  if (e.key === 'ArrowLeft')   lightboxNav(1, null);
});

/* ============================================================
   CONTACT FORM
============================================================ */
var form = document.getElementById('contactForm');
var successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  var response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: new FormData(form)
  });

  var result = await response.json();

  if (result.success) {
    successMessage.style.display = 'block';
    form.reset();
    setTimeout(function() { successMessage.style.display = 'none'; }, 3000);
  } else {
    alert('حدث خطأ أثناء الإرسال');
  }
});