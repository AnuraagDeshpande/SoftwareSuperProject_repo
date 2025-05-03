<?php
class TaskController {
    // GET /tasks
    public function getAllTasks() {
        global $conn;

        $query = "SELECT id, project_id, title, description, status, deadline, created_at FROM tasks";
        $result = $conn->query($query);

        if (!$result) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database query failed.']);
            return;
        }

        $tasks = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => $tasks
        ]);
    }

    public function getTaskById($id) {
        global $conn;

        $stmt = $conn->prepare("SELECT id, project_id, title, description, status, deadline, created_at FROM tasks WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $task = $result->fetch_assoc();

        if ($task) {
            echo json_encode(['success' => true, 'data' => $task]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Task not found']);
        }
    }

    public function createTask($data) {
      global $conn;
  
      // Validate required fields
      if (
          !isset($data['project_id']) ||
          !isset($data['title']) ||
          !isset($data['description']) ||
          !isset($data['status']) ||
          !isset($data['deadline'])
      ) {
          http_response_code(400);
          echo json_encode(['success' => false, 'error' => 'Missing required fields']);
          return;
      }
  
      $project_id = $data['project_id'];
      $title = $data['title'];
      $description = $data['description'];
      $status = $data['status'];
      $deadline = $data['deadline'];
  
      $stmt = $conn->prepare("SELECT id FROM projects WHERE id = ?");
      $stmt->bind_param("i", $project_id);
      $stmt->execute();
      $result = $stmt->get_result();
  
      if ($result->num_rows === 0) {
          http_response_code(400);
          echo json_encode(['success' => false, 'error' => 'Invalid project_id: Project does not exist']);
          return;
      }
  
      $stmt->close();
  
      // Insert the new task
      $stmt = $conn->prepare("
          INSERT INTO tasks (project_id, title, description, status, deadline)
          VALUES (?, ?, ?, ?, ?)
      ");
      $stmt->bind_param("issss", $project_id, $title, $description, $status, $deadline);
  
      if ($stmt->execute()) {
          http_response_code(201);
          echo json_encode(['success' => true, 'message' => 'Task created successfully']);
      } else {
          http_response_code(500);
          echo json_encode(['success' => false, 'error' => 'Failed to create task']);
      }
  
      $stmt->close();
  }

    public function updateTask($id, $data) {
        global $conn;

        $allowedFields = ['project_id', 'title', 'description', 'status', 'deadline'];
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

        $query = "UPDATE tasks SET " . implode(", ", $fieldsToUpdate) . " WHERE id = ?";
        $stmt = $conn->prepare($query);

        $values[] = $id;
        $types = str_repeat("s", count($values) - 1) . "i";

        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Task updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to update task']);
        }

        $stmt->close();
    }

    public function deleteTask($id) {
        global $conn;

        $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Task deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Task not found']);
        }

        $stmt->close();
    }
}
?>
