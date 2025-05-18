<?php
// Enable PHP error reporting (development only)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include init.php for DB connection, BASE_URL, and session
require_once(__DIR__ . '/Backend/init.php');

//we get the project if from the path
$project_id = isset($_GET['project_id']) ? $_GET['project_id'] : 0;
//we get the user info
$userId = $_SESSION['user_id'] ?? -1;
$username = $_SESSION['login'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Activities</title>
  <link rel="stylesheet" href="styles/individual_project.css" />
  <link rel="stylesheet" href="styles/main.css" />
  <link href="styles/sidebar.css" rel="stylesheet"/>
  <link href="styles/navbar.css" rel="stylesheet"/>
  <!-- FullCalendar CSS -->
  <!--link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/main.min.css" rel="stylesheet" -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script>window.user_id = <?php echo json_encode($_SESSION['user_id']); ?>;</script>
</head>
<body>
  <script>
  const BASE_URL = <?= json_encode(BASE_URL) ?>;
  </script>
  <!--NAVIGATION BAR CODE-->
  <div class="navbar">
    <!--javaScript-->
  </div>

    <div class="page-body">
        <!--SIDEBAR CODE-->
        <div class="sidebar">
        <!--javaScript-->
    </div>

  <div class="content-box">
    <div class="top-buttons">
      <button class="primary-button" onclick="addActivity()">Add Activity</button>
      <button class="primary-button" onclick="manageSchedule()">View Gantt Chart</button>
      <button class="secondary-button" onclick="goToProjectMembers()">Manage Team</button>
      <button class="tertiary-button" onclick="goToCharter()">View project charter</button>
    </div>

    <div class="grid-layout">
      <div class="secondary-card section">
        <h2>Recent Tasks</h2>
        <div class="activity-table-container">
          <table class="activity-table">
            <thead>
              <tr>
                <th>Done</th> <!-- New column -->
                <th>Activity</th>
                <th>Status</th>
                <th>Startdate</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="checkbox" class="activity-checkbox" /></td>
                <td>Sample Activity 1</td>
                <td class="status completed">Completed</td>
                <td>2025-05-10</td>
              </tr>
              <tr>
                <td><input type="checkbox" class="activity-checkbox" /></td>
                <td>Sample Activity 2</td>
                <td class="status in-progress">In Progress</td>
                <td>2025-05-15</td>
              </tr>
              <tr>
                <td><input type="checkbox" class="activity-checkbox" /></td>
                <td>Sample Activity 3</td>
                <td class="status not-started">Not Started</td>
                <td>2025-05-20</td>
              </tr>
            </tbody>
          </table>
        </div>        
      </div>

      <div class="primary-card section">
        <h2>Gantt Chart</h2>
        <iframe
        id="gantt-frame"
        src="gantt_chart.html"
        width="100%"
        height="500"
        style="border:none;"
        title="Gantt Chart"
      ></iframe>
      </div>

      <!-- div class="tertiary-card section">
        <h2>Manage Team</h2>
        <div class="team-input">
          <input type="text" id="member-name" placeholder="Enter member name" />
          <button class="primary-button" onclick="addMember()">Add</button>
        </div>
        <ul id="team-list"></ul>
      </div -->

      <!-- div class="primary-card content-box" style="margin-top: var(--mediumGap);">
        <h2>Project Timeline</h2>
        <div id="calendar"></div>
      </div -->

      <!-- New section to display project details -->
      <div class="primary-card section">
        <h2>Project Details</h2>
        <div>
          <strong>Project Name:</strong> <span id="project-name">Loading...</span>
        </div>
        <div>
          <strong>Description:</strong> <span id="project-desc">Loading...</span>
        </div>
        <div>
          <strong>Manager(s):</strong> <span id="project-manager">Loading...</span>
        </div>
        <div>
          <strong>Owner(s):</strong> <span id="project-owner">Loading...</span>
        </div>
        <div>
          <strong>Status:</strong> <span id="project-status">Loading...</span>
        </div>
      </div>

      <div class="secondary-card section">
        <h2>Project Progress</h2>
        <div class="placeholder">
          <div class="progress-container">
            <div class="progress-bar" id = "custom-progress-bar" style="width: 60%;">60%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>
    window.user_id = <?php echo json_encode($_SESSION['user_id']); ?>;
  </script>
  <script src="scripts/individual_project.js" type="module"></script>
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/main.min.js"></script>
  <script type="module" src="scripts/navigation.js"></script>
</body>
</html>