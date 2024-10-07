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
//   const categoryLinks = footerList.querySelectorAll('li a');

//   categoryLinks.forEach((link) => {
//     const item = {};
//     item.slug = link.getAttribute('data-category');
//     item.name = link.textContent;

//     const title = item.name;
//     link.setAttribute('title', title);

//     fetch('allCategory.json')
//       .then(response => response.json())
//       .then(data => {
//         const category = data.find(category => category.slug === item.slug);
//         if (category) {
//           const url = category.url;
//           link.href = url;

//           link.addEventListener('click', (event) => {
//             event.preventDefault();
//             fetchArticles(item.slug);
//           });
//         }
//       });
//   });
// });

const categoryLinks = document.querySelectorAll('[data-category]');
const titleElements = document.querySelectorAll('#title, #title2');
const cardsContainer = document.getElementById('cards-container');

document.addEventListener('DOMContentLoaded', function() {
  fetchArticles();
});

function fetchArticles() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
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
    });
  } catch (error) {
    console.error('Error:', error);
  }
}