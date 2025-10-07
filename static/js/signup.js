document.addEventListener('DOMContentLoaded', function() {
    const passwordToggle = document.getElementById('password-toggle');
    const passwordField = document.getElementById('password');

    if (passwordToggle && passwordField) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle the eye icon
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
});