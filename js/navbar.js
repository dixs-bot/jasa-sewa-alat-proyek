/* ========================================
   NAVBAR MODULE
   Sticky, blur, mobile menu, active link
   ======================================== */
const Navbar = (() => {

    let navbar, menu, toggle, overlay, links;
    let isOpen = false;

    /* ---------- Inisialisasi ---------- */
    function init() {
        navbar = document.getElementById('navbar');
        menu = document.getElementById('navbarMenu');
        toggle = document.getElementById('navbarToggle');
        links = document.querySelectorAll('.navbar-link');

        /* Buat overlay */
        overlay = document.createElement('div');
        overlay.className = 'navbar-overlay';
        document.body.appendChild(overlay);

        if (!navbar || !menu || !toggle) return;

        bindEvents();
        handleScroll();
    }

    /* ---------- Event Listeners ---------- */
    function bindEvents() {
        /* Toggle menu */
        toggle.addEventListener('click', toggleMenu);

        /* Overlay click */
        overlay.addEventListener('click', closeMenu);

        /* Link click - close menu & smooth scroll */
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                closeMenu();
                /* Active state diupdate oleh scroll observer */
            });
        });

        /* Scroll handler (throttled via rAF) */
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        /* Escape key */
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) closeMenu();
        });

        /* Resize - tutup menu jika desktop */
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > 768 && isOpen) closeMenu();
        }, 150));
    }

    /* ---------- Toggle Menu ---------- */
    function toggleMenu() {
        isOpen ? closeMenu() : openMenu();
    }

    function openMenu() {
        isOpen = true;
        menu.classList.add('open');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        isOpen = false;
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ---------- Scroll Handler ---------- */
    function handleScroll() {
        /* Sticky / blur */
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        /* Active link berdasarkan section */
        updateActiveLink();
    }

    /* ---------- Update Active Link ---------- */
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        let currentSection = '';

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;

            if (scrollPos >= top && scrollPos < top + height) {
                currentSection = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === currentSection) {
                link.classList.add('active');
            }
        });
    }

    /* ---------- Public API ---------- */
    return { init };
})();