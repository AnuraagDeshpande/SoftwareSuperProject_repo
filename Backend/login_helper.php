<?php
session_start();

echo '<pre>'; print_r($_SESSION); echo '</pre>';

// Attempt limiter
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
}

if ($_SESSION['login_attempts'] >= 5) {
    $cooldown = 300;

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

// DB connection
$conn = new mysqli("localhost", "root", "", "setest");
if ($conn->connect_error) {
    $_SESSION['login_error'] = "Database connection failed.";
    header("Location: login.php");
    exit();
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['Username'] ?? "");
    $password = $_POST['Password'] ?? "";

    $_SESSION['login_username'] = $username; // Save for repopulating form

    if ($username && $password) {
        $sql = "SELECT ID, Name, Password FROM users WHERE Username = ?";
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 1) {
                $user = $result->fetch_assoc();
                if (password_verify($password, $user['Password'])) {
                    // ✅ Success
                    session_regenerate_id(true);
                    $_SESSION['login_attempts'] = 0;
                    unset($_SESSION['lockout_time']);
                    unset($_SESSION['login_error']);
                    unset($_SESSION['login_username']);

                    $_SESSION['user_id'] = $user['ID'];
                    $_SESSION['user_name'] = $user['Name'];

                    header("Location: ../index.php");
                    exit();
                } else {
                    // ❌ Wrong password
                    $_SESSION['login_attempts']++;
                    $_SESSION['login_error'] = "Invalid username or password.";
                    header("Location: login.php");
                    exit();
                }
            } else {
                // ❌ Username not found
                $_SESSION['login_attempts']++;
                $_SESSION['login_error'] = "Invalid username or password.";
                header("Location: login.php");
                exit();
            }
        } else {
            $_SESSION['login_error'] = "Something went wrong. Try again.";
            header("Location: login.php");
            exit();
        }
    } else {
        $_SESSION['login_error'] = "Please fill in all fields.";
        header("Location: login.php");
        exit();
    }
}

$conn->close();
?>
