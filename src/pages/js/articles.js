const apiUrl = `https://speakup.in.ua/api/articles/`;

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
fetch(apiUrl)
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