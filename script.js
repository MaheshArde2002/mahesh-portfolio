(function() {
    'use strict';

    // ========== Theme Toggle ==========
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    // Check saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // ========== Close Mobile Menu ==========
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const collapse = document.getElementById('navbarNav');
            const bsCollapse = bootstrap.Collapse.getInstance(collapse);
            if (bsCollapse) bsCollapse.hide();
        });
    });

    // ========== Smooth Scroll for Nav Links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar-custom').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Contact Form with Backend API ==========
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const subject = document.getElementById('formSubject').value.trim() || 'Portfolio Contact';
            const message = document.getElementById('formMessageText').value.trim();

            // Validate
            if (!name || !email || !message) {
                showMessage('Please fill in all required fields.', 'danger');
                return;
            }

            // Email validation
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'danger');
                return;
            }

            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, subject, message })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('Thank you! Mahesh will get back to you soon. 🎉', 'success');
                    contactForm.reset();
                } else {
                    showMessage(data.message || 'Something went wrong. Please try again.', 'danger');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Network error. Please check your connection and try again.', 'danger');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }
        });
    }

    // ========== Helper Functions ==========
    function showMessage(text, type) {
        formMessage.style.display = 'block';
        formMessage.className = `alert alert-${type}`;
        formMessage.textContent = text;
        
        // Auto hide after 6 seconds
        clearTimeout(window.messageTimeout);
        window.messageTimeout = setTimeout(() => {
            formMessage.style.display = 'none';
        }, 6000);
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ========== Intersection Observer for Animations ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate cards on scroll
    document.querySelectorAll('.role-card, .project-card, .skill-card, .cert-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ========== Console Welcome ==========
    console.log('%c🚀 Mahesh Arde Portfolio', 'font-size: 20px; font-weight: bold; color: #2563eb;');
    console.log('%cBuilt with ❤️ using HTML, CSS, JavaScript & Bootstrap', 'font-size: 14px; color: #64748b;');
    console.log('%c📧 mahesh.arde2002@gmail.com', 'font-size: 14px; color: #64748b;');

})();

