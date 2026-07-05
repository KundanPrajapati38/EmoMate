document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    if (!languageToggle) {
        console.error('Language toggle element not found.');
        return;
    }

    const translations = {
        'en': {
            'welcome_message': 'Welcome to EmoMate!',
            'understand_emotions': 'Understand your emotions and improve your mental health.',
            'signup_button': 'Sign Up',
            'login_heading': 'Login',
            'username_placeholder': 'Username',
            'username_label': 'Username',
            'username_invalid': 'Please enter your username.',
            'password_placeholder': 'Password',
            'password_label': 'Password',
            'password_invalid': 'Please enter your password.',
            'remember_me': 'Remember me',
            'forgot_password': 'Forgot password?',
            'login_button': 'Login',
            'or_divider': 'OR',
            'login_with_google': 'Login with Google',
            'login_with_facebook': 'Login with Facebook',
            'email_placeholder': 'Email',
            'email_label': 'Email',
            'email_invalid': 'Please enter a valid email address.',
            'signup_heading': 'Sign Up',
            'signup_with_google': 'Sign Up with Google',
            'signup_with_facebook': 'Sign Up with Facebook',
            'toggle_label': 'हिंदी / English'
        },
        'hi': {
            'welcome_message': 'EmoMate में आपका स्वागत है!',
            'understand_emotions': 'अपनी भावनाओं को समझें और अपने मानसिक स्वास्थ्य को बेहतर बनाएं।',
            'signup_button': 'साइन अप करें',
            'login_heading': 'लॉगिन',
            'username_placeholder': 'उपयोगकर्ता नाम',
            'username_label': 'उपयोगकर्ता नाम',
            'username_invalid': 'कृपया अपना उपयोगकर्ता नाम दर्ज करें।',
            'password_placeholder': 'पासवर्ड',
            'password_label': 'पासवर्ड',
            'password_invalid': 'कृपया अपना पासवर्ड दर्ज करें।',
            'remember_me': 'मुझे याद रखें',
            'forgot_password': 'पासवर्ड भूल गए?',
            'login_button': 'लॉगिन',
            'or_divider': 'या',
            'login_with_google': 'Google के साथ लॉगिन करें',
            'login_with_facebook': 'Facebook के साथ लॉगिन करें',
            'email_placeholder': 'ईमेल',
            'email_label': 'ईमेल',
            'email_invalid': 'कृपया एक वैध ईमेल पता दर्ज करें।',
            'signup_heading': 'साइन अप करें',
            'signup_with_google': 'Google के साथ साइन अप करें',
            'signup_with_facebook': 'Facebook के साथ साइन अप करें',
            'toggle_label': 'हिंदी / English'
        }
    };

    // Function to set the language
    function setLanguage(lang) {
        document.documentElement.lang = lang;
        const t = translations[lang];

        // Update content based on translation keys
        const path = window.location.pathname;

        if (path.includes('/login')) {
            const authImageH2 = document.querySelector('.auth-image-content h2');
            if (authImageH2) authImageH2.textContent = t.welcome_message;
            const authImageP = document.querySelector('.auth-image-content p');
            if (authImageP) authImageP.textContent = t.understand_emotions;
            const authImageLink = document.querySelector('.auth-image-content a.btn');
            if (authImageLink) {
                authImageLink.textContent = t.signup_button;
            }
            const authFormH2 = document.querySelector('.auth-form h2');
            if (authFormH2) authFormH2.textContent = t.login_heading;
            const usernameLabel = document.querySelector('label[for="username"]');
            if (usernameLabel) usernameLabel.textContent = t.username_label;
            const usernameInput = document.getElementById('username');
            if (usernameInput) usernameInput.placeholder = t.username_placeholder;
            const usernameInvalidFeedback = document.querySelector('#username + .invalid-feedback');
            if (usernameInvalidFeedback) usernameInvalidFeedback.textContent = t.username_invalid;
            const passwordLabel = document.querySelector('label[for="password"]');
            if (passwordLabel) passwordLabel.textContent = t.password_label;
            const passwordInput = document.getElementById('password');
            if (passwordInput) passwordInput.placeholder = t.password_placeholder;
            const passwordInvalidFeedback = document.querySelector('#password + .invalid-feedback');
            if (passwordInvalidFeedback) passwordInvalidFeedback.textContent = t.password_invalid;
            const rememberMeLabel = document.querySelector('label[for="rememberMe"]');
            if (rememberMeLabel) rememberMeLabel.textContent = t.remember_me;
            const forgotPasswordLink = document.querySelector('.forgot-password');
            if (forgotPasswordLink) forgotPasswordLink.textContent = t.forgot_password;
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton) submitButton.textContent = t.login_button;
            const divider = document.querySelector('.divider');
            if (divider) divider.textContent = t.or_divider;
            const googleBtn = document.querySelector('.google-btn');
            if (googleBtn) googleBtn.innerHTML = '<i class="fab fa-google"></i> ' + t.login_with_google;
            const facebookBtn = document.querySelector('.facebook-btn');
            if (facebookBtn) facebookBtn.innerHTML = '<i class="fab fa-facebook-f"></i> ' + t.login_with_facebook;
        } else if (path.includes('/signup')) {
            const authFormH2 = document.querySelector('.auth-form h2');
            if (authFormH2) authFormH2.textContent = t.signup_heading;

            const usernameLabel = document.querySelector('label[for="username"]');
            if (usernameLabel) usernameLabel.textContent = t.username_label;
            const usernameInput = document.getElementById('username');
            if (usernameInput) usernameInput.placeholder = t.username_placeholder;
            const usernameInvalidFeedback = document.querySelector('#username + .invalid-feedback');
            if (usernameInvalidFeedback) usernameInvalidFeedback.textContent = t.username_invalid;

            const emailLabel = document.querySelector('label[for="email"]');
            if (emailLabel) emailLabel.textContent = t.email_label;
            const emailInput = document.getElementById('email');
            if (emailInput) emailInput.placeholder = t.email_placeholder;
            const emailInvalidFeedback = document.querySelector('#email + .invalid-feedback');
            if (emailInvalidFeedback) emailInvalidFeedback.textContent = t.email_invalid;

            const passwordLabel = document.querySelector('label[for="password"]');
            if (passwordLabel) passwordLabel.textContent = t.password_label;
            const passwordInput = document.getElementById('password');
            if (passwordInput) passwordInput.placeholder = t.password_placeholder;
            const passwordInvalidFeedback = document.querySelector('#password + .invalid-feedback');
            if (passwordInvalidFeedback) passwordInvalidFeedback.textContent = t.password_invalid;

            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton) submitButton.textContent = t.signup_button;

            const divider = document.querySelector('.divider');
            if (divider) divider.textContent = t.or_divider;

            const googleBtn = document.querySelector('.google-btn');
            if (googleBtn) googleBtn.innerHTML = '<i class="fab fa-google"></i> ' + t.signup_with_google;

            const facebookBtn = document.querySelector('.facebook-btn');
            if (facebookBtn) facebookBtn.innerHTML = '<i class="fab fa-facebook-f"></i> ' + t.signup_with_facebook;

            const authImageH2 = document.querySelector('.auth-image-content h2');
            if (authImageH2) authImageH2.textContent = t.welcome_message;
            const authImageP = document.querySelector('.auth-image-content p');
            if (authImageP) authImageP.textContent = t.understand_emotions;
            const authImageLink = document.querySelector('.auth-image-content a.btn');
            if (authImageLink) {
                authImageLink.textContent = t.login_button;
            }
        }

        // This element exists on both pages
        if (languageToggle) {
            document.querySelector('label[for="languageToggle"]').textContent = t.toggle_label;
        }

        console.log('Language set to:', lang);
    }

    if (languageToggle) {
        languageToggle.addEventListener('change', function() {
            const newLanguage = this.checked ? 'hi' : 'en';
            localStorage.setItem('selectedLanguage', newLanguage);
            setLanguage(newLanguage);
        });

        // Set initial language based on saved preference or default to English
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        languageToggle.checked = (savedLanguage === 'hi');
        setLanguage(savedLanguage);
    }
});