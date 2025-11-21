<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB connection
$host = "localhost";
$user = "root";
$pass = "";
$db   = "mepreb";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("DB connection failed: " . $conn->connect_error);

// Get POST data
$fullName = $_POST['fullName'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$company = $_POST['company'] ?? '';
$transaction = $_POST['transaction'] ?? '';
$meetingType = $_POST['meetingType'] ?? '';
$date = $_POST['date'] ?? '';
$time = $_POST['time'] ?? '';
$comments = $_POST['comments'] ?? '';
$propertyTypeArr = $_POST['propertyType'] ?? [];
$propertyTypeStr = implode(", ", $propertyTypeArr);

// Prepare SQL
$sql = "INSERT INTO consultation_bookings 
(full_name,email,phone,company,transaction_type,property_type,preferred_date,preferred_time,meeting_type,additional_comments)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) die("Prepare failed: " . $conn->error);

$stmt->bind_param(
    "ssssssssss",
    $fullName,$email,$phone,$company,$transaction,$propertyTypeStr,$date,$time,$meetingType,$comments
);

// Execute and debug
if ($stmt->execute()) {
    // Redirect back to clear form
    header("Location: book-a-consultation.html");
    exit;
} else {
    die("Insert failed: " . $stmt->error);
}

$stmt->close();
$conn->close();
?>
