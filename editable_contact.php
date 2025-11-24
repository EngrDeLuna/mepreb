

<?php
header('Content-Type: application/json');

// DB connection
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

$id = intval($data["id"]);
$full_name = $conn->real_escape_string($data["full_name"]);
$email     = $conn->real_escape_string($data["email"]);
$phone     = $conn->real_escape_string($data["phone"]);
$message   = $conn->real_escape_string($data["message"]);

$sql = "
    UPDATE contact_messages 
    SET 
        full_name='$full_name',
        email='$email',
        phone='$phone',
        message='$message'
    WHERE id=$id
";

echo json_encode(["success" => $conn->query($sql)]);
?>










