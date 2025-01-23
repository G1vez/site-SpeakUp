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

const ArticleOT = document.getElementById('ArticleOT');

fetch("https://speakup.in.ua/api/articles/by-category/onlajn-podorozh/")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Сортуємо статті за датою публікації
    data.results.sort((a, b) => new Date(b.publish_at) - new Date(a.publish_at));
    const firstArticle = data.results[0];

    // Отримуємо поточну мову
    const lang = localStorage.getItem('language') || 'uk'; 

    // Викликаємо функцію для створення HTML
    ArticleOT.innerHTML = createArticleOTHTML(firstArticle, lang);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

function createArticleOTHTML(firstArticle, lang) {
    const slug = firstArticle.detail_url.split('/').slice(-2, -1)[0];
    return `
          <a href="/${lang}/articles/${slug}"><img style="height: auto;" src="${firstArticle.image_url}" alt="${firstArticle.title}"></a>
          <div>
              <a href="/${lang}/articles/${slug}"><p class="article-text black" style="margin:0">${firstArticle.title}</p></a>
              <p class="gray">${firstArticle.intro}</p>
          </div>
    `;
}