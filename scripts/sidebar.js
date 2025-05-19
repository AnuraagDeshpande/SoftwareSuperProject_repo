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
        <h1>SuperProject</h1>
        <div class="sidebar-links">
            <button class="dark-button sidebar-button"  onclick="document.location='index.php'">
                Main page
                <div class="sidebar-status active">
                </div>
            </button>
            <button class="dark-button sidebar-button" onclick="document.location='project_list.php'" id="btn-project-list">
                Projects
                <div class="sidebar-status active">
                </div>
            </button>        
            <button class="dark-button sidebar-button"  onclick="document.location='kanban_board.php'">
                Tasks
                <div class="sidebar-status active">
                </div>
            </button>
        </div>
        `;
    } else {
        console.log("no sidebar found");
    }
    
}
