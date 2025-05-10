<?php
// Include the database connection (init.php should contain the DB connection setup)
require_once(__DIR__ . '/Backend/init.php');

// Make sure project_id is provided
if (!isset($_GET['project_id'])) {
    echo "No project ID provided.";
    exit;
}

$project_id = $_GET['project_id']; // Expecting URL like project_charter.php?project_id=1

// Fetch project charter details from the database
$sql = "SELECT * FROM project_charters WHERE project_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $project_id);
$stmt->execute();
$result = $stmt->get_result();

// Check if the project charter is found
if ($result->num_rows > 0) {
    $project_charter = $result->fetch_assoc();
} else {
    echo "Project charter not found.";
    exit;
}

// Fetch project details (title and description)
$sql_project = "SELECT title, description FROM projects WHERE id = ?";
$stmt_project = $conn->prepare($sql_project);
$stmt_project->bind_param("i", $project_id);
$stmt_project->execute();
$project_result = $stmt_project->get_result();
$project = $project_result->fetch_assoc();

// Decode JSON fields for purpose, deliverables, assumptions, constraints, risks
$purpose = json_decode($project_charter['purpose'], true);
$deliverables = json_decode($project_charter['deliverables'], true);
$assumptions = json_decode($project_charter['assumptions'], true);
$constraints = json_decode($project_charter['constraints'], true);
$risks = json_decode($project_charter['risks'], true);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project Charter</title>
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
            <form>
                <h1>Project Charter Editing Page:</h1>
                <div class="input-container">
                    <div class="error-message"></div>
                    <!--BASIC INFO-->
                    <h2>Essential Information:</h2>
                    <label for="project-title">Project Title/Name:</label>
                    <input type="text" id="project-title" placeholder="Project Name" value="<?= htmlspecialchars($project['title']); ?>" pattern="[A-Za-z0-9 ,.]+" required>
                    <label for="project-desc">Description:</label>
                    <textarea type="text" id="project-desc" placeholder="Project Description" cols="50" rows="5" class="js-pop-up-field" pattern="[A-Za-z0-9 ,.]+" required><?= htmlspecialchars($project['description']); ?></textarea>

                    <!--IMPORTANT INFO-->
                    <h2>Goals of the Project:</h2>
                    <!-- Deadline -->
                    <input type="date" id="project-deadline" value="<?= htmlspecialchars($project_charter['deadline']); ?>" />
                    <!-- Purpose -->
                    <label for="project-purpose">Purpose:</label>
                    <input type="text" id="project-purpose" placeholder="Project Purpose" value="<?= htmlspecialchars($purpose['purpose']); ?>" pattern="[A-Za-z0-9 ,.]+" >
                    <!-- Objective -->
                    <label for="project-objective">Objective:</label>
                    <textarea type="text" id="project-objective" placeholder="Project Objective" cols="50" rows="5" class="js-pop-up-field" pattern="[A-Za-z0-9 ,.]+" ><?= htmlspecialchars($project_charter['objective']); ?></textarea>

                    <label for="project-accept-crt">Acceptance Criteria:</label>
                    <input type="text" id="project-acceptance" placeholder="Acceptance Criteria" value="<?= htmlspecialchars($project_charter['acceptance_criteria']); ?>" pattern="[A-Za-z0-9 ,.]+" >

                    <!-- Other Info -->
                    <h2>Other Information:</h2>
                    <!-- DELIVERABLES -->
                    <label for="deliverables">Deliverables:</label>
                    <div class="input-container add-deliverable">
                        <input type="text" id="deliverables" placeholder="New Deliverable" pattern="[A-Za-z0-9 ,.]+" >
                        <button id="add-deliverable" class="blob cool-button">
                            Add
                        </button>
                    </div>
                    <div id="project-deliverables" class="project-list">
                        <?php foreach ($deliverables as $del) : ?>
                            <div class="blob cool-button list-del" data-del="<?= htmlspecialchars($del); ?>">
                                <?= htmlspecialchars($del); ?>
                                <input type="text" id="list-del-<?= htmlspecialchars($del); ?>" placeholder="Acceptance Criteria" pattern="[A-Za-z0-9 ,.]+" required>
                                <i class="fa fa-times delete" aria-hidden="true"></i>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <!-- ASSUMPTIONS -->
                    <label for="assumptions">Assumptions:</label>
                    <div class="input-container add-deliverable">
                        <input type="text" id="assumptions" placeholder="New Assumption" pattern="[A-Za-z0-9 ,.]+" >
                        <button id="add-assumptions" class="blob cool-button">
                            Add
                        </button>
                    </div>
                    <div id="project-assumptions" class="project-list">
                        <?php foreach ($assumptions as $assumption) : ?>
                            <div class="blob cool-button list-assumptions" data-assumption="<?= htmlspecialchars($assumption); ?>">
                                <?= htmlspecialchars($assumption); ?>
                                <i class="fa fa-times delete" aria-hidden="true"></i>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <!-- CONSTRAINTS -->
                    <label for="constraints">Constraints:</label>
                    <div class="input-container add-deliverable">
                        <input type="text" id="constraints" placeholder="New Constraint" pattern="[A-Za-z0-9 ,.]+" >
                        <button id="add-constraints" class="blob cool-button">
                            Add
                        </button>
                    </div>
                    <div id="project-constraints" class="project-list">
                        <?php foreach ($constraints as $constraint) : ?>
                            <div class="blob cool-button list-constraints" data-constraint="<?= htmlspecialchars($constraint); ?>">
                                <?= htmlspecialchars($constraint); ?>
                                <i class="fa fa-times delete" aria-hidden="true"></i>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <!-- RISKS -->
                    <label for="risks">Risks:</label>
                    <div class="input-container add-deliverable">
                        <input type="text" id="risks" placeholder="New Risk" pattern="[A-Za-z0-9 ,.]+" >
                        <button id="add-risks" class="blob cool-button">
                            Add
                        </button>
                    </div>
                    <div id="project-risks" class="project-list">
                        <?php foreach ($risks as $risk) : ?>
                            <div class="blob cool-button list-risks" data-risk="<?= htmlspecialchars($risk); ?>">
                                <?= htmlspecialchars($risk); ?>
                                <i class="fa fa-times delete" aria-hidden="true"></i>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <input type="submit" class="cool-button" value="Submit">
                </div>
            </form>
        </div>

        <script type="module" src="scripts/navigation.js"></script>
        <script type="module" src="scripts/project_charter.js"></script>
    </body>
</html>
