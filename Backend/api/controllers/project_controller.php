<?php
class ProjectController {
    // GET /projects
    public function getAllProjects() {
        global $conn;

        $query = "SELECT id, title, description, status, deadline, created_at FROM projects";
        $result = $conn->query($query);

        if (!$result) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database query failed.']);
            return;
        }

        $projects = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => $projects
        ]);
    }

    public function getProjectById($id) {
        global $conn;

        $stmt = $conn->prepare("SELECT id, title, description, status, deadline, created_at FROM projects WHERE id = ?");
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

        if (
            !isset($data['title']) ||
            !isset($data['description']) ||
            !isset($data['status']) ||
            !isset($data['deadline'])
        ) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            return;
        }

        $title = $data['title'];
        $description = $data['description'];
        $status = $data['status'];
        $deadline = $data['deadline'];

        $stmt = $conn->prepare("
            INSERT INTO projects (title, description, status, deadline)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->bind_param("ssss", $title, $description, $status, $deadline);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Project created successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to create project']);
        }

        $stmt->close();
    }

    public function updateProject($id, $data) {
        global $conn;

        $allowedFields = ['title', 'description', 'status', 'deadline'];
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

        $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Project deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Project not found']);
        }

        $stmt->close();
    }
}
?>
