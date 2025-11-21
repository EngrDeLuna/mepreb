<?php
session_start();

// Redirect if not logged in
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: login.php");
    exit();
}

// Database connection
$host = "localhost";
$user = "root"; // change if needed
$pass = "";     // change if needed
$db   = "mepreb";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get today's date
$today = date('Y-m-d');

// 1. NEW SUBMISSIONS (contact_messages for today)
$sql_submissions = "SELECT COUNT(*) as count FROM contact_messages WHERE DATE(created_at) = ?";
$stmt1 = $conn->prepare($sql_submissions);
$stmt1->bind_param("s", $today);
$stmt1->execute();
$result1 = $stmt1->get_result();
$new_submissions = ($result1 && $result1->num_rows > 0) ? $result1->fetch_assoc()['count'] : 0;

// 2. UPCOMING (consultation_bookings for today)
$sql_consultations = "SELECT COUNT(*) as count FROM consultation_bookings WHERE DATE(created_at) = ?";
$stmt2 = $conn->prepare($sql_consultations);
$stmt2->bind_param("s", $today);
$stmt2->execute();
$result2 = $stmt2->get_result();
$upcoming = ($result2 && $result2->num_rows > 0) ? $result2->fetch_assoc()['count'] : 0;

// 3. TOTAL DATA (sum of today's submissions and consultations)
$total_data = $new_submissions + $upcoming;

// 4. Unresolved (default 0, table does not exist)
$unresolved = 0;
?>

<!DOCTYPE html>
<html lang="en">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MREB Admin Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

<!-- TOP NAVBAR -->
<header class="admin-header">

  <!-- Search Bar -->
  <div class="search-container">
    <input type="text" placeholder="Search..." class="search-input">
    <button class="search-btn" type="button">
      <!-- Search SVG -->
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 6a7.5 7.5 0 016.99 10.65z"/>
      </svg>
    </button>
  </div>


<div class="notification-container">

  <!-- Clickable Bell -->
  <div class="notification-bell-wrapper">
    <svg class="icon notification-bell" xmlns="http://www.w3.org/2000/svg" fill="none" 
         viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
    </svg>

    <!-- Count Badge (handled separately in your JS) -->
    <span class="notification-count">0</span>
  </div>

  <!-- Dropdown Menu -->
  <div class="notification-dropdown">
    <ul class="notification-list"></ul>
  </div>

</div>




  <a href="logout.php" class="logout-btn">
  <svg class="icon logout-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/>
  </svg>
</a>


</header>


    <!-- INFO CARDS SECTION -->
    <section class="info-cards-section">
        <div class="info-cards-container">

            <!-- Card 1 -->
            <div class="info-card-wrapper">
                <div class="info-card card-blue">
                    <p class="metric-number"><?php echo $new_submissions; ?></p>
                    <p class="metric-text">New Contact Submissions Today</p>
                </div>
                <p class="info-card-title title-blue">NEW SUBMISSIONS:</p>
            </div>

            <!-- Card 2 -->
            <div class="info-card-wrapper">
                <div class="info-card card-green">
                    <p class="metric-number"><?php echo $upcoming; ?></p>
                    <p class="metric-text">Consultations Booked</p>
                </div>
                <p class="info-card-title title-green">UPCOMING:</p>
            </div>

            <!-- Card 3 -->
            <div class="info-card-wrapper">
                <div class="info-card card-yellow">
                    <p class="metric-number"><?php echo $total_data; ?></p>
                    <p class="metric-text">Total Users</p>
                </div>
                <p class="info-card-title title-yellow">TOTAL DATA:</p>
            </div>

            <!-- Card 4 -->
            <div class="info-card-wrapper">
                <div class="info-card card-red">
                    <p class="metric-number"><?php echo $unresolved; ?></p>
                    <p class="metric-text">Pending Support Tickets</p>
                </div>
                <p class="info-card-title title-red">UNRESOLVED ITEMS:</p>
            </div>

        </div>
    </section>

    <!-- TITLE + SUBTITLE ABOVE BUTTONS -->
    <div class="admin-page-title">
        <h1>MREB ADMIN DASHBOARD</h1>
        <p>Select an option to manage admin tasks</p>
    </div>

    <!-- MAIN SECTION -->
    <section class="admin-section">
        <div class="admin-buttons">

            <!-- CONTACT BUTTON -->
<div class="admin-card-wrapper">
    <a href="contact-show.php" class="admin-card">
        <img src="images/contact.png" class="admin-icon" alt="Contact">
        <p class="card-inner-text">CONTACT</p>
    </a>
    <p class="card-title">VIEW CONTACT FORM SUBMISSIONS</p>
</div>

<!-- CONSULTATION BUTTON -->
<div class="admin-card-wrapper">
    <a href="consultation-show.php" class="admin-card">
        <img src="images/consultation.png" class="admin-icon" alt="Consultation">
        <p class="card-inner-text">CONSULTATION</p>
    </a>
    <p class="card-title">VIEW BOOKED CONSULTATIONS</p>
</div>


        </div>
    </section>


<script src="script.js"></script>
</body>
</html>
