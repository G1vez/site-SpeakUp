function createCardHTML(item, index) {
  // Отримуємо slug статті з URL
  const slug = item.detail_url.split('/').slice(-2, -1)[0]; // Припускаємо, що slug знаходиться перед останнім слешем

  return `
    <div class="card">
      <figure>
        <a href="/articles/${slug}">
          <img ${index === 0 ? 'id="square"' : ''} src="${item.image_url}" alt="${item.title}">
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
    cardsContainer.innerHTML = ''; // очищаємо контейнер
    data.results.forEach((item, index) => {
      cardsContainer.innerHTML += createCardHTML(item, index);
    });
  })
  .catch(error => {
    console.error('Error fetching articles:', error);
    // Обробка помилки, якщо потрібно
  });