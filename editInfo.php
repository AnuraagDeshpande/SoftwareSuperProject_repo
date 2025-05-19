<?php
session_start();
$update_message = '';
if (isset($_SESSION['update_message'])) {
    $update_message = $_SESSION['update_message'];
    unset($_SESSION['update_message']); // Clear after displaying once
}

include "db_connection.php";

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Fetch current user info
$stmt = $conn->prepare("SELECT fullname, email, profile_picture FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($user_fullname, $user_email, $user_avatar);
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
    <?php if (!empty($update_message)): ?>
    <div id="popup-alert" class="popup-alert">
        <?php echo htmlspecialchars($update_message); ?>
    </div>
    <script>
        // Auto-hide the popup after 4 seconds
        setTimeout(() => {
            const alert = document.getElementById("popup-alert");
            if (alert) {
                alert.classList.add("fade-out");
            }
        }, 3000);
    </script>
<?php endif; ?>


    <!-- profile banner at the top -->
    <div class="profile-container">
        <div class="image-container">
            <img id="profile-avatar" src="<?php echo htmlspecialchars($user_avatar); ?>" alt="current profile avatar">
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
    <input type="text" name="fullname" placeholder="full name" value="<?php echo htmlspecialchars($user_fullname); ?>">

    <label>Email:</label>
    <input type="email" name="email" placeholder="email" value="<?php echo htmlspecialchars($user_email); ?>">

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
                    <?php
                    $avatarFiles = glob('avatars/*.png');
                    foreach ($avatarFiles as $avatarPath):
                        $filename = basename($avatarPath);
                        $checked = ($filename === basename($user_avatar)) ? 'checked' : '';
                    ?>
                        <label>
                            <input type="radio" name="avatar" value="<?php echo $avatarPath; ?>" <?php echo $checked; ?>>
                            <img src="<?php echo $avatarPath; ?>" alt="<?php echo $filename; ?>">
                        </label>
                    <?php endforeach; ?>
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
