<?php
session_start();
require 'db_connection.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$old_password = $_POST['old_password'];
$new_password = $_POST['new_password'];
$confirm_password = $_POST['confirm_password'];

if (empty($old_password) || empty($new_password) || empty($confirm_password)) {
    $_SESSION['update_message'] = "All fields are required.";
    header("Location: editInfo.php");
    exit();
}

if ($new_password !== $confirm_password) {
    $_SESSION['update_message'] = "New passwords do not match.";
    header("Location: editInfo.php");
    exit();
}

$stmt = $conn->prepare("SELECT LoginPasscode FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($hashed_password);
$stmt->fetch();
$stmt->close();

if (!password_verify($old_password, $hashed_password)) {
    $_SESSION['update_message'] = "Old password is incorrect.";
    header("Location: editInfo.php");
    exit();
}

$new_hashed = password_hash($new_password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE users SET LoginPasscode = ? WHERE id = ?");
$stmt->bind_param("si", $new_hashed, $user_id);

if ($stmt->execute()) {
    $_SESSION['update_message'] = "Password changed successfully!";
} else {
    $_SESSION['update_message'] = "Error updating password.";
}

$stmt->close();
$conn->close();

header("Location: editInfo.php");
exit();
