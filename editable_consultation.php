<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$db   = "mepreb";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id                  = intval($data["id"]);
$full_name           = $conn->real_escape_string($data["full_name"]);
$email               = $conn->real_escape_string($data["email"]);
$phone               = $conn->real_escape_string($data["phone"]);
$company             = $conn->real_escape_string($data["company"]);
$property_type       = $conn->real_escape_string($data["property_type"]);
$preferred_date      = $conn->real_escape_string($data["preferred_date"]);
$preferred_time      = $conn->real_escape_string($data["preferred_time"]);
$meeting_type        = $conn->real_escape_string($data["meeting_type"]);
$additional_comments = $conn->real_escape_string($data["additional_comments"]);

$sql = "
    UPDATE consultation_bookings
    SET
        full_name='$full_name',
        email='$email',
        phone='$phone',
        company='$company',
        property_type='$property_type',
        preferred_date='$preferred_date',
        preferred_time='$preferred_time',
        meeting_type='$meeting_type',
        additional_comments='$additional_comments'
    WHERE id=$id
";


if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}
?>







