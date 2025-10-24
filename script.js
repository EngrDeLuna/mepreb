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
