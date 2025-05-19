<?php
session_start();
require 'db_connection.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$avatar = $_POST['avatar'];
$avatar_path = "avatars/" . basename($avatar);

$stmt = $conn->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
$stmt->bind_param("si", $avatar_path, $user_id);

if ($stmt->execute()) {
    $_SESSION['update_message'] = "Avatar updated successfully!";
} else {
    $_SESSION['update_message'] = "Error updating avatar: " . $stmt->error;
}

$stmt->close();
$conn->close();

header("Location: editInfo.php");
exit();
