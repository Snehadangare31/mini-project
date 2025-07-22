<?php
// db.php
$host = 'localhost';   // Default XAMPP MySQL host
$user = 'root';        // Default MySQL username
$pass = '';            // Default MySQL password (empty in XAMPP)
$db = 'imt_users';     // Your database name

// Create connection
$conn = new mysqli($host, $user, $pass, $db);


// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

