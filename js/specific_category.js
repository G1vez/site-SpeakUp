function createCardHTML(item) {
  return `
    <div class="card">
      <figure>
        <a href="">
          <img src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="" class="article-text black">${item.title}</a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}

const categoryLinks = document.querySelectorAll('[data-category]');
const titleElements = document.querySelectorAll('#title, #title2');
const cardsContainer = document.getElementById('cards-container');

categoryLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const category = link.getAttribute('data-category');
    fetchArticles(category);
  });
});

function fetchArticles(category) {
  const url = `http://127.0.0.1:8000/articles/by-category/${category}/`;
  const fallbackUrl = `http://127.0.0.1:5500/locally/articlesByCategory_${category}.json`;
  if (!url) {
    console.error(`Unknown category: ${category}`);
    return;
  }
  const title = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');

  fetch({
    type: 'GET',
    url: url,
    dataType: 'json'
  })
  .then(response => response.json())
  .then(data => {
    cardsContainer.innerHTML = ''; // clear the container
    titleElements.forEach((element) => {
      element.innerHTML = `Статті з категорії: ${title}`;    
    });
    document.title = `Статті з категорії: ${title}`;
    data.forEach((item) => {
      cardsContainer.innerHTML += createCardHTML(item);
    });
  })

  .catch(error => {
    fetch(fallbackUrl)
      .then(response => response.json())
      .then(json => {
        cardsContainer.innerHTML = ''; // clear the container
        titleElements.forEach((element) => {
          element.innerHTML = `Статті з категорії: ${title}`;    
        });
        document.title = `Статті з категорії: ${title}`;
        json.forEach((item) => {
          cardsContainer.innerHTML += createCardHTML(item);
        });
      });
      // alert(`online-journey /n ${category}`);
  });
}

fetchArticles('${category}');