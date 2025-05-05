<?php
session_start();

// Check login status and get the username if logged in
$isLoggedIn = isset($_SESSION['user_id']);
$username = $isLoggedIn ? $_SESSION['user_name'] : '';

// Return a JSON response
echo json_encode([
    'isLoggedIn' => $isLoggedIn,
    'username' => $username
]);
?>
