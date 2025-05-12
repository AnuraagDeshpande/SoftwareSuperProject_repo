<?php
session_start();
include "db_connection.php";

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Fetch current user info
$stmt = $conn->prepare("SELECT fullname, email FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($user_fullname, $user_email);
$stmt->fetch();
$stmt->close();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>edit info</title>
    <link rel="stylesheet" href="styles/editInfo.css" />
    <link rel="stylesheet" href="styles/main.css" />
    <link rel="stylesheet" href="styles/sidebar.css">
    <link rel="stylesheet" href="styles/navbar.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>

    <!-- Navbar will be dynamically inserted here -->
    <div class="navbar"></div>
    <div class="sidebar"></div>

    <!-- profile banner at the top -->
    <div class="profile-container">
        <div class="image-container">
            <img id="profile-avatar" src="media/avatar3.png" alt="current profile avatar">
        </div>
        <div class="name-container"> <!-- Added functionality that gets session logged in user's name and email-->
            <h1><?php echo htmlspecialchars($user_fullname); ?></h1>
            <h2><?php echo htmlspecialchars($user_email); ?></h2>
        </div>
    </div>

    <div class="center-container">

        <!-- edit account info section -->
        <div class="card card-info">
            <details open>
                <summary class="card-title">
                    <img src="media/User.png" alt="edit icon" class="summary-icon">
                    Edit account info
                </summary>
                <form action="update_info.php" method="POST" class="card-content">
                    <label>Full name:</label>
                    <input type="text" name="fullname" placeholder="full name" required>
                    <label>Email:</label>
                    <input type="email" name="email" placeholder="email" required>
                    <button class="user-button" type="submit">Save changes</button>
                </form>
            </details>
        </div>

        <!-- update avatar section -->
        <div class="card card-avatar">
            <details>
                <summary class="card-title">
                    <img src="media/Screenshott.png" alt="avatar icon" class="summary-icon">
                    Update avatar
                </summary>
                <form action="update_avatar.php" method="POST" class="card-content avatar-grid">
                    <?php for ($i = 1; $i <= 10; $i++): ?>
                        <label>
                            <input type="radio" name="avatar" value="avatar<?php echo $i; ?>.png">
                            <img src="media/avatar<?php echo $i; ?>.png" alt="avatar <?php echo $i; ?>">
                        </label>
                    <?php endfor; ?>
                    <button class="user-button" type="submit">Save changes</button>
                </form>
            </details>
        </div>

        <!-- change password section -->
        <div class="card card-password">
            <details>
                <summary class="card-title">
                    <img src="media/Password.png" alt="password icon" class="summary-icon">
                    Change password
                </summary>
                <form action="change_password.php" method="POST" class="card-content">
                    <label>Old password:</label>
                    <input type="password" name="old_password" placeholder="old password" required>
                    <label>New password:</label>
                    <input type="password" name="new_password" placeholder="new password" required>
                    <label>Confirm password:</label>
                    <input type="password" name="confirm_password" placeholder="confirm password" required>
                    <button class="user-button" type="submit">Save changes</button>
                </form>
            </details>
        </div>

    </div>

<script type="module" src="scripts/navigation.js"></script>

</body>
</html>
