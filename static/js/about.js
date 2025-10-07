// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
});

// Counter animation for stats
const statsSection = document.querySelector('.impact-stats-section');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(span => {
                    const target = +span.dataset.target;
                    let current = 0;
                    const updateCounter = () => {
                        const increment = target / 200;
                        if (current < target) {
                            current += increment;
                            span.textContent = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            span.textContent = target;
                        }
                    };
                    updateCounter();
                });
                observer.disconnect();
            }
        });
    }, {
        threshold: 0.5
    });
    observer.observe(statsSection);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Team card hover effect
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    });
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    });
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-bs-theme', savedTheme);
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
    } else {
        body.classList.remove('dark-mode');
        if (themeToggle) themeToggle.checked = false;
    }
} else {
    // Default to light mode if no theme is saved
    body.setAttribute('data-bs-theme', 'light');
    body.classList.remove('dark-mode');
    if (themeToggle) themeToggle.checked = false;
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-bs-theme') === 'dark') {
            body.setAttribute('data-bs-theme', 'light');
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-bs-theme', 'dark');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    });
}