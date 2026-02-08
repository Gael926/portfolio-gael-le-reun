document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log('[Portfolio] main.js loaded, prefersReducedMotion:', prefersReducedMotion);

  // --- 1. Robust Smooth Scroll Implementation ---
  const smoothScrollTo = (targetY, duration = 800) => {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    let startTime = null;

    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + diff * easedProgress);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  // Delegated Click Handler for all Anchor Links
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    if (!targetId.startsWith('#')) return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();

      const navbar = document.getElementById('navbar');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      smoothScrollTo(targetPosition);

      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    }
  });

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.add('nav-glass');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'nav-scrolled');
      } else {
        navbar.classList.remove('shadow-lg', 'nav-scrolled');
      }
    });
  }

  // --- Interactive Effects ---
  // These are user-triggered (mouse-driven) so they run regardless of reduced motion

  // (A) Hero Mouse-Following Ambient Glow
  const heroGlowArea = document.getElementById('heroGlowArea');
  const heroGlow = document.getElementById('heroGlow');
  console.log('[Portfolio] Hero glow setup:', { heroGlowArea: !!heroGlowArea, heroGlow: !!heroGlow });
  if (heroGlowArea && heroGlow) {
    heroGlowArea.addEventListener('mousemove', (e) => {
      const rect = heroGlowArea.getBoundingClientRect();
      heroGlow.style.left = (e.clientX - rect.left) + 'px';
      heroGlow.style.top = (e.clientY - rect.top) + 'px';
      if (!heroGlow.classList.contains('active')) {
        heroGlow.classList.add('active');
      }
    });
    heroGlowArea.addEventListener('mouseleave', () => {
      heroGlow.classList.remove('active');
    });
  }

  // (B) Animated Stat Counters
  const counters = document.querySelectorAll('[data-counter]');
  console.log('[Portfolio] Counters found:', counters.length);
  if (counters.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2500;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // (C) 3D Tilt Effect on Project Cards
  const tiltCards = document.querySelectorAll('.tilt-card');
  console.log('[Portfolio] Tilt cards found:', tiltCards.length);
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // Scroll Animations (skip if reduced motion)
  if (!prefersReducedMotion) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  } else {
    // Immediately show all elements for reduced motion users
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.remove('opacity-0', 'translate-y-8');
    });
  }
});

/**
 * Translation System
 */
let currentLang = localStorage.getItem('lang') || 'fr';

function toggleLanguage() {
  const newLang = currentLang === 'fr' ? 'en' : 'fr';
  setLanguage(newLang);
}

function initTranslations() {
  applyTranslations(currentLang);
  updateLangFlag();
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
  updateLangFlag();
}

function applyTranslations(lang) {
  if (typeof translations === 'undefined') {
    console.warn('Translations not loaded');
    return;
  }

  const langData = translations[lang];
  if (!langData) {
    console.warn(`Language ${lang} not found`);
    return;
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (langData[key]) {
      el.textContent = langData[key];
    }
  });

  const pageTitle = document.querySelector('title[data-i18n]');
  if (pageTitle) {
    const key = pageTitle.getAttribute('data-i18n');
    if (langData[key]) {
      document.title = langData[key];
    }
  }

  document.documentElement.lang = lang;
}

function updateLangFlag() {
  const targetLang = currentLang === 'fr' ? 'EN' : 'FR';

  const labelEl = document.getElementById('langLabel');
  if (labelEl) labelEl.textContent = targetLang;

  const mobileLabelEl = document.getElementById('mobileLangLabel');
  if (mobileLabelEl) mobileLabelEl.textContent = targetLang;

  const btns = [document.getElementById('langToggle'), document.getElementById('mobileLangToggle')];
  btns.forEach(btn => {
    if (btn) {
      btn.title = currentLang === 'fr' ? 'Switch to English' : 'Passer en français';
    }
  });
}

window.initTranslations = initTranslations;
window.setLanguage = setLanguage;
window.toggleLanguage = toggleLanguage;
