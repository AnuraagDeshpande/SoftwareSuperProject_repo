<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once(__DIR__ . '/../controllers/task_controller.php');

$controller = new TaskController();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Adjust the base path to match your project structure
$basePath = '/SE_REPO/SoftwareSuperProject_repo/Backend/api/tasks';
$pathTail = trim(str_replace($basePath, '', $uri), '/'); // Could be empty or an ID

if ($method === 'GET') {
    if ($pathTail === '') {
        $controller->getAllTasks();
    } elseif (is_numeric($pathTail)) {
        $controller->getTaskById((int)$pathTail);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid task request']);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        return;
    }

    $controller->createTask($data);
} elseif ($method === 'PUT') {
    if (!is_numeric($pathTail)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Task ID must be numeric']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        return;
    }

    $controller->updateTask((int)$pathTail, $data);
} elseif ($method === 'DELETE') {
    if (!is_numeric($pathTail)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Task ID must be numeric']);
        return;
    }

    $controller->deleteTask((int)$pathTail);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
