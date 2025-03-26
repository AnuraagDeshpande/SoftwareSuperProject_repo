/** toggle the class list of a sidebar to include or not the sidebar-hidden */
export function hideSidebar(){
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("sidebar-hidden");
}

/** create html inside the sidebar class div on the page */
export function generateSidebar(){
    const sidebar = document.querySelector(".sidebar");
    if(sidebar){
        sidebar.innerHTML = `
        <h1>NAME</h1>
        <div class="sidebar-links">
            <button class="dark-button sidebar-button">
                <a href="project_list.php">
                Projects
                </a>
                <div class="sidebar-status active">
                    1
                </div>
            </button>        
            <button class="dark-button sidebar-button">
                <a>
                    Team
                </a>
                <div class="sidebar-status error">
                5
                </div>
            </button>
            <button class="dark-button sidebar-button">
                <a href="Task-view.html">
                    Tasks
                </a>
                <div class="sidebar-status">
                </div>
            </button>
            <button class="dark-button sidebar-button">
                <a>
                    Schedule
                </a>
                <div class="sidebar-status">
                </div>
            </button>
        </div>
        <div class="sidebar-infocard">
            There are some things that need to be done...
            <div>
            <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </div>
        </div>
        `;
    } else {
        console.log("no sidebar found");
    }
    
}
