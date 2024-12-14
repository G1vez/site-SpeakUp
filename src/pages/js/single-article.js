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

const cardsContainer = document.getElementById('cards-container');
fetch('https://speakup.in.ua/api/articles/')
.then(response => response.json())
.then(data => {
  cardsContainer.innerHTML = '';
  data.results.forEach((item) => {
    cardsContainer.innerHTML += createCardHTML(item);
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
  const readingTime = calculateReadingTime(item.body);
  return `
    <p class="subtitle">${item.category_name}</p>
    <h1 id="title" style="margin: 16px;">${item.title}</h1>
    <div id="info-box">
        <img id="avatar" src="" alt="${item.author}">
        <div id="text">
          <p>Автор: ${item.author}</p>
          <p>Час читання: ${readingTime} хв</p>
          <p>Кількість переглядів: ${item.views}</p>
        </div>
    </div>
    <hr class="grey" noshade size="1">
    <img id="image_url" src="${item.image_url}" alt="">
    <div id="body" style="margin-bottom: 237px;">${item.body}
      <div style="text-align: left; margin-top: 15px;">
        ${item.tags.map(tag => `<a href="${item.articles_url}" style="margin-right: 10px;">${tag.name}</a>`).join('')}
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

    articleContainer.innerHTML = createArticleHTML(data);
  })
  .catch(error => {
    console.error('Error fetching articles:', error);
    articleContainer.innerHTML = '<p>Статтю не знайдено.</p>';
  });

