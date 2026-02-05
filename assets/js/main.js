document.addEventListener('DOMContentLoaded', () => {
  // Handle anchor clicks for closing mobile menu
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
    // Let the browser handle the smooth scroll via CSS
  });

  // Navbar Scroll Effect - Always visible with enhanced shadow on scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    // Always apply nav-glass for visibility
    navbar.classList.add('nav-glass');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'nav-scrolled');
      } else {
        navbar.classList.remove('shadow-lg', 'nav-scrolled');
      }
    });
  }

  // Scroll Animations (Intersection Observer)
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
});

/**
 * Translation System
 */
let currentLang = localStorage.getItem('lang') || 'fr';

/**
 * Toggle language between FR and EN
 * Called directly from navbar button onclick
 */
function toggleLanguage() {
  const newLang = currentLang === 'fr' ? 'en' : 'fr';
  setLanguage(newLang);
}

function initTranslations() {
  // Apply saved language
  applyTranslations(currentLang);
  // Update flag icon
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

  // Translate all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (langData[key]) {
      el.textContent = langData[key];
    }
  });

  // Update page title if applicable
  const pageTitle = document.querySelector('title[data-i18n]');
  if (pageTitle) {
    const key = pageTitle.getAttribute('data-i18n');
    if (langData[key]) {
      document.title = langData[key];
    }
  }

  // Update html lang attribute
  document.documentElement.lang = lang;
}

function updateLangFlag() {
  const targetLang = currentLang === 'fr' ? 'EN' : 'FR';

  // Update Desktop Label
  const labelEl = document.getElementById('langLabel');
  if (labelEl) labelEl.textContent = targetLang;

  // Update Mobile Label
  const mobileLabelEl = document.getElementById('mobileLangLabel');
  if (mobileLabelEl) mobileLabelEl.textContent = targetLang;

  const btns = [document.getElementById('langToggle'), document.getElementById('mobileLangToggle')];
  btns.forEach(btn => {
    if (btn) {
      btn.title = currentLang === 'fr' ? 'Switch to English' : 'Passer en français';
    }
  });
}

// Export for use by components.js
window.initTranslations = initTranslations;
window.setLanguage = setLanguage;
window.toggleLanguage = toggleLanguage;
