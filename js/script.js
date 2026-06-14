// js/script.js — Eco-Tech Professional SPA Portfolio

document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER: Terminal & Decryption Effect =====
    const preloader       = document.getElementById('preloader');
    const preloaderLogo   = document.getElementById('preloader-logo');
    const preloaderBar    = document.getElementById('preloader-bar');
    const preloaderPercent = document.getElementById('preloader-percent');
    const terminalConsole = document.getElementById('terminal-console');

    if (preloader) {
        let progress = 0;
        const totalDuration = 2500; // 2.5 seconds total
        const intervalTime = 30; // update speed
        const steps = totalDuration / intervalTime;
        const increment = 100 / steps;

        // Terminal logs
        const logs = [
            { threshold: 0,   text: '> initializing_core_matrix...' },
            { threshold: 25,  text: '> establishing_creative_modules...' },
            { threshold: 50,  text: '> loading_experience_database...' },
            { threshold: 75,  text: '> launching_portfolio_interface...' },
            { threshold: 100, text: '> system_ready. booting_interface...' }
        ];
        
        let activeLogIndex = -1;

        const updatePreloader = () => {
            progress = Math.min(progress + increment + Math.random() * 0.8, 100);
            
            // 1. Update Progress Bar & Percentage
            if (preloaderBar) preloaderBar.style.width = `${progress}%`;
            if (preloaderPercent) preloaderPercent.textContent = `${Math.floor(progress)}%`;

            // 2. FRSY Decryption Animation Stages
            let logoText = '£314';
            if (progress >= 80) {
                logoText = 'FRSY.';
            } else if (progress >= 60) {
                logoText = 'FRS£';
            } else if (progress >= 40) {
                logoText = 'FR&£';
            } else if (progress >= 20) {
                logoText = 'F(*"3';
            }
            if (preloaderLogo) preloaderLogo.textContent = logoText;

            // 3. Update Terminal Console Log (Single Line Replacement)
            logs.forEach((log, index) => {
                if (progress >= log.threshold && index > activeLogIndex) {
                    activeLogIndex = index;
                    const consoleLine = document.getElementById('terminal-console-line');
                    if (consoleLine) {
                        consoleLine.textContent = log.text;
                    }
                }
            });

            // 4. Complete Sequence
            if (progress >= 100) {
                clearInterval(loaderInterval);
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                }, 400);
            }
        };

        const loaderInterval = setInterval(updatePreloader, intervalTime);
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

    document.querySelectorAll('.skills-bento, .achievements-bento, .projects-bento, .timeline')
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
