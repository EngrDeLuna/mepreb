<?php
// DB connection
$host = "localhost";
$user = "root";
$pass = "";
$db   = "mepreb";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'DB connection failed']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['ids'], $data['table']) || !is_array($data['ids']) || empty($data['ids'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit;
}

// Sanitize IDs
$ids = array_map('intval', $data['ids']);
$idsList = implode(',', $ids);

// Allow only these tables
$allowedTables = ['contact_messages', 'consultation_bookings'];
if (!in_array($data['table'], $allowedTables)) {
    echo json_encode(['success' => false, 'error' => 'Invalid table']);
    exit;
}

$table = $data['table'];

// Delete from database
$sql = "DELETE FROM $table WHERE id IN ($idsList)";
if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
?>
