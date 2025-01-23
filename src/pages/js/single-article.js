// Отримуємо поточну мову
const lang = localStorage.getItem('language') || 'uk'; // Отримуємо мову з localStorage

function createCardHTML(item) {
  const slug = item.detail_url.split('/').slice(-2, -1)[0]; // Отримуємо slug статті

  return `
    <div class="card">
      <figure>
        <a href="/${lang}/articles/${slug}"> <!-- Додаємо мову до URL -->
          <img src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="/${lang}/articles/${slug}" class="article-text black"> <!-- Додаємо мову до URL -->
          ${item.title}
        </a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}

const cardsContainer = document.getElementById('cards-container');
fetch('https://speakup.in.ua/api/articles/')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    cardsContainer.innerHTML = ''; // Очищаємо контейнер перед додаванням нових карток
    data.results.forEach((item) => {
      cardsContainer.innerHTML += createCardHTML(item); // Додаємо картки в контейнер
    });
  })
  .catch(error => {
    console.error('Error fetching articles:', error);
  });

// Витягуємо slug з URL браузера
const url = window.location.href;
const urlObj = new URL(url);
const path = urlObj.pathname;
const segments = path.split('/');
const slug = segments.pop(); // Отримуємо slug

const apiUrl = `https://speakup.in.ua/api/articles/${slug}/`;

function calculateReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200; // або 250
  const minutes = words / wordsPerMinute;
  return Math.ceil(minutes);
}

function createArticleHTML(item) {
  const metaAuthor = document.createElement('meta');
  metaAuthor.name = "author";
  metaAuthor.content = item.author_name;
  document.head.appendChild(metaAuthor);

  const readingTime = calculateReadingTime(item.body);
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
        return `<a href="/${lang}/tags/${lastPart}/" style="margin-right: 10px;">${tag.name}</a>`; // Додаємо мову до URL тегів
      }).join('')}
      </div>
    </div>
  `;
}

const articleContainer = document.getElementById('article');
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    document.title = data.title;

    articleContainer.innerHTML = createArticleHTML(data); // Додаємо статтю в контейнер
  })
  .catch(error => {
    console.error('Error fetching articles:', error);
    articleContainer.innerHTML = '<p class="content" data-key="article_not_found"></p>';
  });