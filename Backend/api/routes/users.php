<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once(__DIR__ . '/../controllers/user_controller.php');

$controller = new UserController();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip base API path to extract optional ID from the path
$basePath = '/SE_REPO/SoftwareSuperProject_repo/Backend/api/routes/users';
$pathTail = trim(substr($uri, strlen($basePath)), '/');


if ($method === 'GET') {
    // Priority: Search query
    if (isset($_GET['q'])) {
        $controller->searchUsers($_GET['q']);
        return;
    }

    // Query filters (by email, username, or id)
    if (isset($_GET['email'])) {
        $controller->getUserByColumn('email', $_GET['email']);
    } elseif (isset($_GET['username'])) {
        $controller->getUserByColumn('username', $_GET['username']);
    } elseif (isset($_GET['id'])) {
        $controller->getUserByColumn('id', $_GET['id']);
    } 
    // Path-based routes (clean URLs like /users/3)
    elseif ($pathTail === '') {
        $controller->getAllUsers();
    } elseif (is_numeric($pathTail)) {
        $controller->getUserByColumn('id', (int)$pathTail);
    } 
    // Catch-all fallback
    else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid user request']);
    }
}

elseif ($method === 'PUT') {
    if (!is_numeric($pathTail)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'User ID must be numeric']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        return;
    }

    $controller->updateUser((int)$pathTail, $data);
}

elseif ($method === 'DELETE') {
    if (!is_numeric($pathTail)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'User ID must be numeric']);
        return;
    }

    $controller->deleteUser((int)$pathTail);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        return;
    }

    $controller->createUser($data);
}

?>



