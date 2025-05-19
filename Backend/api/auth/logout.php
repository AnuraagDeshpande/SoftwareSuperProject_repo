<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../../init.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'error' => 'Only POST method is allowed']);
    exit();
}

session_unset();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logout successful']);
?>
