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

if (!location.search) { // перенаправлення з null категоріїї на головну
  window.location.href = './index.html';
}

const titleElements = document.querySelectorAll('#title, #title2');
const cardsContainer = document.getElementById('cards-container');

document.addEventListener('DOMContentLoaded', function() {
  fetchArticles();
});

function fetchArticles() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const categoriesUrl = `http://127.0.0.1:8000/categories/`;
    const fallbackCategoriesUrl = `./locally/allCategory.json`;

    fetch(categoriesUrl)
      .then(response => response.json())
      .then(categoriesData => {
        const categoriesArray = categoriesData.results;
        const categoryObject = categoriesArray.find(categoryObject => categoryObject.slug === category);
    

        if (categoryObject) {
          const title = categoryObject.name;
          const url = `http://127.0.0.1:8000/articles/by-category/${category}/`;
          const fallbackUrl = `./locally/articlesByCategory_${category}.json`;

          fetch(url)
          .then(response => response.json())
          .then(data => {
            cardsContainer.innerHTML = '';
            titleElements.forEach((element) => {
              element.innerHTML = `Статті з категорії: ${title}`;    
            });
            document.title = `Статті з категорії: ${title}`;
            data.forEach((item) => {
              cardsContainer.innerHTML += createCardHTML(item);
            });
          })

          .catch(error => {
            console.error(`Error fetching articles:`, error);

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
        } else {
          console.error(`Unknown category: ${category}`);
          return;
        }
      })

      .catch(error => {
        console.error(`Error fetching categories:`, error);
        fetch(fallbackCategoriesUrl)
          .then(response => response.json())
          .then(json => {
            const categoriesData = json.results;
            const categoryObject = categoriesData.find(categoryObject => categoryObject.slug === category);

            if (categoryObject) {
              const title = categoryObject.name;
              const url = `http://127.0.0.1:8000/articles/by-category/${category}/`;
              const fallbackUrl = `./locally/articlesByCategory_${category}.json`;

              fetch(url)
              .then(response => response.json())

              .then(data => {
                cardsContainer.innerHTML = '';
                titleElements.forEach((element) => {
                  element.innerHTML = `Статті з категорії: ${title}`;    
                });
                document.title = `Статті з категорії: ${title}`;
                data.forEach((item) => {
                  cardsContainer.innerHTML += createCardHTML(item);
                });
              })

              .catch(error => {
                console.error(`Error fetching articles:`, error);

                fetch(fallbackUrl)
                  .then(response => response.json())
                  .then(json => {
                    cardsContainer.innerHTML = '';
                    titleElements.forEach((element) => {
                      element.innerHTML = `Статті з категорії: ${title}`;    
                    });
                    document.title = `Статті з категорії: ${title}`;
                    json.forEach((item) => {
                      cardsContainer.innerHTML += createCardHTML(item);
                    });
                  });
              });
            } else {
              console.error(`Unknown category: ${category}`);
              return;
            }
          });
      });
  } catch (error) {
    console.error('Error:', error);
  }
}