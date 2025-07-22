<?php
include 'db.php';

// Get the posted data (from frontend)
$data = json_decode(file_get_contents("php://input"));
$email = $data->email;
$password = $data->password;

// Check if user exists
$sql = "SELECT password FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$response = [];

if ($row = $result->fetch_assoc()) {
    // Verify password
    if (password_verify($password, $row['password'])) {
        $response['status'] = 'success';
        $response['message'] = 'Login successful!';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Incorrect password.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Email not found.';
}

echo json_encode($response);
?>

