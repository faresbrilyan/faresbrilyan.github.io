// js/script.js — Faresya Brilyan Portfolio (Optimized & Accessible)

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== PRELOADER: Fast & Non-Blocking =====
    const preloader   = document.getElementById('preloader');
    const progressBar = document.getElementById('gate-progress-bar');
    const taglineText = document.getElementById('gate-tagline-text');
    const logoWrap    = document.getElementById('gate-logo-wrap');
    const gateBrand   = document.getElementById('gate-brand');
    const sweepLine   = document.getElementById('gate-sweep-line');
    const tagline     = document.getElementById('gate-tagline');

    const dismissPreloader = () => {
        if (!preloader || preloader.classList.contains('gate-hidden')) return;
        preloader.classList.add('gate-exit');
        document.body.style.overflow = '';
        setTimeout(() => {
            preloader.classList.add('gate-hidden');
            sessionStorage.setItem('preloader_shown', 'true');
        }, 500);
    };

    if (preloader) {
        const alreadyShown = sessionStorage.getItem('preloader_shown') === 'true';

        if (alreadyShown || prefersReducedMotion) {
            // Dismiss immediately for returning sessions or users requesting reduced motion
            preloader.classList.add('gate-hidden');
            document.body.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';

            // Quick click or keypress to skip
            preloader.addEventListener('click', dismissPreloader, { once: true });
            window.addEventListener('keydown', dismissPreloader, { once: true });

            // Snappy stagger animations
            if (logoWrap) logoWrap.classList.add('animate-in');
            if (gateBrand) gateBrand.classList.add('animate-in');
            setTimeout(() => sweepLine && sweepLine.classList.add('animate'), 150);
            setTimeout(() => tagline && tagline.classList.add('animate-in'), 300);

            // Fast tagline typing
            const taglineStr = 'building_systems • crafting_experiences';
            if (taglineText) {
                let charIdx = 0;
                const typeInterval = setInterval(() => {
                    if (charIdx < taglineStr.length) {
                        taglineText.textContent += taglineStr[charIdx++];
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 20);
            }

            // Quick progress fill and exit (~750ms total)
            if (progressBar) {
                progressBar.style.transition = 'width 650ms cubic-bezier(0.16, 1, 0.3, 1)';
                requestAnimationFrame(() => {
                    progressBar.style.width = '100%';
                });
            }

            // Auto dismiss after brief completion
            const autoDismissTimer = setTimeout(dismissPreloader, 750);
            window.addEventListener('load', () => {
                setTimeout(dismissPreloader, 400);
                clearTimeout(autoDismissTimer);
            }, { once: true });
        }
    }

    // ===== BACKGROUND PARALLAX (Throttled with rAF) =====
    const bgDots = document.getElementById('bg-dots');
    if (bgDots && !prefersReducedMotion) {
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking && window.innerWidth >= 768) {
                window.requestAnimationFrame(() => {
                    bgDots.style.transform = `translateY(${window.scrollY * 0.12}px)`;
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });
    }

    // ===== CURSOR GLOW (Desktop & rAF throttled) =====
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow && !prefersReducedMotion) {
        let mouseTicking = false;
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!mouseTicking && window.innerWidth >= 768) {
                window.requestAnimationFrame(() => {
                    cursorGlow.style.left = `${mouseX}px`;
                    cursorGlow.style.top  = `${mouseY}px`;
                    mouseTicking = false;
                });
                mouseTicking = true;
            }
        }, { passive: true });
    }

    // ===== HERO TILT (Desktop & rAF throttled) =====
    const hero     = document.querySelector('.hero');
    const heroImg  = document.querySelector('.hero-img');
    const heroAura = document.querySelector('.hero-img-aura');

    if (hero && heroImg && !prefersReducedMotion) {
        let heroTicking = false;
        let heroX = 0;
        let heroY = 0;

        hero.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            heroX = (e.clientX / window.innerWidth  - 0.5) * 16;
            heroY = (e.clientY / window.innerHeight - 0.5) * 16;

            if (!heroTicking) {
                window.requestAnimationFrame(() => {
                    heroImg.style.transform  = `translate3d(${heroX}px, ${heroY}px, 0) rotateX(${-heroY / 2}deg) rotateY(${heroX / 2}deg)`;
                    if (heroAura) heroAura.style.transform = `translate3d(${-heroX * 0.5}px, ${-heroY * 0.5}px, 0)`;
                    heroTicking = false;
                });
                heroTicking = true;
            }
        }, { passive: true });

        hero.addEventListener('mouseleave', () => {
            heroImg.style.transform  = '';
            if (heroAura) heroAura.style.transform = '';
        });
    }

    // ===== NAVBAR: Sticky & Active Link Tracking =====
    const navbar   = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const mobileMenuBtn     = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');

    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (!navTicking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (navbar) navbar.classList.toggle('scrolled', scrollY > 80);

                let current = '';
                sections.forEach(sec => {
                    if (scrollY >= sec.offsetTop - 220) current = sec.id;
                });
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
                });
                navTicking = false;
            });
            navTicking = true;
        }
    }, { passive: true });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;
            window.scrollTo({ top: target.offsetTop - 90, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            if (navLinksContainer) navLinksContainer.classList.remove('open');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('open');
            if (navbar) navbar.classList.remove('menu-open');
        });
    });

    // Mobile menu toggle
    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.toggle('open');
            mobileMenuBtn.classList.toggle('open', isOpen);
            if (navbar) navbar.classList.toggle('menu-open', isOpen);
            mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    // ===== SCROLL REVEAL (IntersectionObserver) =====
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
            .forEach(el => revealObserver.observe(el));

        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, i) => {
                        setTimeout(() => child.classList.add('visible'), i * 60);
                    });
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.skills-bento, .achievements-grid, .projects-list, .timeline')
            .forEach(el => {
                Array.from(el.children).forEach(child => child.classList.add('stagger-child'));
                staggerObserver.observe(el);
            });
    } else {
        // Reduced motion fallback: show immediately
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .skills-bento > *, .achievements-grid > *, .projects-list > *, .timeline > *')
            .forEach(el => el.classList.add('visible'));
    }

    // ===== FILTER TABS WITH ARIA SYNC =====
    const setupFilter = (filterId, targetSelector) => {
        const filterContainer = document.getElementById(filterId);
        if (!filterContainer) return;

        const buttons = filterContainer.querySelectorAll('.filter-tab');
        const cards   = document.querySelectorAll(targetSelector);

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const filter = btn.getAttribute('data-filter');

                cards.forEach(card => {
                    const categories = (card.dataset.category || '').split(' ');
                    const show = filter === 'all' || categories.includes(filter);

                    card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                    if (show) {
                        card.classList.remove('hidden');
                        requestAnimationFrame(() => {
                            card.style.opacity   = '1';
                            card.style.transform = '';
                        });
                    } else {
                        card.style.opacity   = '0';
                        card.style.transform = 'scale(0.96)';
                        setTimeout(() => card.classList.add('hidden'), 250);
                    }
                });
            });
        });
    };

    setupFilter('skills-filter', '.skill-bento-card');
    setupFilter('experience-filter', '.timeline-item');

    // ===== CONTACT FORM: Validated mailto + status message =====
    const contactForm = document.getElementById('contactForm');
    const formStatus  = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameEl    = document.getElementById('name');
            const emailEl   = document.getElementById('email');
            const subjectEl = document.getElementById('subject');
            const msgEl     = document.getElementById('message');

            const name    = nameEl ? nameEl.value.trim() : '';
            const email   = emailEl ? emailEl.value.trim() : '';
            const subject = subjectEl ? subjectEl.value.trim() : 'Diskusi Proyek';
            const message = msgEl ? msgEl.value.trim() : '';

            if (formStatus) {
                formStatus.textContent = 'Membuka aplikasi email...';
                formStatus.className = 'form-status font-mono active';
            }

            const body = `${message}\n\n---\nPengirim: ${name}\nEmail: ${email}`;
            const mailtoUrl = `mailto:brilyannfaresya02@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoUrl;

            setTimeout(() => {
                if (formStatus) {
                    formStatus.innerHTML = 'Jika aplikasi email tidak terbuka otomatis, silakan kirim langsung ke: <a href="mailto:brilyannfaresya02@gmail.com" class="text-accent underline font-mono">brilyannfaresya02@gmail.com</a>';
                }
            }, 1200);
        });
    }

    // ===== POP-OUT DETAIL MODAL DATA & HANDLER =====
    const detailData = {
        'achv-1': {
            badge: '<i class="fa-solid fa-star"></i> Juara 1 Internasional',
            tagClass: 'achv-rank-gold',
            category: 'INTERNATIONAL SHORT FILM COMPETITION',
            title: 'Kompetisi Film Pendek — "BUNTU"',
            subtitle: '<i class="fa-solid fa-landmark text-emerald"></i> Politeknik Negeri Sambas (2024)',
            desc: 'Film pendek yang mengangkat tema etika penggunaan kecerdasan buatan (AI) di lingkungan perkuliahan, menceritakan tentang ketergantungan mahasiswa terhadap teknologi instan dalam mengerjakan tugas akademik.',
            highlights: [
                'Berperan sebagai sutradara dan sinematografer.',
                'Menyusun konsep cerita, pengambilan gambar, dan penyuntingan video.',
                'Meraih Juara 1 dalam kompetisi film pendek yang diselenggarakan oleh Politeknik Negeri Sambas.'
            ],
            badges: ['Film Pendek', 'Sinematografi', 'Directing', 'Video Editing'],
            action: null
        },
        'achv-2': {
            badge: '<i class="fa-solid fa-ranking-star"></i> Juara 2 Inovasi',
            tagClass: 'achv-rank-silver',
            category: 'SUBANG INNOVATION FESTIVAL 2025',
            title: 'Inovasi Sistem Inventaris & Pembukuan UMKM',
            subtitle: '<i class="fa-solid fa-city text-emerald"></i> Pemerintah Kabupaten Subang (2025)',
            desc: 'Perancangan sistem pencatatan stok barang dan pembukuan internal berbasis Excel VBA Macro untuk membantu pengelolaan data persediaan di UMKM Wiguna Nusantara.',
            highlights: [
                'Membuat formulir otomatis untuk pencatatan mutasi barang masuk dan keluar.',
                'Menyusun rekapitulasi data stok berbasis formula dan logika VBA agar pencatatan barang lebih rapi.',
                'Meraih Juara 2 kategori inovasi pada Subang Innovation Festival 2025.'
            ],
            badges: ['Excel VBA', 'Manajemen Stok', 'Automasi Spreadsheet'],
            action: {
                text: 'Unduh File Excel (.xlsm)',
                url: 'assets/COMFY%20-%20C%20SYSTEM.xlsm',
                icon: 'fa-solid fa-download',
                download: true
            }
        },
        'achv-3': {
            badge: '<i class="fa-solid fa-ribbon"></i> Juara Harapan 1',
            tagClass: 'achv-rank-bronze',
            category: 'NATIONAL VIDEOGRAPHY COMPETITION',
            title: 'Lomba Videografi — Dokumentasi Kuliner Tradisional',
            subtitle: '<i class="fa-solid fa-film text-emerald"></i> Tingkat Nasional (2025)',
            desc: 'Video dokumentasi mengenai proses pembuatan kuliner tradisional khas Subang (d\'bubuy ma\'atik) untuk memperkenalkan kuliner lokal ke khalayak yang lebih luas.',
            highlights: [
                'Melakukan pengambilan gambar dan penyuntingan video dokumentasi kuliner.',
                'Mendokumentasikan tahapan tradisional pengolahan makanan khas daerah.',
                'Meraih Juara Harapan 1 pada kompetisi videografi tingkat nasional.'
            ],
            badges: ['Videografi', 'Dokumentasi', 'Video Editing'],
            action: null
        },
        'proj-1': {
            badge: 'Live Production',
            tagClass: 'modal-tag',
            category: 'GEOSPATIAL • REMOTE WORK DIRECTORY',
            image: 'img/WFC Radar.png',
            title: 'WFC Radar — Direktori Kafe Ramah Kerja',
            subtitle: '<i class="fa-solid fa-satellite-dish text-emerald"></i> Next.js + Leaflet + Supabase',
            desc: 'Aplikasi web direktori tempat kerja (Work From Cafe) berbasis peta interaktif untuk membantu pekerja remote dan mahasiswa menemukan kafe dengan fasilitas pendukung yang sesuai.',
            highlights: [
                'Peta interaktif menggunakan Leaflet & OpenStreetMap dengan filter radius jarak dan deteksi lokasi pengguna.',
                'Informasi ketersediaan fasilitas kerja: colokan listrik, estimasi kecepatan Wi-Fi, tingkat kebisingan, dan musala.',
                'Formulir kontribusi publik untuk menambahkan data spot kafe baru.',
                'Dibangun menggunakan Next.js App Router, TypeScript, Tailwind CSS, dan Supabase.'
            ],
            badges: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'Supabase', 'Vercel'],
            action: {
                text: 'Kunjungi Website',
                url: 'https://wfc-radar.vercel.app',
                icon: 'fa-solid fa-arrow-up-right-from-square',
                target: '_blank'
            }
        },
        'proj-2': {
            badge: 'GIS Routing',
            tagClass: 'modal-tag',
            category: 'HEALTHCARE • TOURISM NAVIGATION',
            image: 'img/Wandermed.png',
            title: 'WanderMed — Direktori Faskes Darurat',
            subtitle: '<i class="fa-solid fa-map-location-dot text-emerald"></i> Laravel + Google Maps Platform',
            desc: 'Sistem informasi geografis direktori fasilitas kesehatan (rumah sakit, klinik, dan apotek) di Kabupaten Subang dengan rute navigasi Google Maps untuk wisatawan.',
            highlights: [
                'Pencarian lokasi faskes darurat terdekat dengan rute navigasi Google Maps.',
                'Halaman dashboard admin berbasis Laravel untuk pengelolaan data fasilitas kesehatan.',
                'Penyimpanan dan pengelolaan data menggunakan basis data MySQL.'
            ],
            badges: ['Laravel', 'Google Maps API', 'MySQL', 'PHP'],
            action: {
                text: 'Lihat Repositori GitHub',
                url: 'https://github.com/faresbrilyan/wandermed.git',
                icon: 'fa-brands fa-github',
                target: '_blank'
            }
        },
        'proj-3': {
            badge: 'Juara 2 Inovasi',
            tagClass: 'modal-tag',
            category: 'OPERATIONAL AUTOMATION • UMKM',
            image: 'img/COMFY.png',
            title: 'Comfy C-System — Sistem Inventaris Pergudangan',
            subtitle: '<i class="fa-solid fa-trophy text-emerald"></i> Excel VBA Macro + Data Modeling',
            desc: 'Aplikasi manajemen stok barang dan pembukuan internal berbasis Excel VBA Macro untuk efisiensi pengelolaan inventaris UMKM Wiguna Nusantara.',
            highlights: [
                'Formulir input mutasi stok barang masuk dan keluar dengan validasi VBA.',
                'Laporan rekapitulasi data stok gudang otomatis.',
                'Meraih Juara 2 pada Subang Innovation Festival 2025.'
            ],
            badges: ['Excel VBA', 'Macro Logic', 'Data Modeling'],
            action: {
                text: 'Unduh File Excel (.xlsm)',
                url: 'assets/COMFY%20-%20C%20SYSTEM.xlsm',
                icon: 'fa-solid fa-download',
                download: true
            }
        },
        'proj-4': {
            badge: 'E-Commerce',
            tagClass: 'modal-tag',
            category: 'UMKM E-COMMERCE • DATABASE',
            image: 'img/dbubuy.png',
            title: 'd\'bubuy ma\'atik — Platform Pemesanan Kuliner UMKM',
            subtitle: '<i class="fa-solid fa-store text-emerald"></i> PHP + MySQL + Bootstrap',
            desc: 'Website katalog dan pemesanan online kuliner khas Sunda dengan pengelolaan basis data relasional MySQL untuk UMKM lokal.',
            highlights: [
                'Katalog menu online interaktif dengan fitur keranjang belanja.',
                'Panel admin untuk pengelolaan data pesanan dan pencatatan bahan baku.',
                'Struktur basis data relasional menggunakan MySQL.'
            ],
            badges: ['PHP', 'MySQL', 'Bootstrap'],
            action: {
                text: 'Lihat Repositori GitHub',
                url: 'https://github.com/faresbrilyan/Website-Dbubuy.git',
                icon: 'fa-brands fa-github',
                target: '_blank'
            }
        }
    };

    const detailModal      = document.getElementById('detailModal');
    const modalBackdrop    = document.getElementById('modalBackdrop');
    const modalCloseBtn    = document.getElementById('modalCloseBtn');
    const modalBodyContent = document.getElementById('modalBodyContent');

    const openModal = (id) => {
        const data = detailData[id];
        if (!data || !detailModal || !modalBodyContent) return;

        let html = '';

        if (data.image) {
            html += `
                <div class="modal-thumb">
                    <img src="${data.image}" alt="${data.title}">
                </div>
            `;
        }

        html += `
            <div class="modal-header-meta font-mono">
                <span class="${data.tagClass || 'modal-tag'}">${data.badge}</span>
                <span class="text-light">&bull;</span>
                <span class="text-light" style="font-size: 0.72rem;">${data.category}</span>
            </div>
            <h2 class="modal-title" id="modalTitle">${data.title}</h2>
            <div class="modal-subtitle font-mono">${data.subtitle}</div>
            <p class="modal-desc">${data.desc}</p>
        `;

        if (data.highlights && data.highlights.length > 0) {
            html += `
                <div class="modal-section-heading font-mono">Poin Penting &amp; Rincian:</div>
                <ul class="modal-highlights">
                    ${data.highlights.map(h => `<li><i class="fa-solid fa-circle-check"></i> <span>${h}</span></li>`).join('')}
                </ul>
            `;
        }

        if (data.badges && data.badges.length > 0) {
            html += `
                <div class="modal-badges font-mono">
                    ${data.badges.map(b => `<span class="badge">${b}</span>`).join('')}
                </div>
            `;
        }

        if (data.action) {
            const targetAttr   = data.action.target ? `target="${data.action.target}" rel="noopener noreferrer"` : '';
            const downloadAttr = data.action.download ? 'download' : '';
            html += `
                <div class="modal-actions">
                    <a href="${data.action.url}" ${targetAttr} ${downloadAttr} class="btn btn-primary btn-sm font-mono">
                        <i class="${data.action.icon}"></i> ${data.action.text}
                    </a>
                </div>
            `;
        }

        modalBodyContent.innerHTML = html;
        detailModal.classList.add('active');
        detailModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!detailModal) return;
        detailModal.classList.remove('active');
        detailModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Trigger listener (delegated)
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal]');
        if (trigger) {
            // Ignore if clicked on an external link that is not a detail button
            if (e.target.closest('a') && !e.target.closest('.btn-detail-trigger') && !e.target.closest('.btn-project-detail') && !e.target.closest('.btn-achv-detail')) {
                return;
            }
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            openModal(modalId);
        }
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detailModal && detailModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ===== FOOTER LINKS SMOOTH SCROLL =====
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) window.scrollTo({ top: target.offsetTop - 90, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    });
});

