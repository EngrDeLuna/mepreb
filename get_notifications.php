<?php
header('Content-Type: application/json');

// Database connection
$host = "localhost";
$user = "root";
$pass = ""; // change if needed
$db   = "mepreb";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['count' => 0]);
    exit();
}

// Count unread messages
$sql_contact = "SELECT COUNT(*) as total FROM contact_messages WHERE read_status = 0";
$sql_consult = "SELECT COUNT(*) as total FROM consultation_bookings WHERE read_status = 0";

$contact_result = $conn->query($sql_contact);
$consult_result = $conn->query($sql_consult);

$contact_count = $contact_result->fetch_assoc()['total'] ?? 0;
$consult_count = $consult_result->fetch_assoc()['total'] ?? 0;

$total_count = $contact_count + $consult_count;

echo json_encode(['count' => $total_count]);
$conn->close();
?>
