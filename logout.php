<?php
session_start();

// Clear all session data
session_unset();
session_destroy();

// Clear the remember me cookie
if (isset($_COOKIE["rememberMe"])) {
    setcookie("rememberMe", "", time() - 3600, "/", "", true, true); // expire cookie
}

// Optional: clear token in DB (recommended)
$conn = new mysqli("localhost", "root", "", "mepreb");
if (!$conn->connect_error && isset($_SESSION["admin_username"])) {
    $stmt = $conn->prepare("UPDATE admin_accounts SET remember_token = NULL WHERE username = ?");
    $stmt->bind_param("s", $_SESSION["admin_username"]);
    $stmt->execute();
    $stmt->close();
}
$conn->close();

// Redirect to login page
header("Location: login.php");
exit();
?>
