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

// These are my directories, you need to add your path.
require '/Applications/XAMPP/xamppfiles/htdocs/SoftwareProject/PHPMailer/src/Exception.php';
require '/Applications/XAMPP/xamppfiles/htdocs/SoftwareProject/PHPMailer/src/PHPMailer.php';
require '/Applications/XAMPP/xamppfiles/htdocs/SoftwareProject/PHPMailer/src/SMTP.php';

// These are my system credentials, everybody can change it regarding their system.
$servername = "localhost";
$username = "root";
$password = "h5gdja$-";
$dbname = "SoftwareProject";

// Connection created.
$conn = new mysqli($servername, $username, $password, $dbname);

if($conn->connect_error){
    error_log("Connection failed: " . $conn->connect_error);
}

// Post request method will help us to check the new user provided all the credentials, if value missing,
// it assigns them as null to prevent errors.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name = isset($_POST['first_name']) ? $_POST['first_name'] : null;
    $last_name = isset($_POST['last_name']) ? $_POST['last_name'] : null;
    $email = isset($_POST['email']) ? $_POST['email'] : null;
    $LoginPasscode = isset($_POST['LoginPasscode']) ? password_hash($_POST['LoginPasscode'], PASSWORD_DEFAULT) : null;

    if ($first_name && $last_name && $email && $LoginPasscode) {
// Using prepared statements to prevent SQL injection.
        $sql = "INSERT INTO users (ID, first_name, last_name, email, LoginPasscode) VALUES (?, ?, ?, ?, ?)";

        if ($stmt = $conn->prepare($sql)) {
// Here I'm binding the values, i = integer, s = string.
            $stmt->bind_param("issss", $nextId, $first_name, $last_name, $email, $LoginPasscode);
// At the end, once the values bound, possible SQL injection would be impossible.
            if ($stmt->execute()) {
                sendWelcomeEmail($email, $first_name);
                echo "New record created successfully!";
                header("Location: signup.html");
                exit();
            } else {
                echo "Error: " . $stmt->error;
            }

            $stmt->close();
        } else {
            echo "Prepare failed: " . $conn->error;
        }
    } else {
        echo "Error: Missing required fields.";
    }
}
$conn->close();

function sendWelcomeEmail($to, $first_name) {
    $mail = new PHPMailer(true);

    try {
        // Server settings.
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'xxxx@gmail.com'; // Replace with your Gmail address.
        $mail->Password = 'xxx'; // Replace with your Gmail app password.
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
// Port 587 is used for sending email over SMTP (Simple Mail Transfer Protocol) with STARTTLS encryption. And it's
// recommended for SMTP services of Google.
        $mail->Port = 587;

        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        $mail->setFrom('xxxx@gmail.com', 'Project Management System');
        $mail->addAddress($to, $first_name);

        // Email content, if wanted, can be changed.
        $mail->isHTML(true);
        $mail->Subject = 'Welcome!';
        $mail->Body    = "Hello $first_name,<br><br>We are happy to see you between us.<br><br>Regards,<br>Project Management System";

        $mail->send();
        echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
