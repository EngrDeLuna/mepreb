<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "mepreb";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("DB connection failed: " . $conn->connect_error);

// Pagination setup
$limit = 10;
$page  = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$offset = ($page - 1) * $limit;

// Get total rows
$resultTotal = $conn->query("SELECT COUNT(*) AS total FROM consultation_bookings");
$totalRows = $resultTotal->fetch_assoc()['total'];
$totalPages = ceil($totalRows / $limit);

// Fetch paginated consultations
$sql = "SELECT id, full_name, email, phone, company, property_type, preferred_date, preferred_time, meeting_type, additional_comments, created_at 
        FROM consultation_bookings 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Consultation Bookings</title>

    <!-- GOOGLE FONTS (same as contact page) -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="style.css">
</head>
<body>

<!-- NAV -->
<nav class="show-header">
    <a href="admin-dashboard.php" class="back-btn">
        <img src="images/back.png" alt="Back">
    </a>
</nav>

<div class="table-container">

    <!-- HEADER + SEARCH -->
    <div class="table-header-container">

        <!-- First row: Title + Search -->
        <div class="table-top-row">
            <div class="left-side">
                <h2>Booked Consultations</h2>
            </div>
            <div class="right-side">
                <input type="text" id="searchInput" class="table-search-input" placeholder="Search by name, email or phone...">
            </div>
        </div>

        <!-- Second row: Selected + Delete icon -->
        <div class="table-bottom-row">
            <div class="left-side">
                <span id="selectedCount" class="selected-count">0 selected</span>
            </div>
            <div class="right-side">
                <button id="deleteSelected" class="delete-btn" title="Delete Selected">
                    <img src="images/delete-icon.png" alt="Delete">
                </button>
            </div>
        </div>

    </div>

    <!-- TABLE -->
    <table class="styled-table" id="consultationTable">

        <thead>
            <tr>
                <th><input type="checkbox" id="selectAll"></th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Property Type</th>
                <th>Preferred Date</th>
                <th>Preferred Time</th>
                <th>Meeting Type</th>
                <th>Additional Comments</th>
                <th>Edit</th>
            </tr>
        </thead>

        <tbody>
        <?php while($row = $result->fetch_assoc()): ?>
            <tr>

                <td><input type="checkbox" class="rowCheckbox" value="<?= $row['id'] ?>"></td>

                <td><?= htmlspecialchars($row['full_name']) ?></td>
                <td><?= htmlspecialchars($row['email']) ?></td>
                <td><?= htmlspecialchars($row['phone']) ?></td>
                <td><?= htmlspecialchars($row['company']) ?></td>
                <td><?= htmlspecialchars($row['property_type']) ?></td>
                <td><?= $row['preferred_date'] ?></td>
                <td><?= $row['preferred_time'] ?></td>
                <td><?= htmlspecialchars($row['meeting_type']) ?></td>
                <td><?= nl2br(htmlspecialchars($row['additional_comments'])) ?></td>

                <!-- EDIT BUTTON -->
                <td class="edit-col">
                    <button class="edit-btn" data-id="<?= $row['id'] ?>">
                        <img src="images/edit.png" class="edit-icon" alt="Edit">
                    </button>
                </td>

            </tr>
        <?php endwhile; ?>
        </tbody>

    </table>

    <!-- PAGINATION -->
    <div class="pagination">

        <a href="?page=<?= max(1, $page - 1) ?>" class="pag-btn <?= $page == 1 ? 'disabled' : '' ?>">Previous</a>

        <?php
        $max_links = 7;
        $start = max(1, $page - 3);
        $end = min($totalPages, $page + 3);

        if ($start > 1) echo '<span>...</span>';

        for ($i = $start; $i <= $end; $i++):
        ?>
            <a href="?page=<?= $i ?>" class="pag-btn <?= $i == $page ? 'active' : '' ?>"><?= $i ?></a>
        <?php endfor;

        if ($end < $totalPages) echo '<span>...</span>';
        ?>

        <a href="?page=<?= min($totalPages, $page + 1) ?>" class="pag-btn <?= $page == $totalPages ? 'disabled' : '' ?>">Next</a>

    </div>

</div>

<!-- ============= EDIT MODAL ============= -->
<div id="editModal" class="edit-modal" aria-hidden="true" role="dialog" aria-labelledby="editModalTitle">
  <div class="edit-modal-content">
    <button type="button" class="close-edit-modal" aria-label="Close edit modal">&times;</button>
    <h3 id="editModalTitle">Edit Entry</h3>
    <form id="editForm" autocomplete="off"></form>
   <div class="save-btn-container">
    <button type="button" id="saveModalBtn">
        <img src="images/save.png" alt="Save">
    </button>
</div>
  </div>
</div>

<script src="script.js"></script>
</body>
</html>
