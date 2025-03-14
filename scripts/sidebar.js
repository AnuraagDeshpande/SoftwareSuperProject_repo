/** toggle the class list of a sidebar to include or not the sidebar-hidden */
export function hideSidebar(){
    console.log("hiding side bar");
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("sidebar-hidden");
}

/** create html inside the sidebar class div on the page */
export function generateSidebar(){
    const sidebar = document.querySelector(".sidebar");
    if(sidebar){
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
    } else {
        console.log("no sidebar found");
    }
    
}
