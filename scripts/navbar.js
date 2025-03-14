export function generateNavbar(){
    const navbar=document.querySelector(".navbar");
    if(navbar){
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
            <a href="login.html">
                <button class="dark-button">
                        Sign Up
                </button>
            </a>
        `;
    } else {
        console.log("no navbar found");
    }
}