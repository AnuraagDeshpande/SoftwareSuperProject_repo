<?php
session_start();

// Database connection
$host = "localhost";
$db_user = "root";
$db_pass = "new_password";
$db_name = "softwareproject";

// Attempt limiter
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
}

if ($_SESSION['login_attempts'] >= 5) {
    $cooldown = 300; // 5-minute cooldown

    if (!isset($_SESSION['lockout_time'])) {
        $_SESSION['lockout_time'] = time();
        $_SESSION['login_error'] = "Too many failed login attempts. Try again in 5 minutes.";
        header("Location: login.php");
        exit();
    }

    $elapsed = time() - $_SESSION['lockout_time'];
    if ($elapsed < $cooldown) {
        $remaining = $cooldown - $elapsed;
        $_SESSION['login_error'] = "Please wait $remaining seconds before trying again.";
        header("Location: login.php");
        exit();
    } else {
        $_SESSION['login_attempts'] = 0;
        unset($_SESSION['lockout_time']);
    }
}

// Connect to DB
$conn = new mysqli($host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    $_SESSION['login_error'] = "Database connection failed.";
    header("Location: login.php");
    exit();
}

// Handle login
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST['Username'] ?? "");
    $password = $_POST['Password'] ?? "";

    $_SESSION['login_username'] = $username; // Save the username for repopulating the form

    if ($username && $password) {
        $sql = "SELECT id, fullname, LoginPasscode FROM users WHERE username = ?";
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 1) {
                $user = $result->fetch_assoc();
                if (password_verify($password, $user['LoginPasscode'])) {
                    session_regenerate_id(true); // Regenerate session ID to prevent session fixation attacks
                    $_SESSION['login_attempts'] = 0; // Reset login attempts

                    // Unset any previous session error or username to avoid leaking data
                    unset($_SESSION['lockout_time'], $_SESSION['login_error'], $_SESSION['login_username']);

                    // Set user data in session
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['user_name'] = $user['fullname'];

                    // Redirect to the homepage
                    header("Location: index.php");
                    exit();
                }
            }

            // If login fails
            $_SESSION['login_attempts']++;
            $_SESSION['login_error'] = "Invalid username or password.";
        } else {
            $_SESSION['login_error'] = "Something went wrong. Try again.";
        }
    } else {
        $_SESSION['login_error'] = "Please fill in both username and password.";
    }

    // Redirect to login page after handling the POST request
    header("Location: login.php");
    exit();
}

$conn->close();
?>
