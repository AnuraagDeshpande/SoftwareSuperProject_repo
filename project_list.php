<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>projects</title>
        <link href="styles/main.css" rel="stylesheet"/>
        <link href="styles/sidebar.css" rel="stylesheet"/>
        <link href="styles/navbar.css" rel="stylesheet"/>
        <link rel="stylesheet" href="styles/Style-task.css">
        <link href="styles/project_list.css" rel="stylesheet"/>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body>
        <!--NAVIGATION BAR CODE-->
        <div class="navbar">
        <!--javaScript-->
        </div>

        <div class="page-body">
            <!--SIDEBAR CODE-->
            <div class="sidebar">
            <!--javaScript-->
            </div>

            <div class="pop-up-screen">
                <div class="pop-up-back"></div>
                
                <div class="pop-up-card add-project-card">
                    <i class="fa fa-times close-add-project js-hide-add-project" aria-hidden="true"></i>
                    <h1>Add a project:</h1>
                    <div class="error-message"></div>
                    <input type="text" id="project-name" placeholder="Project name" class="js-pop-up-field" pattern="[A-Za-z0-9 ,.]+" >
                    <textarea type="text" id="project-desc" placeholder="Project description" cols="40" rows="5" class="js-pop-up-field" pattern="[A-Za-z0-9 ,.]+" ></textarea>
                    <div>
                    <button id="add-project-submit" class="cool-button">Submit</button>
                    <button id="add-project-clear" class="cool-button">Clear</button>
                    </div>
                </div>
            </div>

            <!--LOCAL MENU-->
            <div class="task-overview">
                <div class="task-search-panel">
                    <div class="input-container">
                        <label for="filter-project-name">Project Name</label>
                        <input type="text" id="filter-project-name" placeholder="Search by project name">
                    </div>
                    <div class="input-container">
                        <label for="filter-description">Description</label>
                        <input type="text" id="filter-description" placeholder="Search by description">
                    </div>
                    <div class="input-container">
                        <label for="filter-access">Access level</label>
                        <select id="filter-access"><option value="none">None</option>
                            <option value="owner">Owner</option>
                            <option value="participant">participant</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <button id="btn-search">Search</button>
                </div>
                <div class="task-management-panel">
                        <button id="btn-add-project">New project</button>
                        <button id="btn-sort">Sort</button>
                        <button id="btn-print">Print</button>
                </div>
            </div>

            <!--PROJECTS GRID-->
            <div class="projects-grid js-project-list">
            <!--javaScript in project_list.js-->
            </div>
        </div>
        <script type="module" src="scripts/navigation.js"></script>
        <script type="module" src="scripts/project_list.js"></script>
    </body>
</hrml>