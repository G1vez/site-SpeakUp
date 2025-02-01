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

let articles = []; // Зберігатимемо статті в масиві

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
    articles = data.results; // Зберігаємо статті в глобальному масиві
    displayArticles(articles); // Відображаємо статті

    // Читаємо параметр 'sort' з URL
    const sortParam = urlObj.searchParams.get('sort');
    if (sortParam) {
      sortArticles(sortParam); // Сортуємо статті за параметром
      document.getElementById('sort-options').value = sortParam; // Встановлюємо значення в селекторі
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

function displayArticles(articles) {
  const container = document.getElementById('cards-container'); // Змінити на ваш контейнер
  container.innerHTML = ''; // Очищаємо контейнер перед додаванням нових карток
  articles.forEach(item => {
      const cardHTML = createCardHTML(item);
      container.innerHTML += cardHTML; // Додаємо картки в контейнер
  });
}

function sortArticles(criteria) {
  let sortedArticles;
  if (criteria === 'popular') {
      sortedArticles = [...articles].sort((a, b) => b.views - a.views); // Сортуємо за кількістю переглядів
  } else if (criteria === 'newest') {
      sortedArticles = [...articles].sort((a, b) => new Date(b.publish_at) - new Date(a.publish_at)); // Сортуємо за датою публікації
  }
  displayArticles(sortedArticles); // Відображаємо відсортовані статті
}

// Додаємо обробник події для зміни вибору в спадному меню
document.getElementById('sort-options').addEventListener('change', function() {
  sortArticles(this.value); // Викликаємо функцію сортування з вибраним значенням

  // Оновлюємо URL з параметром
  const url = new URL(window.location);
  url.searchParams.set('sort', this.value); // Додаємо або оновлюємо параметр 'sort'
  window.history.pushState({}, '', url); // Оновлюємо URL без перезавантаження сторінки
});

// Викликаємо функцію для отримання статей
fetchArticles(lang);