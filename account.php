<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Include your DB connection file
require_once 'db_connection.php';

$user_id = $_SESSION['user_id'];

// Fetch user details
$stmt = $conn->prepare("SELECT fullname, username, email, profile_picture, system_role FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
} else {
    echo "User not found.";
    exit();
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Account Details</title>
    <link href="styles/main.css" rel="stylesheet"/>
    <link href="styles/navbar.css" rel="stylesheet"/>
    <link href="styles/account.css" rel="stylesheet"/>
</head>
<body>
    <div class="navbar">
        <!-- Navbar JS will populate this -->
    </div>

    <div class="account-container">
        <h1>Account Details</h1>
        <div class="account-card">
            <img src="<?= htmlspecialchars($user['profile_picture'] ?? 'profile-picture-placeholder.png') ?>" alt="Profile Picture">
            <div class="info">
                <p><strong>Full Name:</strong> <?= htmlspecialchars($user['fullname']) ?></p>
                <p><strong>Username:</strong> <?= htmlspecialchars($user['username']) ?></p>
                <p><strong>Email:</strong> <?= htmlspecialchars($user['email']) ?></p>
                <p><strong>Role:</strong> <?= htmlspecialchars($user['system_role']) ?></p>
            </div>
        </div>
    </div>

    
    <script>
        const isLoggedIn = true;
        const username = <?= json_encode($_SESSION['user_name']) ?>;
        const currentPage = "account"; // Pass this to navbar
    </script>
    <script type="module">
        import { generateNavbar } from '.scripts/navbar.js';
        generateNavbar(isLoggedIn, username, currentPage);
    </script>
</body>
</html>
