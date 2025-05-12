<?php
session_start();
require 'db_connection.php';

$user_id = $_SESSION['user_id'];
$avatar = $_POST['avatar']; // Expected values: avatar1.png, avatar2.png, etc.
$avatar_path = "media/" . basename($avatar);

$stmt = $conn->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
$stmt->bind_param("si", $avatar_path, $user_id);

if ($stmt->execute()) {
    echo "Avatar updated.";
} else {
    echo "Error updating avatar: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
