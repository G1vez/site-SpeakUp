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

// Формуємо URL для API
const apiUrl = `https://speakup.in.ua/api/articles/${slug}/`;

function createArticleHTML(item) {
  return `
    <p class="subtitle">${item.category_name}</p>
    <h1 id="title" style="margin: 16px;">${item.title}</h1>
    <div id="info-box">
        <img id="avatar" src="" alt="${item.author}">
        <div id="text">
          <p>Автор: ${item.author}</p>
          <p>Час на читання:</p>
        </div>
    </div>
    <hr class="grey" noshade size="1">
    <img id="image_url" src="${item.image_url}" alt="">
    <div id="body" style="margin-bottom: 237px;">${item.body}</div>
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
    articleContainer.innerHTML = createArticleHTML(data);
  })
  .catch(error => {
    console.error('Error fetching articles:', error);
    articleContainer.innerHTML = '<p>Статтю не знайдено.</p>';
});