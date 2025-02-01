const apiUrl = `https://speakup.in.ua/api/articles/`;

// Отримуємо короткий код мови
function getShortLang(lang) {
  return lang.split('-')[0];
}

// Отримуємо поточну мову
const lang = localStorage.getItem('language') || 'uk-UA';

function createCardHTML(item) {
  const slug = item.detail_url.split('/').slice(-2, -1)[0];

  return `
    <div class="card">
      <figure>
        <a href="/${getShortLang(lang)}/articles/${slug}">
          <img src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="/${getShortLang(lang)}/articles/${slug}" class="article-text black">
          ${item.title}
        </a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}

async function fetchArticles(language, sort) {
  let url = apiUrl;
  if (sort === 'popular') {
    url = `https://speakup.in.ua/api/articles/`; // Для популярних статей
  } else if (sort === 'newest') {
    url = `https://speakup.in.ua/api/articles/?ordering=-publish_at`; // Для найновіших статей
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept-Language': language
      }
    });

    if (!response.ok) {
      console.error('Помилка при отриманні карток:', response.statusText);
      return;
    }
    const data = await response.json();
    displayArticles(data.results); // Відображаємо статті
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

function displayArticles(articles) {
  const container = document.getElementById('cards-container');
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
const urlObj = new URL(window.location.href);
const sortParam = urlObj.searchParams.get('sort') || 'popular'; // За замовчуванням 'popular'
fetchArticles(lang, sortParam);