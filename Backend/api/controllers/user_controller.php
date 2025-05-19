<?php

class UserController {

    // GET /users
    public function getAllUsers() {
        global $conn;

        $query = "SELECT id, username, email, system_role, fullname FROM users";
        $result = $conn->query($query);

        if (!$result) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database query failed.']);
            return;
        }

        $users = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => $users
        ]);
    }


    public function getUserByColumn($column, $value) {
        global $conn;
    
        // Define allowed search columns
        $allowed = ['id', 'username', 'email', 'fullname'];
        if (!in_array($column, $allowed)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid column']);
            return;
        }
    
        $query = "SELECT id, username, email, system_role FROM users WHERE $column = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $value);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
    
        if ($user) {
            echo json_encode(['success' => true, 'data' => $user]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'User not found']);
        }
    }
    
    public function searchUsers($query) {
        global $conn;

        //% tells the program to accept non exact searches, whule the rest escapes special characters in the input
        $search = '%' . $conn->real_escape_string($query) . '%';
    
        $stmt = $conn->prepare("
            SELECT id, username, email, system_role, OR fullname ?
            FROM users 
            WHERE username LIKE ? OR email LIKE ? OR fullname LIKE ? OR system_role ?
        ");
    
        //bind the search value to the four placeholders in the SQL
        $stmt->bind_param("ssss", $search, $search, $search, $search);
        $stmt->execute();
        $result = $stmt->get_result();
    
        $users = $result->fetch_all(MYSQLI_ASSOC);
    
        echo json_encode([
            'success' => true,
            'results' => $users
        ]);
    }

    public function updateUser($id, $data) {
        global $conn;
    
        $allowedFields = ['fullname', 'username', 'email'];
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
    
        $query = "UPDATE users SET " . implode(", ", $fieldsToUpdate) . " WHERE id = ?";
        $stmt = $conn->prepare($query);
    
        $values[] = $id;
        $types = str_repeat("s", count($values) - 1) . "i";
    
        $stmt->bind_param($types, ...$values);
    
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to update user']);
        }
    
        $stmt->close();
    }

    public function deleteUser($id) {
        global $conn;
    
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
    
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'User not found']);
        }
    
        $stmt->close();
    }

    public function createUser($data) {
        global $conn;
    
        if (
            !isset($data['username']) ||
            !isset($data['email']) ||
            !isset($data['password']) ||
            !isset($data['system_role']) ||
            !isset($data['fullname'])
        ) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            return;
        }
    
        $username = $data['username'];
        $email = $data['email'];
        $password = password_hash($data['password'], PASSWORD_DEFAULT);
        $system_role = $data['system_role'];
        $fullname = $data['fullname'];
    
        $stmt = $conn->prepare("
            INSERT INTO users (username, email, LoginPasscode, system_role, fullname)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->bind_param("sssss", $username, $email, $password, $system_role, $fullname);
    
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'User created successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to create user']);
        }
    
        $stmt->close();
    }
    
    
    
    
    
    
    
    }
