// Витягуємо slug з URL браузера
const url = window.location.href;
const urlObj = new URL(url);
const path = urlObj.pathname;
const segments = path.split('/').filter(segment => segment);
const slug = segments[segments.length - 1];

const decodedSlug = decodeURIComponent(slug);
document.querySelector('h2').innerText = decodedSlug;
document.querySelector('.title').innerText = decodedSlug;

// Отримуємо поточну мову
const lang = localStorage.getItem('language') || 'uk-UA'; // Отримуємо мову з localStorage

function getShortLang(lang) {
  return lang.split('-')[0]; // Отримуємо короткий код мови
}

// Функція для створення HTML картки статті
function createCardHTML(item) {
  const articleSlug = item.detail_url.split('/').slice(-2, -1)[0]; // Отримуємо slug статті

  return `
    <div class="card">
      <figure>
        <a href="/${getShortLang(lang)}/articles/${articleSlug}">
          <img src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="/${getShortLang(lang)}/articles/${articleSlug}" class="article-text black">
          ${item.title}
        </a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}

let articles = []; // Зберігатимемо статті в масиві

async function fetchArticles(language, sort) {
  let apiUrl;

  if (sort === 'popular') {
    apiUrl = `https://speakup.in.ua/api/articles/by-tag/${slug}/`; // Для популярних статей
  } else if (sort === 'newest') {
    apiUrl = `https://speakup.in.ua/api/articles/by-tag/${slug}/?ordering=-publish_at`; // Для найновіших статей
  } else {
    apiUrl = `https://speakup.in.ua/api/articles/by-tag/${slug}/`; // За замовчуванням
  }

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

// Додаємо обробник події для зміни вибору в спадному меню
document.getElementById('sort-options').addEventListener('change', function() {
  const selectedSort = this.value; // Отримуємо вибране значення
  fetchArticles(lang, selectedSort); // Викликаємо функцію для отримання статей з новим параметром сортування

  // Оновлюємо URL з параметром
  const url = new URL(window.location);
  url.searchParams.set('sort', selectedSort); // Додаємо або оновлюємо параметр 'sort'
  window.history.pushState({}, '', url); // Оновлюємо URL без перезавантаження сторінки
});

// Читаємо параметр 'sort' з URL і викликаємо функцію для отримання статей
const sortParam = urlObj.searchParams.get('sort') || 'popular'; // За замовчуванням 'popular'
fetchArticles(lang, sortParam);