const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
 
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
 
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
      entries.forEach((entry) => {
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
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');

      const cards = document.querySelectorAll('.project-card');
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = 'block';
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = 'fadeInScale 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.92); }
        to   { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
 
    /* ============================================================
       PRODUCT CARDS → SCROLL TO PROJECTS + FILTER
       map: product card index (0-based) → filter category
    ============================================================ */
    const productCatMap = [
      'terazzo',   // 0: تيرازو مرمري فاخر
      'resin',     // 1: ريزن باوند
      'epoxy',     // 2: إيبوكسي صناعي
      'concrete',  // 3: خرسانة مطبوعة
      'stone',     // 4: حجر رملي
      'stone',     // 5: حجر جرانيت
      'stone',     // 6: حجر ديكوري أخضر
      'resin',     // 7: ريزن آرت
    ];

    document.querySelectorAll('.product-card').forEach((card, i) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const cat = productCatMap[i] || 'all';

        // فعّل الفلتر الصح
        const targetBtn = document.querySelector(`.filter-btn[onclick*="'${cat}'"]`);
        filterProjects(cat, targetBtn);

        // اسكرول smooth لقسم المشاريع
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          const top = projectsSection.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    /* ============================================================
       LAZY LOADING للصور
       - كل صورة بـ data-src تتحمل لما تظهر في الشاشة
    ============================================================ */
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            imgObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px 0px', // يبدأ يحمل قبل ما تظهر بـ 200px
        threshold: 0
      });

      lazyImages.forEach(img => imgObserver.observe(img));
    } else {
      // Fallback للمتصفحات القديمة
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }

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