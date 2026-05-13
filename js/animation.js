/* ========================================
   ANIMATION MODULE
   Scroll reveal, counter, parallax
   ======================================== */
const Animation = (() => {

    /* ---------- Scroll Reveal ---------- */
    function initScrollReveal() {
        const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    /* Terapkan delay dari data attribute jika ada */
                    const delay = entry.target.dataset.delay;
                    if (delay) {
                        entry.target.style.transitionDelay = delay + 'ms';
                    }
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }

    /* ---------- Counter Animation ---------- */
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    }

    function animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            /* Easing: ease-out cubic */
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /* ---------- Hero Parallax ---------- */
    function initHeroParallax() {
        const heroImg = document.querySelector('.hero-img');
        if (!heroImg) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const heroHeight = document.querySelector('.hero').offsetHeight;

                    if (scrollY < heroHeight) {
                        const translateY = scrollY * 0.3;
                        heroImg.style.transform = `scale(1.05) translateY(${translateY}px)`;
                    }

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ---------- Hero Image Loaded ---------- */
    function initHeroImage() {
        const heroImg = document.querySelector('.hero-img');
        if (!heroImg) return;

        if (heroImg.complete) {
            heroImg.classList.add('loaded');
        } else {
            heroImg.addEventListener('load', () => {
                heroImg.classList.add('loaded');
            }, { once: true });
        }
    }

    /* ---------- Public API ---------- */
    return {
        init() {
            initScrollReveal();
            initCounters();
            initHeroParallax();
            initHeroImage();
        }
    };
})();