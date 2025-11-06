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
      if (typeof callback === 'function') {
        callback(target);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

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
  loadFragment('#navbar-placeholder', 'navbar.html', initNavbar);
  loadFragment('#footer-placeholder', 'footer.html', initFooter);
});
