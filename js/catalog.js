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
            description: 'Sewa mesin cor beton berkualitas tinggi untuk proyek pengecoran di Bandung. Tersedia berbagai tipe dengan performa stabil.',
            category: 'mesin-beton',
            categoryLabel: 'Mesin Beton',
            image: 'mesin-molen1.png'
        },
        {
            id: 2,
            name: 'Stamper Kodok',
            price: 'Rp 150.000',
            priceUnit: '/hari',
            description: 'Sewa stamper kodok untuk pemadatan tanah dan aspal di area konstruksi Bandung. Mudah dioperasikan dan daya tahan tinggi.',
            category: 'alat-keras',
            categoryLabel: 'Alat Keras',
            image: 'stemper-kuda'
        },
        {
            id: 3,
            name: 'Mesin Las / Setum',
            price: 'Rp 100.000',
            priceUnit: '/hari',
            description: 'Rental mesin las setum 450A untuk pengelasan besi dan baja konstruksi di Bandung. Hasil rapi dan konsisten.',
            category: 'alat-las',
            categoryLabel: 'Alat Las',
            image: 'mesin-las.png'
        },
        {
            id: 4,
            name: 'Jack Hammer',
            price: 'Rp 200.000',
            priceUnit: '/hari',
            description: 'Sewa jack hammer bor palu untuk pembongkaran beton dan aspal di Bandung. Efisien dan hemat waktu proyek.',
            category: 'alat-keras',
            categoryLabel: 'Alat Keras',
            image: 'jack-hammer.png'
        },
        {
            id: 5,
            name: 'Genset 5000 Watt',
            price: 'Rp 300.000',
            priceUnit: '/hari',
            description: 'Rental genset 5000 Watt silent untuk kebutuhan listrik proyek di Bandung. Bising rendah dan irit bahan bakar.',
            category: 'generator',
            categoryLabel: 'Generator',
            image: 'genset.png'
        },
        {
            id: 6,
            name: 'Molen Beton',
            price: 'Rp 175.000',
            priceUnit: '/hari',
            description: 'Sewa molen beton 50 kg untuk pengadukan beton di lokasi proyek Bandung. Merata, efisien, dan kuat di segala medan.',
            category: 'mesin-beton',
            categoryLabel: 'Mesin Beton',
            image: 'mesin-molen-png'
        },
        {
            id: 7,
            name: 'Vibrator Beton',
            price: 'Rp 125.000',
            priceUnit: '/hari',
            description: 'Sewa vibrator beton untuk memadatkan adukan dan menghilangkan udara di campuran beton proyek Bandung.',
            category: 'mesin-beton',
            categoryLabel: 'Mesin Beton',
            image: 'vibrator.png'
        },
        {
            id: 8,
            name: 'Bar Cutter',
            price: 'Rp 100.000',
            priceUnit: '/hari',
            description: 'Rental bar cutter pemotong besi beton diameter 4mm sampai 32mm. Hasil potong presisi untuk proyek di Bandung.',
            category: 'alat-potong',
            categoryLabel: 'Alat Potong',
            image: 'bar-cutter.png'
        },
        {
            id: 9,
            name: 'Concrete Cutter',
            price: 'Rp 350.000',
            priceUnit: '/hari',
            description: 'Sewa concrete cutter untuk pemotongan beton, aspal, dan lantai keramik di Bandung. Kedalaman potong variabel.',
            category: 'alat-potong',
            categoryLabel: 'Alat Potong',
            image: 'cuting-jalan.png'
        },
        {
            id: 10,
            name: 'Mesin Potong Keramik',
            price: 'Rp 75.000',
            priceUnit: '/hari',
            description: 'Rental mesin potong keramik presisi tinggi untuk ubin, granit, dan keramik di proyek Bandung. Mudah digunakan.',
            category: 'alat-potong',
            categoryLabel: 'Alat Potong',
            image: 'pemotong-keramik.png'
        },
        {
            id: 11,
            name: 'Baby Setum',
            price: 'Rp 75.000',
            priceUnit: '/hari',
            description: 'Rental baby setum untuk pemadatan aspal,baby setum di proyek Bandung. Mudah digunakan.',
            category: 'mesin-beton',
            categoryLabel: 'Mesin Beton',
            image: 'baby-setum.png'
        },
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
