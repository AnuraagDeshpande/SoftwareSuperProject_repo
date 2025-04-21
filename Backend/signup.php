<?php
/*                                  A T T E N T I O N
This code has some requirements that you need to alter and modify it regarding your software,
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
$password = "";
$dbname = "SoftwareProject";

// Connection created.
$conn = new mysqli($servername, $username, $password, $dbname);

if($conn->connect_error){
    error_log("Connection failed: " . $conn->connect_error);
}

// Post request method will help us to check the new user provided all the credentials, if value missing,
// it assigns them as null to prevent errors.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $Name = isset($_POST['Name']) ? $_POST['Name'] : null;
    $Surname = isset($_POST['Surname']) ? $_POST['Surname'] : null;
    $Email = isset($_POST['Email']) ? $_POST['Email'] : null;
    $LoginPasscode = isset($_POST['LoginPasscode']) ? password_hash($_POST['LoginPasscode'], PASSWORD_DEFAULT) : null;

    if ($Name && $Surname && $Gender && $Email && $LoginPasscode) {
// Using prepared statements to prevent SQL injection.
        $sql = "INSERT INTO User (ID, Name, Surname, Email, LoginPasscode) VALUES (?, ?, ?, ?, ?)";

        if ($stmt = $conn->prepare($sql)) {
// Here I'm binding the values, i = integer, s = string.
            $stmt->bind_param("issss", $nextId, $Name, $Surname, $Email, $LoginPasscode);
// At the end, once the values bound, possible SQL injection would be impossible.
            if ($stmt->execute()) {
                sendWelcomeEmail($Email, $Name);
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

function sendWelcomeEmail($to, $name) {
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
        $mail->addAddress($to, $name);

        // Email content, if wanted, can be changed.
        $mail->isHTML(true);
        $mail->Subject = 'Welcome!';
        $mail->Body    = "Hello $name,<br><br>We are happy to see you between us.<br><br>Regards,<br>Project Management System";

        $mail->send();
        echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
