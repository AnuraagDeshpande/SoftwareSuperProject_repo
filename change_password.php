<?php
session_start();
require 'db_connection.php';

$user_id = $_SESSION['user_id'];
$old_password = $_POST['old_password'];
$new_password = $_POST['new_password'];
$confirm_password = $_POST['confirm_password'];

// Validate inputs
if (empty($old_password) || empty($new_password) || empty($confirm_password)) {
    echo "All fields are required.";
    exit;
}

if ($new_password !== $confirm_password) {
    echo "New passwords do not match.";
    exit;
}

// Check old password
$stmt = $conn->prepare("SELECT LoginPasscode FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($hashed_password);
$stmt->fetch();
$stmt->close();

if (!password_verify($old_password, $hashed_password)) {
    echo "Old password is incorrect.";
    exit;
}

// Update password
$new_hashed = password_hash($new_password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE users SET LoginPasscode = ? WHERE id = ?");
$stmt->bind_param("si", $new_hashed, $user_id);

if ($stmt->execute()) {
    echo "Password updated successfully.";
} else {
    echo "Error updating password.";
}

$stmt->close();
$conn->close();
?>
