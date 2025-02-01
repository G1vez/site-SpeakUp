const apiUrl = `https://speakup.in.ua/api/articles/`;

let currentPage = 1; // Номер поточної сторінки

function getShortLang(lang) {
  return lang.split('-')[0]; // Отримуємо короткий код мови
}

// Отримуємо поточну мову
const lang = localStorage.getItem('language') || 'uk-UA'; // Отримуємо мову з localStorage

function createCardHTML(item) {
  const slug = item.detail_url.split('/').slice(-2, -1)[0]; // Отримуємо slug статті

  return `
    <div class="card">
      <figure>
        <a href="/${getShortLang(lang)}/articles/${slug}"> <!-- Додаємо мову до URL -->
          <img src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="/${getShortLang(lang)}/articles/${slug}" class="article-text black"> <!-- Додаємо мову до URL -->
          ${item.title}
        </a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}

async function fetchArticles(language) {
  try {
    const response = await fetch(`${apiUrl}?page=${currentPage}`, {
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
    const articles = data.results; // Витягуємо масив статей з поля results
    const container = document.getElementById('cards-container'); // Змінити на ваш контейнер

    // Додаємо нові статті до контейнера
    articles.forEach(item => {
      const cardHTML = createCardHTML(item);
      container.innerHTML += cardHTML; // Додаємо картки в контейнер
    });
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

// Функція для обробки горизонтального гортання
function handleScroll() {
  const container = document.getElementById('cards-container');
  const scrollLeft = container.scrollLeft; // Поточна горизонтальна прокрутка
  const scrollWidth = container.scrollWidth; // Загальна ширина контейнера
  const clientWidth = container.clientWidth; // Ширина видимої частини контейнера

  // Перевіряємо, чи досягнуто правого краю контейнера
  if (scrollLeft + clientWidth >= scrollWidth) {
    currentPage++; // Збільшуємо номер сторінки
    fetchArticles(lang); // Завантажуємо нові статті
  }
}

// Додаємо обробник події для горизонтального гортання
const container = document.getElementById('cards-container');
container.addEventListener('scroll', handleScroll);

// Завантажуємо першу порцію статей
fetchArticles(lang);