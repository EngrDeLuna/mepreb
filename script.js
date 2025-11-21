document.addEventListener("DOMContentLoaded", function() {




      // Hamburger Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

const btnAdmin = document.querySelector('.btn-admin');
const headerButtons = document.querySelector('.header-buttons');

function moveAdminBtn() {
    if (window.innerWidth <= 1024) {
        // Move btn-admin inside navMenu if not already moved
        if (!navMenu.contains(btnAdmin)) {
            navMenu.appendChild(btnAdmin);
        }
    } else {
        // Move back to header-buttons on larger screens
        if (!headerButtons.contains(btnAdmin)) {
            headerButtons.appendChild(btnAdmin);
        }
    }
}

// Run on load
moveAdminBtn();

// Run on window resize
window.addEventListener('resize', moveAdminBtn);



    // ==============================
    // HIGHLIGHT IMAGE GALLERY
    // ==============================
    const highlightSections = document.querySelectorAll(".highlight-item");
    highlightSections.forEach(section => {
        const mainImg = section.querySelector(".highlight-image img");
        const thumbs = section.querySelectorAll(".thumbnail-gallery .thumb");
        let currentIndex = 0;

        function showImage(index) {
            mainImg.style.opacity = 0;
            setTimeout(() => {
                mainImg.src = thumbs[index].src;
                mainImg.style.opacity = 1;
                thumbs.forEach(t => t.classList.remove("active-thumb"));
                thumbs[index].classList.add("active-thumb");
            }, 250);
        }

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener("click", () => {
                currentIndex = index;
                showImage(currentIndex);
            });
        });

        setInterval(() => {
            currentIndex = (currentIndex + 1) % thumbs.length;
            showImage(currentIndex);
        }, 3000);

        showImage(currentIndex);
    });

    // ==============================
    // SEARCH / FILTER FUNCTIONALITY (Properties)
    // ==============================
    const searchBar = document.getElementById("searchBar");
    const typeFilter = document.getElementById("typeFilter");
    const propertyCards = document.querySelectorAll(".property-card");

    function filterProperties() {
        const searchText = searchBar.value.toLowerCase().trim();
        const selectedType = typeFilter.value;

        propertyCards.forEach(card => {
            const location = card.getAttribute("data-location").toLowerCase();
            const type = card.getAttribute("data-type");
            const infoText = card.innerText.toLowerCase();
            const isBuilding = infoText.includes("total floors");
            const isFloorOnly = infoText.includes("floors:") && !infoText.includes("total floors");

            let matchesSearch = false;

            if (searchText.includes("building")) matchesSearch = isBuilding;
            else if (searchText.includes("floor")) matchesSearch = isFloorOnly;
            else matchesSearch = location.includes(searchText) || infoText.includes(searchText);

            const matchesType = selectedType === "" ||
                                (selectedType === "building" && isBuilding) ||
                                (selectedType === "floor" && isFloorOnly);

            card.style.display = (matchesSearch && matchesType) ? "block" : "none";
        });
    }

    if (searchBar) searchBar.addEventListener("input", filterProperties);
    if (typeFilter) typeFilter.addEventListener("change", filterProperties);

    // ==============================
    // MODAL SHOW / HIDE
    // ==============================
    const modals = document.querySelectorAll(".modal");
    const viewButtons = document.querySelectorAll(".view-details");
    const closeButtons = document.querySelectorAll(".close");

    viewButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = document.getElementById(button.dataset.target);
            if (modal) {
                modal.style.display = "flex";
                document.body.style.overflow = "hidden";
            }
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (modal) {
                modal.style.display = "none";
                document.body.style.overflow = "";
            }
        });
    });

    window.addEventListener("click", e => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = "none";
                document.body.style.overflow = "";
            }
        });
    });

    // ==============================
    // NOTIFICATIONS (Bell & Modal)
    // ==============================
    const bellWrapper = document.querySelector('.notification-bell-wrapper');
    const dropdown = document.querySelector('.notification-dropdown');
    const list = document.querySelector('.notification-list');
    const notificationCountElem = document.querySelector('.notification-count');

    let notificationsCache = [];

    // Create modal dynamically if not present
    let modal = document.getElementById('notif-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'notif-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    const modalContent = modal.querySelector('.modal-body');
    const closeBtn = modal.querySelector('.close');

    // ------------------------------
    // RENDER NOTIFICATIONS
    // ------------------------------
    function renderNotifications() {
        list.innerHTML = '';
        if (!notificationsCache.length) {
            list.innerHTML = '<li class="no-notif">No new notifications</li>';
            notificationCountElem.textContent = 0;
            return;
        }

        notificationsCache.forEach(item => {
            const li = document.createElement('li');
            li.className = 'notification-item';
            li.dataset.type = item.type;
            li.dataset.id = item.id;
            li.innerHTML = `
                <strong>${item.type}</strong><br>
                <span>${item.title || item.full_name}</span><br>
                <small>${item.message || ''}</small><br>
                <small>${item.date}</small>
            `;

            li.addEventListener('click', () => {
                const nameText = item.full_name || item.title || 'N/A';
                const purposeText = item.subject || item.transaction_type || 'N/A';

                let tableHTML = '';
                if(item.type === 'Contact Message') {
                    tableHTML = `
                        <table class="modal-table">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Message</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${item.full_name || ''}</td>
                                    <td>${item.email || ''}</td>
                                    <td>${item.phone || ''}</td>
                                    <td>${item.message || ''}</td>
                                    <td>${item.created_at || item.date}</td>
                                </tr>
                            </tbody>
                        </table>
                    `;
                } else if(item.type === 'Consultation Booking') {
                    tableHTML = `
                        <table class="modal-table">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Company</th>
                                    <th>Property Type</th>
                                    <th>Preferred Date</th>
                                    <th>Preferred Time</th>
                                    <th>Meeting Type</th>
                                    <th>Additional Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${item.full_name || ''}</td>
                                    <td>${item.email || ''}</td>
                                    <td>${item.phone || ''}</td>
                                    <td>${item.company || ''}</td>
                                    <td>${item.property_type || ''}</td>
                                    <td>${item.preferred_date || ''}</td>
                                    <td>${item.preferred_time || ''}</td>
                                    <td>${item.meeting_type || ''}</td>
                                    <td>${item.additional_comments || ''}</td>
                                </tr>
                            </tbody>
                        </table>
                    `;
                }

                modalContent.innerHTML = `
                    <p class="modal-name">NAME: ${nameText}</p>
                    <p class="modal-purpose">PURPOSE: ${purposeText}</p>
                    ${tableHTML}
                `;

                modal.style.display = 'flex';
                dropdown.classList.remove('show');

                if(item.id) {
                    fetch('mark_as_read.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: item.id, type: item.type })
                    })
                    .then(res => res.json())
                    .then(resp => {
                        if(resp.success){
                            notificationsCache = notificationsCache.filter(n => n.id !== item.id || n.type !== item.type);
                            renderNotifications();
                        }
                    })
                    .catch(err => console.error(err));
                }
            });

            list.appendChild(li);
        });

        notificationCountElem.textContent = notificationsCache.length;
    }

    function fetchNotifications() {
        fetch('get_notification_list.php')
            .then(res => res.json())
            .then(data => {
                const today = new Date().toISOString().split('T')[0];
                data = data.filter(n => n.date.startsWith(today));

                const existingKeys = notificationsCache.map(n => `${n.type}-${n.id}`);
                data.forEach(n => {
                    const key = `${n.type}-${n.id}`;
                    if (!existingKeys.includes(key)) notificationsCache.push(n);
                });

                notificationsCache.sort((a,b) => new Date(b.date) - new Date(a.date));
                notificationsCache = notificationsCache.slice(0,10);
                renderNotifications();
            })
            .catch(err => console.error(err));
    }

    if (bellWrapper && dropdown) {
        bellWrapper.addEventListener('click', e => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
            renderNotifications();
        });

        document.addEventListener('click', e => {
            if (!dropdown.contains(e.target) && !bellWrapper.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', e => { if(e.target===modal) modal.style.display='none'; });

    fetchNotifications();
    setInterval(fetchNotifications, 5000);




    // ==============================
    // TABLE SEARCH (Contact / Consultation)
    // ==============================
    const tableSearchInput = document.getElementById("searchInput");
    const contactTable = document.getElementById("contactTable");

    if (tableSearchInput && contactTable) {
        tableSearchInput.addEventListener("input", function() {
            const filter = this.value.toLowerCase();
            const rows = contactTable.querySelectorAll("tbody tr");

            rows.forEach(row => {
                const cells = row.querySelectorAll("td");
                if (cells.length >= 3) {
                    const name = cells[0].textContent.toLowerCase();
                    const email = cells[1].textContent.toLowerCase();
                    const phone = cells[2].textContent.toLowerCase();
                    row.style.display = (name.includes(filter) || email.includes(filter) || phone.includes(filter)) ? "" : "none";
                }
            });
        });
    }



const selectAllCheckbox = document.getElementById('selectAll');
const selectedCount = document.getElementById('selectedCount');
const tableBottomRow = document.querySelector('.table-bottom-row'); // the second row in header

// Update selected count and highlight bottom row
function updateSelectedCount() {
    const rowCheckboxes = document.querySelectorAll('.rowCheckbox');
    const count = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
    selectedCount.textContent = `${count} selected`;

    // Highlight bottom row if at least one checkbox is selected
    if (count > 0) {
        tableBottomRow.classList.add('selected');
    } else {
        tableBottomRow.classList.remove('selected');
    }
}

// Function to highlight/unhighlight a table row
function toggleRowHighlight(checkbox) {
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
        row.classList.add('row-selected');
    } else {
        row.classList.remove('row-selected');
    }
}

// Handle row checkbox changes
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('rowCheckbox')) {
        toggleRowHighlight(e.target);
        updateSelectedCount();

        const allCheckboxes = document.querySelectorAll('.rowCheckbox');
        selectAllCheckbox.checked = Array.from(allCheckboxes).every(cb => cb.checked);
    }
});

