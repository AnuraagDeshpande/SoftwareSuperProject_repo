<?php
// Enable PHP error reporting (development only)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include init.php for DB connection, BASE_URL, and session
require_once(__DIR__ . '/Backend/init.php');

//we get the project if from the path
$project_id = isset($_GET['project_id']) ? $_GET['project_id'] : 0;
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>project charter</title>
        <link href="styles/main.css" rel="stylesheet"/>
        <link href="styles/sidebar.css" rel="stylesheet"/>
        <link href="styles/navbar.css" rel="stylesheet"/>
        <link rel="stylesheet" href="styles/project_charter.css">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body>
        <script>
            const BASE_URL = <?= json_encode(BASE_URL) ?>;
        </script>
        <!--NAVIGATION BAR CODE-->
        <div class="navbar">
            <!--javaScript-->
        </div>

        <div class="sidebar">
            <!--javaScript-->
        </div>

        <div class="page-body">
            <!--SIDEBAR CODE-->
            
            <form>
                <h1>Project charter editing page:</h1>
                <div class="input-container">
                    <div class="error-message"></div>
                    <!--BASIC INFO-->
                    <h2>Essential information:</h2>
                    <label for="project-title">Project title/name:</label>
                    <input type="text" id="project-title" placeholder="Project name" pattern="[A-Za-z0-9 ,.]+" required>
                    <label for="project-desc">Description:</label>
                    <textarea type="text" id="project-desc" placeholder="Project description" cols="50" rows="5" class="js-pop-up-field" pattern="[A-Za-z0-9 ,.]+" ></textarea required>
                    <!--IMPORTANT INFO-->
                    <h2>Goals of the project:</h2>
                    <!--deadline-->
                    <input type="date" id="project-deadline" value="2069-12-12" required/>
                    <!--purpose-->
                    <label for="project-purpose">Purpose:</label>
                    <input type="text" id="project-purpose" placeholder="Project purpose" pattern="[A-Za-z0-9 ,.]+" required>
                    <!--objective-->
                    <label for="project-objective">Objective:</label>
                    <textarea type="text" id="project-objective" placeholder="Project objective" cols="50" rows="5" class="js-pop-up-field" pattern="[A-Za-z0-9 ,.]+" required></textarea>
                    <label for="project-accept-crt">Acceptance criteria:</label>
                    <!--acceptance-->
                    <input type="text" id="project-acceptance" placeholder="Acceptance criteria" pattern="[A-Za-z0-9 ,.]+" required>
                    <!--adding a deliverable-->
                    <h2>Other info</h2>
                    <!--DELIVERABLES-->
                    <label for="deliverables">Deliverables:</label>
                    <div class="input-container add-deliverable">
                        <input type="text" id="deliverables" placeholder="New deliverable" pattern="[A-Za-z0-9 ,.]+" >
                        <button id="add-deliverable"class="blob cool-button">
                            Add
                        </button>
                    </div>
                    <div id="project-deliverables" class="project-list">
                        <!--javascript-->
                    </div>
                    <!--ASSUMPTIONS-->
                    <label for="assumptions">Assumptions:</label>
                    <div class="input-container add-deliverable">
                        <input type="text" id="assumptions" placeholder="New assumption" pattern="[A-Za-z0-9 ,.]+" >
                        <button id="add-assumptions"class="blob cool-button">
                            Add
                        </button>
                    </div>
                    <div id="project-assumptions" class="project-list">
                        <!--javascript-->
                    </div>
                    <!--CONSTRAINTS-->
                    <label for="constraints">Constraints:</label>
                    <div class="input-container add-deliverable">
                        <input type="text" id="constraints" placeholder="New constraint" pattern="[A-Za-z0-9 ,.]+" >
                        <button id="add-constraints"class="blob cool-button">
                            Add
                        </button>
                    </div>
                    <div id="project-constraints" class="project-list">
                        <!--javascript-->
                    </div>
                    <!--RISKS-->
                    <label for="risks">Risks:</label>
                    <div class="input-container add-deliverable">
                        <input type="text" id="risks" placeholder="New risk" pattern="[A-Za-z0-9 ,.]+" >
                        <button id="add-risks"class="blob cool-button">
                            Add
                        </button>
                    </div>
                    <div id="project-risks" class="project-list">
                        <!--javascript-->
                    </div>
                    <input type="submit" class="cool-button" value="Submit">
                </div>
            </form>
        </div>

        <script type="module" src="scripts/navigation.js"></script>
        <script type="module" src="scripts/project_charter.js"></script>
        <script type="module">
            //we get the project id
             const projectId = <?php echo json_encode($project_id); ?>;
            //The code is ran here to make the page interactive
            //this can be seen similar to a main function as it allows for
            //easier testing without weird js errors
            import { setUpFun  } from "./scripts/project_charter.js";
            setUpFun(projectId);
        </script>
    </body>
</html>