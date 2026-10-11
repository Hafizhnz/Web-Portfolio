/* ===================================
   PORTFOLIO INTERACTIVE SCRIPTS
   Hafizh Naufal Zain - System Analyst
   Futuristic Tech Theme
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursorGlow();
    initNavbar();
    initScrollProgress();
    initTypingEffect();
    initCountUp();
    initScrollReveal();
    initParallax();
    initContactForm();
    initSmoothScroll();
    initTiltCards();
});

/* ===================================
   PARTICLE SYSTEM
   =================================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            // Cyan and purple particles for tech theme
            const colors = ['0, 245, 255', '191, 0, 255', '123, 97, 255'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x -= (dx / dist) * force * 0.8;
                    this.y -= (dy / dist) * force * 0.8;
                }
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles (optimized for mobile)
    const particleCount = window.innerWidth < 768 ? 32 : Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.12;
                    ctx.beginPath();
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(0, 245, 255, ${opacity})`);
                    gradient.addColorStop(1, `rgba(191, 0, 255, ${opacity})`);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

/* ===================================
   CURSOR GLOW EFFECT
   =================================== */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    // Only on desktop
    if (window.innerWidth < 768) {
        glow.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        glowX += (mouseX - glowX) * 0.06;
        glowY += (mouseY - glowY) * 0.06;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(updateGlow);
    }

    updateGlow();
}

/* ===================================
   NAVBAR
   =================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-cv-btn');

    function openMenu() {
        if (!navToggle || !navMenu) return;
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.classList.add('nav-open');
        navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        if (!navToggle || !navMenu) return;
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('data-section')) {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            }
        });
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navMenu && navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Close on overlay click
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close on resize if screen becomes larger than 768px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* ===================================
   SCROLL PROGRESS
   =================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/* ===================================
   TYPING EFFECT
   =================================== */
function initTypingEffect() {
    const element = document.getElementById('typingText');
    if (!element) return;

    const texts = [
        'System Analyst',
        'Business Analyst',
        'Solution Architect',
        'Process Designer',
        'Tech Consultant'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

/* ===================================
   COUNT UP ANIMATION
   =================================== */
function initCountUp() {
    const stats = document.querySelectorAll('.about-stat-number');

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-target'));
        if (isNaN(target)) return;
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statsInSection = entry.target.querySelectorAll('.about-stat-number');
                statsInSection.forEach(stat => animateCount(stat));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        observer.observe(aboutStats);
    }
}

/* ===================================
   SCROLL REVEAL WITH STAGGER
   =================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-scroll-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay based on siblings
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll('[data-scroll-reveal]');
                let siblingIndex = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) siblingIndex = i;
                });

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, siblingIndex * 100);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: window.innerWidth < 768 ? '0px 0px -15px 0px' : '0px 0px -60px 0px'
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });
}

/* ===================================
   PARALLAX EFFECTS
   =================================== */
function initParallax() {
    const heroGlows = document.querySelectorAll('.hero-glow');
    const heroGrid = document.querySelector('.hero-grid-bg');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Parallax on hero elements
        heroGlows.forEach((glow, index) => {
            const speed = (index + 1) * 0.15;
            glow.style.transform = `translateY(${scrollY * speed}px)`;
        });

        if (heroGrid) {
            heroGrid.style.transform = `translateY(${scrollY * 0.05}px)`;
        }
    });

    // Mouse parallax on hero
    if (window.innerWidth > 768) {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 10;
                const y = (e.clientY / window.innerHeight - 0.5) * 10;

                heroGlows.forEach((glow, index) => {
                    const factor = (index + 1) * 1.5;
                    glow.style.marginLeft = `${x * factor}px`;
                    glow.style.marginTop = `${y * factor}px`;
                });
            });
        }
    }
}

/* ===================================
   TILT EFFECT ON CARDS
   =================================== */
function initTiltCards() {
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.skill-card, .timeline-content');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

            // Move glow element
            const glowEl = card.querySelector('.skill-card-glow');
            if (glowEl) {
                glowEl.style.left = `${x - rect.width}px`;
                glowEl.style.top = `${y - rect.height}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ===================================
   CONTACT FORM
   =================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;

        // Simulate submission
        btn.innerHTML = `
            <span style="display:flex;align-items:center;gap:8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Mengirim...
            </span>
        `;
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = `
                <span style="display:flex;align-items:center;gap:8px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Pesan Terkirim!
                </span>
            `;
            btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
            btn.style.color = '#050816';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
                form.reset();
            }, 2500);
        }, 1500);
    });
}

/* ===================================
   SMOOTH SCROLL
   =================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                // Custom smooth scroll with easing
                const startPosition = window.scrollY;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;

                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    // Cubic ease-in-out
                    const eased = progress < 0.5
                        ? 4 * progress * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                    window.scrollTo(0, startPosition + distance * eased);

                    if (progress < 1) {
                        requestAnimationFrame(animation);
                    }
                }

                requestAnimationFrame(animation);
            }
        });
    });
}

/* ===================================
   CSS ANIMATION KEYFRAME (injected)
   =================================== */
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
