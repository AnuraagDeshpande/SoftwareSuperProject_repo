/** generate the html inside a div with navbar class */
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
            <button class="dark-button" onclick="document.location='login.html'" id="btn-login">
                Sign Up
            </button>
        `;
    } else {
        console.log("no navbar found");
    }
}