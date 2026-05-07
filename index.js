/* ══ BURGER ══ */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
function closeMobile() {
  burger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
 
/* ══ NAVBAR SCROLL ══ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
});
 
/* ══ ACTIVE NAV ══ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
function updateActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
 
/* ══ SCROLL REVEAL ══ */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));
 
/* ══ COUNTER ANIMATION ══ */
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1800;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (suffix === '+' ? '+' : '') + Math.floor(eased * target) + (suffix === 'K' ? 'K' : suffix === '+K' ? '' : '');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = suffix;
  }
  requestAnimationFrame(update);
}
 
const statNums = document.querySelectorAll('.stat-num');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const txt = el.textContent;
      if (txt.includes('K')) animateCounter(el, 1, '+1K');
      else if (txt.includes('500')) animateCounter(el, 500, '+500');
      else if (txt.includes('200')) animateCounter(el, 200, '+200');
      else if (txt.includes('15')) animateCounter(el, 15, '+15');
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObs.observe(el));
 
/* ══ FORM SUBMIT ══ */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target;
  btn.textContent = '✅ تم الإرسال بنجاح!';
  btn.style.background = 'linear-gradient(135deg,#2ecc71,#27ae60)';
  setTimeout(() => {
    btn.textContent = 'إرسال الطلب ←';
    btn.style.background = '';
  }, 3000);
}
 
/* ══ SMOOTH ANCHOR ══ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});