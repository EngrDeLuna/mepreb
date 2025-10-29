  // Hamburger Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });


















document.addEventListener("DOMContentLoaded", function() {
  const highlightSections = document.querySelectorAll(".highlight-item");

  highlightSections.forEach(section => {
    const mainImg = section.querySelector(".highlight-image img");
    const thumbs = section.querySelectorAll(".thumbnail-gallery .thumb");
    let currentIndex = 0;

    // Function to change main image with fade
    function showImage(index) {
      // fade out
      mainImg.style.opacity = 0;

      setTimeout(() => {
        mainImg.src = thumbs[index].src;

        // fade in
        mainImg.style.opacity = 1;

        // highlight active thumbnail
        thumbs.forEach(t => t.classList.remove("active-thumb"));
        thumbs[index].classList.add("active-thumb");
      }, 250); // half of the transition duration
    }

    // Click event on thumbnails
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        currentIndex = index;
        showImage(currentIndex);
      });
    });

    // Auto change every 3 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % thumbs.length;
      showImage(currentIndex);
    }, 3000);

    // Initialize first image
    showImage(currentIndex);
  });
});





// ==============================
// SEARCH / FILTER FUNCTIONALITY
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

    // Detect whether it's a full building or just a floor listing
    const isBuilding = infoText.includes("total floors");
    const isFloorOnly = infoText.includes("floors:") && !infoText.includes("total floors");

    let matchesSearch = false;

    // If user explicitly types "building" → show only buildings
    if (searchText === "building" || searchText.includes("building")) {
      matchesSearch = isBuilding;
    }
    // If user types "floor" → show only individual floor listings
    else if (searchText === "floor" || searchText.includes("floor")) {
      matchesSearch = isFloorOnly;
    }
    // Otherwise, normal text or location-based search
    else {
      matchesSearch =
        location.includes(searchText) ||
        infoText.includes(searchText);
    }

    // Match dropdown type filter
    const matchesType =
      selectedType === "" ||
      (selectedType === "building" && isBuilding) ||
      (selectedType === "floor" && isFloorOnly);

    // Show or hide based on combined logic
    card.style.display = (matchesSearch && matchesType) ? "block" : "none";
  });
}

searchBar.addEventListener("input", filterProperties);
typeFilter.addEventListener("change", filterProperties);





// ==============================
// MODAL SHOW / HIDE LOGIC
// ==============================
const modals = document.querySelectorAll(".modal");
const viewButtons = document.querySelectorAll(".view-details");
const closeButtons = document.querySelectorAll(".close");

// Open Modal
viewButtons.forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    const modal = document.getElementById(targetId);
    if (modal) {
      modal.style.display = "flex"; // show modal
      document.body.style.overflow = "hidden"; // disable scrolling
    }
  });
});

// Close Modal
closeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = ""; // re-enable scrolling
    }
  });
});

// Close Modal when clicking outside
window.addEventListener("click", e => {
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = ""; // re-enable scrolling
    }
  });
});



























document.getElementById('consultationForm').addEventListener('submit', function(e){
  e.preventDefault(); // prevent actual submission

  // Validate at least one property type
  const checkedProperties = document.querySelectorAll('input[name="propertyType"]:checked');
  if(checkedProperties.length === 0){
    alert('Please select at least one property type.');
    return;
  }

  // Validate meeting type
  const meetingType = document.getElementById('meetingType').value;
  if(!meetingType){
    alert('Please select a meeting type.');
    return;
  }

  // Gather form data
  const formData = {
    fullName: this.fullName.value,
    email: this.email.value,
    phone: this.phone.value,
    company: this.company.value,
    transaction: this.transaction.value,
    propertyType: Array.from(checkedProperties).map(el => el.value),
    date: this.date.value,
    time: this.time.value,
    meetingType: meetingType,
    comments: this.comments.value
  };

  console.log('Form Submitted:', formData);

  // Display confirmation message (can replace with a modal)
  alert(`Thank you ${formData.fullName}! Your consultation is scheduled on ${formData.date} at ${formData.time}.`);

  // Optional: integrate with Google Calendar, send email, or redirect

  this.reset();
});
