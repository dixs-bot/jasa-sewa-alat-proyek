/* ========================================
   SERVICE FORM MODULE
   Validasi, preview upload, submit ke WA
   ======================================== */
const ServiceForm = (() => {

    /* ---------- State ---------- */
    let formEl, submitBtn, btnText, btnLoading, successEl;
    let selectedFile = null;
    let isSubmitting = false;

    /* ---------- Rules Validasi ---------- */
    const RULES = {
        nama: {
            required: true,
            minLength: 2,
            maxLength: 100,
            messages: {
                required: 'Nama customer wajib diisi.',
                minLength: 'Nama minimal 2 karakter.',
                maxLength: 'Nama maksimal 100 karakter.'
            }
        },
        nowa: {
            required: true,
            pattern: /^(08|\+62|62)\d{8,13}$/,
            messages: {
                required: 'Nomor WhatsApp wajib diisi.',
                pattern: 'Format nomor tidak valid. Contoh: 081234567890'
            }
        },
        namaalat: {
            required: true,
            minLength: 2,
            messages: {
                required: 'Nama alat wajib diisi.',
                minLength: 'Nama alat minimal 2 karakter.'
            }
        },
        merk: {
            required: true,
            minLength: 2,
            messages: {
                required: 'Merk alat wajib diisi.',
                minLength: 'Merk alat minimal 2 karakter.'
            }
        },
        kerusakan: {
            required: true,
            messages: {
                required: 'Pilih jenis kerusakan.'
            }
        },
        lokasi: {
            required: true,
            minLength: 5,
            messages: {
                required: 'Lokasi wajib diisi.',
                minLength: 'Lokasi minimal 5 karakter.'
            }
        }
    };

    /* ---------- Inisialisasi ---------- */
    function init() {
        formEl = document.getElementById('serviceForm');
        submitBtn = document.getElementById('btnSubmit');
        successEl = document.getElementById('formSuccess');

        if (!formEl) return;

        btnText = submitBtn.querySelector('.btn-text');
        btnLoading = submitBtn.querySelector('.btn-loading');
        const btnIcon = submitBtn.querySelector('.btn-icon');

        bindEvents();
    }

    /* ---------- Event Bindings ---------- */
    function bindEvents() {
        /* Submit form */
        formEl.addEventListener('submit', handleSubmit);

        /* Realtime validation: hapus error saat user mengetik */
        const inputs = formEl.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearFieldError(input.name);
            });

            input.addEventListener('change', () => {
                clearFieldError(input.name);
            });
        });

        /* Upload foto */
        const fileInput = document.getElementById('foto');
        const uploadArea = document.getElementById('formUpload');
        const removeBtn = document.getElementById('removeFoto');

        fileInput.addEventListener('change', handleFileSelect);

        /* Drag & drop */
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    handleFileSelect({ target: fileInput });
                }
            });
        }

        /* Hapus foto */
        if (removeBtn) {
            removeBtn.addEventListener('click', handleRemoveFile);
        }

        /* Tombol reset setelah sukses */
        const resetBtn = document.getElementById('btnResetForm');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetForm);
        }
    }

    /* ---------- Handle Submit ---------- */
    function handleSubmit(e) {
        e.preventDefault();

        if (isSubmitting) return;

        /* Validasi semua field */
        const formData = getFormData();
        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            displayErrors(errors);
            Utils.showToast('Mohon lengkapi form dengan benar.', 'error');
            return;
        }

        /* Mulai proses submit */
        isSubmitting = true;
        setSubmitLoading(true);

        /* Simulasi delay loading (seperti network request) */
        setTimeout(() => {
            const message = Utils.buildServiceMessage(formData);
            Utils.openWhatsApp(message);

            /* Tampilkan success state */
            formEl.style.display = 'none';
            successEl.style.display = '';
            successEl.classList.add('visible');

            setSubmitLoading(false);
            isSubmitting = false;
        }, 1200);
    }

    /* ---------- Ambil Data Form ---------- */
    function getFormData() {
        return {
            nama: formEl.nama.value.trim(),
            nowa: formEl.nowa.value.trim(),
            namaalat: formEl.namaalat.value.trim(),
            merk: formEl.merk.value.trim(),
            kerusakan: formEl.kerusakan.value,
            lokasi: formEl.lokasi.value.trim(),
            foto: selectedFile ? true : false,
            catatan: formEl.catatan.value.trim()
        };
    }

    /* ---------- Validasi Form ---------- */
    function validateForm(data) {
        const errors = {};

        for (const [fieldName, rules] of Object.entries(RULES)) {
            const value = data[fieldName];

            /* Required check */
            if (rules.required && !value) {
                errors[fieldName] = rules.messages.required;
                continue;
            }

            /* MinLength check */
            if (rules.minLength && value && value.length < rules.minLength) {
                errors[fieldName] = rules.messages.minLength;
                continue;
            }

            /* MaxLength check */
            if (rules.maxLength && value && value.length > rules.maxLength) {
                errors[fieldName] = rules.messages.maxLength;
                continue;
            }

            /* Pattern check */
            if (rules.pattern && value && !rules.pattern.test(value)) {
                errors[fieldName] = rules.messages.pattern;
                continue;
            }
        }

        return errors;
    }

    /* ---------- Tampilkan Error ---------- */
    function displayErrors(errors) {
        for (const [fieldName, message] of Object.entries(errors)) {
            const input = formEl.querySelector(`[name="${fieldName}"]`);
            const errorEl = document.getElementById(`${fieldName}-error`);

            if (input) {
                input.classList.add('error');
            }
            if (errorEl) {
                errorEl.textContent = message;
            }
        }

        /* Scroll ke error pertama */
        const firstError = formEl.querySelector('.form-input.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    /* ---------- Hapus Error Satu Field ---------- */
    function clearFieldError(fieldName) {
        const input = formEl.querySelector(`[name="${fieldName}"]`);
        const errorEl = document.getElementById(`${fieldName}-error`);

        if (input) input.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
    }

    /* ---------- Handle File Select ---------- */
    function handleFileSelect(e) {
        const file = e.target.files[0];

        if (!file) return;

        /* Validasi tipe file */
        if (!file.type.startsWith('image/')) {
            Utils.showToast('Format file harus berupa gambar (JPG, PNG).', 'error');
            e.target.value = '';
            return;
        }

        /* Validasi ukuran file (maks 5MB) */
        if (file.size > 5 * 1024 * 1024) {
            Utils.showToast('Ukuran foto maksimal 5MB.', 'error');
            e.target.value = '';
            return;
        }

        selectedFile = file;

        /* Tampilkan preview */
        const reader = new FileReader();
        reader.onload = (ev) => {
            const previewImg = document.getElementById('previewImg');
            const uploadContent = document.getElementById('uploadContent');
            const uploadPreview = document.getElementById('uploadPreview');

            previewImg.src = ev.target.result;
            uploadContent.style.display = 'none';
            uploadPreview.style.display = '';
        };
        reader.readAsDataURL(file);
    }

    /* ---------- Hapus File ---------- */
    function handleRemoveFile() {
        selectedFile = null;

        const fileInput = document.getElementById('foto');
        const uploadContent = document.getElementById('uploadContent');
        const uploadPreview = document.getElementById('uploadPreview');
        const previewImg = document.getElementById('previewImg');

        fileInput.value = '';
        previewImg.src = '';
        uploadContent.style.display = '';
        uploadPreview.style.display = 'none';
    }

    /* ---------- Loading State ---------- */
    function setSubmitLoading(loading) {
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = '';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
        } else {
            btnText.style.display = '';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            submitBtn.style.cursor = '';
        }
    }

    /* ---------- Reset Form ---------- */
    function resetForm() {
        formEl.reset();
        handleRemoveFile();

        /* Hapus semua error */
        formEl.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('error');
        });
        formEl.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
        });

        /* Kembali ke form */
        successEl.style.display = 'none';
        successEl.classList.remove('visible');
        formEl.style.display = '';

        /* Scroll ke form */
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ---------- Public API ---------- */
    return { init };
})();