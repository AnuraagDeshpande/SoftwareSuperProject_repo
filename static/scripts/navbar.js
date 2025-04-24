export function generateNavbar() {
    const navbar = document.querySelector(".navbar");
    const isLoggedIn = document.body.getAttribute('data-user-logged-in') === 'true';
    let username = document.body.getAttribute('data-username');

    if (navbar) {
        navbar.innerHTML = `
            <div>
                <button id="hamburger" onclick="hideSidebar();">
                    <i class="fa fa-bars" aria-hidden="true"></i>
                </button>
                <a href="/">NAME</a>
            </div>
            <div class="user-info">
                ${isLoggedIn ? 
                    `<span>${username}</span>
                    <button class="dark-button" onclick="document.location='/logout'">Logout</button>` :
                    `<button class="dark-button" onclick="document.location='/login'">Log in</button>`
                }
            </div>
        `;
    } else {
        console.log("No navbar found");
    }
}

window.addEventListener('DOMContentLoaded', generateNavbar);
