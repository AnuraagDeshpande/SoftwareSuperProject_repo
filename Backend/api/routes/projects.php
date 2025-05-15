<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once(__DIR__ . '/../controllers/project_controller.php');

$controller = new ProjectController();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Adjust the base path to match your project structure
$basePath = '/SE_REPO/SoftwareSuperProject_repo/Backend/api/projects';
$pathTail = trim(str_replace($basePath, '', $uri), '/'); // Could be empty or an ID

// /projects/user=?

if ($method === 'GET') {
    if ($pathTail === '') {
        $controller->getAllProjects();
    } elseif (is_numeric($pathTail)) {
        $controller->getProjectById((int)$pathTail);
    } elseif (preg_match('/^user=(\d+)$/', $pathTail, $matches)) {
        $userId = (int)$matches[1];
        $controller->getAllRelatedProjects($userId);
    } else {
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

    $controller->createProject($data);
    
} elseif ($method === 'PUT') {
    // Match URLs like /projects/{id}/status={status}
    if (preg_match('/^(\d+)\/status=([A-Za-z]+)$/', $pathTail, $matches)) {
        $projectId = (int)$matches[1];
        $status = $matches[2];
        $controller->updateProjectStatus($projectId, $status);
    } elseif (is_numeric($pathTail)) {
        // Existing logic for updating project details
        $data = json_decode(file_get_contents('php://input'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
            return;
        }

        $controller->updateProject((int)$pathTail, $data);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid project ID']);
        return;
    }

} elseif ($method === 'DELETE') {
    if (!is_numeric($pathTail)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Project ID must be numeric']);
        return;
    }

    $controller->deleteProject((int)$pathTail);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
