// Отримуємо поточну мову
const lang = localStorage.getItem('language') || 'uk-UA'; // Отримуємо мову з localStorage

function getShortLang(lang) {
  return lang.split('-')[0]; // Отримуємо короткий код мови
}

// Витягуємо slug з URL браузера
const url = window.location.href;
const urlObj = new URL(url);
const path = urlObj.pathname;
const segments = path.split('/');
const slug = segments.pop(); // Отримуємо slug

const apiUrl = `https://speakup.in.ua/api/articles/${slug}/`;

let currentPage = 1; // Номер поточної сторінки

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

const cardsContainer = document.getElementById('cards-container');

async function fetchArticles(language) {
  try {
    const response = await fetch(`https://speakup.in.ua/api/articles/?page=${currentPage}`, {
      method: 'GET',
      headers: {
          'Accept-Language': language
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    data.results.forEach((item) => {
      cardsContainer.innerHTML += createCardHTML(item); // Додаємо картки в контейнер
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
}

// Функція для обробки горизонтального гортання
function handleScroll() {
  const scrollLeft = cardsContainer.scrollLeft; // Поточна горизонтальна прокрутка
  const scrollWidth = cardsContainer.scrollWidth; // Загальна ширина контейнера
  const clientWidth = cardsContainer.clientWidth; // Ширина видимої частини контейнера

  // Перевіряємо, чи досягнуто правого краю контейнера
  if (scrollLeft + clientWidth >= scrollWidth) {
    currentPage++; // Збільшуємо номер сторінки
    fetchArticles(lang); // Завантажуємо нові статті
  }
}

// Додаємо обробник події для горизонтального гортання
cardsContainer.addEventListener('scroll', handleScroll);

// Завантажуємо першу порцію статей
fetchArticles(lang);

cardsContainer.addEventListener('wheel', (event) => {
    event.preventDefault(); // Запобігаємо стандартній прокрутці сторінки
    cardsContainer.scrollBy({
        left: event.deltaY, // Прокручуємо вліво або вправо в залежності від прокрутки
        behavior: 'smooth' // Додаємо плавність прокрутки
    });
});

function calculateReadingTime(text) {
  const plainText = text.replace(/<[^>]*>/g, ' ').trim();
  const words = plainText.split(/\s+/).filter(word => word.length > 0).length; // Підрахунок слів
  const wordsPerMinute = 200; // або 250
  if (words === 0) {
    return 0; // Якщо слів немає, повертаємо 0
  }
  const minutes = words / wordsPerMinute;
  return Math.ceil(minutes);
}

const articleContainer = document.getElementById('article');
function createArticleHTML(item) {
  const metaAuthor = document.createElement('meta');
  metaAuthor.name = "author";
  metaAuthor.content = item.author_name;
  document.head.appendChild(metaAuthor);

  const metaTitle = document.createElement('meta');
  metaTitle.name = "title";
  metaTitle.content = item.title;
  document.head.appendChild(metaTitle);

  const metaIntro = document.createElement('meta');
  metaIntro.name = "intro";
  metaIntro.content = item.intro;
  document.head.appendChild(metaIntro);

  const readingTime = calculateReadingTime(item.body);
  
  // Підрахунок слів у body
  const plainText = item.body.replace(/<[^>]*>/g, ' ').trim();
  const words = plainText.split(/\s+/).filter(word => word.length > 0).length;

  // Якщо слів немає, відображаємо повідомлення
  if (words === 0) {
    return `
      <p class="subtitle">${item.category_name}</p>
      <h1 id="title" style="margin: 16px;">${item.title}</h1>
      <div id="info-box">
          <div id="text">
            <div style="display: flex;"><p class="content" data-key="autor" style="margin-right: 10px;"></p><label>${item.author_name}</label></div>
            <div style="display: flex;"><p class="content" data-key="time-reader" style="margin-right: 10px;">></p><label style="margin-right: 5px;">${readingTime}</label><p class="content" data-key="min"></p></div>
            <div style="display: flex;"><p class="content" data-key="number-views" style="margin-right: 10px;"></p><label>${item.views}</label></div>
          </div>
      </div>
      <hr class="grey" noshade size="1">
      <img id="image_url" src="${item.image_url}" alt="">
      <div id="body" style="margin-bottom: 237px;">
        <p class="content" data-key="articles-text-is-empty"></p>
      </div>
    `;
  }

  // Якщо слова є, відображаємо статтю
  return `
    <p class="subtitle">${item.category_name}</p>
    <h1 id="title" style="margin: 16px;">${item.title}</h1>
    <div id="info-box">
        <div id="text">
          <div style="display: flex;"><p class="content" data-key="autor" style="margin-right: 10px;"></p><label>${item.author_name}</label></div>
          <div style="display: flex;"><p class="content" data-key="time-reader" style="margin-right: 10px;">></p><label style="margin-right: 5px;">${readingTime}</label><p class="content" data-key="min"></p></div>
          <div style="display: flex;"><p class="content" data-key="number-views" style="margin-right: 10px;"></p><label>${item.views}</label></div>
        </div>
    </div>
    <hr class="grey" noshade size="1">
    <img id="image_url" src="${item.image_url}" alt="">
    <div id="body" style="margin-bottom: 237px;">${item.body}
      <div style="text-align: left; margin-top: 15px;">
      ${item.tags.map(tag => {
        const tagUrlParts = tag.articles_url.split('/');
        const lastPart = tagUrlParts[tagUrlParts.length - 2]; // Отримуємо передостанній елемент
        return `<a href="/${getShortLang(lang)}/tags/${lastPart}/" style="margin-right: 10px;">${tag.name}</a>`; // Додаємо мову до URL тегів
      }).join('')}
      </div>
    </div>
  `;
}

async function fetchArticle(language) {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
          'Accept-Language': language
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    document.title = data.title;
    articleContainer.innerHTML = createArticleHTML(data); // Додаємо статтю в контейнер
  } catch (error) {
    console.error('Error fetching articles:', error);
    articleContainer.innerHTML = '<p class="content" data-key="article_not_found"></p>';
  }
}

fetchArticle(lang);