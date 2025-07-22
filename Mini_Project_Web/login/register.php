<?php
include 'db.php';

// Get the posted data (from frontend)
$data = json_decode(file_get_contents("php://input"));
$email = $data->email;
$password = password_hash($data->password, PASSWORD_DEFAULT);  // Hash the password

// Check if email already exists
$sql_check = "SELECT id FROM users WHERE email = ?";
$stmt = $conn->prepare($sql_check);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$response = [];

if ($stmt->num_rows > 0) {
    $response['status'] = 'error';
    $response['message'] = 'Email already registered.';
} else {
    // Insert new user
    $sql_insert = "INSERT INTO users (email, password) VALUES (?, ?)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("ss", $email, $password);
    
    if ($stmt_insert->execute()) {
        $response['status'] = 'success';
        $response['message'] = 'Registration successful!';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Failed to register user.';
    }
}

echo json_encode($response);
?>
