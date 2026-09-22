// js/script.js — Faresya Brilyan Portfolio

document.addEventListener('DOMContentLoaded', () => {

    // ===== OPENING GATE — Elegant Cinematic Intro =====
    const preloader     = document.getElementById('preloader');
    const logoWrap      = document.getElementById('gate-logo-wrap');
    const gateBrand     = document.getElementById('gate-brand');
    const sweepLine     = document.getElementById('gate-sweep-line');
    const tagline       = document.getElementById('gate-tagline');
    const taglineText   = document.getElementById('gate-tagline-text');
    const progressBar   = document.getElementById('gate-progress-bar');

    if (preloader) {
        // --- Phase 1: Stagger elements in ---
        setTimeout(() => logoWrap  && logoWrap.classList.add('animate-in'),   80);
        setTimeout(() => gateBrand && gateBrand.classList.add('animate-in'),  80);
        setTimeout(() => sweepLine && sweepLine.classList.add('animate'),      800);
        setTimeout(() => tagline   && tagline.classList.add('animate-in'),     1150);

        // --- Phase 2: Typewriter tagline ---
        const taglineStr = 'building_systems • crafting_experiences';
        let charIdx = 0;
        const typeSpeed = 38; // ms per char
        const typeDelay = 1300;

        const typewriter = () => {
            if (!taglineText) return;
            if (charIdx < taglineStr.length) {
                taglineText.textContent += taglineStr[charIdx++];
                setTimeout(typewriter, typeSpeed);
            }
        };
        setTimeout(typewriter, typeDelay);

        // --- Phase 3: Progress bar fills to 100% ---
        let progress = 0;
        const totalMs   = 2600; // total preloader duration
        const tickMs    = 30;
        const baseIncrement = 100 / (totalMs / tickMs);

        const tickProgress = setInterval(() => {
            // Ease-in: faster start, slower near end
            const eased = progress < 70
                ? baseIncrement * (1 + Math.random() * 0.6)
                : baseIncrement * (0.35 + Math.random() * 0.2);
            progress = Math.min(progress + eased, 100);
            if (progressBar) progressBar.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(tickProgress);
                triggerExit();
            }
        }, tickMs);

        // --- Phase 4: Curtain split exit ---
        const triggerExit = () => {
            setTimeout(() => {
                preloader.classList.add('gate-exit');
                // After curtain animation finishes, hide fully
                setTimeout(() => {
                    preloader.classList.add('gate-hidden');
                    document.body.style.overflow = '';
                }, 800);
            }, 300);
        };

        // Lock scroll while gate is open
        document.body.style.overflow = 'hidden';
    }


    // ===== BACKGROUND DOTS PARALLAX (desktop only) =====
    const bgDots = document.getElementById('bg-dots');
    if (bgDots) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth >= 768) {
                bgDots.style.transform = `translateY(${window.scrollY * 0.18}px)`;
            } else {
                bgDots.style.transform = 'none';
            }
        }, { passive: true });
    }

    // ===== CURSOR GLOW (desktop only) =====
    const cursorGlow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow && window.innerWidth >= 768) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top  = e.clientY + 'px';
        }
    }, { passive: true });

    // ===== HERO MOUSE PARALLAX (desktop only) =====
    const hero    = document.querySelector('.hero');
    const heroImg = document.querySelector('.hero-img');
    const heroAura = document.querySelector('.hero-img-aura');

    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            const x = (e.clientX / window.innerWidth  - 0.5) * 22;
            const y = (e.clientY / window.innerHeight - 0.5) * 22;
            if (heroImg)  heroImg.style.transform  = `translate(${x}px, ${y}px) rotateX(${-y / 2}deg) rotateY(${x / 2}deg)`;
            if (heroAura) heroAura.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
        }, { passive: true });

        hero.addEventListener('mouseleave', () => {
            if (heroImg)  heroImg.style.transform  = '';
            if (heroAura) heroAura.style.transform = '';
        });
    }

    // ===== NAVBAR: Sticky Class + Smooth Scroll + Active Link =====
    const navbar   = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky class
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 80);
        }

        // Active link tracking
        let current = '';
        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop - 200) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    }, { passive: true });

    // Smooth scroll on nav click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
            // Close mobile menu if open
            navLinksContainer && navLinksContainer.classList.remove('open');
            mobileMenuBtn && mobileMenuBtn.classList.remove('open');
            navbar && navbar.classList.remove('menu-open');
        });
    });

    // ===== MOBILE MENU =====
    const mobileMenuBtn     = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
            mobileMenuBtn.classList.toggle('open');
            if (navbar) navbar.classList.toggle('menu-open');
        });
    }

    // ===== SCROLL REVEAL (IntersectionObserver) =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
        .forEach(el => revealObserver.observe(el));

    // ===== STAGGERED CHILD REVEAL =====
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, i) => {
                    setTimeout(() => child.classList.add('visible'), i * 80);
                });
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skills-bento, .achievements-grid, .projects-list, .timeline')
        .forEach(el => {
            // Wrap immediate children in stagger class
            Array.from(el.children).forEach(child => {
                child.classList.add('stagger-child');
            });
            staggerObserver.observe(el);
        });

    // ===== SKILLS FILTER =====
    const setupFilter = (filterId, targetSelector) => {
        const filterContainer = document.getElementById(filterId);
        if (!filterContainer) return;

        const buttons = filterContainer.querySelectorAll('.filter-tab');
        const cards   = document.querySelectorAll(targetSelector);

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                cards.forEach(card => {
                    const categories = (card.dataset.category || '').split(' ');
                    const show = filter === 'all' || categories.includes(filter);

                    card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                    if (show) {
                        card.classList.remove('hidden');
                        requestAnimationFrame(() => {
                            card.style.opacity   = '1';
                            card.style.transform = '';
                        });
                    } else {
                        card.style.opacity   = '0';
                        card.style.transform = 'scale(0.92)';
                        setTimeout(() => card.classList.add('hidden'), 350);
                    }
                });
            });
        });
    };

    setupFilter('skills-filter', '.skill-bento-card');
    setupFilter('experience-filter', '.timeline-item');

    // ===== CONTACT FORM — mailto handler =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            const body = `${message}\n\n---\nPengirim: ${name}\nEmail: ${email}`;
            const url  = `mailto:brilyannfaresya02@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = url;
        });
    }

    // ===== FOOTER LINKS SMOOTH SCROLL =====
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
        });
    });

});
