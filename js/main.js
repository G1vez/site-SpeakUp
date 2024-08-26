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

// ----------------------------
let lightboxIndex = 1;

// Show lightbox when clicking on a slide
document.querySelectorAll('.mySlides').forEach((slide, index) => {
  slide.addEventListener('click', () => {
    lightboxIndex = index + 1;
    showLightbox();
  });
});

// Lightbox functions
function showLightbox() {
  const lightboxContainer = document.querySelector('.lightbox-container');
  const lightboxSlides = document.querySelector('.lightbox-slides');
  const slides = document.querySelectorAll('.mySlides');

  lightboxContainer.style.display = 'block';
  lightboxSlides.innerHTML = '';

  slides.forEach((slide, index) => {
    const lightboxSlide = document.createElement('div');
    lightboxSlide.className = 'lightbox-slide';
    lightboxSlide.innerHTML = slide.innerHTML;
    lightboxSlides.appendChild(lightboxSlide);
  });

  showLightboxSlide(lightboxIndex);
}

function showLightboxSlide(n) {
  const lightboxSlides = document.querySelectorAll('.lightbox-slide');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  if (n > lightboxSlides.length) { lightboxIndex = 1 }
  if (n < 1) { lightboxIndex = lightboxSlides.length }

  for (let i = 0; i < lightboxSlides.length; i++) {
    lightboxSlides[i].style.display = 'none';
  }
  lightboxSlides[lightboxIndex - 1].style.display = 'block';

  lightboxPrev.style.display = lightboxIndex === 1 ? 'none' : 'block';
  lightboxNext.style.display = lightboxIndex === lightboxSlides.length ? 'none' : 'block';
}

function lightboxPrev() {
  showLightboxSlide(lightboxIndex -= 1);
}

function lightboxNext() {
  showLightboxSlide(lightboxIndex += 1);
}

// Close lightbox when clicking on the close button or outside the lightbox
document.querySelector('.lightbox-close').addEventListener('click', () => {
  document.querySelector('.lightbox-container').style.display = 'none';
});

document.addEventListener('click', (e) => {
  if (e.target === document.querySelector('.lightbox-container')) {
    document.querySelector('.lightbox-container').style.display = 'none';
  }
});

const tooltip = document.querySelector('.tooltip');
const closeBtn = document.querySelector('.close-btn');

setTimeout(() => {
  tooltip.classList.add('show');
}, 1000); // show tooltip after 1 second

const images = document.querySelectorAll('.lightbox-slide img');

images.forEach((image) => {
  let initialScale = 1;
  let currentScale = 1;
  let startX = 0;
  let startY = 0;
  let startDistance = 0;

  image.addEventListener('touchstart', (event) => {
    if (event.touches.length === 2) {
      startX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
      startY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
      startDistance = Math.sqrt(Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) + Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2));
    }
  });

  image.addEventListener('touchmove', (event) => {
    if (event.touches.length === 2) {
      const currentX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
      const currentY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
      const currentDistance = Math.sqrt(Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) + Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2));

      if (currentDistance > startDistance) {
        currentScale = initialScale * (currentDistance / startDistance);
        image.style.transform = `scale(${currentScale})`;
      } else if (currentDistance < startDistance) {
        currentScale = initialScale * (currentDistance / startDistance);
        image.style.transform = `scale(${currentScale})`;
      }
    }
  });

  image.addEventListener('touchend', () => {
    initialScale = currentScale;
  });

  image.addEventListener('click', (event) => {
    event.preventDefault();
  });
});