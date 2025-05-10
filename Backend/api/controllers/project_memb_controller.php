<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once(__DIR__ . '/../../../db_connection.php');

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];
$pathInfo = $_SERVER['PATH_INFO'] ?? '';
$requestUri = explode('/', trim($pathInfo, '/'));
$project_id = isset($_GET['project_id']) ? intval($_GET['project_id']) : null;

switch ($method) {
    case 'GET':
        if ($project_id) {
            getProjectMembers($project_id);
        } else {
            echo json_encode(["success" => false, "message" => "Project ID is required"]);
        }
        break;

    case 'POST':
        addProjectMember();
        break;

    case 'DELETE':
        if ($project_id) {
            deleteProjectMember($project_id);
        } else {
            echo json_encode(["success" => false, "message" => "Project ID is required for deletion"]);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}

// Function to retrieve project members for a specific project
function getProjectMembers($project_id) {
    global $conn;

    // Query to get project members
    $sql = "SELECT users.id, users.username, project_members.role
            FROM project_members
            JOIN users ON project_members.user_id = users.id
            WHERE project_members.project_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $project_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $members = [];
        while ($row = $result->fetch_assoc()) {
            $members[] = [
                'user_id' => $row['id'],
                'username' => $row['username'],
                'role' => $row['role']
            ];
        }
        echo json_encode($members);
    } else {
        echo json_encode(["success" => false, "message" => "No members found for this project."]);
    }
}

// Function to add a new project member
function addProjectMember() {
    global $conn;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['username'], $data['role'], $data['project_id'])) {
        echo json_encode(["success" => false, "message" => "Invalid input."]);
        return;
    }

    $username = $data['username'];
    $role = $data['role'];
    $project_id = intval($data['project_id']);

    // Step 1: Check if the user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "User not found."]);
        return;
    }

    $user = $result->fetch_assoc();
    $userId = $user['id'];

    // Step 2: Check if the user is already added to the project
    $stmt = $conn->prepare("SELECT * FROM project_members WHERE user_id = ? AND project_id = ?");
    $stmt->bind_param("ii", $userId, $project_id);
    $stmt->execute();
    $existing = $stmt->get_result();

    if ($existing->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "User already added to the project."]);
        return;
    }

    // Step 3: Insert the user into the project_members table
    $stmt = $conn->prepare("INSERT INTO project_members (user_id, project_id, role) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $userId, $project_id, $role);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User added successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to add user."]);
    }
}

// Function to delete a project member
function deleteProjectMember($project_id) {
    global $conn;
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['user_id'])) {
        echo json_encode(["success" => false, "message" => "User ID is required"]);
        return;
    }

    $user_id = $data['user_id'];

    // Delete the member from the project_members table
    $stmt = $conn->prepare("DELETE FROM project_members WHERE user_id = ? AND project_id = ?");
    $stmt->bind_param("ii", $user_id, $project_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User deleted from the project."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete user."]);
    }
}

$conn->close();
?>
