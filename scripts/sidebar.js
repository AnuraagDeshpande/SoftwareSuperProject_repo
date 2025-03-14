export function hideSidebar(){
    console.log("hiding side bar");
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("sidebar-hidden");
}

export function generateSidebar(){
    const sidebar = document.querySelector(".sidebar");
    sidebar.innerHTML = `
    <h1>PMBOK</h1>
    <div></div>
    <h2 class="sidebar-subheader">General</h2>
    <button class="dark-button">
        <i class="fa fa-database" aria-hidden="true"></i>
        <div class="sidebar-label">
            Projects
        </div>
    </button>
    <button class="dark-button">
        <i class="fa fa-users" aria-hidden="true"></i>
        <div class="sidebar-label">
            Team
        </div>
    </button>
    `;
}

//we need to create the sidebar
