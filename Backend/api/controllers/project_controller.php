<?php
class ProjectController {
    // GET /projects
    public function getAllProjects() {
        global $conn;

        $query = "SELECT id, title, description, status FROM projects";
        $result = $conn->query($query);

        if (!$result) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database query failed.']);
            return;
        }

        $projects = [];

        while ($project = $result->fetch_assoc()) {
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

        echo json_encode(['success' => true, 'data' => $projects]);
    }

    public function getProjectById($id) {
        global $conn;

        $stmt = $conn->prepare("SELECT id, title, description, status FROM projects WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $project = $result->fetch_assoc();

        if ($project) {
            echo json_encode(['success' => true, 'data' => $project]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Project not found']);
        }
    }

    public function createProject($data) {
        global $conn;

        $title = trim($data['projectName'] ?? '');
        $description = trim($data['desc'] ?? '');
        $status = strtolower(trim($data['status'] ?? 'active'));
        $ownerUsernames = $data['owner'] ?? [];
        $managerUsernames = $data['manager'] ?? [];
        $participantUsernames = $data['participants'] ?? [];

        if (empty($title) || empty($description) || empty($ownerUsernames)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            return;
        }

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

        $project_id = $stmt->insert_id;
        $stmt->close();

        // Function to insert members
        $insertMembers = function($usernames, $role) use ($conn, $project_id) {
            foreach ($usernames as $username) {
                $userStmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
                $userStmt->bind_param("s", $username);
                $userStmt->execute();
                $userResult = $userStmt->get_result();
                $userRow = $userResult->fetch_assoc();
                $userStmt->close();

                if ($userRow) {
                    $user_id = $userRow['id'];

                    $memberStmt = $conn->prepare("INSERT INTO project_members (user_id, project_id, role) VALUES (?, ?, ?)");
                    $memberStmt->bind_param("iis", $user_id, $project_id, $role);
                    $memberStmt->execute();
                    $memberStmt->close();
                }
            }
        };

        // Insert owners, managers, and participants
        $insertMembers($ownerUsernames, 'Owner');
        $insertMembers($managerUsernames, 'Manager');
        $insertMembers($participantUsernames, 'Participant');

        echo json_encode(['success' => true, 'message' => 'Project created', 'project_id' => $project_id]);
    }

    public function updateProject($id, $data) {
        global $conn;

        $allowedFields = ['title', 'description', 'status'];
        $fieldsToUpdate = [];
        $values = [];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fieldsToUpdate[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (empty($fieldsToUpdate)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No valid fields for update']);
            return;
        }

        $query = "UPDATE projects SET " . implode(", ", $fieldsToUpdate) . " WHERE id = ?";
        $stmt = $conn->prepare($query);

        $values[] = $id;
        $types = str_repeat("s", count($values) - 1) . "i";

        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Project updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to update project']);
        }

        $stmt->close();
    }

    public function deleteProject($id) {
        global $conn;

        if (empty($id) || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid project ID']);
            return;
        }

        $conn->begin_transaction();

        try {
            $stmt = $conn->prepare("DELETE FROM project_members WHERE project_id = ?");
            $stmt->bind_param("i", $id);
            if (!$stmt->execute()) {
                throw new Exception('Failed to delete project members');
            }

            $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
            $stmt->bind_param("i", $id);
            if (!$stmt->execute()) {
                throw new Exception('Failed to delete the project');
            }

            $conn->commit();

            echo json_encode(['success' => true, 'message' => 'Project deleted successfully']);
        } catch (Exception $e) {
            $conn->rollback();
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function getProjectById($projectId) {
        global $conn;
        $project = null;
    
        $projectStmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
        $projectStmt->bind_param("i", $projectId);
        $projectStmt->execute();
        $projectResult = $projectStmt->get_result();
    
        if ($projectResult->num_rows > 0) {
            $project = $projectResult->fetch_assoc();
            $project_id = $project['id'];
    
            // Fetch project members (owners, managers, participants)
            $membersStmt = $conn->prepare("
                SELECT u.username, pm.role 
                FROM project_members pm
                JOIN users u ON pm.user_id = u.id
                WHERE pm.project_id = ?
            ");
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
    
            echo json_encode($formattedProject);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Project not found']);
        }
    
        $projectStmt->close();
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

// Add a new case for fetching a single project by ID
switch ($action) {
    case 'get':
        $controller->getAllProjects();
        break;
    case 'getById':
        $projectId = $_GET['projectId'] ?? null;
        if ($projectId && is_numeric($projectId)) {
            $controller->getProjectById((int)$projectId);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing or invalid project ID']);
        }
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
}
?>
