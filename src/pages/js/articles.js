const apiUrl = `https://speakup.in.ua/api/articles/`;

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
fetch(apiUrl)
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