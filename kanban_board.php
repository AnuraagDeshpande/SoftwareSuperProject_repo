<?php
// Enable PHP error reporting (development only)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include init.php for DB connection, BASE_URL, and session
require_once(__DIR__ . '/Backend/init.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kanban Board</title>
    <link rel="stylesheet" href="styles/kanban_board.css">
    <link rel="stylesheet" href="styles/main.css">
    <link href="styles/sidebar.css" rel="stylesheet"/>
    <link href="styles/navbar.css" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>
      <script>
            const BASE_URL = <?= json_encode(BASE_URL) ?>;
        </script>
      <!--NAVIGATION BAR CODE-->
      <div class="navbar">
        <!--javaScript-->
        </div>

        <!--SIDEBAR CODE-->
        <div class="sidebar">
        <!--javaScript-->
        </div>

        <script src="scripts/kanban_board.js"></script>
        <script type="module" src="scripts/navigation.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/html2pdf.js/dist/html2pdf.bundle.min.js"></script>

</body>

</html>