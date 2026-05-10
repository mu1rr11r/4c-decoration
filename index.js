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
    const ham = document.getElementById('hamburger');
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
     ACTIVE NAV LINK
  ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  const prodTabs = document.querySelectorAll('.prod-tab');
 
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    navItems.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + cur) a.classList.add('active');
    });
 
    const visible = window.scrollY > 400;
    document.getElementById('back-to-top').classList.toggle('visible', visible);
    document.getElementById('whatsapp-btn').classList.toggle('visible', visible);
  });
 
  function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
 
  /* ============================================================
     REVEAL ANIMATION
  ============================================================ */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), 80); ro.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
 
  /* ============================================================
     FILTER PROJECTS
  ============================================================ */
  function filterProjects(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    let visible = 0;
    document.querySelectorAll('.project-card').forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.style.display = 'block';
        card.style.animation = 'none'; void card.offsetHeight;
        card.style.animation = 'fadeInScale 0.4s ease';
        visible++;
      } else { card.style.display = 'none'; }
    });
    document.getElementById('empty-state').style.display = visible === 0 ? 'block' : 'none';
  }
 
  function goToProjects(cat) {
    /* Update active tab in BOTH bars */
    document.querySelectorAll('#products-bar .prod-tab, .mobile-products-bar .prod-tab').forEach(t => t.classList.remove('active'));
 
    const filterBtn = document.querySelector(`.filter-btn[onclick*="'${cat}'"]`);
    filterProjects(cat, filterBtn);
 
    const sec = document.getElementById('projects');
    if (sec) setTimeout(() => window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' }), 50);
  }
 
  /* ============================================================
     LIGHTBOX
  ============================================================ */
  let lbImages = [], lbIdx = 0;
  function openLightbox(card) {
    const visible = [...document.querySelectorAll('.project-card')].filter(c => c.style.display !== 'none');
    lbImages = visible.map(c => ({ src: c.querySelector('img')?.src || '', caption: c.querySelector('.project-name')?.textContent || '' })).filter(i => i.src);
    const clicked = card.querySelector('img')?.src;
    lbIdx = lbImages.findIndex(i => i.src === clicked); if (lbIdx < 0) lbIdx = 0;
    renderLb(); document.getElementById('lightbox').classList.add('active'); document.body.style.overflow = 'hidden';
  }
  function renderLb() {
    const item = lbImages[lbIdx]; if (!item) return;
    const img = document.getElementById('lightbox-img');
    img.style.opacity = '0';
    setTimeout(() => { img.src = item.src; img.onload = () => img.style.opacity = '1'; if (img.complete) img.style.opacity = '1'; }, 100);
    document.getElementById('lightbox-caption').textContent = item.caption;
    document.getElementById('lightbox-counter').textContent = `${lbIdx + 1} / ${lbImages.length}`;
  }
  function closeLightbox(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('lightbox').classList.remove('active'); document.body.style.overflow = '';
  }
  function lightboxNav(dir, e) { if (e) e.stopPropagation(); lbIdx = (lbIdx + dir + lbImages.length) % lbImages.length; renderLb(); }
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox'); if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNav(-1, null);
    if (e.key === 'ArrowLeft')  lightboxNav(1, null);
  });
 
  /* ============================================================
     FORM SUBMIT
  ============================================================ */
  function submitForm() {
    const btn = document.querySelector('.form-submit');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    btn.style.background = 'var(--gray)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check-circle"></i> تم الإرسال بنجاح!';
      btn.style.background = '#22c55e';
      setTimeout(() => { btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الرسالة'; btn.style.background = ''; }, 3000);
    }, 1800);
  }