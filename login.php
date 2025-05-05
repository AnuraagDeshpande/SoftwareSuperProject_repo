<?php
session_start();

$error = "";
$username = "";

// Check if the login form was submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the username and password from the form
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Assuming you have a database connection in $db
    $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    // Validate credentials
    if ($user && password_verify($password, $user['password'])) {
        // Successful login, store user data in session
        // Assuming user successfully authenticated:
        $_SESSION['user_id'] = $user['id'];       // Store the user ID in the session
        $_SESSION['username'] = $user['username']; // Store the username in the session
        $_SESSION['user'] = $user;                 // Optionally store the entire user data


        // Redirect to the home page
        header("Location: index.php");
        exit();
    } else {
        // Login failed, store error in session
        $_SESSION['login_error'] = "Invalid username or password";
        $_SESSION['login_username'] = $username; // Optionally, retain the username input

        // Redirect back to login page
        header("Location: login.php");
        exit();
    }
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <script src="scripts/login-validation.js"></script>
    <link rel="stylesheet" href="styles/login.css">
</head>

<body>
    <div class="container">
        <div class="img-side">
            <img src="media/form-image.jpg" alt="Login image">
        </div>
        <div class="form-side">
            <h2>Welcome back</h2>

            <?php if ($error): ?>
                <div class="error-message" style="color: red; margin-bottom: 10px;">
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <form id="login-form" method="POST" action="login_helper.php">
                <input type="text" id="username" name="Username" placeholder="Username" value="<?= htmlspecialchars($username) ?>" required>
                <input type="password" id="password" name="Password" placeholder="Password" required>
                <input type="submit" value="Login">
            </form>

            <p>Don't have an account yet?
                <a href="signup.html">Sign up</a>
            </p>
        </div>
    </div>
</body>

</html>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <script src="scripts/login-validation.js"></script>
    <link rel="stylesheet" href="styles/login.css">

</head>


<body>
    <div class="container">
        <div class="img-side">
            <img src="media/form-image.jpg" alt="">
        </div>
        <div class="form-side">
            <h2>Welcome back</h2>
            <form id="login-form" action="login.php" method="POST">
                <input type="text" id="username" name="username" placeholder="Username" required>
                <input type="password" id="password" name="password" placeholder="Password" required>
                <input type="submit" value="Login">
            </form>
            <p>Don't have an account yet?
                <a href="signup.html">Sign up</a>
            </p>
        </div>
    </div>

</body>

</html>
