/* ========================================
   APP MODULE
   Entry point - inisialisasi semua module
   ======================================== */
const App = (() => {

    /* ---------- Inisialisasi Semua Module ---------- */
    function init() {
        /* Animations: scroll reveal, counter, parallax */
        Animation.init();

        /* Navbar: sticky, blur, mobile menu, active link */
        Navbar.init();

        /* Catalog: render, search, filter */
        Catalog.init();

        /* Service Form: validasi, upload, submit WA */
        ServiceForm.init();

        /* Smooth scroll untuk anchor links */
        initSmoothScroll();

        /* Tampilkan pesan di console untuk developer */
        console.log(
            '%c ProyekTools %c v1.0.0 ',
            'background: #facc15; color: #0f172a; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
            'background: #1e293b; color: #f8fafc; padding: 4px 8px; border-radius: 0 4px 4px 0;'
        );
    }

    /* ---------- Smooth Scroll Fallback ---------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetEl = document.querySelector(targetId);
                if (!targetEl) return;

                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* ---------- DOM Ready ---------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { init };
})();