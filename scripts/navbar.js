function generateNavbar(){
    const navbar=document.querySelector(".navbar");
    navbar.innerHTML= `
        <div>
        <button id="hamburger" onclick="
            hideSidebar();
        ">
            <i class="fa fa-bars" aria-hidden="true"></i>
        </button>
        <a href="./index.php">
        NAME
        </a>
        </div>
        <button class="dark-button">
            Sign Up
        </button>
    `;
}

generateNavbar();