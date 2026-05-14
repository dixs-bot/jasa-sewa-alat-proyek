/* ========================================
   UTILS MODULE
   Fungsi-fungsi utilitas yang reusable
   ======================================== */
const Utils = (() => {
    /* ---------- Konfigurasi ---------- */
    const CONFIG = {
        WHATSAPP_NUMBER: '6281313413771',
        WHATSAPP_BASE_URL: 'https://wa.me',
        DEBOUNCE_DELAY: 300,
        TOAST_DURATION: 3500
    };

    /* ---------- Buka WhatsApp ---------- */
    function openWhatsApp(message) {
        const url = `${CONFIG.WHATSAPP_BASE_URL}/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    /* ---------- Pesan WhatsApp: Jual Produk ---------- */
    function buildSellMessage(productName) {
        return `Halo Admin ProyekTools

Saya mau tanya produk ${productName} yang di jual serta tanyakan harga nya.

Mohon info detailnya. Terima kasih.`;
    }

    /* ---------- Pesan WhatsApp: Beli Produk ---------- */
    function buildBuyMessage(productName) {
        return `Halo Admin ProyekTools

Saya mau beli ${productName} serta tanyakan harga nya.

Mohon info ketersediaan dan harganya. Terima kasih.`;
    }

    /* ---------- Pesan WhatsApp: Service Alat ---------- */
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
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type || 'success'}`;

        const iconClass = type === 'error' ? 'bx-error-circle' : 'bx-check-circle';
        const iconColor = type === 'error' ? 'var(--error)' : 'var(--success)';

        toast.innerHTML = `<i class="bx ${iconClass}" style="font-size:1.25rem;color:${iconColor}"></i><span>${message}</span>`;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, CONFIG.TOAST_DURATION);
    }

    /* ---------- Lazy Load Images ---------- */
   function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    images.forEach(img => {
        const realSrc = img.dataset.src;

        if (!realSrc) {
            console.error('Image src missing:', img);
            return;
        }

        img.src = realSrc;

        img.onload = () => {
            img.classList.add('loaded');
        };

        img.onerror = () => {
            console.error('Failed load image:', realSrc);

            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23f1f5f9"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="16"%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E';
        };

        img.removeAttribute('data-src');
    });
}

    /* ---------- Format Rupiah ---------- */
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
        buildSellMessage,
        buildBuyMessage,
        buildServiceMessage,
        debounce,
        showToast,
        lazyLoadImages,
        formatRupiah,
        escapeHTML
    };
})();
