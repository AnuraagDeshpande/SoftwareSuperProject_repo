<?php
session_start();

// Destroy the session and unset all session variables
session_unset(); 
session_destroy();

// Redirect to the index starter page
header("Location: index.php");
exit();
?>
