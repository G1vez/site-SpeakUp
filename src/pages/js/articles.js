const apiUrl = `https://speakup.in.ua/api/articles/`;
let currentPage = 1;
const limit = 15; // Кількість статей на запит
let totalArticles = 0; // Загальна кількість статей
let isLoading = false; // Прапорець для перевірки, чи триває завантаження

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

async function fetchArticles(language, sort, page = 1) {
  let url = apiUrl;
  if (sort === 'popular') {
    url = `https://speakup.in.ua/api/articles/?page=${page}&limit=${limit}`; // Для популярних статей
  } else if (sort === 'newest') {
    url = `https://speakup.in.ua/api/articles/?ordering=-publish_at&page=${page}&limit=${limit}`; // Для найновіших статей
  }

  try {
    isLoading = true; // Встановлюємо прапорець завантаження
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
    totalArticles = data.count; // Загальна кількість статей
    displayArticles(data.results); // Відображаємо статті
    updateLoadMoreButton(); // Оновлюємо видимість кнопки "Завантажити ще"
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  } finally {
    isLoading = false; // Скидаємо прапорець завантаження
  }
}

function displayArticles(articles) {
  const container = document.getElementById('cards-container');
  articles.forEach(item => {
    const cardHTML = createCardHTML(item);
    container.innerHTML += cardHTML; // Додаємо картки в контейнер
  });
}

function updateLoadMoreButton() {
  const loadMoreButton = document.getElementById('load-more-button');
  const totalLoadedArticles = currentPage * limit;

  // Якщо завантажено всіх статей, ховаємо кнопку
  if (totalLoadedArticles >= totalArticles) {
    loadMoreButton.style.display = 'none'; // Сховати кнопку
  } else {
    loadMoreButton.style.display = 'block'; // Показати кнопку
  }
}

// Додаємо обробник події для зміни вибору в спадному меню
document.getElementById('sort-options').addEventListener('change', function() {
  const selectedSort = this.value; // Отримуємо вибране значення
  currentPage = 1; // Скидаємо номер сторінки при зміні сортування
  document.getElementById('cards-container').innerHTML = ''; // Очищаємо контейнер
  fetchArticles(lang, selectedSort, currentPage); // Викликаємо функцію для отримання статей з новим параметром сортування

  // Оновлюємо URL з параметром
  const url = new URL(window.location);
  url.searchParams.set('sort', selectedSort); // Додаємо або оновлюємо параметр 'sort'
  window.history.pushState({}, '', url); // Оновлюємо URL без перезавантаження сторінки
});

// Додаємо обробник події для кнопки "Завантажити ще"
document.getElementById('load-more-button').addEventListener('click', function() {
  if (!isLoading) {
    currentPage++; // Збільшуємо номер сторінки
    fetchArticles(lang, document.getElementById('sort-options').value, currentPage); // Отримуємо наступну порцію статей
  }
});

// Ініціалізуємо перше завантаження статей
fetchArticles(lang, document.getElementById('sort-options').value, currentPage);