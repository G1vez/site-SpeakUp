let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let prevArrow = document.querySelector('.prev .svg-arrow');
  let nextArrow = document.querySelector('.next .svg-arrow');

  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";

  // Update arrow fill colors based on current slide index
  if (slideIndex === 1) {
    prevArrow.style.fill = 'var(--color-gray)';
    nextArrow.style.fill = 'var(--color-black)';
  } else if (slideIndex === 2) {
    prevArrow.style.fill = 'var(--color-black)';
    nextArrow.style.fill = 'var(--color-gray)';
  }
}

let touchStartX = 0;
let touchEndX = 0;

function plusSlides(n) {
  showSlides(slideIndex += n);
}

document.addEventListener("DOMContentLoaded", function() {
  showSlides(slideIndex);
});

// Add event listeners for touch events
document.addEventListener("touchstart", function(event) {
  touchStartX = event.touches[0].clientX;
});

document.addEventListener("touchend", function(event) {
  touchEndX = event.changedTouches[0].clientX;
  let deltaX = touchEndX - touchStartX;
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      plusSlides(-1);
    } else {
      plusSlides(1);
    }
  }
});
