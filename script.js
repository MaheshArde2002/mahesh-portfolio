(function() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
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

    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

    // Skill tabs
    const skillTabs = document.querySelectorAll('#skillTabs .tab');
    const skillContents = {
        tab1: document.getElementById('tab1'),
        tab2: document.getElementById('tab2'),
        tab3: document.getElementById('tab3')
    };
    skillTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            skillTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            Object.values(skillContents).forEach(c => c.classList.remove('active'));
            const target = document.getElementById(this.dataset.tab);
            if (target) target.classList.add('active');
        });
    });

    // Project filters
    const filterBtns = document.querySelectorAll('#projectFilters .tab');
    const projectCards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;
            projectCards.forEach(card => {
                const type = card.dataset.type;
                if (filter === 'all' || type === filter) card.classList.add('active');
                else card.classList.remove('active');
            });
        });
    });

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you, Mahesh will get back to you soon!');
        this.reset();
    });

    // Skill bars animation (if you add .skill-progress elements later)
    const bars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const w = bar.dataset.width || '70';
                bar.style.width = w + '%';
            }
        });
    }, { threshold: 0.3 });
    bars.forEach(b => observer.observe(b));
})();