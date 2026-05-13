/* ========================================
   CATALOG MODULE
   Data katalog, render cards, search,
   filter kategori, sewa via WhatsApp
   ======================================== */
const Catalog = (() => {

    /* ==========================================
       DATA KATALOG ALAT PROYEK
       Tambahkan item baru di array ini untuk
       menambahkan alat ke katalog tanpa ubah HTML
       ========================================== */
    const DATA = [
        {
            id: 1,
            name: 'Mesin Cor Beton',
            price: 'Rp 500.000',
            priceUnit: '/hari',
            description: 'Mesin cor beton berkualitas tinggi untuk proyek pengecoran skala besar dan kecil dengan performa stabil.',
            category: 'mesin-beton',
            categoryLabel: 'Mesin Beton',
            image: 'https://picsum.photos/seed/concrete-pump-2024/400/300'
        },
        {
            id: 2,
            name: 'Stamper Kodok',
            price: 'Rp 150.000',
            priceUnit: '/hari',
            description: 'Stamper kodok untuk pemadatan tanah dan aspal pada area konstruksi, mudah dioperasikan.',
            category: 'alat-keras',
            categoryLabel: 'Alat Keras',
            image: 'https://picsum.photos/seed/stamper-frog-2024/400/300'
        },
        {
            id: 3,
            name: 'Mesin Las / Setum',
            price: 'Rp 100.000',
            priceUnit: '/hari',
            description: 'Mesin las setum 450A cocok untuk pengelasan besi dan baja konstruksi dengan hasil rapi.',
            category: 'alat-las',
            categoryLabel: 'Alat Las',
            image: 'https://picsum.photos/seed/welding-machine-2024/400/300'
        },
        {
            id: 4,
            name: 'Jack Hammer',
            price: 'Rp 200.000',
            priceUnit: '/hari',
            description: 'Jack hammer bor palu untuk pembongkaran beton dan aspal secara cepat dan efisien.',
            category: 'alat-keras',
            categoryLabel: 'Alat Keras',
            image: 'https://picsum.photos/seed/jack-hammer-2024/400/300'
        },
        {
            id: 5,
            name: 'Genset 5000 Watt',
            price: 'Rp 300.000',
            priceUnit: '/hari',
            description: 'Genset portable 5000 Watt silent untuk kebutuhan listrik di lokasi proyek tanpa gangguan.',
            category: 'generator',
            categoryLabel: 'Generator',
            image: 'https://picsum.photos/seed/generator-set-2024/400/300'
        },
        {
            id: 6,
            name: 'Molen Beton',
            price: 'Rp 175.000',
            priceUnit: '/hari',
            description: 'Molen beton 50 kg untuk pengadukan beton merata dan efisien di segala medan proyek.',
            category: 'mesin-beton',
            categoryLabel: 'Mesin Beton',
            image: 'https://picsum.photos/seed/concrete-mixer-2024/400/300'
        },
        {
            id: 7,
            name: 'Vibrator Beton',
            price: 'Rp 125.000',
            priceUnit: '/hari',
            description: 'Vibrator beton untuk memadatkan adukan beton dan menghilangkan udara di dalam campuran.',
            category: 'mesin-beton',
            categoryLabel: 'Mesin Beton',
            image: 'https://picsum.photos/seed/vibrator-beton-2024/400/300'
        },
        {
            id: 8,
            name: 'Bar Cutter',
            price: 'Rp 100.000',
            priceUnit: '/hari',
            description: 'Bar cutter pemotong besi beton diameter 4mm sampai 32mm dengan hasil potong presisi.',
            category: 'alat-potong',
            categoryLabel: 'Alat Potong',
            image: 'https://picsum.photos/seed/bar-cutter-2024/400/300'
        },
        {
            id: 9,
            name: 'Concrete Cutter',
            price: 'Rp 350.000',
            priceUnit: '/hari',
            description: 'Concrete cutter untuk pemotongan beton, aspal, dan lantai keramik dengan kedalaman variabel.',
            category: 'alat-potong',
            categoryLabel: 'Alat Potong',
            image: 'https://picsum.photos/seed/concrete-cutter-2024/400/300'
        },
        {
            id: 10,
            name: 'Mesin Potong Keramik',
            price: 'Rp 75.000',
            priceUnit: '/hari',
            description: 'Mesin potong keramik presisi tinggi untuk berbagai jenis ubin, granit, dan keramik.',
            category: 'alat-potong',
            categoryLabel: 'Alat Potong',
            image: 'https://picsum.photos/seed/tile-cutter-2024/400/300'
        }
    ];

    /* ==========================================
       DAFTAR KATEGORI FILTER
       Tambahkan kategori baru di sini untuk
       menambahkan tombol filter di UI
       ========================================== */
    const CATEGORIES = [
        { id: 'semua', label: 'Semua' },
        { id: 'mesin-beton', label: 'Mesin Beton' },
        { id: 'alat-keras', label: 'Alat Keras' },
        { id: 'alat-potong', label: 'Alat Potong' },
        { id: 'alat-las', label: 'Alat Las' },
        { id: 'generator', label: 'Generator' }
    ];

    /* ==========================================
       STATE INTERNAL
       ========================================== */
    let activeCategory = 'semua';
    let searchQuery = '';

    /* ==========================================
       DOM ELEMENT REFERENCES
       ========================================== */
    let gridEl = null;
    let skeletonEl = null;
    let emptyEl = null;
    let searchEl = null;
    let filtersEl = null;

    /* ==========================================
       INISIALISASI MODULE
       Dipanggil dari App.init() di app.js
       ========================================== */
    function init() {
        gridEl = document.getElementById('catalogGrid');
        skeletonEl = document.getElementById('catalogSkeleton');
        emptyEl = document.getElementById('catalogEmpty');
        searchEl = document.getElementById('catalogSearch');
        filtersEl = document.getElementById('catalogFilters');

        if (!gridEl || !skeletonEl) return;

        renderFilters();
        bindEvents();

        /* Simulasi skeleton loading 600ms untuk efek realistis */
        setTimeout(() => {
            skeletonEl.style.display = 'none';
            gridEl.style.display = '';
            renderCards();
            Utils.lazyLoadImages();
        }, 600);
    }

    /* ==========================================
       RENDER FILTER BUTTONS
       Membuat tombol filter kategori secara
       dinamis berdasarkan array CATEGORIES
       ========================================== */
    function renderFilters() {
        filtersEl.innerHTML = CATEGORIES.map(cat => {
            const isActive = cat.id === activeCategory;
            return `
                <button class="filter-btn ${isActive ? 'active' : ''}"
                        data-category="${cat.id}"
                        role="tab"
                        aria-selected="${isActive}"
                        aria-label="Filter kategori ${Utils.escapeHTML(cat.label)}">
                    ${Utils.escapeHTML(cat.label)}
                </button>
            `;
        }).join('');
    }

    /* ==========================================
       RENDER CATALOG CARDS
       Membuat card HTML berdasarkan data yang
       sudah difilter oleh search dan kategori
       ========================================== */
    function renderCards() {
        const filtered = getFilteredData();

        /* Jika tidak ada hasil, tampilkan empty state */
        if (filtered.length === 0) {
            gridEl.innerHTML = '';
            emptyEl.style.display = '';
            return;
        }

        /* Sembunyikan empty state */
        emptyEl.style.display = 'none';

        /* Bangun HTML cards dengan stagger animation */
        gridEl.innerHTML = filtered.map((item, index) => {
            return `
                <article class="catalog-card" role="listitem" style="animation: fadeUp 0.4s ease ${index * 0.05}s both;">
                    <div class="catalog-card-img">
                        <img data-src="${item.image}" alt="${Utils.escapeHTML(item.name)}" loading="lazy">
                        <span class="catalog-card-category">${Utils.escapeHTML(item.categoryLabel)}</span>
                    </div>
                    <div class="catalog-card-body">
                        <h3 class="catalog-card-name">${Utils.escapeHTML(item.name)}</h3>
                        <p class="catalog-card-desc">${Utils.escapeHTML(item.description)}</p>
                        <div class="catalog-card-footer">
                            <div class="catalog-card-price">${item.price} <small>${item.priceUnit}</small></div>
                            <button class="btn btn-primary btn-sm btn-rent-wa" data-item="${Utils.escapeHTML(item.name)}" aria-label="Sewa ${Utils.escapeHTML(item.name)} via WhatsApp">
                                <i class="bx bxl-whatsapp"></i> Sewa
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        /* Pasang event listener pada tombol sewa */
        bindRentButtons();

        /* Jalankan lazy load untuk gambar baru */
        Utils.lazyLoadImages();
    }

    /* ==========================================
       FILTER DATA
       Menggabungkan filter kategori dan search
       query untuk mendapatkan data yang relevan
       ========================================== */
    function getFilteredData() {
        return DATA.filter(item => {
            /* Cocokkan kategori */
            const matchCategory = activeCategory === 'semua' || item.category === activeCategory;

            /* Cocokkan search query terhadap nama, deskripsi, dan kategori */
            const matchSearch = searchQuery === '' ||
                item.name.toLowerCase().includes(searchQuery) ||
                item.description.toLowerCase().includes(searchQuery) ||
                item.categoryLabel.toLowerCase().includes(searchQuery);

            return matchCategory && matchSearch;
        });
    }

    /* ==========================================
       EVENT BINDINGS
       Mengikat event ke search input dan
       filter buttons menggunakan event
       delegation untuk performa optimal
       ========================================== */
    function bindEvents() {
        /* Search input dengan debounce agar tidak
           render ulang setiap kali user mengetik */
        searchEl.addEventListener('input', Utils.debounce((e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            renderCards();
        }));

        /* Filter buttons menggunakan event delegation
           agar tidak perlu re-bind saat render ulang */
        filtersEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            activeCategory = btn.dataset.category;

            /* Update visual active state pada semua tombol */
            filtersEl.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            /* Render ulang cards dengan filter baru */
            renderCards();
        });
    }

    /* ==========================================
       BIND RENT BUTTONS
       Mengikat event klik pada setiap tombol
       "Sewa" untuk redirect ke WhatsApp
       ========================================== */
    function bindRentButtons() {
        const rentButtons = gridEl.querySelectorAll('.btn-rent-wa');

        rentButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const itemName = btn.dataset.item;
                const message = Utils.buildRentalMessage(itemName);
                Utils.openWhatsApp(message);
            });
        });
    }

    /* ==========================================
       PUBLIC API
       Hanya init yang diekspos ke luar module
       ========================================== */
    return {
        init: init
    };
})();