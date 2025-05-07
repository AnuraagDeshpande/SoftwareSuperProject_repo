<?php
$servername = "localhost";
$username = "root";
$password = ""; // Adjust if your MySQL has a password
$dbname = "softwareproject";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
