// Витягуємо slug з URL браузера
const url = window.location.href;
const urlObj = new URL(url);
const path = urlObj.pathname;
const segments = path.split('/').filter(segment => segment);
const slug = segments[segments.length - 1];

const decodedSlug = decodeURIComponent(slug);
document.querySelector('h2').innerText = decodedSlug;
document.querySelector('.title').innerText = decodedSlug;

// Формуємо URL для API
const apiUrl = `https://speakup.in.ua/api/articles/by-tag/${slug}/`;

function createCardHTML(item) {
  const slug = item.detail_url.split('/').slice(-2, -1)[0];

  return `
    <div class="card">
      <figure>
        <a href="/articles/${slug}">
          <img src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="/articles/${slug}" class="article-text black">${item.title}</a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const articles = data.results; // Витягуємо масив статей з поля results
    const container = document.getElementById('cards-container'); // Змінити на ваш контейнер
    articles.forEach(item => {
      const cardHTML = createCardHTML(item);
      container.innerHTML += cardHTML; // Додаємо картки в контейнер
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });


  // Формуємо URL для запиту до API категорій
const articleApiUrl = 'https://speakup.in.ua/api/articles/';