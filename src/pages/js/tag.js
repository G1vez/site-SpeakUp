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

function getShortLang(lang) {
  return lang.split('-')[0]; // Отримуємо короткий код мови
}

// Отримуємо поточну мову
const lang = localStorage.getItem('language') || 'uk-UA'; // Отримуємо мову з localStorage

function createCardHTML(item) {
  const articleSlug = item.detail_url.split('/').slice(-2, -1)[0]; // Отримуємо slug статті

  return `
    <div class="card">
      <figure>
        <a href="/${getShortLang(lang)}/articles/${articleSlug}"> <!-- Додаємо мову до URL -->
          <img src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="/${getShortLang(lang)}/articles/${articleSlug}" class="article-text black"> <!-- Додаємо мову до URL -->
          ${item.title}
        </a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}

async function fetchArticles(language) {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
          'Accept-Language': language
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const articles = data.results; // Витягуємо масив статей з поля results
    const container = document.getElementById('cards-container'); // Змінити на ваш контейнер
    container.innerHTML = ''; // Очищаємо контейнер перед додаванням нових карток
    articles.forEach(item => {
      const cardHTML = createCardHTML(item);
      container.innerHTML += cardHTML; // Додаємо картки в контейнер
    });
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

fetchArticles(lang);