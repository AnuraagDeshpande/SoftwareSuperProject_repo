// navbar.js

function generateNavbar(passedIsLoggedIn, passedUsername) {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    // Get the current filename (e.g., "index.php", "account.php")
    const currentPage = window.location.pathname.split("/").pop();

    // Helper: render navbar
    function renderNavbar(isLoggedIn, username) {
        let leftSection = `
            <button id="hamburger" onclick="hideSidebar();">
                <i class="fa fa-bars" aria-hidden="true"></i>
            </button>
        `;
        navbar.innerHTML = `
            <div>
                ${leftSection} <span class="project-title">SuperProject</span>
            </div>
        `;

        if (isLoggedIn) {
            navbar.innerHTML += `
                <div class="navbar-user">
                    <span class="username">Welcome, ${username}</span>
                    <button class="dark-button" onclick="window.location.href='editInfo.php'" id="btn-account">
                        Account Details
                    </button>
                    <button class="dark-button" onclick="window.location.href='logout.php'" id="btn-logout">
                        Log out
                    </button>
                </div>
            `;
        } else {
            navbar.innerHTML += `
                <button class="dark-button" onclick="window.location.href='login.php'" id="btn-login">
                    Log in
                </button>
            `;
        }
    }

    // If login status was passed
    if (typeof passedIsLoggedIn !== "undefined" && typeof passedUsername !== "undefined") {
        renderNavbar(passedIsLoggedIn, passedUsername);
    } else {
        // Otherwise, fetch it from backend
        fetch('./auth_status.php')
            .then(res => res.json())
            .then(data => renderNavbar(data.isLoggedIn, data.username))
            .catch(err => {
                console.error("Navbar: login check failed", err);
                renderNavbar(false, "");
            });
    }
}

export { generateNavbar };
