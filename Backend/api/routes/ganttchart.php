<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once(__DIR__ . '/../controllers/gantt_chart_controller.php');

$controller = new Ganttchartcontroller();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Adjust the base path to match your project structure
$basePath = '/SE_REPO/SoftwareSuperProject_repo/Backend/api/routes/ganttchart.php';
$pathTail = trim(str_replace($basePath, '', $uri), '/'); // Could be empty or an ID

if ($method === 'GET') {
    if (isset($_GET['project_id'])) {
        $projectID = $_GET['project_id'];
        $controller->getTaskByProjectId($projectID);
    } 
    else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid task request']);
    }
}
?>