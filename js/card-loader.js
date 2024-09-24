function createCardHTML(item) {
  return `
    <figure>
      <a href=" ">
        <img src="${item.image_url}" alt="${item.title}">
      </a>
    </figure>
    <div>
      <a href=" " class="article-text black">${item.title}</a>
      <div class="gray text-card">${item.intro}</div>
    </div>
  `;
}

const cardsContainer = document.getElementById('cards-container');

// Перевірка основного сервера
fetch('http://127.0.0.1:8000/articles/')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    data.forEach(item => {
      cardsContainer.innerHTML += createCardHTML(item);
    });
  })
  .catch(error => {
    console.error('Error fetching articles:', error);

    // Резервний запит до локального JSON-файлу
    fetch('http://localhost:8000/podojg.json') // Тепер використовуємо HTTP сервер
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch local JSON');
        }
        return response.json();
      })
      .then(json => {
        json.forEach(item => {
          cardsContainer.innerHTML += createCardHTML(item);
        });
      })
      .catch(localError => {
        console.error('Error fetching local JSON:', localError);
      });
  });