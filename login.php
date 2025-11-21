<?php
session_start();

// DB connection
$conn = new mysqli("localhost", "root", "", "mepreb");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle auto-login via cookie
if (!isset($_SESSION["admin_logged_in"]) && isset($_COOKIE["rememberMe"])) {
    $token = $_COOKIE["rememberMe"];
    $stmt = $conn->prepare("SELECT username FROM admin_accounts WHERE remember_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($username);
        $stmt->fetch();
        $_SESSION["admin_logged_in"] = true;
        $_SESSION["admin_username"] = $username;
        header("Location: admin-dashboard.php");
        exit();
    }
}

// If form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["loginUsername"];
    $password = $_POST["loginPassword"];
    $remember = isset($_POST["rememberMe"]);

    // Check admin credentials
    $stmt = $conn->prepare("SELECT password FROM admin_accounts WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            // Store session
            $_SESSION["admin_logged_in"] = true;
            $_SESSION["admin_username"] = $username;

            // Remember Me functionality
            if ($remember) {
                $token = bin2hex(random_bytes(16));
                setcookie("rememberMe", $token, time() + (86400 * 30), "/", "", true, true); // 30 days, secure
                // Save token in DB
                $update = $conn->prepare("UPDATE admin_accounts SET remember_token = ? WHERE username = ?");
                $update->bind_param("ss", $token, $username);
                $update->execute();
                $update->close();
            }

            header("Location: admin-dashboard.php");
            exit();
        } else {
            $error = "Incorrect password.";
        }
    } else {
        $error = "Username not found.";
    }

    $stmt->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login Page</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div class="login-container">
  <div class="login-left">
    <h1>WELCOME BACK!</h1>
    <p>Sign in to continue where you left off and explore our amazing features.</p>
  </div>

  <div class="login-right">
  <form class="login-form" id="loginForm" method="POST" action="">
    <h2>Hello</h2>
    <p>Access your administration dashboard</p>

    <?php if (!empty($error)) echo "<p style='color:red;'>$error</p>"; ?>

    <div class="input-group">
      <label for="loginUsername">Username or Email *</label>
      <div class="input-wrapper">
        <img src="images/email-icon.png" alt="user icon">
        <input type="text" placeholder="Enter your username or email" id="loginUsername" name="loginUsername" required>
      </div>
    </div>

    <div class="input-group">
      <label for="loginPassword">Password *</label>
      <div class="input-wrapper">
        <img src="images/password-icon.png" alt="password icon">
        <input type="password" placeholder="Enter your password" id="loginPassword" name="loginPassword" required>
      </div>
    </div>

    <div class="form-options">
     <label class="remember-me">
    <input type="checkbox" name="rememberMe" id="rememberMe">
    Remember Me
</label>

      <a href="#" class="forgot-password">Forgot Password?</a>
    </div>

    <!-- FIXED BUTTON TEXT (was SIGN UP) -->
    <button type="submit" class="login-btn">LOGIN</button>
  </form>
</div>

</body>
</html>
