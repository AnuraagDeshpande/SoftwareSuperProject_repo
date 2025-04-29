<?php
// Defines the main folder as the site root so this works for everyone
defined('SITE_ROOT') ? null :
define('SITE_ROOT', realpath(__DIR__ . '/../') . DIRECTORY_SEPARATOR);

defined('CONFIG_PATH') ? null :
define('CONFIG_PATH', SITE_ROOT . 'Backend/config.php');
require_once(CONFIG_PATH);

//Both forms of error reporting should be gotten rid of or logged later in development
// PHP error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//SQL error reporting
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Connects to the database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
  $conn -> set_charset("utf8mb4");

// Starts session for tracking user login/auth
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
