document.addEventListener("DOMContentLoaded", function () {
    console.log("Signup form validation loaded");

    let form = document.querySelector("form");
    let fullNameInput = document.getElementById("full-name");
    let usernameInput = document.getElementById("username");
    let passwordInput = document.getElementById("password");

    // Validate full name (only letters and spaces)
    if (fullNameInput) {
        fullNameInput.addEventListener("input", function () {
            let nameRegex = /^[A-Za-z\s]+$/;
            fullNameInput.setCustomValidity(nameRegex.test(fullNameInput.value) ? "" : "Only letters and spaces allowed.");
        });
    }

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