// Handle Select All checkbox
selectAllCheckbox.addEventListener('change', () => {
    const rowCheckboxes = document.querySelectorAll('.rowCheckbox');
    rowCheckboxes.forEach(cb => {
        cb.checked = selectAllCheckbox.checked;
        toggleRowHighlight(cb);
    });
    updateSelectedCount();
});






// Delete selected rows
document.getElementById('deleteSelected').addEventListener('click', () => {
    const rowCheckboxes = document.querySelectorAll('.rowCheckbox');
    const selectedIds = Array.from(rowCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selectedIds.length === 0) {
        alert('Please select at least one row to delete.');
        return;
    }

    if (!confirm('Are you sure you want to delete the selected rows?')) return;

    // Detect which table is active
    let table = '';
    if (document.getElementById('contactTable')) table = 'contact_messages';
    else if (document.getElementById('consultationTable')) table = 'consultation_bookings';
    else {
        alert('Unknown table.');
        return;
    }

    fetch('delete_row.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, table: table })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Selected rows deleted successfully.');
            location.reload();
        } else {
            alert('Error deleting rows: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error(err);
        alert('An error occurred.');
    });
});













    // ==============================
    // INLINE EDITING FOR CONTACT_MESSAGES
    // ==============================
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".edit-btn")) return;

        const btn = e.target.closest(".edit-btn");
        const row = btn.closest("tr");
        const id = btn.dataset.id;

        // Already editing? stop
        if (row.classList.contains("editing")) return;
        row.classList.add("editing");

        const cells = row.querySelectorAll("td");

        // Get old values
        const fullName = cells[1].innerText;
        const email = cells[2].innerText;
        const phone = cells[3].innerText;
        const message = cells[4].innerText;

        // Convert to inputs
        cells[1].innerHTML = `<input type="text" class="edit-input" value="${fullName}">`;
        cells[2].innerHTML = `<input type="text" class="edit-input" value="${email}">`;
        cells[3].innerHTML = `<input type="text" class="edit-input" value="${phone}">`;
        cells[4].innerHTML = `<textarea class="edit-input">${message}</textarea>`;

        // Change edit.png → save.png
        btn.innerHTML = `<img src="images/save.png" class="save-icon">`;
        btn.classList.add("save-btn");

        // SAVE
        btn.onclick = function () {
            const updated = {
                id: id,
                full_name: cells[1].querySelector("input").value,
                email: cells[2].querySelector("input").value,
                phone: cells[3].querySelector("input").value,
                message: cells[4].querySelector("textarea").value
            };

            fetch("editable_contact.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
            })
            .then(res => res.json())
            .then(resp => {
                if (resp.success) {
                    alert("Saved successfully!");

                    // Restore normal text
                    cells[1].textContent = updated.full_name;
                    cells[2].textContent = updated.email;
                    cells[3].textContent = updated.phone;
                    cells[4].textContent = updated.message;

                    // Restore edit.png
                    btn.innerHTML = `<img src="images/edit.png" class="edit-icon">`;
                    btn.classList.remove("save-btn");
                    row.classList.remove("editing");
                } else {
                    alert("Error saving: " + resp.error);
                }
            });
        };
    });


    });


