document.addEventListener('DOMContentLoaded', () => {
    console.log('settings.js: DOMContentLoaded event fired.');
    const themeToggle = document.getElementById('darkModeToggle');
    console.log('settings.js: themeToggle element:', themeToggle);
    const languageSelect = document.getElementById('languageSelect');
    const body = document.body;

    // Load saved preferences
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (themeToggle && savedTheme === 'dark-mode') {
            themeToggle.checked = true;
        }
    }

    // Dark Mode Toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (themeToggle.type === 'checkbox') { // Check if it's the settings page toggle
                if (themeToggle.checked) {
                    body.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark-mode');
                    updateServerTheme('dark-mode');
                } else {
                    body.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light-mode');
                    updateServerTheme('light-mode');
                }
            } else { // It's a button on other pages
                if (body.classList.contains('dark-mode')) {
                    body.classList.remove('dark-mode');
                } else {
                    body.classList.add('dark-mode');
                }
            }
        });
    }

    // Language Selection
    const applyLanguageBtn = document.getElementById('applyLanguageBtn');
    if (applyLanguageBtn && languageSelect) {
        applyLanguageBtn.addEventListener('click', () => {
            const selectedLanguage = languageSelect.value;
            applyLanguage(selectedLanguage);
        });
    }

    function applyLanguage(lang) {
        // Dynamically load translations from translations.json
        fetch('/static/translations.json')
            .then(response => response.json())
            .then(translations => {
                const elements = document.querySelectorAll('[data-lang-key]');
                elements.forEach(element => {
                    const key = element.getAttribute('data-lang-key');
                    if (translations[lang] && translations[lang][key]) {
                        element.textContent = translations[lang][key];
                    }
                });
            })
            .catch(error => console.error('Error loading translations:', error));

        // Make a server-side call to update the session language
        fetch(`/set_language/${lang}`)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to update language on server.');
                } else {
                    window.location.reload(); // Reload the page to apply new language
                }
            })
            .catch(error => console.error('Error updating language on server:', error));
    }

    // Initial application of language based on saved preference or default
    // Removed: applyLanguage(savedLanguage || 'en'); // Default to English if no preference saved

    function updateServerTheme(theme) {
        fetch(`/set_theme/${theme}`)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to update theme on server.');
                }
            })
            .catch(error => console.error('Error updating theme on server:', error));
    }
});