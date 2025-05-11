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
            <button class="dark-button sidebar-button"  onclick="document.location='Task-view.html'">
                Tasks
                <div class="sidebar-status active">
                </div>
            </button>
            <button class="dark-button sidebar-button">
                Error example
                <div class="sidebar-status error">
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