// ==============================
// INLINE EDITING FOR CONSULTATION BOOKINGS
// ==============================
document.addEventListener("click", function (e) {
    if (!e.target.closest(".edit-btn")) return;

    const btn = e.target.closest(".edit-btn");
    const row = btn.closest("tr");
    const id = btn.dataset.id;

    // Already editing? stop
    if (row.classList.contains("editing")) return;
    row.classList.add("editing");

    const cells = row.querySelectorAll("td");

    // Get old values
    const oldValues = {
        full_name: cells[1].innerText,
        email: cells[2].innerText,
        phone: cells[3].innerText,
        company: cells[4].innerText,
        property_type: cells[5].innerText,
        preferred_date: cells[6].innerText,
        preferred_time: cells[7].innerText,
        meeting_type: cells[8].innerText,
        additional_comments: cells[9].innerText
    };

    // Convert to inputs
    for (let i = 1; i <= 9; i++) {
        let value = cells[i].innerText;
        let type = (i === 6) ? "date" : (i === 7) ? "time" : "text"; // date/time fields
        cells[i].innerHTML = `<input type="${type}" class="edit-input" value="${value}">`;
    }

    // Change edit.png → save.png
    btn.innerHTML = `<img src="images/save.png" class="save-icon">`;
    btn.classList.add("save-btn");

    // SAVE
    const saveHandler = function () {
        const updated = {
            id: id,
            full_name: cells[1].querySelector("input").value,
            email: cells[2].querySelector("input").value,
            phone: cells[3].querySelector("input").value,
            company: cells[4].querySelector("input").value,
            property_type: cells[5].querySelector("input").value,
            preferred_date: cells[6].querySelector("input").value,
            preferred_time: cells[7].querySelector("input").value,
            meeting_type: cells[8].querySelector("input").value,
            additional_comments: cells[9].querySelector("input").value
        };

        fetch("editable_consultation.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
        })
        .then(res => res.json())
        .then(resp => {
            if (resp.success) {
                alert("Saved successfully!");

                // Restore normal text
                for (let i = 1; i <= 9; i++) {
                    const key = Object.keys(oldValues)[i - 1];
                    cells[i].textContent = updated[key];
                }

                // Restore edit icon
                btn.innerHTML = `<img src="images/edit.png" class="edit-icon">`;
                btn.classList.remove("save-btn");
                row.classList.remove("editing");

                // Remove listener to avoid duplicate calls
                btn.removeEventListener("click", saveHandler);
            } else {
                alert("Error saving: " + resp.error);
            }
        });
    };

    btn.addEventListener("click", saveHandler);
});
