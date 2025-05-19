
document.addEventListener("DOMContentLoaded", () => {
    const fullNameInput = document.querySelector("input[name='fullname']");
    const passwordInput = document.querySelector("input[name='new_password']");
  
    // Validate full name (only letters and spaces)
    if (fullNameInput) {
      fullNameInput.addEventListener("input", function () {
        const nameRegex = /^[A-Za-z\s]+$/;
        fullNameInput.setCustomValidity(
          nameRegex.test(fullNameInput.value)
            ? ""
            : "Only letters and spaces allowed."
        );
      });
    }
  
    // Validate password (at least 8 characters, no spaces, and no (' \" ;)
    if (passwordInput) {
      passwordInput.addEventListener("input", function () {
        const passwordRegex = /^(?!.*\s)(?!.*['\";]).{8,}$/;
        passwordInput.setCustomValidity(
          passwordRegex.test(passwordInput.value)
            ? ""
            : "At least 8 characters, no spaces or (' \" ;)"
        );
      });
    }
  });
  