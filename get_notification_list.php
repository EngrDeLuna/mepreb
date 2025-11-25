<?php
date_default_timezone_set('Asia/Manila');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "mepreb");
if ($conn->connect_error) {
    echo json_encode([]);
    exit();
}

$notifications = [];
$today = date('Y-m-d');

// ----------------------------
// Contact messages (today, unread)
// ----------------------------
$sql_contact = "SELECT * 
                FROM contact_messages 
                WHERE read_status = 0 
               AND DATE(CONVERT_TZ(created_at, '+00:00', '+08:00')) = ?
                ORDER BY created_at DESC
                LIMIT 10";
$stmt = $conn->prepare($sql_contact);
$stmt->bind_param("s", $today);
$stmt->execute();
$result_contact = $stmt->get_result();
while ($row = $result_contact->fetch_assoc()) {
    $notifications[] = [
        'id' => $row['id'],
        'type' => 'Contact Message',
        'full_name' => $row['full_name'],
        'email' => $row['email'],
        'phone' => $row['phone'],
        'subject' => $row['subject'],
        'message' => $row['message'],
        'agree_terms' => $row['agree_terms'],
        'created_at' => $row['created_at'],
        'title' => $row['full_name'],
        'purpose' => $row['subject'],
        'date' => $row['created_at']
    ];
}

// ----------------------------
// Consultation bookings (today, unread)
// ----------------------------
$sql_consult = "SELECT * 
                FROM consultation_bookings 
                WHERE read_status = 0 
                 AND DATE(CONVERT_TZ(created_at, '+00:00', '+08:00')) = ?
                ORDER BY created_at DESC
                LIMIT 10";
$stmt2 = $conn->prepare($sql_consult);
$stmt2->bind_param("s", $today);
$stmt2->execute();
$result_consult = $stmt2->get_result();
while ($row = $result_consult->fetch_assoc()) {
    $notifications[] = [
        'id' => $row['id'],
        'type' => 'Consultation Booking',
        'full_name' => $row['full_name'],
        'email' => $row['email'],
        'phone' => $row['phone'],
        'company' => $row['company'],
        'transaction_type' => $row['transaction_type'],
        'property_type' => $row['property_type'],
        'preferred_date' => $row['preferred_date'],
        'preferred_time' => $row['preferred_time'],
        'meeting_type' => $row['meeting_type'],
        'additional_comments' => $row['additional_comments'],
        'created_at' => $row['created_at'],
        'title' => $row['full_name'],
        'purpose' => $row['transaction_type'],
        'message' => $row['transaction_type'],
        'date' => $row['created_at']
    ];
}

// ----------------------------
// Sort by created_at descending & limit top 10
// ----------------------------
usort($notifications, function($a,$b){
    return strtotime($b['date']) - strtotime($a['date']);
});
$notifications = array_slice($notifications, 0, 10);

echo json_encode($notifications);
$conn->close();
?>
