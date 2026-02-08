/**
 * Component Loader - Dynamically loads navbar and footer components
 * This script should be included in all pages that use shared components
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Load navbar
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        try {
            const response = await fetch('navbar.html');
            if (response.ok) {
                const html = await response.text();
                navbarPlaceholder.outerHTML = html;
                // Re-initialize mobile menu after loading navbar
                initMobileMenu();
                // Initialize navbar scroll effect
                initNavbarScrollEffect();
                // Re-initialize Lucide icons for navbar
                if (typeof lucide !== 'undefined') {
                    try { lucide.createIcons(); } catch(e) { console.warn('[Portfolio] Lucide navbar icons error:', e.message); }
                }
            }
        } catch (error) {
            console.error('Failed to load navbar:', error);
        }
    }

    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const response = await fetch('footer.html');
            if (response.ok) {
                const html = await response.text();
                footerPlaceholder.outerHTML = html;
                // Re-initialize Lucide icons for footer
                if (typeof lucide !== 'undefined') {
                    try { lucide.createIcons(); } catch(e) { console.warn('[Portfolio] Lucide footer icons error:', e.message); }
                }
            }
        } catch (error) {
            console.error('Failed to load footer:', error);
        }
    }

    // Re-initialize translations after components are loaded
    if (typeof window.initTranslations === 'function') {
        window.initTranslations();
    }
});

/**
 * Initialize mobile menu functionality
 * Called after navbar is dynamically loaded
 */
function initMobileMenu() {
    const menuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

/**
 * Initialize navbar scroll effect
 * Called after navbar is dynamically loaded
 */
function initNavbarScrollEffect() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-lg', 'nav-scrolled');
            } else {
                navbar.classList.remove('shadow-lg', 'nav-scrolled');
            }
        });
    }
}
