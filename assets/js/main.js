let currentLanguage = 'fr';

function loadFragment(selector, url, callback) {
  const target = document.querySelector(selector);
  if (!target) return;

  fetch(url, { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Impossible de charger ${url}`);
      }
      return response.text();
    })
    .then((html) => {
      target.innerHTML = html;
      applyTranslations(target);
      initLanguageSwitch(target);
      updateLanguageSwitchState();
      if (typeof callback === 'function') {
        callback(target);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function initLanguageSwitch(scope = document) {
  const buttons = scope.querySelectorAll('[data-lang-switch]');
  buttons.forEach((button) => {
    if (button.dataset.langBound === 'true') return;
    button.dataset.langBound = 'true';
    button.addEventListener('click', () => {
      const lang = button.getAttribute('data-lang-switch');
      setLanguage(lang);
    });
  });

  const toggles = scope.querySelectorAll('[data-lang-toggle]');
  toggles.forEach((toggle) => {
    if (toggle.dataset.langBound === 'true') return;
    toggle.dataset.langBound = 'true';
    toggle.addEventListener('click', () => {
      const nextLang = currentLanguage === 'fr' ? 'en' : 'fr';
      setLanguage(nextLang);
    });
  });
}

function applyTranslations(scope = document) {
  if (typeof translations === 'undefined') return;
  const elements = scope.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const translation = translations[currentLanguage]?.[key];
    if (translation !== undefined) {
      el.innerHTML = translation;
    }
  });
}

function updateLanguageSwitchState() {
  const buttons = document.querySelectorAll('[data-lang-switch]');
  buttons.forEach((button) => {
    const lang = button.getAttribute('data-lang-switch');
    const isActive = lang === currentLanguage;
    button.classList.toggle('bg-blue-600', isActive);
    button.classList.toggle('text-white', isActive);
    button.classList.toggle('text-gray-600', !isActive);
  });
}

function setLanguage(lang) {
  if (typeof translations === 'undefined' || !translations[lang]) {
    return;
  }
  currentLanguage = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('lang', lang);
  applyTranslations();
  updateLanguageSwitchState();
}

window.setLanguage = setLanguage;

function initNavbar(container) {
  const menuButton = container.querySelector('#mobileMenuButton');
  const mobileMenu = container.querySelector('#mobileMenu');
  const desktopNav = container.querySelector('[data-nav="desktop"]');
  const mobileNav = container.querySelector('[data-nav="mobile"]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const markActiveLink = (links, options) => {
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.endsWith('.html')) {
        return;
      }

      const isActive = href === currentPath || (href.endsWith('index.html') && currentPath === '');

      options.activeClasses.forEach((cls) => {
        link.classList.toggle(cls, isActive);
      });
      options.inactiveClasses.forEach((cls) => {
        link.classList.toggle(cls, !isActive);
      });
    });
  };

  if (desktopNav) {
    markActiveLink(desktopNav.querySelectorAll('a'), {
      activeClasses: ['text-blue-600', 'border-blue-600'],
      inactiveClasses: ['text-gray-700', 'border-transparent'],
    });
  }

  if (mobileNav) {
    markActiveLink(mobileNav.querySelectorAll('a'), {
      activeClasses: ['text-blue-600', 'bg-blue-50'],
      inactiveClasses: ['text-gray-700', 'bg-transparent'],
    });
  }
}

function initFooter(container) {
  const yearSpan = container.querySelector('[data-year]');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const storedLang = localStorage.getItem('lang');
  if (typeof translations !== 'undefined' && storedLang && translations[storedLang]) {
    currentLanguage = storedLang;
  } else {
    currentLanguage = 'fr';
  }
  setLanguage(currentLanguage);
  initLanguageSwitch(document);

  loadFragment('#navbar-placeholder', 'navbar.html', initNavbar);
  loadFragment('#footer-placeholder', 'footer.html', initFooter);
});
