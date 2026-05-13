// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Starfield Animation ---
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    const starCount = 150;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    };

    const initStars = () => {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random()
            });
        }
    };

    const drawStars = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        
        stars.forEach(star => {
            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Move star
            star.y -= star.speed;
            if (star.y < 0) {
                star.y = canvas.height;
                star.x = Math.random() * canvas.width;
            }
        });
        
        requestAnimationFrame(drawStars);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawStars();

    // --- Custom Cursor Glow ---
    const cursorGlow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });

    // --- Hero Mouse Parallax ---
    const hero = document.querySelector('.hero');
    const heroImg = document.querySelector('.hero-img');
    const glowSphere = document.querySelector('.glow-sphere');

    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 30;
            const y = (clientY / window.innerHeight - 0.5) * 30;

            if (heroImg) heroImg.style.transform = `translate(${x}px, ${y}px) rotateX(${-y/2}deg) rotateY(${x/2}deg)`;
            if (glowSphere) glowSphere.style.transform = `translate(${-x}px, ${-y}px)`;
        });
    }

    // --- Smooth Scrolling ---
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 120;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                navLinks.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollPos >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Sticky Navbar effect
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollPos > 100) {
                navbar.style.padding = '0.5rem 2rem';
                navbar.style.background = 'rgba(10, 15, 28, 0.9)';
            } else {
                navbar.style.padding = '0.75rem 2rem';
                navbar.style.background = 'var(--glass-bg)';
            }
        }
    });

    // --- Filtering Functionality ---
    const setupFiltering = (sectionId, cardSelector) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const filterBtns = section.querySelectorAll('.filter-btn');
        const cards = section.querySelectorAll(cardSelector);
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                cards.forEach(card => {
                    card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                    if (filterValue === 'all') {
                        card.classList.remove('hidden');
                        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
                    } else {
                        const categories = (card.getAttribute('data-category') || '').split(' ');
                        if (categories.includes(filterValue)) {
                            card.classList.remove('hidden');
                            setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.9)';
                            setTimeout(() => card.classList.add('hidden'), 400);
                        }
                    }
                });
            });
        });
    };

    setupFiltering('skills', '.skill-card');
    setupFiltering('experience', '.exp-card');

    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('show-menu');
        });

        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('show-menu');
            });
        });
    }
});


