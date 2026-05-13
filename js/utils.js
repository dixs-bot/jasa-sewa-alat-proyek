/* ========================================
   UTILS MODULE
   Fungsi-fungsi utilitas yang reusable
   ======================================== */
const Utils = (() => {
    /* ---------- Konfigurasi ---------- */
    const CONFIG = {
        WHATSAPP_NUMBER: '6281234567890',
        WHATSAPP_BASE_URL: 'https://wa.me',
        DEBOUNCE_DELAY: 300,
        TOAST_DURATION: 3500
    };

    /* ---------- Buka WhatsApp ---------- */
    function openWhatsApp(message) {
        const url = `${CONFIG.WHATSAPP_BASE_URL}/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    /* ---------- Buat pesan WhatsApp service ---------- */
    function buildServiceMessage(data) {
        return `Halo Admin Rental Alat

Saya ingin mengajukan service alat proyek.

Nama: ${data.nama}
No WA: ${data.nowa}
Nama Alat: ${data.namaalat}
Merk: ${data.merk}
Kerusakan: ${data.kerusakan}
Lokasi: ${data.lokasi}
 ${data.foto ? 'Foto: Terlampir di chat ini' : 'Foto: Tidak ada'}
Catatan: ${data.catatan || '-'}

Mohon info estimasi perbaikan. Terima kasih.`;
    }

    /* ---------- Buat pesan WhatsApp rental ---------- */
    function buildRentalMessage(itemName) {
        return `Halo Admin Rental Alat

Saya ingin menyewa *${itemName}*.

Mohon info ketersediaan dan harga terbaru. Terima kasih.`;
    }

    /* ---------- Debounce ---------- */
    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay || CONFIG.DEBOUNCE_DELAY);
        };
    }

    /* ---------- Toast Notification ---------- */
    function showToast(message, type) {
        /* Hapus toast lama jika ada */
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type || 'success'}`;

        const iconClass = type === 'error' ? 'bx-error-circle' : 'bx-check-circle';
        const iconColor = type === 'error' ? 'var(--error)' : 'var(--success)';

        toast.innerHTML = `<i class="bx ${iconClass}" style="font-size:1.25rem;color:${iconColor}"></i><span>${message}</span>`;

        document.body.appendChild(toast);

        /* Trigger show */
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
        });

        /* Auto hide */
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, CONFIG.TOAST_DURATION);
    }

    /* ---------- Lazy Load Images ---------- */
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        if (!images.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    }, { once: true });
                    img.addEventListener('error', () => {
                        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23f1f5f9"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="16"%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E';
                    }, { once: true });
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        images.forEach(img => imageObserver.observe(img));
    }

    /* ---------- Format Rupiah (future use) ---------- */
    function formatRupiah(number) {
        return 'Rp ' + number.toLocaleString('id-ID');
    }

    /* ---------- Escape HTML ---------- */
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /* ---------- Public API ---------- */
    return {
        openWhatsApp,
        buildServiceMessage,
        buildRentalMessage,
        debounce,
        showToast,
        lazyLoadImages,
        formatRupiah,
        escapeHTML
    };
})();