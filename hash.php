<?php
$password = "Mepreb@2025";

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Display hashed password
echo "Your hashed password is: " . $hashedPassword;
?>
