<?php

// Enable PHP error reporting (development only)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include init.php for DB connection, BASE_URL, and session
require_once(__DIR__ . '/../../init.php');

class TaskController {
    // GET /tasks
    public function getAllTasks() {
        global $conn;

        $query = "SELECT tasks.id, tasks.project_id, projects.title AS project, tasks.title, tasks.description, tasks.status, tasks.deadline, tasks.startdate FROM tasks
        JOIN projects ON tasks.project_id = projects.id
        LEFT JOIN task_assignments ON tasks.id = task_assignments.task_id";
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

        $stmt = $conn->prepare("SELECT id, project_id, title, description, status, deadline, startdate FROM tasks WHERE id = ?");
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
          !isset($data['project']) ||
          !isset($data['title']) ||
          !isset($data['description']) ||
          !isset($data['status']) ||
          !isset($data['startdate']) ||
          !isset($data['deadline'])
      ) {
          http_response_code(400);
          echo json_encode(['success' => false, 'error' => 'Missing required fields']);
          return;
      }
  
      $project_name = $data['project'];
      $title = $data['title'];
      $description = $data['description'];
      $status = $data['status'];
      $startdate = $data['startdate'];
      $deadline = $data['deadline'];
  
      $stmt = $conn->prepare("SELECT id FROM projects WHERE title = ?");
      $stmt->bind_param("s", $project_name);
      $stmt->execute();
      $result = $stmt->get_result();
  
      if ($result->num_rows === 0) {
          http_response_code(400);
          echo json_encode(['success' => false, 'error' => 'Invalid project_name: Project does not exist']);
          return;
      }

      $row = $result->fetch_assoc();
      $project_id = $row['id'];

      $stmt->close();
  
      // Insert the new task
      $stmt = $conn->prepare("
          INSERT INTO tasks (project_id, title, description, status, startdate, deadline)
          VALUES (?, ?, ?, ?, ?, ?)
      ");
      $stmt->bind_param("issss", $project_id, $title, $description, $status, $startdate, $deadline);
  
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

        $allowedFields = ['project_id' => 'project', 'title' => 'title', 'description' => 'description', 'status' => 'status', 'startdate' => 'startdate', 'deadline' => 'deadline'];
        $fieldsToUpdate = [];
        $values = [];

        // foreach ($allowedFields as $field) {
        //     if (isset($data[$field])) {
        //         $fieldsToUpdate[] = "$field = ?";
        //         $values[] = $data[$field];
        //     }
        // }

        foreach ($allowedFields as $column => $inputKey) {
            if (isset($data[$inputKey])) {
                // Special handling for project name → get project_id
                if ($inputKey === 'project') {
                    $projectName = $data[$inputKey];
        
                    $stmtProject = $conn->prepare("SELECT id FROM projects WHERE title = ?");
                    $stmtProject->bind_param("s", $projectName);
                    $stmtProject->execute();
                    $resultProject = $stmtProject->get_result();
        
                    if ($resultProject && $resultProject->num_rows > 0) {
                        $projectRow = $resultProject->fetch_assoc();
                        $projectId = $projectRow['id'];
        
                        $fieldsToUpdate[] = "project_id = ?";
                        $values[] = $projectId;
                    } else {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'error' => 'Project name not found']);
                        return;
                    }
        
                    $stmtProject->close();
                } else {
                    $fieldsToUpdate[] = "$column = ?";
                    $values[] = $data[$inputKey];
                }
            }
        }
        

        if (empty($fieldsToUpdate)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No valid fields for update']);
            return;
        }

        $query = "UPDATE tasks SET " . implode(", ", $fieldsToUpdate) . " WHERE id = ?";
        $stmt = $conn->prepare($query);

        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Prepare failed: ' . $conn->error]);
            return;
        }

        $values[] = $id;
        $types = str_repeat("s", count($values) - 1) . "i";

        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            // Fetch updated task
            $result = $conn->query("SELECT * FROM tasks WHERE id = " . intval($id));

            if (!$result) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Select failed: ' . $conn->error]);
                return;
            }

            $updatedTask = $result->fetch_assoc();

            echo json_encode(['success' => true, 'data' => $updatedTask, 'message' => 'Task updated successfully']);
            //echo json_encode(['success' => true, 'message' => 'Task updated successfully']);
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

    //assigning tasks to users
    public function assignTask($taskId, $userId) {
        global $conn;
    
        // Check if task exists
        $stmtTask = $conn->prepare("SELECT id FROM tasks WHERE id = ?");
        $stmtTask->bind_param("i", $taskId);
        $stmtTask->execute();
        $resultTask = $stmtTask->get_result();
    
        if ($resultTask->num_rows === 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Task does not exist']);
            return;
        }
        $stmtTask->close();
    
        // Check if user exists
        $stmtUser = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $stmtUser->bind_param("i", $userId);
        $stmtUser->execute();
        $resultUser = $stmtUser->get_result();
    
        if ($resultUser->num_rows === 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'User does not exist']);
            return;
        }
        $stmtUser->close();
    
        // Check if assignment already exists
        $stmtCheck = $conn->prepare("SELECT * FROM task_assignments WHERE task_id = ? AND user_id = ?");
        $stmtCheck->bind_param("ii", $taskId, $userId);
        $stmtCheck->execute();
        $resultCheck = $stmtCheck->get_result();
    
        if ($resultCheck->num_rows > 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Task already assigned to user']);
            return;
        }
        $stmtCheck->close();
    
        // Assign task to user
        $stmt = $conn->prepare("INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $taskId, $userId);
    
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Task assigned to user successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to assign task']);
        }
    
        $stmt->close();
    }
}
?>
