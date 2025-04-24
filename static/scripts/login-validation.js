document.addEventListener("DOMContentLoaded", function () {
    console.log("Login form validation loaded");

    let form = document.querySelector("form");
    let usernameInput = document.querySelector("input[type='text']");
    let passwordInput = document.querySelector("input[type='password']");

    // Validate username (only letters, numbers, and underscores)
    if (usernameInput) {
        usernameInput.addEventListener("input", function () {
            let usernameRegex = /^[A-Za-z0-9_]+$/;
            usernameInput.setCustomValidity(usernameRegex.test(usernameInput.value) ? "" : "Only letters, numbers, and underscores allowed.");
        });
    }

    // Validate password (at least 8 characters, no spaces, and no (' \" ;)
    if (passwordInput) {
        passwordInput.addEventListener("input", function () {
            let passwordRegex = /^(?!.*\s)(?!.*['";]).{8,}$/;
            passwordInput.setCustomValidity(passwordRegex.test(passwordInput.value) ? "" : "At least 8 chars, no (' \" ;).");
        });
    }

    // Form submission prevention if invalid
    form.addEventListener("submit", function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
        }
    });
});
