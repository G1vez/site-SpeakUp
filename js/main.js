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
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
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

// автопрокручування слайд-шоу
// slideIndex = 0;
// carousel();

// function carousel() {
//   var i;
//   var x = document.getElementsByClassName("mySlides");
//   for (i = 0; i < x.length; i++) {
//     x[i].style.display = "none";
//   }
//   slideIndex++;
//   if (slideIndex > x.length) {slideIndex = 1}
//   x[slideIndex-1].style.display = "block";
//   setTimeout(carousel, 15000); // Change image every 2 seconds
// }



// ----------------------------------------------------------------------

// Отримати кнопку та контейнер меню
const navToggle = document.querySelector('.nav-toggle');
const navContent = document.querySelector('.nav-content');

// Додати обробник події натиску кнопки
navToggle.addEventListener('click', () => {
  // Переключити клас 'open' на контейнері меню
  navContent.classList.toggle('open');
});