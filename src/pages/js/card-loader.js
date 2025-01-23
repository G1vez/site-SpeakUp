function getShortLang(lang) {
  return lang.split('-')[0]; // Отримуємо короткий код мови
}

function createCardHTML(item, index, lang) {
  // Отримуємо slug статті з URL
  const slug = item.detail_url.split('/').slice(-2, -1)[0]; // Припускаємо, що slug знаходиться перед останнім слешем

  return `
    <div class="card">
      <figure>
        <a href="/${getShortLang(lang)}/articles/${slug}">
          <img ${index === 0 ? 'id="square"' : ''} src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="/${getShortLang(lang)}/articles/${slug}" class="article-text black">${item.title}</a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}

const cardsContainer = document.getElementById('cards-container');
const lang = localStorage.getItem('language') || 'uk-UA'; // Отримуємо поточну мову

fetch('https://speakup.in.ua/api/articles/')
  .then(response => response.json())
  .then(data => {
    cardsContainer.innerHTML = ''; // очищаємо контейнер
    data.results.forEach((item, index) => {
      cardsContainer.innerHTML += createCardHTML(item, index, lang); // Передаємо мову у функцію
    });
  })
  .catch(error => {
    console.error('Error fetching articles:', error);
    // Обробка помилки, якщо потрібно
  });