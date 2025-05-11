<?php
session_start();
require 'db_connection.php';

$user_id = $_SESSION['user_id']; // Or replace with $_POST['user_id'] if using hidden input
$fullname = $_POST['fullname'];
$email = $_POST['email'];

if (empty($fullname) || empty($email)) {
    echo "Please fill in all fields.";
    exit;
}

$stmt = $conn->prepare("UPDATE users SET fullname = ?, email = ? WHERE id = ?");
$stmt->bind_param("ssi", $fullname, $email, $user_id);

if ($stmt->execute()) {
    echo "Information updated successfully.";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
