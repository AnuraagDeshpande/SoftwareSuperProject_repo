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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gantt Chart</title>
    <link rel="stylesheet" href="styles/gantt_chart.css">
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>
    <script>
        const BASE_URL = <?= json_encode(BASE_URL) ?>;
    </script>
    <script src="scripts/gantt_chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/html2pdf.js/dist/html2pdf.bundle.min.js"></script>

</body>

</html>
