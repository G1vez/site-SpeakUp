const cardsContainer = document.getElementById('cards-container');
const lang = localStorage.getItem('language') || 'uk-UA'; // Отримуємо поточну мову

async function loadArticles(language) {
  try {
    const response = await fetch('https://speakup.in.ua/api/articles/', {
      method: 'GET',
      headers: {
          'Accept-Language': language
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    cardsContainer.innerHTML = ''; // очищаємо контейнер
    data.results.forEach((item, index) => {
      cardsContainer.innerHTML += createCardHTML(item, index, lang); // Передаємо мову у функцію
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Обробка помилки, якщо потрібно
  }
}

loadArticles(lang);

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