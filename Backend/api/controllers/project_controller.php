<?php
session_start();
header('Content-Type: application/json');

$host = "localhost";
$db_user = "root";
$db_pass = "..."; // replace with your password
$db_name = "softwareproject";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

class ProjectController {
    public function getAllProjects() {
        global $conn;
        $projects = [];
    
        $projectResult = $conn->query("SELECT * FROM projects");
        if (!$projectResult) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to fetch projects']);
            return;
        }
    
        while ($project = $projectResult->fetch_assoc()) {
            $project_id = $project['id'];
    
            $membersStmt = $conn->prepare("
                SELECT u.username, pm.role 
                FROM project_members pm
                JOIN users u ON pm.user_id = u.id
                WHERE pm.project_id = ?
            ");
            if (!$membersStmt) {
                continue;
            }
    
            $membersStmt->bind_param("i", $project_id);
            $membersStmt->execute();
            $members = $membersStmt->get_result();
    
            $owners = [];
            $managers = [];
            $participants = [];
    
            while ($member = $members->fetch_assoc()) {
                switch ($member['role']) {
                    case 'Owner':
                        $owners[] = $member['username'];
                        break;
                    case 'Manager':
                        $managers[] = $member['username'];
                        break;
                    case 'Participant':
                        $participants[] = $member['username'];
                        break;
                }
            }
    
            $formattedProject = [
                'id' => (int)$project['id'],
                'projectName' => $project['title'],
                'projectIcon' => 'profile-picture-placeholder.png',
                'manager' => $managers,
                'owner' => $owners,
                'desc' => $project['description'],
                'participants' => $participants,
                'status' => strtolower($project['status']) ?? 'active'
            ];
    
            $projects[] = $formattedProject;
            $membersStmt->close();
        }
    
        echo json_encode($projects);
    }    

    public function createProject($data) {
        global $conn;
    
        // Extract data from the request
        $title = trim($data['projectName'] ?? '');
        $description = trim($data['desc'] ?? '');
        $status = strtolower(trim($data['status'] ?? 'active'));
        $ownerUsernames = $data['owner'] ?? [];
        $participantsUsernames = $data['participants'] ?? [];
    
        // Validate required fields
        if (empty($title) || empty($description) || empty($ownerUsernames)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            return;
        }
    
        // Validate input formats
        if (!preg_match('/^[A-Za-z0-9 ,.]+$/', $title) || !preg_match('/^[A-Za-z0-9 ,.]+$/', $description) || strlen($title) > 50) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid input format']);
            return;
        }
    
        // Insert project into database
        $stmt = $conn->prepare("INSERT INTO projects (title, description, status) VALUES (?, ?, ?)");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to prepare insert statement']);
            return;
        }
    
        $stmt->bind_param("sss", $title, $description, $status);
        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to insert project']);
            return;
        }
    
        // Get the project ID after insertion
        $project_id = $stmt->insert_id;
        $stmt->close();
    
        // Insert owner (first one in the list)
        $owner_username = $ownerUsernames[0]; // assuming only one owner
        $userStmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $userStmt->bind_param("s", $owner_username);
        $userStmt->execute();
        $userResult = $userStmt->get_result();
        $userRow = $userResult->fetch_assoc();
        $userStmt->close();
    
        if ($userRow) {
            $user_id = $userRow['id'];
    
            // Insert owner into project_members table
            $memberStmt = $conn->prepare("INSERT INTO project_members (user_id, project_id, role) VALUES (?, ?, 'Owner')");
            $memberStmt->bind_param("ii", $user_id, $project_id);
            $memberStmt->execute();
            $memberStmt->close();
        }
    
        // Insert participants
        foreach ($participantsUsernames as $participant_username) {
            $userStmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
            $userStmt->bind_param("s", $participant_username);
            $userStmt->execute();
            $userResult = $userStmt->get_result();
            $userRow = $userResult->fetch_assoc();
            $userStmt->close();
    
            if ($userRow) {
                $user_id = $userRow['id'];
    
                // Insert participant into project_members table
                $memberStmt = $conn->prepare("INSERT INTO project_members (user_id, project_id, role) VALUES (?, ?, 'Participant')");
                $memberStmt->bind_param("ii", $user_id, $project_id);
                $memberStmt->execute();
                $memberStmt->close();
            }
        }
    
        // Return success response
        echo json_encode(['success' => true, 'message' => 'Project created', 'project_id' => $project_id]);
    }

    function deleteProject($projectId) {
        global $conn;
    
        // Validate the project ID
        if (empty($projectId) || !is_numeric($projectId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid project ID']);
            return;
        }
    
        // Begin a transaction to ensure data integrity
        $conn->begin_transaction();
    
        try {
            // First, remove the project members (participants and owners) associated with the project
            $stmt = $conn->prepare("DELETE FROM project_members WHERE project_id = ?");
            $stmt->bind_param("i", $projectId);
            if (!$stmt->execute()) {
                throw new Exception('Failed to delete project members');
            }
    
            // Then, delete the project itself
            $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
            $stmt->bind_param("i", $projectId);
            if (!$stmt->execute()) {
                throw new Exception('Failed to delete the project');
            }
    
            // Commit the transaction
            $conn->commit();
    
            // Return success message
            echo json_encode(['success' => true, 'message' => 'Project deleted successfully']);
        } catch (Exception $e) {
            // Rollback the transaction if something goes wrong
            $conn->rollback();
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}

// Dispatcher
$controller = new ProjectController();
$rawInput = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? $_POST['action'] ?? ($rawInput['action'] ?? '');

switch ($action) {
    case 'get':
        $controller->getAllProjects();
        break;
    case 'add':
        $controller->createProject($_POST ?: $rawInput);
        break;
    case 'delete':
        $id = $_POST['id'] ?? ($rawInput['id'] ?? null);
        if (is_numeric($id)) {
            $controller->deleteProject((int)$id);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid or missing ID']);
        }
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown action']);
        break;
}
?>
