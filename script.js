document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PRELOADER
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hide');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 2500);
    });

    /* ==========================================================================
       2. DYNAMIC SCROLL THEME (SLOW FADE)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const body = document.body;

    const themeObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Triggers when section crosses the middle of the screen
        threshold: 0
    };

    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Dark Sections
                if (sectionId === 'home' || sectionId === 'skills' || sectionId === 'projects' || sectionId === 'certificates') {
                    body.classList.add('dark-theme');
                } 
                // Light / Gradient Sections
                else {
                    body.classList.remove('dark-theme');
                }
            }
        });
    }, themeObserverOptions);

    sections.forEach(section => {
        themeObserver.observe(section);
    });

    /* ==========================================================================
       3. CUSTOM CURSOR (Desktop Only)
       ========================================================================== */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const hoverElements = document.querySelectorAll('a, button, input, textarea, .skill-card, .cert-card, .journey-card');
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (isFinePointer && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover-active'));
        });
    }

    /* ==========================================================================
       4. ANIMATED MOBILE NAVIGATION
       ========================================================================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle Menu and Hamburger Animation
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('show-menu');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('show-menu');
        });
    });

    /* ==========================================================================
       5. STICKY HEADER & ACTIVE NAV LINK (SCROLL SPY)
       ========================================================================== */
    const header = document.getElementById('header');
    const allSections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY >= 50) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }

        let current = '';
        allSections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // This ensures the Resume link highlights properly when scrolled to
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       6. TYPING EFFECT (ASPIRING IS STATIC)
       ========================================================================== */
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const roles = [
            "Full-Stack Developer.", 
            "Cybersecurity Expert.", 
            "UI/UX Designer.", 
            "Problem Solver."
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40; 
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80; 
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 1500; 
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500; 
            }
            
            setTimeout(type, typingSpeed);
        }
        
        setTimeout(type, 2800);
    }

    /* ==========================================================================
       7. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealOnScroll.observe(el));

    /* ==========================================================================
       8. CONTACT FORM HANDLING
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.form-submit');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const formAction = this.getAttribute('action');

            if (formAction.includes('YOUR_FORMSPREE_ID')) {
                setTimeout(() => {
                    formStatus.textContent = 'Setup required: Please add your Formspree ID to the HTML.';
                    formStatus.classList.add('error');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 1000);
                return;
            }

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.textContent = "Oops! There was a problem submitting your form.";
                        }
                        formStatus.classList.add('error');
                    });
                }
            })
            .catch(() => {
                formStatus.textContent = 'Network error. Please try again.';
                formStatus.classList.add('error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    /* ==========================================================================
       9. BACK TO TOP BUTTON & CURRENT YEAR
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});