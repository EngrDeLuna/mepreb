// ==============================
// HAMBURGER MENU TOGGLE
// ==============================
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// ==============================
// MOVE ADMIN BUTTON BASED ON SCREEN WIDTH
// ==============================
const btnAdmin = document.querySelector('.btn-admin');
const headerButtons = document.querySelector('.header-buttons');

function moveAdminBtn() {
    if (!btnAdmin || !navMenu || !headerButtons) return;

    if (window.innerWidth <= 1024) {
        if (!navMenu.contains(btnAdmin)) navMenu.appendChild(btnAdmin);
    } else {
        if (!headerButtons.contains(btnAdmin)) headerButtons.appendChild(btnAdmin);
    }
}
moveAdminBtn();
window.addEventListener('resize', moveAdminBtn);

// ==============================
// HIGHLIGHT IMAGE GALLERY
// ==============================
const highlightSections = document.querySelectorAll(".highlight-item");
highlightSections.forEach(section => {
    const mainImg = section.querySelector(".highlight-image img");
    const thumbs = section.querySelectorAll(".thumbnail-gallery .thumb");
    if (!mainImg || thumbs.length === 0) return;

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
    if (!propertyCards) return;

    const searchText = searchBar?.value.toLowerCase().trim() || '';
    const selectedType = typeFilter?.value || '';

    propertyCards.forEach(card => {
        const location = card.getAttribute("data-location")?.toLowerCase() || '';
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

searchBar?.addEventListener("input", filterProperties);
typeFilter?.addEventListener("change", filterProperties);

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

function renderNotifications() {
    if (!list || !notificationCountElem) return;

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
                                <th>Full Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Created At</th>
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
                    </table>`;
            } else if(item.type === 'Consultation Booking') {
                tableHTML = `
                    <table class="modal-table">
                        <thead>
                            <tr>
                                <th>Full Name</th><th>Email</th><th>Phone</th><th>Company</th>
                                <th>Property Type</th><th>Preferred Date</th><th>Preferred Time</th>
                                <th>Meeting Type</th><th>Additional Comments</th>
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
                    </table>`;
            }

            modalContent.innerHTML = `
                <p class="modal-name">NAME: ${nameText}</p>
                <p class="modal-purpose">PURPOSE: ${purposeText}</p>
                ${tableHTML}
            `;
            modal.style.display = 'flex';
            dropdown?.classList.remove('show');

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

bellWrapper?.addEventListener('click', e => {
    e.stopPropagation();
    dropdown?.classList.toggle('show');
    renderNotifications();
});

document.addEventListener('click', e => {
    if (!dropdown?.contains(e.target) && !bellWrapper?.contains(e.target)) {
        dropdown?.classList.remove('show');
    }
});

closeBtn?.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === modal) modal.style.display='none'; });

fetchNotifications();
setInterval(fetchNotifications, 5000);

// ==============================
// TABLE SEARCH (Contact / Consultation)
// ==============================
const tableSearchInput = document.getElementById("searchInput");
const contactTable = document.getElementById("contactTable");
const consultationTable = document.getElementById("consultationTable");

tableSearchInput?.addEventListener("input", function() {
    const filter = this.value.toLowerCase();
    const table = contactTable || consultationTable;
    const rows = table?.querySelectorAll("tbody tr") || [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 4) { // ensure we have enough cells
            const name = cells[1].textContent.toLowerCase();
            const email = cells[2].textContent.toLowerCase();
            const phone = cells[3].textContent.toLowerCase();
            row.style.display = (name.includes(filter) || email.includes(filter) || phone.includes(filter)) ? "" : "none";
        }
    });
});


// ==============================
// SELECT / DELETE TABLE ROWS
// ==============================
const selectAllCheckbox = document.getElementById('selectAll');
const selectedCount = document.getElementById('selectedCount');
const tableBottomRow = document.querySelector('.table-bottom-row');

function updateSelectedCount() {
    const rowCheckboxes = document.querySelectorAll('.rowCheckbox');
    const count = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
    if(selectedCount) selectedCount.textContent = `${count} selected`;
    tableBottomRow?.classList.toggle('selected', count > 0);
}

function toggleRowHighlight(checkbox) {
    const row = checkbox.closest('tr');
    row?.classList.toggle('row-selected', checkbox.checked);
}

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('rowCheckbox')) {
        toggleRowHighlight(e.target);
        updateSelectedCount();

        const allCheckboxes = document.querySelectorAll('.rowCheckbox');
        if(selectAllCheckbox) selectAllCheckbox.checked = Array.from(allCheckboxes).every(cb => cb.checked);
    }
});

selectAllCheckbox?.addEventListener('change', () => {
    const rowCheckboxes = document.querySelectorAll('.rowCheckbox');
    rowCheckboxes.forEach(cb => {
        cb.checked = selectAllCheckbox.checked;
        toggleRowHighlight(cb);
    });
    updateSelectedCount();
});

document.getElementById('deleteSelected')?.addEventListener('click', () => {
    const rowCheckboxes = document.querySelectorAll('.rowCheckbox');
    const selectedIds = Array.from(rowCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selectedIds.length === 0) return alert('Please select at least one row to delete.');
    if (!confirm('Are you sure you want to delete the selected rows?')) return;

    let table = '';
    if (document.getElementById('contactTable')) table = 'contact_messages';
    else if (document.getElementById('consultationTable')) table = 'consultation_bookings';
    else return alert('Unknown table.');

    fetch('delete_row.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, table: table })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) alert('Selected rows deleted successfully.');
        else alert('Error deleting rows: ' + (data.error || 'Unknown error'));
        location.reload();
    })
    .catch(err => { console.error(err); alert('An error occurred.'); });
});


















// ==============================
// EDIT MODAL FOR CONTACT & CONSULTATION
// ==============================
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const saveModalBtn = document.getElementById("saveModalBtn");
const closeEditModalBtn = editModal.querySelector(".close-edit-modal");

let currentRow = null;
let currentTable = null;

// Open modal when edit button is clicked
document.addEventListener("click", function(e){
    const btn = e.target.closest(".edit-btn");
    if(!btn) return;

    currentRow = btn.closest("tr");
    if(!currentRow) return;

    currentTable = currentRow.closest("table").id;

    // Clear previous form and classes
    editForm.innerHTML = "";
    editForm.className = "";

    const cells = currentRow.querySelectorAll("td");
    const id = btn.dataset.id;

    if(currentTable === "contactTable"){
        editForm.classList.add("contact-layout"); // 1-column layout
        const fields = ["full_name","email","phone","message"];
        fields.forEach((field,i)=>{
            const value = cells[i+1].innerText;
            if(field==="message"){
                editForm.innerHTML += `<label>${field.replace("_"," ").toUpperCase()}</label>
                    <textarea name="${field}">${value}</textarea>`;
            } else {
                editForm.innerHTML += `<label>${field.replace("_"," ").toUpperCase()}</label>
                    <input type="text" name="${field}" value="${value}">`;
            }
        });
    } else if(currentTable === "consultationTable"){
        editForm.classList.add("consultation-layout"); // 2-column layout

        // Create left & right column wrappers
        const leftCol = document.createElement("div");
        leftCol.classList.add("col");

        const rightCol = document.createElement("div");
        rightCol.classList.add("col");

        const leftFields = ["full_name","email","phone","company","property_type"];
        const rightFields = ["preferred_date","preferred_time","meeting_type","additional_comments"];

        // Fill left column
        // Fill left column
leftFields.forEach((field,i)=>{
    const value = cells[i+1].innerText;

    if(field === "property_type"){
        leftCol.innerHTML += `<label>${field.replace("_"," ").toUpperCase()}</label>
            <select name="${field}">
                <option value="Residential" ${value === "Residential" ? "selected" : ""}>Residential</option>
                <option value="Commercial" ${value === "Commercial" ? "selected" : ""}>Commercial</option>
                <option value="Lot" ${value === "Lot" ? "selected" : ""}>Lot</option>
                <option value="Condo" ${value === "Condo" ? "selected" : ""}>Condo</option>
            </select>`;
    } else {
        leftCol.innerHTML += `<label>${field.replace("_"," ").toUpperCase()}</label>
            <input type="text" name="${field}" value="${value}">`;
    }
});


        // Fill right column
        rightFields.forEach((field,i)=>{
            const idx = i + leftFields.length;
            const value = cells[idx+1].innerText;
            let type = "text";
            if(field==="preferred_date") type="date";
            if(field==="preferred_time") type="time";
            if(field==="additional_comments"){
                rightCol.innerHTML += `<label>${field.replace("_"," ").toUpperCase()}</label>
                    <textarea name="${field}">${value}</textarea>`;
            } else {
                rightCol.innerHTML += `<label>${field.replace("_"," ").toUpperCase()}</label>
                    <input type="${type}" name="${field}" value="${value}">`;
            }
        });

        // Append columns to form
        editForm.appendChild(leftCol);
        editForm.appendChild(rightCol);
    }

    // Show modal
    editModal.style.display = "flex";
});

// Close modal
closeEditModalBtn.onclick = () => editModal.style.display = "none";
window.onclick = e => { if(e.target === editModal) editModal.style.display = "none"; };

// Save modal changes
saveModalBtn.onclick = ()=>{
    if(!currentRow) return;

    const formData = Object.fromEntries(new FormData(editForm).entries());
    const id = currentRow.querySelector(".edit-btn").dataset.id;
    formData.id = id;

    const endpoint = currentTable==="contactTable" ? "editable_contact.php" : "editable_consultation.php";

    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(res=>res.json())
    .then(resp=>{
        if(resp.success){
            const cells = currentRow.querySelectorAll("td");
            let i=1;
            for(let key in formData){
                if(key==="id") continue;
                cells[i].textContent = formData[key];
                i++;
            }
            editModal.style.display="none";
        } else alert("Error saving: "+resp.error);
    })
    .catch(err => alert("An error occurred: " + err));
};



