<?php
/*                                  A T T E N T I O N
This code has some stuff that you need to alter and modify it regarding your software,
Please read the comments for assistance. */

// Ensure PHPMailer(PHP Library) is installed before using this script.
// You can install it via Composer: `composer require phpmailer/phpmailer`
// Or manually download PHPMailer and include the required files below.
// You can find the files from following git repo: https://github.com/PHPMailer/PHPMailer
// PHP Mailer is necessary us for sending welcome emails, or verification system (might be done at future).
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// These are my directories, you need to add your path.
require '/Applications/XAMPP/xamppfiles/htdocs/SoftwareEngineering/PHPMailer/src/Exception.php';
require '/Applications/XAMPP/xamppfiles/htdocs/SoftwareEngineering/PHPMailer/src/PHPMailer.php';
require '/Applications/XAMPP/xamppfiles/htdocs/SoftwareEngineering/PHPMailer/src/SMTP.php';

// Database connection details (Modify these for your system)
$servername = "localhost";
$username = "root";
$password = ""; //your details
$dbname = "SoftwareProject";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize input
    $first_name = isset($_POST['first_name']) ? trim($_POST['first_name']) : null;
    $last_name = isset($_POST['last_name']) ? trim($_POST['last_name']) : null;
    $username = isset($_POST['username']) ? trim($_POST['username']) : null;
    $email = isset($_POST['email']) ? trim($_POST['email']) : null;
    $LoginPasscode = isset($_POST['LoginPasscode']) ? password_hash($_POST['LoginPasscode'], PASSWORD_DEFAULT) : null;

    // Validate required fields
    if (!$first_name || !$last_name || !$username || !$email || !$LoginPasscode) {
        die("Error: All fields are required.");
    }

    // Check if username or email already exists
    $checkUser = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $checkUser->bind_param("ss", $username, $email);
    $checkUser->execute();
    $checkUser->store_result();

    if ($checkUser->num_rows > 0) {
        die("Error: Username or email already exists.");
    }
    $checkUser->close();

    // Insert new user into database
    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, username, email, LoginPasscode) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $first_name, $last_name, $username, $email, $LoginPasscode);

    if ($stmt->execute()) {
        sendWelcomeEmail($email, $first_name);
        header("Location: login.html"); // Redirect to login page
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

function sendWelcomeEmail($to, $first_name) {
    $mail = new PHPMailer(true);

    try {
        // Server settings.
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'noreply.project.management.cu@gmail.com'; // Replace with your Gmail address.
        $mail->Password = 'djky wqhj fhvo ymcc'; // Replace with your Gmail password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        $mail->setFrom('noreply.project.management.cu@gmail.com', 'Noreply Project Management System');
        $mail->addAddress($to, $first_name);

        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'Welcome!';
        $mail->Body    = "Hello $first_name,<br><br>We are happy to see you between us.<br><br>Regards,<br>Project Management System";

        // Send email
        if ($mail->send()) {
            echo 'Message has been sent';
        } else {
            echo 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
        }
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
