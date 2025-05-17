<?php

// Enable PHP error reporting (development only)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include init.php for DB connection, BASE_URL, and session
require_once(__DIR__ . '/../../init.php');


class Ganttchartcontroller{
    
    public function getTaskByProjectId($id) {
        global $conn;

        $stmt = $conn->prepare("SELECT id, project_id, title, description, status, startdate, deadline FROM tasks WHERE project_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $tasks = $result->fetch_all(MYSQLI_ASSOC);

        if ($tasks) {
            echo json_encode(['success' => true, 'data' => $tasks]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Project not found']);
        }
    }
}
?>
