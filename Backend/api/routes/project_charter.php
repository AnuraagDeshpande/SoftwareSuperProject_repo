<?php
header('Content-Type: application/json');

require_once(__DIR__ . '/../controllers/project_charter_controller.php');

$controller = new ProjectCharterController();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Adjust the base path to match your project structure
$basePath = '/SE_REPO/SoftwareSuperProject_repo/Backend/api/project_charter';
$pathTail = trim(str_replace($basePath, '', $uri), '/'); // Could be empty or an ID

// /projects/u=?

if ($method === 'GET') {
    if ($pathTail === '') {
        $controller->getAllProjectCharters();
    } elseif (is_numeric($pathTail)) {
        $controller->getProjectCharterById((int)$pathTail);
    }  else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid project request']);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        return;
    }

    $controller->createProjectCharter($data);
} elseif ($method === 'PUT') {
    if (!is_numeric($pathTail)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Project ID must be numeric']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        return;
    }

    $controller->updateProjectCharter((int)$pathTail, $data);
} elseif ($method === 'DELETE') {
    if (!is_numeric($pathTail)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Project ID must be numeric']);
        return;
    }

    $controller->deleteProjectCharter((int)$pathTail);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
