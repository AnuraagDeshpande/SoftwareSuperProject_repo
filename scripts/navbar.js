/** generate the html inside a div with navbar class */
export function generateNavbar(passedIsLoggedIn, passedUsername) {
    const navbar = document.querySelector(".navbar");
    console.log("Navbar generation triggered");

    // If login status is not passed, fetch it from the server
    if (typeof passedIsLoggedIn === "undefined" || typeof passedUsername === "undefined") {
        fetch('./auth_status.php')
            .then(res => res.json())
            .then(data => {
                console.log("Fetched isLoggedIn:", data.isLoggedIn);
                console.log("Fetched Username:", data.username);
                renderNavbar(data.isLoggedIn, data.username);
            })
            .catch(err => {
                console.error("Failed to fetch login status:", err);
                renderNavbar(false, '');
            });
    } else {
        console.log("isLoggedIn:", passedIsLoggedIn);
        console.log("Username:", passedUsername);
        renderNavbar(passedIsLoggedIn, passedUsername);
    }

    function renderNavbar(isLoggedIn, username) {
        if (navbar) {
            navbar.innerHTML = `
                <div>
                    <button id="hamburger" onclick="hideSidebar();">
                        <i class="fa fa-bars" aria-hidden="true"></i>
                    </button>
                    <a href="./index.php">NAME</a>
                </div>
            `;

            if (isLoggedIn) {
                navbar.innerHTML += `
                    <div class="navbar-user">
                        <span class="username">${username}</span> <!-- Display the username -->
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
        } else {
            console.log("No navbar found");
        }
    }
}
