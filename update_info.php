<?php
session_start();
include "db_connection.php";

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_SESSION['user_id'];
    $fullname = trim($_POST['fullname']);
    $email = trim($_POST['email']);

    if (!empty($fullname) && !empty($email)) {
        $stmt = $conn->prepare("UPDATE users SET fullname = ?, email = ? WHERE id = ?");
        $stmt->bind_param("ssi", $fullname, $email, $user_id);

        if ($stmt->execute()) {
            $_SESSION['update_message'] = "Account info updated successfully!";
        } else {
            $_SESSION['update_message'] = "Something went wrong while updating your info.";
        }

        $stmt->close();
    } else {
        $_SESSION['update_message'] = "Please fill in all fields.";
    }

    header("Location: editInfo.php");
    exit();
}
?>
