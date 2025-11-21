<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "mepreb");
if ($conn->connect_error) {
    echo json_encode(['success' => false]);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
$type = $data['type'] ?? null;

if ($id && $type) {
    if ($type === 'Contact Message') {
        $stmt = $conn->prepare("UPDATE contact_messages SET read_status = 1 WHERE id = ?");
    } elseif ($type === 'Consultation Booking') {
        $stmt = $conn->prepare("UPDATE consultation_bookings SET read_status = 1 WHERE id = ?");
    } else {
        echo json_encode(['success' => false]);
        exit();
    }

    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}

$conn->close();
?>
