
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
 
    window.addEventListener('scroll', () => {
      // Sticky color change
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
 
      // Active link highlight
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) {
          current = sec.getAttribute('id');
        }
      });
      navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
      });
 
      // Back to top
      const btn = document.getElementById('back-to-top');
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });
 
    /* ============================================================
       MOBILE MENU
    ============================================================ */
    function toggleMenu() {
      const menu = document.getElementById('mobile-menu');
      const ham = document.getElementById('hamburger');
      menu.classList.toggle('open');
      ham.classList.toggle('open');
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
       SCROLL REVEAL ANIMATIONS
    ============================================================ */
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
 
    reveals.forEach(el => revealObserver.observe(el));
 
    /* ============================================================
       PROJECT FILTER
    ============================================================ */
    function filterProjects(cat, btn) {
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
 
      // Filter cards
      const cards = document.querySelectorAll('.project-card');
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = 'block';
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = 'fadeInScale 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    }
 
    // Add fadeInScale keyframe dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.92); }
        to   { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
 
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
       COUNTER ANIMATION (hero stats)
    ============================================================ */
    function animateCounter(el, target, suffix) {
      let count = 0;
      const step = Math.ceil(target / 50);
      const interval = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(interval); }
        el.textContent = '+' + count + (suffix || '');
      }, 30);
    }
 
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nums = entry.target.querySelectorAll('.stat-num');
          nums[0] && animateCounter(nums[0], 50, '');
          nums[1] && animateCounter(nums[1], 5, '');
          nums[2] && animateCounter(nums[2], 40, '');
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
 
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);
