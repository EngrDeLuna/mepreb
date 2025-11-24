<?php
// DB connection
$host = "localhost";
$user = "root";
$pass = "";
$db   = "mepreb";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("DB connection failed: " . $conn->connect_error);

// ------------------------
// reCAPTCHA verification
// ------------------------
$recaptcha_secret = '6LdbcRYsAAAAAKbaagEFDmeZh1RYmhvoY50DaOKa';
$recaptcha_response = $_POST['g-recaptcha-response'] ?? '';

$verify = file_get_contents(
    "https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$recaptcha_response}"
);
$captcha_success = json_decode($verify);

if (!$captcha_success->success) {
    die("reCAPTCHA verification failed. Please check the box and try again.");
}

// ------------------------
// Get POST data
// ------------------------
$fullName    = $_POST['fullName'] ?? '';
$email       = $_POST['email'] ?? '';
$phone       = $_POST['phone'] ?? '';
$subject     = $_POST['subject'] ?? '';
$message     = $_POST['message'] ?? '';
$agree_terms = isset($_POST['agree_terms']) ? 1 : 0;

// Insert into database
$sql = "INSERT INTO contact_messages (full_name, email, phone, subject, message, agree_terms)
        VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssi", $fullName, $email, $phone, $subject, $message, $agree_terms);
$stmt->execute();

$stmt->close();
$conn->close();

// Redirect back to the contact form to clear fields
header("Location: contact.html");
exit;
?>
